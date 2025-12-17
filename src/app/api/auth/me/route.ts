import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import db from "@/lib/db"
import type { RowDataPacket } from "mysql2"

interface User {
  id: string
  name: string
  email: string
  employee_id: string
}

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const [rows] = await db.query<RowDataPacket[] & User[]>(
    "SELECT id, name, email, employee_id FROM users WHERE id = ? LIMIT 1",
    [userId]
  )

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    user: rows[0],
  })
}
