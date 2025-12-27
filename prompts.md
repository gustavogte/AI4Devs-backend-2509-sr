1. Please read openspec/project.md and help me fill it out with details about my project, tech stack, and conventions.

2. I want to add an endpoint that allows us to manipulate the candidate list for an application in a Kanban-style interface.

GET /positions/:id/candidates

This endpoint will retrieve all candidates in the process for a given position, that is, all applications for a specific positionID. It must provide the following basic information:

Full name of the candidate (from the candidate table).

current_interview_step: the stage of the process the candidate is in (from the application table).

The candidate's average score. Remember that each interview (interview) completed by the candidate has a score.

Please create an OpenSpec change proposal for this function.

3. I want to Add endpoint to update candidate stage (Kanban move).

    Please create an OpenSpec change proposal for this feature

The Kanban UI needs a way to move a candidate card between stages. This requires updating the candidate’s current interview stage for the relevant position/application.

- Add `PUT /candidates/:id/stage` to update the candidate’s current interview stage.
