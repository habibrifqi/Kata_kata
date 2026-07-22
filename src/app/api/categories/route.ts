import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateCategoryInput, ApiResponse, CategoryType } from "@/types";

// GET /api/categories - Ambil semua kategori
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";

    const categories = await prisma.category.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { updatedAt: "desc" },
    });

    const response: ApiResponse<CategoryType[]> = {
      success: true,
      data: categories,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/categories] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data kategori" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// POST /api/categories - Buat kategori baru
export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryInput = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama kategori tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
        colorBg: body.colorBg ?? "bg-primary",
        glowColor: body.glowColor ?? "rgba(192, 193, 255, 0.6)",
        quotesCount: body.quotesCount ?? 0,
      },
    });

    const response: ApiResponse<CategoryType> = {
      success: true,
      data: category,
      message: "Kategori berhasil dibuat",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/categories] Error:", error);

    // Handle unique constraint violation
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, error: "Nama kategori sudah ada" } satisfies ApiResponse<never>,
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Gagal membuat kategori" } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
