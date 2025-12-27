## 1. Implementation
- [x] 1.1 Create service method to update candidate's interview stage for a position
- [x] 1.2 Implement controller method to handle PUT /candidates/:id/stage request
- [x] 1.3 Add route definition for PUT /candidates/:id/stage
- [x] 1.4 Update API specification (api-spec.yaml) with new endpoint
- [x] 1.5 Write unit tests for service method
- [x] 1.6 Write integration tests for endpoint

## 2. Validation & Business Logic
- [x] 2.1 Validate that candidate exists
- [x] 2.2 Validate that position exists
- [x] 2.3 Validate that application exists for candidate and position
- [x] 2.4 Validate that interviewStepId exists and belongs to the position's interview flow
- [x] 2.5 Ensure interview step is valid for the position's interview flow

## 3. Data Update
- [x] 3.1 Update Application.currentInterviewStep with the new interviewStepId
- [x] 3.2 Return updated application information in response
- [x] 3.3 Handle database transaction errors appropriately

## 4. Error Handling
- [x] 4.1 Return 404 if candidate not found
- [x] 4.2 Return 404 if position not found
- [x] 4.3 Return 404 if application not found for candidate/position combination
- [x] 4.4 Return 400 if interviewStepId is invalid or doesn't belong to position's interview flow
- [x] 4.5 Return appropriate error messages for validation failures

