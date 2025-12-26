## ADDED Requirements

### Requirement: Position Candidates List Endpoint
The system SHALL provide a GET endpoint at `/positions/:id/candidates` that retrieves all candidates in the application process for a given position. The endpoint SHALL return candidate information suitable for display in a Kanban-style interface, including the candidate's full name, current interview step, and average interview score.

#### Scenario: Retrieve candidates for a valid position
- **WHEN** a GET request is made to `/positions/:id/candidates` with a valid position ID
- **THEN** the system SHALL return a 200 status code
- **AND** the response SHALL contain an array of candidate objects
- **AND** each candidate object SHALL include:
  - `fullName`: The candidate's full name (firstName + lastName from the candidate table)
  - `currentInterviewStep`: The ID of the current interview step from the application table
  - `averageScore`: The average score calculated from all completed interviews for the candidate's application, or `null` if no interviews have been completed

#### Scenario: Position not found
- **WHEN** a GET request is made to `/positions/:id/candidates` with a non-existent position ID
- **THEN** the system SHALL return a 404 status code
- **AND** the response SHALL include an appropriate error message

#### Scenario: Position with no applications
- **WHEN** a GET request is made to `/positions/:id/candidates` for a position with no applications
- **THEN** the system SHALL return a 200 status code
- **AND** the response SHALL contain an empty array

#### Scenario: Candidate with no interviews
- **WHEN** a candidate has an application but no completed interviews
- **THEN** the candidate SHALL be included in the response
- **AND** the `averageScore` field SHALL be `null`

#### Scenario: Candidate with multiple interviews
- **WHEN** a candidate has completed multiple interviews with scores
- **THEN** the `averageScore` SHALL be calculated as the arithmetic mean of all interview scores
- **AND** interviews without scores SHALL be excluded from the average calculation

