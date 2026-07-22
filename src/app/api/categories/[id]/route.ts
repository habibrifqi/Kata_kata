import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UpdateCategoryInput, ApiResponse, CategoryType } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/categories/[id] - Ambil detail kategori
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category } satisfies ApiResponse<CategoryType>);
  } catch (error) {
    console.error("[GET /api/categories/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data kategori" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update kategori
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const body: UpdateCategoryInput = await request.json();

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.colorBg && { colorBg: body.colorBg }),
        ...(body.glowColor && { glowColor: body.glowColor }),
        ...(body.quotesCount !== undefined && { quotesCount: body.quotesCount }),
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: "Kategori berhasil diupdate",
    } satisfies ApiResponse<CategoryType>);
  } catch (error: unknown) {
    console.error("[PUT /api/categories/[id]] Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal mengupdate kategori" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Hapus kategori
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus",
    } satisfies ApiResponse<never>);
  } catch (error: unknown) {
    console.error("[DELETE /api/categories/[id]] Error:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Kategori tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
