## 1. Implementation
- [x] 1.1 Create position service method to fetch candidates with interview data
- [x] 1.2 Implement controller method to handle GET /positions/:id/candidates request
- [x] 1.3 Add route definition for GET /positions/:id/candidates
- [x] 1.4 Update API specification (api-spec.yaml) with new endpoint
- [x] 1.5 Write unit tests for service method
- [x] 1.6 Write integration tests for endpoint

## 2. Data Aggregation
- [x] 2.1 Query applications for the given position ID
- [x] 2.2 Join with candidate table to get full name (firstName + lastName)
- [x] 2.3 Include currentInterviewStep from application
- [x] 2.4 Calculate average score from all interviews for each application
- [x] 2.5 Handle cases where candidate has no interviews (null average score)

## 3. Response Format
- [x] 3.1 Structure response with candidate full name
- [x] 3.2 Include current interview step information
- [x] 3.3 Include calculated average score (or null if no interviews)
- [x] 3.4 Ensure proper error handling for invalid position ID

