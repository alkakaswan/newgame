import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, updateUser } from "@/app/lib/auth"

interface UserUpdateData {
  xp?: number;
  level?: number;
  streak?: number;
  lastAction?: string; // ensure it's string to match backend expectations
  achievements?: string[];
  totalPoints?: number;
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No authentication token" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { xp, level, streak, lastAction, achievements, totalPoints } = body

    const updates: UserUpdateData = {}
    if (xp !== undefined) updates.xp = xp
    if (level !== undefined) updates.level = level
    if (streak !== undefined) updates.streak = streak
    if (lastAction !== undefined) {
      updates.lastAction = typeof lastAction === "string" ? lastAction : new Date(lastAction).toISOString()
    }
    if (achievements !== undefined) updates.achievements = achievements
    if (totalPoints !== undefined) updates.totalPoints = totalPoints

    const user = await updateUser(decoded.userId, updates)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
