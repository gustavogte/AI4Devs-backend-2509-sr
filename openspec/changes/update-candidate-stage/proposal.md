# Change: Update Candidate Stage (Kanban Move)

## Why
The Kanban UI needs a way to move candidate cards between interview stages. Recruiters must be able to update a candidate's current interview step for a specific position/application when dragging and dropping cards in the Kanban interface. This enables visual workflow management and progress tracking.

## What Changes
- **ADDED**: New PUT endpoint `/candidates/:id/stage` to update the candidate's current interview stage for a position
- **ADDED**: Request body includes `positionId` and `interviewStepId` to identify the application and target stage
- The endpoint updates the `currentInterviewStep` field in the Application table for the specified candidate and position

## Impact
- Affected specs: `candidates` (new capability)
- Affected code:
  - New route: `backend/src/routes/candidateRoutes.ts`
  - New controller method: `backend/src/presentation/controllers/candidateController.ts`
  - New service method: `backend/src/application/services/candidateService.ts` (or `applicationService.ts` if created)
  - API spec: `backend/api-spec.yaml`

