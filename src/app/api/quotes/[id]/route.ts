import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UpdateQuoteInput, ApiResponse, QuoteType } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper: include Author + Categories dalam query
const quoteInclude = {
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
} as const;

// GET /api/quotes/[id] - Ambil detail quote
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const quoteId = parseInt(id, 10);

    if (isNaN(quoteId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: quoteInclude,
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    const formattedQuote = {
      ...quote,
      categories: quote.categories.map((qc: typeof quote.categories[number]) => qc.category),
    };

    return NextResponse.json(
      { success: true, data: formattedQuote as unknown as QuoteType } satisfies ApiResponse<QuoteType>,
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/quotes/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data quote" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// PUT /api/quotes/[id] - Update quote
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const quoteId = parseInt(id, 10);

    if (isNaN(quoteId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const body: UpdateQuoteInput = await request.json();

    if (body.text !== undefined && !body.text.trim()) {
      return NextResponse.json(
        { success: false, error: "Teks quote tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validasi authorId jika disertakan
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

    // Ambil authorId lama untuk update quotesCount
    const existingQuote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { authorId: true },
    });

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        ...(body.text && { text: body.text.trim() }),
        ...(body.authorId !== undefined && { authorId: body.authorId ?? null }),
        // Update relasi kategori jika ada categoryIds
        ...(body.categoryIds !== undefined && {
          categories: {
            deleteMany: {},
            create: body.categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        }),
      },
      include: quoteInclude,
    });

    // Sync quotesCount jika authorId berubah
    if (body.authorId !== undefined && body.authorId !== existingQuote?.authorId) {
      // Kurangi count author lama
      if (existingQuote?.authorId) {
        await prisma.author.update({
          where: { id: existingQuote.authorId },
          data: { quotesCount: { decrement: 1 } },
        });
      }
      // Tambah count author baru
      if (body.authorId) {
        await prisma.author.update({
          where: { id: body.authorId },
          data: { quotesCount: { increment: 1 } },
        });
      }
    }

    const formattedQuote = {
      ...quote,
      categories: quote.categories.map((qc: typeof quote.categories[number]) => qc.category),
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedQuote as unknown as QuoteType,
        message: "Quote berhasil diupdate",
      } satisfies ApiResponse<QuoteType>,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[PUT /api/quotes/[id]] Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Quote tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal mengupdate quote" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// DELETE /api/quotes/[id] - Hapus quote
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const quoteId = parseInt(id, 10);

    if (isNaN(quoteId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Ambil authorId sebelum hapus untuk update quotesCount
    const existingQuote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { authorId: true },
    });

    await prisma.quote.delete({
      where: { id: quoteId },
    });

    // Kurangi quotesCount author jika ada
    if (existingQuote?.authorId) {
      await prisma.author.update({
        where: { id: existingQuote.authorId },
        data: { quotesCount: { decrement: 1 } },
      });
    }

    return NextResponse.json(
      { success: true, message: "Quote berhasil dihapus" } satisfies ApiResponse<never>,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[DELETE /api/quotes/[id]] Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Quote tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal menghapus quote" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
