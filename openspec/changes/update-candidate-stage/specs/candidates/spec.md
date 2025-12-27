## ADDED Requirements

### Requirement: Update Candidate Interview Stage Endpoint
The system SHALL provide a PUT endpoint at `/candidates/:id/stage` that updates a candidate's current interview stage for a specific position. This endpoint enables the Kanban UI to move candidate cards between interview stages by updating the application's current interview step.

#### Scenario: Successfully update candidate stage
- **WHEN** a PUT request is made to `/candidates/:id/stage` with:
  - A valid candidate ID in the URL path
  - A request body containing `positionId` and `interviewStepId`
  - The candidate has an application for the specified position
  - The interviewStepId belongs to the position's interview flow
- **THEN** the system SHALL return a 200 status code
- **AND** the system SHALL update the Application.currentInterviewStep field for the matching application
- **AND** the response SHALL include the updated application information

#### Scenario: Candidate not found
- **WHEN** a PUT request is made to `/candidates/:id/stage` with a non-existent candidate ID
- **THEN** the system SHALL return a 404 status code
- **AND** the response SHALL include an appropriate error message indicating the candidate was not found

#### Scenario: Position not found
- **WHEN** a PUT request is made to `/candidates/:id/stage` with a valid candidate ID but a non-existent positionId in the request body
- **THEN** the system SHALL return a 404 status code
- **AND** the response SHALL include an appropriate error message indicating the position was not found

#### Scenario: Application not found
- **WHEN** a PUT request is made to `/candidates/:id/stage` with a valid candidate ID and positionId, but no application exists for that candidate-position combination
- **THEN** the system SHALL return a 404 status code
- **AND** the response SHALL include an appropriate error message indicating the application was not found

#### Scenario: Invalid interview step
- **WHEN** a PUT request is made to `/candidates/:id/stage` with an interviewStepId that:
  - Does not exist, OR
  - Does not belong to the position's interview flow
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL include an appropriate error message indicating the interview step is invalid

#### Scenario: Missing required fields
- **WHEN** a PUT request is made to `/candidates/:id/stage` without required fields (positionId or interviewStepId) in the request body
- **THEN** the system SHALL return a 400 status code
- **AND** the response SHALL include an appropriate error message indicating which fields are missing

