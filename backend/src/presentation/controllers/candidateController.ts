import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Invalid candidate ID format' });
        }

        const { positionId, interviewStepId } = req.body;

        // Validate required fields
        if (!positionId || !interviewStepId) {
            const missingFields = [];
            if (!positionId) missingFields.push('positionId');
            if (!interviewStepId) missingFields.push('interviewStepId');
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: missingFields,
            });
        }

        // Validate field types
        if (typeof positionId !== 'number' || typeof interviewStepId !== 'number') {
            return res.status(400).json({
                error: 'Invalid field types. positionId and interviewStepId must be numbers',
            });
        }

        const updatedApplication = await updateCandidateStage(candidateId, {
            positionId,
            interviewStepId,
        });

        res.status(200).json({
            message: 'Candidate stage updated successfully',
            data: updatedApplication,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            const errorMessage = error.message;
            if (errorMessage === 'Candidate not found') {
                return res.status(404).json({ error: errorMessage });
            }
            if (errorMessage === 'Position not found') {
                return res.status(404).json({ error: errorMessage });
            }
            if (errorMessage === 'Application not found for this candidate and position') {
                return res.status(404).json({ error: 'Application not found' });
            }
            if (
                errorMessage === 'Interview step not found' ||
                errorMessage === "Interview step does not belong to the position's interview flow"
            ) {
                return res.status(400).json({ error: 'Invalid interview step' });
            }
            return res.status(400).json({ error: errorMessage });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export { addCandidate };