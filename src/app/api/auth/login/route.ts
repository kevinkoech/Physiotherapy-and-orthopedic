import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admissionNumber = searchParams.get('admissionNumber');

    if (!admissionNumber) {
      return NextResponse.json({
        success: false,
        error: 'Admission number is required',
      }, { status: 400 });
    }

    // Find user by admission number
    const user = await db.select().from(users).where(eq(users.admissionNumber, admissionNumber));

    if (user.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found. Please check your admission number.',
      }, { status: 404 });
    }

    const foundUser = user[0];

    return NextResponse.json({
      success: true,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        admissionNumber: foundUser.admissionNumber,
        className: foundUser.className,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed',
    }, { status: 500 });
  }
}
