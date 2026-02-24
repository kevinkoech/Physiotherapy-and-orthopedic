import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, reports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest, { params }: { params: Promise<{ equipmentName: string }> }) {
  const { equipmentName: encodedEquipmentName } = await params;
  try {
    const equipmentName = decodeURIComponent(encodedEquipmentName);
    
    // Get all reports for the specified equipment with user information
    const equipmentReports = await db.select({
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
      .where(eq(reports.equipmentName, equipmentName))
      .orderBy(reports.submittedAt);

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheetData = equipmentReports.map(report => ({
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
    XLSX.utils.book_append_sheet(workbook, worksheet, equipmentName);

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Generate filename
    const sanitizeFilename = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
    const filename = `${sanitizeFilename(equipmentName)}-marks.xlsx`;

    // Create response with Excel file
    return new NextResponse(excelBlob, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
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
