import { NextResponse } from "next/server"
import db from "@/lib/db"
import bcrypt from "bcryptjs"
import type { RowDataPacket } from "mysql2"
import type { User } from "@/types/user"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      )
    }

    // ✅ Ambil user dari DB
    const [rows] = await db.query<RowDataPacket[] & User[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 401 }
      )
    }

    const user = rows[0]

    // ✅ Verifikasi password bcrypt
    const isValid = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!isValid) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      )
    }

    // ✅ Response sukses
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        employee_id: user.employee_id,
      },
    })

    // 🔐 COOKIE LOGIN
    res.cookies.set("login", "true", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    })

    // 🔐 COOKIE USER ID (INI YANG DITAMBAHKAN)
    res.cookies.set("user_id", String(user.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    })

    return res
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
