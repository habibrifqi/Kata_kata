import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

interface RouteParams { params: Promise<{ id: string }> }

export async function PUT(_request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    const userId = Number(session?.userId);
    const quoteId = Number((await params).id);
    if (!Number.isInteger(userId)) return NextResponse.json({ success: false, error: "User belum login" }, { status: 401 });
    if (!Number.isInteger(quoteId)) return NextResponse.json({ success: false, error: "ID quote tidak valid" }, { status: 400 });

    const quote = await prisma.quote.findUnique({ where: { id: quoteId }, select: { id: true } });
    if (!quote) return NextResponse.json({ success: false, error: "Quote tidak ditemukan" }, { status: 404 });

    const existing = await prisma.userFavorite.findUnique({ where: { userId_quoteId: { userId, quoteId } } });
    if (existing) await prisma.userFavorite.delete({ where: { userId_quoteId: { userId, quoteId } } });
    else await prisma.userFavorite.create({ data: { userId, quoteId } });

    return NextResponse.json({ success: true, data: { isFavorite: !existing } });
  } catch (error) {
    console.error("[PUT /api/favorites/:id] Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengubah favorite quote" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteParams) {
  try {
    const session = await getSession();
    const userId = Number(session?.userId);
    const quoteId = Number((await context.params).id);
    if (!Number.isInteger(userId)) return NextResponse.json({ success: false, error: "User belum login" }, { status: 401 });
    if (!Number.isInteger(quoteId)) return NextResponse.json({ success: false, error: "ID quote tidak valid" }, { status: 400 });

    await prisma.userFavorite.deleteMany({ where: { userId, quoteId } });
    return NextResponse.json({ success: true, data: { isFavorite: false } });
  } catch (error) {
    console.error("[DELETE /api/favorites/:id] Error:", error);
    return NextResponse.json({ success: false, error: "Gagal menghapus favorite quote" }, { status: 500 });
  }
}
