import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, reports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest, { params }: { params: Promise<{ admissionNumber: string }> }) {
  const { admissionNumber: encodedAdmissionNumber } = await params;
  try {
    const admissionNumber = decodeURIComponent(encodedAdmissionNumber);
    
    // Find user
    const user = await db.select().from(users).where(eq(users.admissionNumber, admissionNumber));
    if (user.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // Get reports for the trainee
    const userReports = await db.select({
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
    }).from(reports)
      .innerJoin(users, eq(reports.traineeId, users.id))
      .where(eq(users.admissionNumber, admissionNumber))
      .orderBy(reports.submittedAt);

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheetData = userReports.map(report => ({
      'Trainee Name': report.traineeName,
      'Admission Number': report.admissionNumber,
      'Class': report.className,
      'Equipment': report.equipmentName,
      'Score': report.score,
      'Grade': report.grade,
      'Status': report.status,
      'Submitted At': new Date(report.submittedAt as Date).toLocaleString('en-US'),
      'Graded At': report.gradedAt ? new Date(report.gradedAt as Date).toLocaleString('en-US') : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trainee Reports');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create response with Excel file
    return new NextResponse(excelBlob, {
      headers: {
        'Content-Disposition': `attachment; filename="trainee-marks-${admissionNumber}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error('Error exporting Excel file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to export Excel file',
    }, { status: 500 });
  }
}
