import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateAuthorInput, ApiResponse, AuthorType, PaginatedResponse } from "@/types";

// GET /api/authors — Ambil semua author dengan pagination & pencarian
export async function GET(request: NextRequest) {
  try {
    if (!prisma.author) {
      throw new Error("Model Prisma 'author' belum terdeteksi. Silakan restart server dev (npm run dev).");
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(searchParams.get("pageSize") ?? "10", 10)));
    const skip = (page - 1) * pageSize;

    // Filter berdasarkan userId (opsional) — untuk dropdown di modal Quote
    const userIdParam = searchParams.get("userId");
    const userId = userIdParam ? parseInt(userIdParam, 10) : null;

    const whereClause = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { title: { contains: search, mode: "insensitive" as const } },
              { bio: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      // Jika userId ada, filter author milik user tersebut saja
      ...(userId ? { userId } : {}),
    } as Record<string, unknown> | undefined;

    const finalWhere = Object.keys(whereClause as object).length > 0 ? whereClause : undefined;

    // Jalankan query total & data secara paralel
    const [total, authors] = await Promise.all([
      prisma.author.count({ where: finalWhere }),
      prisma.author.findMany({
        where: finalWhere,
        orderBy: { updatedAt: "desc" },
        skip,
        take: pageSize,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { quotes: true } },
        },
      }),
    ]);

    // Safely map quotesCount dari relasi
    const authorsWithCount = authors.map((a: typeof authors[number]) => {
      const { _count, ...authorData } = a;
      return {
        ...authorData,
        quotesCount: _count?.quotes ?? a.quotesCount ?? 0,
      };
    });

    const response: PaginatedResponse<AuthorType> = {
      success: true,
      data: authorsWithCount as unknown as AuthorType[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("[GET /api/authors] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal mengambil data author";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// POST /api/authors — Buat author baru
export async function POST(request: NextRequest) {
  try {
    if (!prisma.author) {
      throw new Error("Model Prisma 'author' belum terdeteksi. Silakan restart server dev (npm run dev).");
    }

    const body: CreateAuthorInput = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama author tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const author = await prisma.author.create({
      data: {
        name: body.name.trim(),
        title: body.title?.trim() ?? null,
        bio: body.bio?.trim() ?? null,
        avatarUrl: body.avatarUrl?.trim() ?? null,
        tags: body.tags ?? [],
        userId: body.userId ?? null,
      },
    });

    const response: ApiResponse<AuthorType> = {
      success: true,
      data: author as unknown as AuthorType,
      message: "Author berhasil dibuat",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/authors] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal membuat author";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
