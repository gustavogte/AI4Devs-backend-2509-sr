import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PositionCandidate {
  fullName: string;
  currentInterviewStep: number;
  averageScore: number | null;
}

export const getPositionCandidates = async (positionId: number): Promise<PositionCandidate[]> => {
  // First, verify the position exists
  const position = await prisma.position.findUnique({
    where: { id: positionId },
  });

  if (!position) {
    throw new Error('Position not found');
  }

  // Get all applications for this position with candidate and interview data
  const applications = await prisma.application.findMany({
    where: { positionId },
    include: {
      candidate: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      interviews: {
        select: {
          score: true,
        },
      },
    },
  });

  // Transform the data to match the required format
  const candidates: PositionCandidate[] = applications.map((application) => {
    const fullName = `${application.candidate.firstName} ${application.candidate.lastName}`;
    const currentInterviewStep = application.currentInterviewStep;

    // Calculate average score from interviews that have scores
    const scoresWithValues = application.interviews
      .map((interview) => interview.score)
      .filter((score): score is number => score !== null);

    const averageScore =
      scoresWithValues.length > 0
        ? scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length
        : null;

    return {
      fullName,
      currentInterviewStep,
      averageScore,
    };
  });

  return candidates;
};

