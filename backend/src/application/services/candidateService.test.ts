import { updateCandidateStage } from './candidateService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    candidate: {
      findUnique: jest.fn(),
    },
    position: {
      findUnique: jest.fn(),
    },
    application: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    interviewStep: {
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('candidateService', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('updateCandidateStage', () => {
    const candidateId = 1;
    const positionId = 2;
    const interviewStepId = 3;
    const interviewFlowId = 10;

    const mockCandidate = {
      id: candidateId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const mockPosition = {
      id: positionId,
      title: 'Software Engineer',
      interviewFlowId: interviewFlowId,
      interviewFlow: {
        id: interviewFlowId,
        interviewSteps: [
          { id: 3, name: 'Technical Interview', interviewFlowId: interviewFlowId },
          { id: 4, name: 'Final Interview', interviewFlowId: interviewFlowId },
        ],
      },
    };

    const mockApplication = {
      id: 100,
      candidateId: candidateId,
      positionId: positionId,
      currentInterviewStep: 1,
    };

    const mockInterviewStep = {
      id: interviewStepId,
      name: 'Technical Interview',
      interviewFlowId: interviewFlowId,
    };

    const mockUpdatedApplication = {
      id: 100,
      candidateId: candidateId,
      positionId: positionId,
      currentInterviewStep: interviewStepId,
      candidate: {
        id: candidateId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      position: {
        id: positionId,
        title: 'Software Engineer',
      },
      interviewStep: {
        id: interviewStepId,
        name: 'Technical Interview',
      },
    };

    it('should successfully update candidate stage', async () => {
      prisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      prisma.position.findUnique.mockResolvedValue(mockPosition);
      prisma.application.findFirst.mockResolvedValue(mockApplication);
      prisma.interviewStep.findUnique.mockResolvedValue(mockInterviewStep);
      prisma.application.update.mockResolvedValue(mockUpdatedApplication);

      const result = await updateCandidateStage(candidateId, {
        positionId,
        interviewStepId,
      });

      expect(result).toEqual(mockUpdatedApplication);
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId },
      });
      expect(prisma.position.findUnique).toHaveBeenCalledWith({
        where: { id: positionId },
        include: {
          interviewFlow: {
            include: {
              interviewSteps: true,
            },
          },
        },
      });
      expect(prisma.application.findFirst).toHaveBeenCalledWith({
        where: {
          candidateId: candidateId,
          positionId: positionId,
        },
      });
      expect(prisma.interviewStep.findUnique).toHaveBeenCalledWith({
        where: { id: interviewStepId },
      });
      expect(prisma.application.update).toHaveBeenCalledWith({
        where: { id: mockApplication.id },
        data: {
          currentInterviewStep: interviewStepId,
        },
        include: {
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          position: {
            select: {
              id: true,
              title: true,
            },
          },
          interviewStep: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should throw error when candidate does not exist', async () => {
      prisma.candidate.findUnique.mockResolvedValue(null);

      await expect(
        updateCandidateStage(candidateId, { positionId, interviewStepId })
      ).rejects.toThrow('Candidate not found');

      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId },
      });
      expect(prisma.position.findUnique).not.toHaveBeenCalled();
    });

    it('should throw error when position does not exist', async () => {
      prisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      prisma.position.findUnique.mockResolvedValue(null);

      await expect(
        updateCandidateStage(candidateId, { positionId, interviewStepId })
      ).rejects.toThrow('Position not found');

      expect(prisma.candidate.findUnique).toHaveBeenCalled();
      expect(prisma.position.findUnique).toHaveBeenCalled();
      expect(prisma.application.findFirst).not.toHaveBeenCalled();
    });

    it('should throw error when application does not exist', async () => {
      prisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      prisma.position.findUnique.mockResolvedValue(mockPosition);
      prisma.application.findFirst.mockResolvedValue(null);

      await expect(
        updateCandidateStage(candidateId, { positionId, interviewStepId })
      ).rejects.toThrow('Application not found for this candidate and position');

      expect(prisma.candidate.findUnique).toHaveBeenCalled();
      expect(prisma.position.findUnique).toHaveBeenCalled();
      expect(prisma.application.findFirst).toHaveBeenCalled();
      expect(prisma.interviewStep.findUnique).not.toHaveBeenCalled();
    });

    it('should throw error when interview step does not exist', async () => {
      prisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      prisma.position.findUnique.mockResolvedValue(mockPosition);
      prisma.application.findFirst.mockResolvedValue(mockApplication);
      prisma.interviewStep.findUnique.mockResolvedValue(null);

      await expect(
        updateCandidateStage(candidateId, { positionId, interviewStepId })
      ).rejects.toThrow('Interview step not found');

      expect(prisma.candidate.findUnique).toHaveBeenCalled();
      expect(prisma.position.findUnique).toHaveBeenCalled();
      expect(prisma.application.findFirst).toHaveBeenCalled();
      expect(prisma.interviewStep.findUnique).toHaveBeenCalled();
      expect(prisma.application.update).not.toHaveBeenCalled();
    });

    it('should throw error when interview step does not belong to position interview flow', async () => {
      // Create a position with interview steps that don't include the requested step
      const positionWithDifferentSteps = {
        id: positionId,
        title: 'Software Engineer',
        interviewFlowId: interviewFlowId,
        interviewFlow: {
          id: interviewFlowId,
          interviewSteps: [
            { id: 4, name: 'Final Interview', interviewFlowId: interviewFlowId },
            { id: 5, name: 'HR Interview', interviewFlowId: interviewFlowId },
          ],
        },
      };

      prisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      prisma.position.findUnique.mockResolvedValue(positionWithDifferentSteps);
      prisma.application.findFirst.mockResolvedValue(mockApplication);
      prisma.interviewStep.findUnique.mockResolvedValue({
        id: interviewStepId,
        name: 'Technical Interview',
        interviewFlowId: 999, // Different interview flow
      });

      await expect(
        updateCandidateStage(candidateId, { positionId, interviewStepId })
      ).rejects.toThrow("Interview step does not belong to the position's interview flow");

      expect(prisma.candidate.findUnique).toHaveBeenCalled();
      expect(prisma.position.findUnique).toHaveBeenCalled();
      expect(prisma.application.findFirst).toHaveBeenCalled();
      expect(prisma.interviewStep.findUnique).toHaveBeenCalled();
      expect(prisma.application.update).not.toHaveBeenCalled();
    });
  });
});

