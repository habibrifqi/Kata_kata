import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UpdateUserInput, ApiResponse, UserType } from "@/types";
import { Role } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id] — Ambil detail user berdasarkan ID
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "ID user tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        authors: {
          select: { id: true, name: true, quotesCount: true },
        },
        _count: {
          select: { authors: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user as unknown as UserType },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[GET /api/users/[id]] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal mengambil data user";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] — Update data user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "ID user tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const body: UpdateUserInput = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    // Jika email diubah, pastikan tidak bentrok dengan user lain
    if (body.email && body.email.trim().toLowerCase() !== existingUser.email) {
      const emailCheck = await prisma.user.findUnique({
        where: { email: body.email.trim().toLowerCase() },
      });
      if (emailCheck) {
        return NextResponse.json(
          { success: false, error: "Email sudah digunakan oleh user lain" } satisfies ApiResponse<never>,
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.email !== undefined) updateData.email = body.email.trim().toLowerCase();
    if (body.image !== undefined) updateData.image = body.image ? body.image.trim() : null;
    if (body.role && Object.values(Role).includes(body.role as Role)) {
      updateData.role = body.role as Role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedUser as unknown as UserType,
        message: "Data user berhasil diperbarui",
      } satisfies ApiResponse<UserType>,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[PUT /api/users/[id]] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal memperbarui user";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] — Hapus user
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "ID user tidak valid" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" } satisfies ApiResponse<never>,
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User berhasil dihapus",
      } satisfies ApiResponse<never>,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[DELETE /api/users/[id]] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus user";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
