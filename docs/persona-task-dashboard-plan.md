# Persona Task Assignment Dashboard Implementation Plan

## Overview
Create a UTab selector interface to demonstrate task assignments received by different personas in the TowerCo Workflow Platform. This will showcase how tasks flow between team members with different roles.

## Current System Analysis
- **2 Personas**: Field Engineer, Site Manager
- **Task System**: Robust task creation, assignment, and tracking via `useDataService()` and `useWorkflowStore()`
- **Demo Data**: Pre-populated with realistic workflow scenarios across personas
- **Persona Switching**: Existing `PersonaSelector` component for switching active user

## Implementation Plan

### 1. Create WorkspaceDashboard Component
**File**: `app/components/WorkspaceDashboard.vue`

**Features**:
- NuxtUI UTabs with one tab per persona (2 tabs total)
- Each tab shows tasks assigned TO that persona (their "inbox")
- Tab labels include persona name + unread/pending task count badge
- Clean, organized view of persona-specific tasks

**Tab Structure**:
```
[👩‍🔧 Sarah Chen (3)] [👨‍💼 Marcus Rodriguez (1)]
```

### 2. Update Demo Page Integration
**File**: `app/pages/demo.vue`

**Changes**:
- Add WorkspaceDashboard component above or alongside existing TaskTable
- Create clear section for "Assigned Task Views"
- Maintain existing task creation functionality
- Show both unassigned tasks (current view) and assigned tasks (new dashboard)

### 3. Enhanced Task Assignment Flow
**Features**:
- Quick assignment dropdown on each task in TaskTable
- Visual feedback when tasks are assigned (move from unassigned to assigned view)
- Real-time updates to tab badges when assignments change
- Demonstration of cross-persona collaboration

### 4. Persona-Specific Task Views
**Each Tab Content**:
- Filtered tasks assigned to that specific persona
- Task status indicators (pending, in-progress, completed)
- Due date and priority indicators
- Document attachment indicators
- Action buttons appropriate for task status

### 5. Data Integration
**Use Existing Services**:
- `useDataService().getPersonaTasks(persona)` for filtering
- `useWorkflowStore()` for task management
- Leverage existing demo data from `useDemoData()`
- Maintain localStorage persistence

### 6. Demo Enhancement
**Sample Scenarios**:
- Pre-populate with tasks assigned across different personas
- Show realistic workflow progression (Field Engineer → Site Manager)
- Demonstrate collaborative features (comments, document sharing)

## Technical Implementation Details

### Component Architecture
```
WorkspaceDashboard.vue
├── UTabs (NuxtUI)
│   ├── UTabItem per persona
│   │   ├── Task list filtered by assigneeId
│   │   ├── Status badges and priority indicators
│   │   └── Action buttons (view, comment, update status)
│   └── Tab badges with task counts
```

### Data Flow
1. Component gets all personas from `useDataService()`
2. For each persona, filter tasks where `task.assigneeId === persona.id`
3. Count pending tasks for badge display
4. Update reactively when tasks are assigned/reassigned

### Styling Approach
- Use NuxtUI components for consistency
- Responsive design for mobile/desktop
- Color-coded badges for different task types/statuses
- Clear visual hierarchy

## Success Criteria
- [x] Clean tabbed interface showing both personas
- [x] Each tab displays tasks assigned to that persona
- [x] Badge counts update when tasks are assigned
- [x] Seamless integration with existing demo page
- [x] Demonstrates realistic workflow scenarios
- [x] Mobile-responsive design
- [x] Uses existing data service architecture

## Files to Create/Modify
1. **New**: `app/components/WorkspaceDashboard.vue` ✅ **COMPLETED**
2. **Modify**: `app/pages/demo.vue` - Add dashboard component ✅ **COMPLETED**
3. **Optional**: Update TaskTable component for enhanced assignment UI ✅ **NOT NEEDED** (existing AssigneeCell provides assignment functionality)

## Implementation Status: ✅ **COMPLETE**

### What Was Implemented:

**WorkspaceDashboard Component** (`app/components/WorkspaceDashboard.vue`):
- UTabs interface with 2 persona tabs (Field Engineer, Site Manager only)
- Task filtering using `dataService.getPersonaTasks(persona).inTray`
- Tab badges showing pending task counts: `${persona.name} (${pendingCount})`
- Rich task display with status badges, priority indicators, document counts
- Empty states for personas with no assigned tasks
- Responsive design using NuxtUI components
- Real-time reactivity through Vue 3 computed properties

**Demo Page Integration** (`app/pages/demo.vue`):
- Added WorkspaceDashboard above existing TaskTable sections
- Maintains all existing task creation and management functionality
- Clear section headers distinguish "Assigned Task Views" from unassigned tasks

**Data Integration**:
- Uses existing `useDataService()` and `getPersonaTasks()` methods
- Leverages pre-populated demo data with realistic workflow scenarios:
  - Task-1: Sarah Chen → Marcus Rodriguez (site survey review)
  - Task-4: Sarah Chen assigned (safety audit)
- Real-time badge updates when tasks are assigned through existing TaskTable
- localStorage persistence maintained through existing data service

**Key Features Working**:
- 2-persona focus as specified (Field Engineer + Site Manager)
- Task assignment flow through existing AssigneeCell dropdown
- Visual feedback with status/priority badges and document indicators
- Cross-persona collaboration demonstration
- Mobile-responsive NuxtUI design

## Dependencies
- Existing NuxtUI components (UTabs, UBadge, UButton, UCard)
- Current data service architecture
- Existing persona and task type definitions