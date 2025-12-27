import { Request, Response } from 'express';
import { updateCandidateStageController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';

jest.mock('../application/services/candidateService');

describe('candidateController', () => {
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
      body: {
        positionId: 2,
        interviewStepId: 3,
      },
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe('updateCandidateStageController', () => {
    const mockUpdatedApplication = {
      id: 100,
      candidateId: 1,
      positionId: 2,
      currentInterviewStep: 3,
      candidate: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      position: {
        id: 2,
        title: 'Software Engineer',
      },
      interviewStep: {
        id: 3,
        name: 'Technical Interview',
      },
    };

    it('should return 200 with updated application on success', async () => {
      (candidateService.updateCandidateStage as jest.Mock).mockResolvedValue(
        mockUpdatedApplication
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(candidateService.updateCandidateStage).toHaveBeenCalledWith(1, {
        positionId: 2,
        interviewStepId: 3,
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate stage updated successfully',
        data: mockUpdatedApplication,
      });
    });

    it('should return 400 for invalid candidate ID format', async () => {
      mockRequest.params = { id: 'invalid' };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid candidate ID format',
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when positionId is missing', async () => {
      mockRequest.body = {
        interviewStepId: 3,
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Missing required fields',
        missingFields: ['positionId'],
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when interviewStepId is missing', async () => {
      mockRequest.body = {
        positionId: 2,
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Missing required fields',
        missingFields: ['interviewStepId'],
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when both positionId and interviewStepId are missing', async () => {
      mockRequest.body = {};

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Missing required fields',
        missingFields: ['positionId', 'interviewStepId'],
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 400 when field types are invalid', async () => {
      mockRequest.body = {
        positionId: 'invalid',
        interviewStepId: 3,
      };

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid field types. positionId and interviewStepId must be numbers',
      });
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
    });

    it('should return 404 when candidate not found', async () => {
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Candidate not found')
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Candidate not found',
      });
    });

    it('should return 404 when position not found', async () => {
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Position not found')
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Position not found',
      });
    });

    it('should return 404 when application not found', async () => {
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Application not found for this candidate and position')
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Application not found',
      });
    });

    it('should return 400 when interview step is invalid', async () => {
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Interview step not found')
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid interview step',
      });
    });

    it('should return 400 when interview step does not belong to position flow', async () => {
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error("Interview step does not belong to the position's interview flow")
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid interview step',
      });
    });

    it('should return 400 for unknown errors', async () => {
      (candidateService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Database connection error')
      );

      await updateCandidateStageController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Database connection error',
      });
    });
  });
});

