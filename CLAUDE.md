# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `bun dev` - Start development server on http://localhost:3000
- `bun build` - Build application for production
- `bun preview` - Preview production build locally
- `bun generate` - Generate static site

### Code Quality
- `bun lint` - Run ESLint to check code quality
- `bun lint:fix` - Automatically fix ESLint issues

### Package Management
- Uses `bun` as primary package manager (bun.lock present)
- `bun install` - Install dependencies
- `bun add <package>` - Add new dependencies
- `bun remove <package>` - Remove dependencies

## Architecture Overview

### Technology Stack
- **Framework**: Nuxt 4 with Vue 3
- **UI Library**: NuxtUI (component library)
- **State Management**: Pinia stores
- **TypeScript**: Fully typed codebase
- **Styling**: CSS with NuxtUI components
- **Image Handling**: @nuxt/image module
- **Code Quality**: ESLint with Nuxt configuration

### Project Structure
This is a TowerCo Workflow Platform demo that simulates document workflow management through persona switching rather than traditional authentication.

#### Core Directories
- `app/` - Main application code (Nuxt 4 structure)
  - `components/` - Vue components (PersonaSelector, WorkspaceDashboard)
  - `composables/` - Reusable composition functions
  - `pages/` - File-based routing (index.vue, demo.vue)
  - `stores/` - Pinia state management
  - `types/` - TypeScript type definitions
- `docs/` - Project requirements and sprint documentation

#### Data Architecture
- **Demo Mode**: Uses local storage + in-memory data simulation
- **Data Service Pattern**: `useDataService()` composable abstracts data operations
- **Demo Data**: `useDemoData()` provides realistic workflow scenarios
- **Migration Ready**: Designed for easy transition to Supabase backend

### Key Concepts

#### Persona Simulation System
The app operates without traditional authentication, instead using a persona selector to simulate different user roles:
- Field Engineer (Sarah Chen)
- Site Manager (Marcus Rodriguez)  
- Compliance Officer (Dr. Emily Watson)
- Project Manager, Technical Lead, Operations Manager (additional personas)

#### Workflow Data Model
Core entities with TypeScript interfaces:
- `User` - Employee personas with roles and departments
- `Task` - Workflow items with types (review, approval, information, action)
- `Document` - File attachments with versioning
- `Comment` - Task discussions with mentions support

#### State Management Pattern
- `useWorkflowStore()` - Main Pinia store managing current persona and tasks
- `useDataService()` - Data layer abstraction for CRUD operations
- Computed properties for filtered views (by status, priority, persona)
- Real-time UI updates when switching personas

## Development Guidelines

### Component Conventions
- Use NuxtUI components for consistent styling
- Follow Vue 3 Composition API patterns
- Leverage TypeScript for all component props and emits
- Use `readonly()` for exposing reactive state from stores

### Data Operations
- All data operations go through `useDataService()` composable
- Maintain separation between demo data and business logic
- Use proper TypeScript interfaces for all data structures
- Local storage keys prefixed with 'towerco-'

### Styling Approach
- Rely on NuxtUI component styling
- Custom CSS in `assets/css/main.css`
- Use NuxtUI color tokens for status/priority indicators
- Responsive design considerations built into NuxtUI

### Testing Strategy
- No specific test framework configured yet
- Manual testing through persona switching
- Verify data persistence in localStorage
- Cross-browser compatibility testing recommended