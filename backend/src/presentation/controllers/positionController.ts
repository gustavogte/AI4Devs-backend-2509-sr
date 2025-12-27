import { Request, Response } from 'express';
import { getPositionCandidates } from '../../application/services/positionService';

export const getPositionCandidatesController = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid position ID format' });
    }

    const candidates = await getPositionCandidates(positionId);
    res.status(200).json(candidates);
  } catch (error) {
    if (error instanceof Error && error.message === 'Position not found') {
      return res.status(404).json({ error: 'Position not found' });
    }
    console.error('Error fetching position candidates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

