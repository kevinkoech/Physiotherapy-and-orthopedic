import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, reports } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, admissionNumber, className, equipmentName, simulationData } = data;

    // Check if user exists
    let user = await db.select().from(users).where(eq(users.admissionNumber, admissionNumber));
    
    if (user.length === 0) {
      // Create new user
      const [newUser] = await db.insert(users).values({
        name,
        admissionNumber,
        className,
        role: 'trainee',
      }).returning();
      user = [newUser];
    }

    // Calculate automatic score based on simulation data
    const score = calculateScore(simulationData);
    const grade = getGrade(score);

    // Save report
    const [newReport] = await db.insert(reports).values({
      traineeId: user[0].id,
      equipmentName,
      simulationData: JSON.stringify(simulationData),
      score,
      grade,
      status: 'graded', // Auto-graded immediately
      gradedAt: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      reportId: newReport.id,
      score,
      grade,
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit report',
    }, { status: 500 });
  }
}

function calculateScore(simulationData: any): number {
  // Calculate score based on how many parameters are in normal range
  const results = simulationData.results || [];
  const totalParameters = results.length;
  const normalParameters = results.filter((result: any) => result.status === 'normal').length;
  
  return totalParameters > 0 ? Math.round((normalParameters / totalParameters) * 100) : 0;
}

function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
