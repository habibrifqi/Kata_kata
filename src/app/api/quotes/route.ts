import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateQuoteInput, ApiResponse, QuoteType, PaginatedResponse } from "@/types";
import { getSession } from "@/lib/session";

// GET /api/quotes - Ambil semua quotes dengan filter & pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(searchParams.get("pageSize") ?? "12", 10)));
    const favorite = searchParams.get("favorite");
    const session = await getSession();
    const userId = Number(session?.userId);

    const where = {
      AND: [
        // Filter pencarian teks atau nama author
        search
          ? {
              OR: [
                { text: { contains: search, mode: "insensitive" as const } },
                {
                  author: {
                    name: { contains: search, mode: "insensitive" as const },
                  },
                },
              ],
            }
          : {},
        // Filter kategori (global)
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
        favorite !== null && Number.isInteger(userId)
          ? favorite === "true"
            ? { favorites: { some: { userId } } }
            : { favorites: { none: { userId } } }
          : favorite === "true"
            ? { id: -1 }
            : {},
      ],
    };

    const [total, quotes] = await Promise.all([
      prisma.quote.count({ where }),
      prisma.quote.findMany({
        where,
        include: {
          // Join ke Author
          author: {
            select: {
              id: true,
              name: true,
              title: true,
              avatarUrl: true,
              tags: true,
            },
          },
          // Join ke Category (many-to-many)
          categories: {
            include: { category: true },
          },
          favorites: Number.isInteger(userId)
            ? { where: { userId }, select: { userId: true } }
            : false,
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    // Flatten kategori untuk response yang lebih bersih
    const formattedQuotes = quotes.map((q: typeof quotes[number]) => ({
      ...q,
      isFavorite: q.favorites?.length > 0,
      categories: q.categories.map((qc: typeof q.categories[number]) => qc.category),
    }));

    const response: PaginatedResponse<QuoteType> = {
      success: true,
      data: formattedQuotes as unknown as QuoteType[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json(response, { status: 200 });
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

    // Jika authorId disertakan, validasi bahwa author ada di DB
    if (body.authorId) {
      const authorExists = await prisma.author.findUnique({
        where: { id: body.authorId },
        select: { id: true },
      });
      if (!authorExists) {
        return NextResponse.json(
          { success: false, error: "Author tidak ditemukan" } satisfies ApiResponse<never>,
          { status: 404 }
        );
      }
    }

    const quote = await prisma.quote.create({
      data: {
        text: body.text.trim(),
        authorId: body.authorId ?? null,
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
        author: {
          select: {
            id: true,
            name: true,
            title: true,
            avatarUrl: true,
            tags: true,
          },
        },
        categories: {
          include: { category: true },
        },
      },
    });

    const formattedQuote = {
      ...quote,
      categories: quote.categories.map((qc: typeof quote.categories[number]) => qc.category),
    };

    const response: ApiResponse<QuoteType> = {
      success: true,
      data: formattedQuote as unknown as QuoteType,
      message: "Quote berhasil dibuat",
    };

    // Update quotesCount di Author jika ada authorId
    if (body.authorId) {
      await prisma.author.update({
        where: { id: body.authorId },
        data: { quotesCount: { increment: 1 } },
      });
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quotes] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat quote" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
