import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, reports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import JSZip from 'jszip';

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
    }).from(reports)
      .innerJoin(users, eq(reports.traineeId, users.id))
      .orderBy(reports.submittedAt);

    // Check if there are any reports
    if (allReports.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No reports found. Trainees need to submit reports first before exporting.',
      }, { status: 404 });
    }

    // Create zip file
    const zip = new JSZip();

    // Group reports by trainee and equipment
    const traineeReports: Record<string, Record<string, any[]>> = {};
    allReports.forEach(report => {
      const traineeKey = `${report.admissionNumber}_${report.traineeName}`;
      if (!traineeReports[traineeKey]) {
        traineeReports[traineeKey] = {};
      }
      const equipmentKey = report.equipmentName;
      if (!traineeReports[traineeKey][equipmentKey]) {
        traineeReports[traineeKey][equipmentKey] = [];
      }
      traineeReports[traineeKey][equipmentKey].push(report);
    });

    // Add files to zip
    Object.keys(traineeReports).forEach(traineeKey => {
      const traineeFolder = zip.folder(traineeKey);
      if (traineeFolder) {
        Object.keys(traineeReports[traineeKey]).forEach(equipmentKey => {
          const equipmentFolder = traineeFolder.folder(equipmentKey);
          if (equipmentFolder) {
            const reportsForEquipment = traineeReports[traineeKey][equipmentKey];
            reportsForEquipment.forEach(report => {
              const filename = `report_${report.id}.json`;
              equipmentFolder.file(filename, JSON.stringify(report, null, 2));
            });
          }
        });
      }
    });

    // Generate zip file
    const zipContent = await zip.generateAsync({ type: 'blob' });

    // Create response with zip file
    return new NextResponse(zipContent, {
      headers: {
        'Content-Disposition': 'attachment; filename="trainee-reports.zip"',
        'Content-Type': 'application/zip',
      },
    });
  } catch (error) {
    console.error('Error exporting reports as zip:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to export reports as zip',
    }, { status: 500 });
  }
}
