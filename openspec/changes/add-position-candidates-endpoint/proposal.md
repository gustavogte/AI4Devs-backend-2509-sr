# Change: Add Position Candidates Endpoint for Kanban Interface

## Why
Recruiters need a way to view all candidates in the application process for a specific position in a Kanban-style interface. This endpoint will provide the essential information needed to display candidates organized by their current interview stage, including their progress and performance metrics.

## What Changes
- **ADDED**: New GET endpoint `/positions/:id/candidates` to retrieve candidates for a position
- **ADDED**: Response includes candidate full name, current interview step, and average interview score
- The endpoint aggregates data from Application, Candidate, and Interview tables to provide a consolidated view

## Impact
- Affected specs: `positions` (new capability)
- Affected code: 
  - New route: `backend/src/routes/positionRoutes.ts` (or similar)
  - New controller: `backend/src/presentation/controllers/positionController.ts` (or similar)
  - New service: `backend/src/application/services/positionService.ts` (or similar)
  - API spec: `backend/api-spec.yaml`

