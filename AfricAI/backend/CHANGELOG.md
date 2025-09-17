# Changelog

## v1.0.0 (Initial Release)

This marks the first version of the new Learning App backend.

### Summary

This backend was built from the ground up as a new service to support the existing frontend application (`B/frontend`). The goal was to create a production-quality, modern Spring Boot application while respecting the coding style and data models implied by the existing frontend and reference code (`B/User/User`).

### What Was Added

- **New Spring Boot Application**: A complete backend application using Java 24, Spring Boot 3.3, and Maven.
- **Authentication**: Full JWT-based authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`) with password hashing and role-based security stubs.
- **Course API**: A full CRUD API for managing courses (`/api/courses`).
- **Database Integration**: Uses Spring Data MongoDB for persistent storage.
- **Testing**: Includes both unit tests for the service layer and integration tests (using Testcontainers) for key API flows.
- **API Documentation**: Integrated Swagger/OpenAPI for live, interactive API documentation.
- **Containerization**: A `Dockerfile` and `docker-compose.yml` are provided for easy, reproducible local development.
- **Documentation**: A comprehensive `README.md` details setup, configuration, and execution.

### What Was Preserved (from `B/User/User` and `B/frontend`)

- **Data Models**: The backend entities and DTOs are designed to be 100% compatible with the data structures defined in the frontend's `types.ts` and `mockData.ts`.
- **Coding Style**: The code aims for clarity and explicitness, avoiding "magic" frameworks like Lombok, in line with the "human-written" style requested.
- **Architectural Pattern**: Follows a standard Controller-Service-Repository pattern, similar to the structure seen in the reference projects.
