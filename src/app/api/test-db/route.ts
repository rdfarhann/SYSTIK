import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result")
    return NextResponse.json({
      success: true,
      rows,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 }
    )
  }
}
