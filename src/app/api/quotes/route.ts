import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateQuoteInput, ApiResponse, QuoteType } from "@/types";

// GET /api/quotes - Ambil semua quotes dengan filter & pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "12", 10);
    const favorite = searchParams.get("favorite");

    const where = {
      AND: [
        // Filter pencarian teks
        search
          ? {
              OR: [
                { text: { contains: search, mode: "insensitive" as const } },
                { author: { contains: search, mode: "insensitive" as const } },
                { role: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {},
        // Filter kategori
        category
          ? {
              categories: {
                some: {
                  category: {
                    name: { equals: category, mode: "insensitive" as const },
                  },
                },
              },
            }
          : {},
        // Filter favorit
        favorite !== null ? { isFavorite: favorite === "true" } : {},
      ],
    };

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          categories: {
            include: { category: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.quote.count({ where }),
    ]);

    // Flatten kategori untuk response
    const formattedQuotes = quotes.map((q) => ({
      ...q,
      categories: q.categories.map((qc) => qc.category),
    }));

    return NextResponse.json({
      success: true,
      data: formattedQuotes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[GET /api/quotes] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data quotes" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// POST /api/quotes - Buat quote baru
export async function POST(request: NextRequest) {
  try {
    const body: CreateQuoteInput = await request.json();

    if (!body.text?.trim()) {
      return NextResponse.json(
        { success: false, error: "Teks quote tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    if (!body.author?.trim()) {
      return NextResponse.json(
        { success: false, error: "Author tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const quote = await prisma.quote.create({
      data: {
        text: body.text.trim(),
        author: body.author.trim(),
        role: body.role ?? null,
        isFavorite: body.isFavorite ?? false,
        avatarGradient: body.avatarGradient ?? null,
        avatarInitials: body.avatarInitials ?? null,
        // Connect ke categories yang ada (by ID)
        categories: body.categoryIds?.length
          ? {
              create: body.categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    const formattedQuote = {
      ...quote,
      categories: quote.categories.map((qc) => qc.category),
    };

    const response: ApiResponse<QuoteType> = {
      success: true,
      data: formattedQuote as unknown as QuoteType,
      message: "Quote berhasil dibuat",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quotes] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat quote" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
