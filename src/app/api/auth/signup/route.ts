import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/app/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Create user
    const user = await createUser({ email, name, password })

    // Generate JWT token
    const token = generateToken(user._id!)

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user,
      message: "Account created successfully",
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Login error:", error)

    if (error.message === "Invalid credentials") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}
}
