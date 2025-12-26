# Project Context

## Purpose
LTI (Talent Tracking System) is a full-stack application designed to manage the complete talent acquisition and recruitment lifecycle. The system enables recruiters and HR teams to:

- Track and manage candidate profiles with education, work experience, and resume documents
- Manage job positions and their associated interview flows
- Process applications and track candidates through multi-step interview processes
- Schedule and record interview results with scoring and notes
- Manage company information and employee assignments

The system supports both web-based interactions and RESTful API access for programmatic integration.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode enabled)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Testing**: Jest with ts-jest
- **Code Quality**: ESLint, Prettier
- **File Upload**: Multer
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Create React App
- **Routing**: React Router DOM
- **UI Framework**: Bootstrap 5, React Bootstrap
- **Icons**: React Bootstrap Icons
- **Date Handling**: React Datepicker
- **Testing**: React Testing Library, Jest

### Infrastructure
- **Containerization**: Docker Compose
- **Database**: PostgreSQL (containerized)
- **Development**: ts-node-dev (hot reload), ts-node (scripts)

## Project Conventions

### Code Style
- **Language**: All code, comments, documentation, and commit messages must be in English
- **Quotes**: Single quotes for strings (Prettier configured)
- **Trailing Commas**: Always use trailing commas (Prettier configured)
- **Formatting**: Prettier for code formatting, ESLint for linting
- **Naming**: 
  - Use clear, descriptive names for variables and functions
  - Follow TypeScript/JavaScript conventions (camelCase for variables/functions, PascalCase for classes)
- **Type Safety**: All code must be fully typed (TypeScript strict mode)

### Architecture Patterns

#### Backend Architecture (Layered Architecture)
The backend follows a clean, layered architecture pattern:

- **Domain Layer** (`domain/models/`): Contains business logic and domain models (e.g., `Candidate`, `Position`, `Application`). Models encapsulate data and behavior, including database persistence methods.
- **Application Layer** (`application/services/`): Contains application services that orchestrate business logic (e.g., `candidateService`, `fileUploadService`). Handles validation and coordinates between domain models.
- **Presentation Layer** (`presentation/controllers/`): Contains controllers that handle HTTP requests/responses and delegate to application services.
- **Routes** (`routes/`): Defines API endpoints and maps them to controllers.
- **Infrastructure**: Database access is handled through Prisma Client, which is attached to Express requests via middleware.

#### Frontend Architecture
- **Components** (`components/`): React functional components
- **Services** (`services/`): API communication layer
- **Public Assets**: Static files in `public/`
- **Build Output**: Production builds in `build/`

#### Key Patterns
- **Active Record Pattern**: Domain models (e.g., `Candidate`) include `save()` and static `findOne()` methods
- **Service Layer**: Business logic is encapsulated in service classes
- **Middleware Pattern**: Express middleware for CORS, JSON parsing, Prisma client attachment, and error handling
- **Dependency Injection**: Prisma client is injected via Express request object

### Testing Strategy
- **Framework**: Jest with ts-jest for TypeScript support
- **Approach**: Test-Driven Development (TDD) - write failing tests first, then implement functionality
- **Test Environment**: Node.js environment for backend tests
- **Coverage**: Aim for comprehensive test coverage, especially for business logic
- **Test Location**: Tests should be co-located with source files or in dedicated `tests/` directories
- **Test Naming**: Use descriptive test names in English

### Git Workflow
- **Branch Naming**: Feature branches follow the pattern `feature/[ticket-id]-[frontend|backend]`
  - Example: `feature/SCRUM-10-backend`, `feature/SCRUM-10-frontend`
- **Base Branch**: Typically `main` or `develop` (pull latest before creating feature branch)
- **Commit Messages**: Must be in English, descriptive of changes made
- **Workflow**: 
  1. Ensure on latest base branch
  2. Pull latest changes
  3. Create feature branch
  4. Implement changes following TDD
  5. Commit and push changes

## Domain Context

### Core Entities
- **Candidate**: Represents a job applicant with personal information, education history, work experience, and resume documents
- **Position**: Represents a job opening at a company with details like title, description, requirements, salary range, and application deadline
- **Company**: Represents organizations posting positions
- **Employee**: Represents company employees who conduct interviews
- **Application**: Represents a candidate's application to a specific position, tracking progress through interview steps
- **InterviewFlow**: Defines a sequence of interview steps for a position
- **InterviewStep**: Represents a single step in an interview flow (e.g., "Phone Screen", "Technical Interview")
- **InterviewType**: Categorizes interview steps (e.g., "Technical", "Behavioral")
- **Interview**: Records the actual interview event with date, interviewer, results, scores, and notes
- **Education**: Candidate's educational background (institution, title, dates)
- **WorkExperience**: Candidate's employment history (company, position, description, dates)
- **Resume**: File documents associated with candidates (file path, type, upload date)

### Business Rules
- Candidates must have unique email addresses
- Applications track progress through defined interview flows
- Each interview is associated with a specific interview step and conducted by an employee
- Positions are associated with companies and interview flows
- Interview flows define the sequence and types of interviews for a position

### API Endpoints
- `POST /candidates` - Create a new candidate with education, work experience, and resume
- `GET /candidates/:id` - Retrieve a candidate by ID with all related data
- `POST /upload` - Upload files (e.g., resumes)

## Important Constraints
- **Database**: PostgreSQL must be running (via Docker Compose) for the application to function
- **Ports**: 
  - Backend runs on port 3010
  - Frontend runs on port 3000
  - PostgreSQL runs on port 5432 (configurable via environment variables)
- **CORS**: Backend is configured to accept requests from `http://localhost:3000`
- **File Uploads**: File uploads are handled via Multer, stored in `uploads/` directory
- **Type Safety**: Strict TypeScript mode is enabled - all code must be properly typed
- **Language**: All technical artifacts (code, docs, commits) must be in English

## External Dependencies
- **PostgreSQL Database**: Managed via Docker Compose, requires `DATABASE_URL` environment variable
- **Prisma**: Database ORM and migration tool - requires `prisma generate` and `prisma migrate` commands
- **Docker**: Required for running PostgreSQL database container
- **Environment Variables**: 
  - Backend requires `DATABASE_URL` for Prisma connection
  - Docker Compose uses `DB_PASSWORD`, `DB_USER`, `DB_NAME`, `DB_PORT` for database configuration
