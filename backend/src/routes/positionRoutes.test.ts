import { Request, Response } from 'express';
import { getPositionCandidatesController } from '../presentation/controllers/positionController';
import * as positionService from '../application/services/positionService';

jest.mock('../application/services/positionService');

describe('positionController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {
      params: { id: '1' },
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe('getPositionCandidatesController', () => {
    it('should return 200 with candidates array on success', async () => {
      const mockCandidates = [
        {
          fullName: 'John Doe',
          currentInterviewStep: 1,
          averageScore: 85,
        },
      ];

      (positionService.getPositionCandidates as jest.Mock).mockResolvedValue(mockCandidates);

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(positionService.getPositionCandidates).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCandidates);
    });

    it('should return 400 for invalid position ID format', async () => {
      mockRequest.params = { id: 'invalid' };

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid position ID format' });
      expect(positionService.getPositionCandidates).not.toHaveBeenCalled();
    });

    it('should return 404 when position not found', async () => {
      (positionService.getPositionCandidates as jest.Mock).mockRejectedValue(
        new Error('Position not found')
      );

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Position not found' });
    });

    it('should return 500 for other errors', async () => {
      (positionService.getPositionCandidates as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await getPositionCandidatesController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});

