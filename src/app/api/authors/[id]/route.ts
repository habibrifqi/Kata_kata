import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UpdateAuthorInput, ApiResponse, AuthorType } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/authors/[id] — Detail satu author beserta jumlah quote-nya
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authorId = parseInt(id, 10);

    if (isNaN(authorId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const author = await prisma.author.findUnique({
      where: { id: authorId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { quotes: true } },
      },
    });

    if (!author) {
      return NextResponse.json(
        { success: false, error: "Author tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    const { _count, ...authorData } = author;
    const result = {
      ...authorData,
      quotesCount: _count?.quotes ?? author.quotesCount ?? 0,
    };

    return NextResponse.json(
      { success: true, data: result as unknown as AuthorType } satisfies ApiResponse<AuthorType>,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[GET /api/authors/[id]] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal mengambil data author";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// PUT /api/authors/[id] — Update data author
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authorId = parseInt(id, 10);

    if (isNaN(authorId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const body: UpdateAuthorInput = await request.json();

    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama author tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.title !== undefined) updateData.title = body.title?.trim() ?? null;
    if (body.bio !== undefined) updateData.bio = body.bio?.trim() ?? null;
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl?.trim() ?? null;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.userId !== undefined) updateData.userId = body.userId ?? null;

    const author = await prisma.author.update({
      where: { id: authorId },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        data: author as unknown as AuthorType,
        message: "Author berhasil diupdate",
      } satisfies ApiResponse<AuthorType>,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[PUT /api/authors/[id]] Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Author tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Gagal mengupdate author";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// DELETE /api/authors/[id] — Hapus author
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authorId = parseInt(id, 10);

    if (isNaN(authorId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    await prisma.author.delete({
      where: { id: authorId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Author berhasil dihapus",
      } satisfies ApiResponse<never>,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[DELETE /api/authors/[id]] Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Author tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus author";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
