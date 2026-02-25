import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, reports } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

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

    // Find user
    const user = await db.select().from(users).where(eq(users.admissionNumber, admissionNumber));

    if (user.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // Get reports including simulation data
    const userReports = await db.select().from(reports).where(eq(reports.traineeId, user[0].id)).orderBy(desc(reports.submittedAt));

    const formattedReports = userReports.map(report => ({
      id: report.id,
      equipmentName: report.equipmentName,
      simulationData: report.simulationData,
      score: report.score,
      grade: report.grade,
      status: report.status,
      submittedAt: report.submittedAt,
      gradedAt: report.gradedAt,
      traineeName: user[0].name,
      admissionNumber: user[0].admissionNumber,
      className: user[0].className,
    }));

    return NextResponse.json({
      success: true,
      reports: formattedReports,
    });
  } catch (error) {
    console.error('Error getting trainee reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get reports',
    }, { status: 500 });
  }
}
