import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UpdateQuoteInput, ApiResponse, QuoteType } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    const formattedQuote = {
      ...quote,
      categories: quote.categories.map((qc) => qc.category),
    };

    return NextResponse.json({
      success: true,
      data: formattedQuote,
    } satisfies ApiResponse<QuoteType>);
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

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        ...(body.text && { text: body.text.trim() }),
        ...(body.author && { author: body.author.trim() }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
        ...(body.avatarGradient !== undefined && { avatarGradient: body.avatarGradient }),
        ...(body.avatarInitials !== undefined && { avatarInitials: body.avatarInitials }),
        // Update relasi kategori jika ada categoryIds
        ...(body.categoryIds !== undefined && {
          categories: {
            // Hapus relasi lama dan buat yang baru
            deleteMany: {},
            create: body.categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        }),
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

    return NextResponse.json({
      success: true,
      data: formattedQuote,
      message: "Quote berhasil diupdate",
    } satisfies ApiResponse<QuoteType>);
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

    await prisma.quote.delete({
      where: { id: quoteId },
    });

    return NextResponse.json({
      success: true,
      message: "Quote berhasil dihapus",
    } satisfies ApiResponse<never>);
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
