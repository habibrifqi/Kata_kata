import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CreateUserInput, ApiResponse, UserType, PaginatedResponse, UserRole } from "@/types";
import { Role } from "@prisma/client";

export interface UsersPaginatedResponse extends PaginatedResponse<UserType> {
  stats?: {
    totalUsers: number;
    adminCount: number;
    newThisMonthCount: number;
  };
}

// GET /api/users — Ambil daftar user dengan pencarian, filter role, pagination, & statistik
export async function GET(request: NextRequest) {
  try {
    if (!prisma.user) {
      throw new Error("Model Prisma 'user' belum terdeteksi.");
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const roleParam = searchParams.get("role")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(searchParams.get("pageSize") ?? "10", 10)));
    const skip = (page - 1) * pageSize;

    // Filter kondisi Prisma
    const whereConditions: Record<string, unknown>[] = [];

    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      });
    }

    if (roleParam && roleParam !== "all" && Object.values(Role).includes(roleParam as Role)) {
      whereConditions.push({ role: roleParam as Role });
    }

    const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Hitung tanggal awal bulan ini untuk statistik "New this month"
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Query paralel data & statistik
    const [totalUsers, totalFiltered, adminCount, newThisMonthCount, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: whereClause }),
      prisma.user.count({
        where: {
          role: { in: [Role.admin, Role.superadmin] },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { authors: true },
          },
        },
      }),
    ]);

    const response: UsersPaginatedResponse = {
      success: true,
      data: users as unknown as UserType[],
      total: totalFiltered,
      page,
      pageSize,
      totalPages: Math.ceil(totalFiltered / pageSize) || 1,
      stats: {
        totalUsers,
        adminCount,
        newThisMonthCount,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("[GET /api/users] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal mengambil data user";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// POST /api/users — Buat user baru
export async function POST(request: NextRequest) {
  try {
    if (!prisma.user) {
      throw new Error("Model Prisma 'user' belum terdeteksi.");
    }

    const body: CreateUserInput = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama user tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        { success: false, error: "Email user tidak boleh kosong" } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email sudah digunakan oleh user lain" } satisfies ApiResponse<never>,
        { status: 409 }
      );
    }

    // Role validasi
    let targetRole: Role = Role.writer;
    if (body.role && Object.values(Role).includes(body.role as Role)) {
      targetRole = body.role as Role;
    }

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        image: body.image?.trim() || null,
        role: targetRole,
      },
    });

    const response: ApiResponse<UserType> = {
      success: true,
      data: user as unknown as UserType,
      message: "User berhasil ditambahkan",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/users] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal membuat user baru";
    return NextResponse.json(
      { success: false, error: errorMessage } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
