"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "获取用户列表失败" };
  }
}

export async function createUser(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username) {
      return { success: false, error: "用户名不能为空" };
    }

    if (!password) {
      return { success: false, error: "密码不能为空" };
    }

    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    });

    revalidatePath("/");
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return { success: false, error: "该用户名已存在" };
    }
    return { success: false, error: "创建用户失败" };
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "删除用户失败" };
  }
}
