import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const include = {
  author: { select: { id: true, name: true, title: true, avatarUrl: true, tags: true } },
  categories: { include: { category: true } },
} as const;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = Number(session?.userId);
    if (!Number.isInteger(userId)) {
      return NextResponse.json({ success: false, error: "User belum login" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";
    const favorites = await prisma.quote.findMany({
      where: {
        favorites: { some: { userId } },
        ...(search
          ? { OR: [{ text: { contains: search, mode: "insensitive" } }, { author: { name: { contains: search, mode: "insensitive" } } }] }
          : {}),
        ...(category
          ? { categories: { some: { category: { name: { equals: category, mode: "insensitive" } } } } }
          : {}),
      },
      include,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: favorites.map((quote) => ({
        ...quote,
        isFavorite: true,
        categories: quote.categories.map(({ category: item }) => item),
      })),
    });
  } catch (error) {
    console.error("[GET /api/favorites] Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil favorite quotes" }, { status: 500 });
  }
}
