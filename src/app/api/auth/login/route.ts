import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, generateToken } from "@/app/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    // Generate JWT token
    const token = generateToken(user._id!)

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user,
      message: "Login successful",
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
