import { getPositionCandidates } from './positionService';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    position: {
      findUnique: jest.fn(),
    },
    application: {
      findMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('positionService', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('getPositionCandidates', () => {
    it('should throw error when position does not exist', async () => {
      prisma.position.findUnique.mockResolvedValue(null);

      await expect(getPositionCandidates(1)).rejects.toThrow('Position not found');
    });

    it('should return empty array when position has no applications', async () => {
      prisma.position.findUnique.mockResolvedValue({ id: 1, title: 'Test Position' });
      prisma.application.findMany.mockResolvedValue([]);

      const result = await getPositionCandidates(1);

      expect(result).toEqual([]);
      expect(prisma.position.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.application.findMany).toHaveBeenCalledWith({
        where: { positionId: 1 },
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
    });

    it('should return candidates with null average score when no interviews', async () => {
      prisma.position.findUnique.mockResolvedValue({ id: 1, title: 'Test Position' });
      prisma.application.findMany.mockResolvedValue([
        {
          currentInterviewStep: 1,
          candidate: {
            firstName: 'John',
            lastName: 'Doe',
          },
          interviews: [],
        },
      ]);

      const result = await getPositionCandidates(1);

      expect(result).toEqual([
        {
          fullName: 'John Doe',
          currentInterviewStep: 1,
          averageScore: null,
        },
      ]);
    });

    it('should calculate average score from interviews with scores', async () => {
      prisma.position.findUnique.mockResolvedValue({ id: 1, title: 'Test Position' });
      prisma.application.findMany.mockResolvedValue([
        {
          currentInterviewStep: 2,
          candidate: {
            firstName: 'Jane',
            lastName: 'Smith',
          },
          interviews: [
            { score: 80 },
            { score: 90 },
            { score: 85 },
          ],
        },
      ]);

      const result = await getPositionCandidates(1);

      expect(result).toEqual([
        {
          fullName: 'Jane Smith',
          currentInterviewStep: 2,
          averageScore: 85, // (80 + 90 + 85) / 3
        },
      ]);
    });

    it('should exclude interviews without scores from average calculation', async () => {
      prisma.position.findUnique.mockResolvedValue({ id: 1, title: 'Test Position' });
      prisma.application.findMany.mockResolvedValue([
        {
          currentInterviewStep: 2,
          candidate: {
            firstName: 'Bob',
            lastName: 'Johnson',
          },
          interviews: [
            { score: 70 },
            { score: null },
            { score: 90 },
            { score: null },
          ],
        },
      ]);

      const result = await getPositionCandidates(1);

      expect(result).toEqual([
        {
          fullName: 'Bob Johnson',
          currentInterviewStep: 2,
          averageScore: 80, // (70 + 90) / 2
        },
      ]);
    });

    it('should handle multiple candidates correctly', async () => {
      prisma.position.findUnique.mockResolvedValue({ id: 1, title: 'Test Position' });
      prisma.application.findMany.mockResolvedValue([
        {
          currentInterviewStep: 1,
          candidate: {
            firstName: 'Alice',
            lastName: 'Williams',
          },
          interviews: [{ score: 75 }],
        },
        {
          currentInterviewStep: 2,
          candidate: {
            firstName: 'Charlie',
            lastName: 'Brown',
          },
          interviews: [],
        },
      ]);

      const result = await getPositionCandidates(1);

      expect(result).toEqual([
        {
          fullName: 'Alice Williams',
          currentInterviewStep: 1,
          averageScore: 75,
        },
        {
          fullName: 'Charlie Brown',
          currentInterviewStep: 2,
          averageScore: null,
        },
      ]);
    });
  });
});

