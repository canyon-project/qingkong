"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function login(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: "用户名或密码错误" };
    }

    // 密码不加密，直接比较
    if (user.password !== password) {
      return { success: false, error: "用户名或密码错误" };
    }

    // 设置 cookie
    const cookieStore = await cookies();
    cookieStore.set("userId", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7天
    });

    return { success: true, data: { id: user.id, username: user.username } };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, error: "登录失败" };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("userId");
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: "登出失败" };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return { success: false, error: "未登录" };
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true, username: true },
    });

    if (!user) {
      return { success: false, error: "用户不存在" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { success: false, error: "获取用户信息失败" };
  }
}
