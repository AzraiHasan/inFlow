# Product Requirements Document v1.1: TowerCo Workflow Platform (Demo Version)

## 1. Introduction & Purpose

This document outlines the requirements for a **demonstration prototype** of the TowerCo Workflow Platform. The purpose of this version is to showcase the core features and user experience of the platform from the perspective of various internal roles. It will operate without a real authentication system, instead using a UI-based persona selector to simulate the experience of different users.

## 2. Product Goals

*   **Business Goal:** Increase operational efficiency and reduce risks associated with manual document handling.
*   **Product Goal:** Digitize and centralize the entire lifecycle of operational documents through a task-based workflow.
*   **Success Metrics:** Reduce document approval times, achieve 100% adoption for new projects, and eliminate the use of outdated document versions.

## 3. User Personas (Internal Employees)

The platform is designed exclusively for internal employees. The personas available for simulation will be:
*   Project Manager
*   Project Planner
*   Property Department
*   Site Acquisition (SAQ)
*   One Stop Agency (Liaison)
*   Documentation Department

## 4. MVP Feature Requirements

*   **FEAT-01: Task-Based Workflow:** Users can create, assign, and track tasks (e.g., `Review`, `Approval`) which act as containers for documents and collaboration.
*   **FEAT-02: Secure Document Management:** Secure document upload and storage with automatic version control.
*   **FEAT-03: Collaboration:** In-context comments and user tagging (`@mentions`) on every task.
*   **FEAT-04: Status Tracking & Approvals:** Clear status tracking for all tasks and simple, one-click approval/rejection workflows.
*   **FEAT-05: Audit & Analytics:** A comprehensive, immutable audit log for all actions and a dashboard overview of pending and recent tasks.
*   **FEAT-06: Persona Simulation Mode:**
    *   The UI must include a global component (e.g., a dropdown menu) to select from a list of pre-defined user personas.
    *   Upon selection, the entire UI (In-Tray, Out-Tray, etc.) must instantly update to reflect the data associated with the chosen persona.
    *   This selector replaces a traditional login system for this demo version.

## 5. User Experience (UX)

The UI is built around an intuitive **"in-tray" / "out-tray"** metaphor.

*   **"My Workspace" Screen:** The main view showing the user's In-Tray (tasks assigned to them) and Out-Tray (tasks they've assigned to others).
*   **"Task Detail" View:** A multi-column layout showing task details, an embedded document viewer, and a sidebar for comments, version history, and the audit log.

## 6. Technology Stack

*   **Backend Server:** **Nuxt 3/4 (Nitro)** will serve as the web server and handle all API logic.
*   **Data Storage:** **Local Storage/Memory** - All data will be stored in-memory and/or browser local storage for demo purposes.
*   **Authentication:** **None (Mocked).** A persona selection mechanism will be used instead of a real authentication library.
*   **State Management:** **Pinia** will be used to manage the currently active persona and application state.
*   **File Storage:** **Local file system** or **in-memory storage** for document uploads during demo sessions.
*   **Frontend Framework:** **Nuxt 4**.
*   **UI Component Library:** **NuxtUI**.

## 7. Data Model

The data model will be defined as TypeScript interfaces for local storage and in-memory data structures.

*   **`User` Interface:**
    *   `id: string`
    *   `email: string`
    *   `full_name: string`
    *   `department: string`
*   **`Task` Interface:**
    *   `id: string`
    *   `title: string`
    *   `creatorId: string` (references User.id)
    *   `assigneeId: string` (references User.id)
    *   `status: string`
    *   `task_type: string`
    *   `createdAt: Date`
    *   `dueDate: Date`
*   **`Document` Interface:**
    *   `id: string`
    *   `taskId: string` (references Task.id)
    *   `file_name: string`
    *   `file_data: string | Blob` (base64 encoded file content or blob for local storage)
    *   `version: number`
    *   `uploaderId: string` (references User.id)
    *   `uploadedAt: Date`
*   **`Comment` Interface:**
    *   `id: string`
    *   `taskId: string` (references Task.id)
    *   `authorId: string` (references User.id)
    *   `content: string`
    *   `createdAt: Date`

## 8. Development Plan Addendum

*   **Demo Data Initialization:** A data initialization system is a critical requirement. This will populate local storage and in-memory data stores with a comprehensive set of demo users, tasks, documents, and comments on application startup, ensuring the application is immediately demonstrable across all personas without requiring external database setup.

## 9. Migration Strategy to Production

This demo version is designed with production migration in mind. The architecture enables a smooth transition to Supabase (or similar production backend) with minimal refactoring:

### 9.1 Migration-Ready Architecture
*   **Service Layer Abstraction:** All data operations will be abstracted through a service layer interface that can be swapped from local storage to Supabase without changing business logic.
*   **Consistent Data Models:** TypeScript interfaces directly translate to Supabase table schemas with minimal modifications.
*   **API Structure:** Nuxt/Nitro API endpoints maintain the same structure, only changing the data source implementation.

### 9.2 Production Migration Effort (Estimated 2-3 Days)
*   **Authentication (Moderate):** Replace persona selector with Supabase Auth flows while optionally keeping persona switching as an admin feature.
*   **File Storage (Low-Medium):** Migrate from base64/blob storage to Supabase Storage buckets, updating upload/download logic.
*   **Database Operations (Medium):** Replace synchronous local storage with async Supabase calls, adding proper error handling and loading states.
*   **Real-time Features (Optional):** Leverage Supabase real-time subscriptions for enhanced collaboration features.

### 9.3 Migration Benefits
*   **Preserved Investment:** All UI/UX work, business logic, and component architecture remain intact.
*   **Enhanced Features:** Production version gains real authentication, scalable storage, and real-time collaboration.
*   **Proven Concept:** Demo validates user experience before production development costs.