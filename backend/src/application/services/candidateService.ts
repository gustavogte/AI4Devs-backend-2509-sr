import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData); // Validar los datos del candidato
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        // Guardar la educación del candidato
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                const educationModel = new Education(education);
                educationModel.candidateId = candidateId;
                await educationModel.save();
                candidate.education.push(educationModel);
            }
        }

        // Guardar la experiencia laboral del candidato
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                const experienceModel = new WorkExperience(experience);
                experienceModel.candidateId = candidateId;
                await experienceModel.save();
                candidate.workExperience.push(experienceModel);
            }
        }

        // Guardar los archivos de CV
        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            const resumeModel = new Resume(candidateData.cv);
            resumeModel.candidateId = candidateId;
            await resumeModel.save();
            candidate.resumes.push(resumeModel);
        }
        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw new Error('Error al recuperar el candidato');
    }
};

export interface UpdateCandidateStageRequest {
    positionId: number;
    interviewStepId: number;
}

export const updateCandidateStage = async (
    candidateId: number,
    request: UpdateCandidateStageRequest
): Promise<any> => {
    const { positionId, interviewStepId } = request;

    // Validate candidate exists
    const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
    });

    if (!candidate) {
        throw new Error('Candidate not found');
    }

    // Validate position exists
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        include: {
            interviewFlow: {
                include: {
                    interviewSteps: true,
                },
            },
        },
    });

    if (!position) {
        throw new Error('Position not found');
    }

    // Find application for candidate and position
    const application = await prisma.application.findFirst({
        where: {
            candidateId: candidateId,
            positionId: positionId,
        },
    });

    if (!application) {
        throw new Error('Application not found for this candidate and position');
    }

    // Validate interview step exists and belongs to position's interview flow
    const interviewStep = await prisma.interviewStep.findUnique({
        where: { id: interviewStepId },
    });

    if (!interviewStep) {
        throw new Error('Interview step not found');
    }

    // Check if interview step belongs to the position's interview flow
    const isValidStep = position.interviewFlow.interviewSteps.some(
        (step) => step.id === interviewStepId
    );

    if (!isValidStep) {
        throw new Error('Interview step does not belong to the position\'s interview flow');
    }

    // Update the application's current interview step
    const updatedApplication = await prisma.application.update({
        where: { id: application.id },
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

    return updatedApplication;
};
