import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, reports } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get all reports with user information
    const allReports = await db.select({
      id: reports.id,
      traineeId: reports.traineeId,
      equipmentName: reports.equipmentName,
      score: reports.score,
      grade: reports.grade,
      status: reports.status,
      submittedAt: reports.submittedAt,
      gradedAt: reports.gradedAt,
      traineeName: users.name,
      admissionNumber: users.admissionNumber,
      className: users.className,
    }).from(reports).innerJoin(users, eq(reports.traineeId, users.id)).orderBy(reports.submittedAt);

    return NextResponse.json({
      success: true,
      reports: allReports,
    });
  } catch (error) {
    console.error('Error getting all reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get reports',
    }, { status: 500 });
  }
}
