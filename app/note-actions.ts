"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return { success: true, data: notes };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { success: false, error: "获取笔记列表失败" };
  }
}

export async function getTodayNote() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const note = await prisma.note.findFirst({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: note };
  } catch (error) {
    console.error("Error fetching today note:", error);
    return { success: false, error: "获取今日笔记失败" };
  }
}

export async function createNote(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return { success: false, error: "请先登录" };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const source = formData.get("source") as string | null;
    const author = formData.get("author") as string | null;
    const image = formData.get("image") as string | null;
    const dateStr = formData.get("date") as string;

    if (!title || !title.trim()) {
      return { success: false, error: "标题不能为空" };
    }

    const date = dateStr ? new Date(dateStr) : new Date();

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content || "",
        source: source?.trim() || null,
        author: author?.trim() || null,
        image: image || null,
        date,
        creatorId: parseInt(userId),
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: note };
  } catch (error: any) {
    console.error("Error creating note:", error);
    return { success: false, error: "创建笔记失败" };
  }
}

export async function updateNote(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const source = formData.get("source") as string | null;
    const author = formData.get("author") as string | null;
    const image = formData.get("image") as string | null;

    if (!title || !title.trim()) {
      return { success: false, error: "标题不能为空" };
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content || "",
        source: source?.trim() || null,
        author: author?.trim() || null,
        image: image || null,
      },
    });

    revalidatePath("/");
    return { success: true, data: note };
  } catch (error: any) {
    console.error("Error updating note:", error);
    return { success: false, error: "更新笔记失败" };
  }
}

export async function deleteNote(id: number) {
  try {
    await prisma.note.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "删除笔记失败" };
  }
}

export async function getNoteById(id: number) {
  try {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    if (!note) {
      return { success: false, error: "笔记不存在" };
    }
    return { success: true, data: note };
  } catch (error) {
    console.error("Error fetching note:", error);
    return { success: false, error: "获取笔记失败" };
  }
}
