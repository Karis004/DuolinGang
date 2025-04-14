import { createUser } from "../../../lib/dbUtils";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // 简单验证
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "请提供所有必填字段" },
        { status: 400 }
      );
    }

    // 创建用户
    const result = await createUser({ name, email, password });

    // 处理错误
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // 注册成功
    return NextResponse.json({
      message: "注册成功",
      user: result.user
    }, { status: 201 });
    
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      { error: "注册失败" },
      { status: 500 }
    );
  }
}