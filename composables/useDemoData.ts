import type { 
  User, 
  Task, 
  Document, 
  DocumentVersion, 
  Comment 
} from '../app/types'

import { 
  TaskType, 
  TaskStatus, 
  TaskPriority, 
  UserRole, 
  Department 
} from '../app/types'

// Demo Users - 2 Personas
export const demoUsers: User[] = [
  {
    id: 'user-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@towerco.com',
    department: Department.FIELD_OPERATIONS,
    role: UserRole.FIELD_ENGINEER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'user-002',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@towerco.com',
    department: Department.PROJECT_MANAGEMENT,
    role: UserRole.PROJECT_MANAGER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  }
]

// Document Versions
export const demoDocumentVersions: Record<string, DocumentVersion[]> = {
  'doc-001': [
    {
      id: 'version-001-v1',
      version: 1,
      uploadedBy: 'user-001',
      uploadedAt: '2025-01-15T08:30:00Z',
      url: '/api/documents/site-inspection-v1.pdf',
      changes: 'Initial site inspection report'
    },
    {
      id: 'version-001-v2',
      version: 2,
      uploadedBy: 'user-001',
      uploadedAt: '2025-01-16T14:20:00Z',
      url: '/api/documents/site-inspection-v2.pdf',
      changes: 'Added detailed equipment measurements and photos'
    }
  ],
  'doc-002': [
    {
      id: 'version-002-v1',
      version: 1,
      uploadedBy: 'user-001',
      uploadedAt: '2025-01-18T10:15:00Z',
      url: '/api/documents/safety-checklist-v1.pdf',
      changes: 'Initial safety compliance checklist'
    }
  ],
  'doc-003': [
    {
      id: 'version-003-v1',
      version: 1,
      uploadedBy: 'user-002',
      uploadedAt: '2025-01-20T09:45:00Z',
      url: '/api/documents/project-timeline-v1.xlsx',
      changes: 'Q1 2025 project timeline and milestones'
    },
    {
      id: 'version-003-v2',
      version: 2,
      uploadedBy: 'user-002',
      uploadedAt: '2025-01-22T11:30:00Z',
      url: '/api/documents/project-timeline-v2.xlsx',
      changes: 'Updated timeline after site inspection review'
    },
    {
      id: 'version-003-v3',
      version: 3,
      uploadedBy: 'user-002',
      uploadedAt: '2025-01-24T16:00:00Z',
      url: '/api/documents/project-timeline-v3.xlsx',
      changes: 'Final timeline with approved resource allocation'
    }
  ],
  'doc-004': [
    {
      id: 'version-004-v1',
      version: 1,
      uploadedBy: 'user-001',
      uploadedAt: '2025-01-25T13:20:00Z',
      url: '/api/documents/equipment-specs-v1.pdf',
      changes: 'Equipment specifications for tower upgrade'
    }
  ],
  'doc-005': [
    {
      id: 'version-005-v1',
      version: 1,
      uploadedBy: 'user-002',
      uploadedAt: '2025-01-23T12:10:00Z',
      url: '/api/documents/budget-approval-v1.pdf',
      changes: 'Budget approval form for Q1 projects'
    }
  ]
}

// Demo Documents
export const demoDocuments: Document[] = [
  {
    id: 'doc-001',
    name: 'Site Inspection Report - Tower A47',
    type: 'application/pdf',
    size: 2457600, // 2.4MB
    uploadedBy: 'user-001',
    uploadedAt: '2025-01-16T14:20:00Z',
    version: 2,
    url: '/api/documents/site-inspection-v2.pdf',
    versions: demoDocumentVersions['doc-001']
  },
  {
    id: 'doc-002',
    name: 'Safety Compliance Checklist',
    type: 'application/pdf',
    size: 1024000, // 1MB
    uploadedBy: 'user-001',
    uploadedAt: '2025-01-18T10:15:00Z',
    version: 1,
    url: '/api/documents/safety-checklist-v1.pdf',
    versions: demoDocumentVersions['doc-002']
  },
  {
    id: 'doc-003',
    name: 'Q1 2025 Project Timeline',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 512000, // 512KB
    uploadedBy: 'user-002',
    uploadedAt: '2025-01-24T16:00:00Z',
    version: 3,
    url: '/api/documents/project-timeline-v3.xlsx',
    versions: demoDocumentVersions['doc-003']
  },
  {
    id: 'doc-004',
    name: 'Equipment Specifications',
    type: 'application/pdf',
    size: 3145728, // 3MB
    uploadedBy: 'user-001',
    uploadedAt: '2025-01-25T13:20:00Z',
    version: 1,
    url: '/api/documents/equipment-specs-v1.pdf',
    versions: demoDocumentVersions['doc-004']
  },
  {
    id: 'doc-005',
    name: 'Budget Approval Form',
    type: 'application/pdf',
    size: 768000, // 768KB
    uploadedBy: 'user-002',
    uploadedAt: '2025-01-23T12:10:00Z',
    version: 1,
    url: '/api/documents/budget-approval-v1.pdf',
    versions: demoDocumentVersions['doc-005']
  }
]

// Demo Comments
export const demoComments: Comment[] = [
  // Comments for Task 1
  {
    id: 'comment-001',
    content: 'Site inspection completed successfully. Found some minor equipment issues that need attention before the upgrade can proceed.',
    authorId: 'user-001',
    createdAt: '2025-01-16T15:30:00Z',
    mentions: ['user-002'],
    taskId: 'task-001'
  },
  {
    id: 'comment-002',
    content: '@sarah.chen Thanks for the detailed report. The equipment issues you mentioned - are they critical or can we work around them for now?',
    authorId: 'user-002',
    createdAt: '2025-01-17T09:15:00Z',
    mentions: ['user-001'],
    taskId: 'task-001'
  },
  {
    id: 'comment-003',
    content: '@michael.rodriguez They\'re not critical but should be addressed within the next maintenance window. I\'ve updated the report with specific recommendations.',
    authorId: 'user-001',
    createdAt: '2025-01-17T14:20:00Z',
    mentions: ['user-002'],
    taskId: 'task-001'
  },
  
  // Comments for Task 2
  {
    id: 'comment-004',
    content: 'Safety checklist completed for all equipment. All items passed except for one minor documentation update needed.',
    authorId: 'user-001',
    createdAt: '2025-01-19T10:45:00Z',
    mentions: [],
    taskId: 'task-002'
  },
  
  // Comments for Task 3
  {
    id: 'comment-005',
    content: 'Initial project timeline draft is ready. Please review and let me know if the milestones align with your field schedule.',
    authorId: 'user-002',
    createdAt: '2025-01-20T11:00:00Z',
    mentions: ['user-001'],
    taskId: 'task-003'
  },
  {
    id: 'comment-006',
    content: '@michael.rodriguez Timeline looks good overall. I suggest extending the equipment testing phase by 2 days to account for the issues found in the inspection.',
    authorId: 'user-001',
    createdAt: '2025-01-21T08:30:00Z',
    mentions: ['user-002'],
    taskId: 'task-003'
  },
  {
    id: 'comment-007',
    content: '@sarah.chen Good point. I\'ve updated the timeline to include the additional testing time. Version 2 is now available.',
    authorId: 'user-002',
    createdAt: '2025-01-22T12:00:00Z',
    mentions: ['user-001'],
    taskId: 'task-003'
  },
  
  // Comments for Task 4
  {
    id: 'comment-008',
    content: 'Equipment specifications have been compiled based on the site inspection findings. Ready for technical review.',
    authorId: 'user-001',
    createdAt: '2025-01-25T14:00:00Z',
    mentions: [],
    taskId: 'task-004'
  },
  
  // Comments for Task 5
  {
    id: 'comment-009',
    content: 'Budget approval documentation is ready for submission. All cost estimates are based on current vendor quotes.',
    authorId: 'user-002',
    createdAt: '2025-01-23T13:15:00Z',
    mentions: [],
    taskId: 'task-005'
  }
]

// Demo Tasks - 5 tasks total (3 for Sarah, 2 for Michael)
export const demoTasks: Task[] = [
  // Sarah's Tasks (Field Engineer)
  {
    id: 'task-001',
    title: 'Site Inspection - Tower A47 Upgrade Assessment',
    description: 'Conduct comprehensive site inspection for the upcoming tower equipment upgrade. Document current conditions, identify potential issues, and provide recommendations for the upgrade process.',
    type: TaskType.REVIEW,
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    assigneeId: 'user-001',
    createdBy: 'user-002',
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-17T16:30:00Z',
    dueDate: '2025-01-18T17:00:00Z',
    documents: [demoDocuments[0]], // Site Inspection Report
    comments: demoComments.filter(c => c.taskId === 'task-001')
  },
  {
    id: 'task-002',
    title: 'Safety Compliance Verification',
    description: 'Verify all safety protocols and compliance requirements are met before proceeding with equipment installation. Complete safety checklist and document any non-compliance issues.',
    type: TaskType.ACTION,
    status: TaskStatus.APPROVED,
    priority: TaskPriority.URGENT,
    assigneeId: 'user-001',
    createdBy: 'user-002',
    createdAt: '2025-01-17T09:30:00Z',
    updatedAt: '2025-01-19T11:00:00Z',
    dueDate: '2025-01-20T12:00:00Z',
    documents: [demoDocuments[1]], // Safety Compliance Checklist
    comments: demoComments.filter(c => c.taskId === 'task-002')
  },
  {
    id: 'task-004',
    title: 'Equipment Specification Documentation',
    description: 'Compile detailed specifications for all equipment required for the tower upgrade. Include technical requirements, compatibility matrices, and installation guidelines.',
    type: TaskType.INFORMATION,
    status: TaskStatus.PENDING_REVIEW,
    priority: TaskPriority.MEDIUM,
    assigneeId: 'user-001',
    createdBy: 'user-001',
    createdAt: '2025-01-24T10:00:00Z',
    updatedAt: '2025-01-25T14:00:00Z',
    dueDate: '2025-01-28T17:00:00Z',
    documents: [demoDocuments[3]], // Equipment Specifications
    comments: demoComments.filter(c => c.taskId === 'task-004')
  },
  
  // Michael's Tasks (Project Manager)
  {
    id: 'task-003',
    title: 'Q1 2025 Project Timeline Development',
    description: 'Develop comprehensive project timeline for Q1 2025 tower upgrade initiatives. Coordinate with field teams and incorporate site inspection findings into the schedule.',
    type: TaskType.APPROVAL,
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    assigneeId: 'user-002',
    createdBy: 'user-002',
    createdAt: '2025-01-19T14:00:00Z',
    updatedAt: '2025-01-24T16:30:00Z',
    dueDate: '2025-01-26T17:00:00Z',
    documents: [demoDocuments[2]], // Q1 2025 Project Timeline
    comments: demoComments.filter(c => c.taskId === 'task-003')
  },
  {
    id: 'task-005',
    title: 'Budget Approval Processing',
    description: 'Process budget approvals for Q1 project initiatives. Review cost estimates, validate against approved budgets, and prepare documentation for executive approval.',
    type: TaskType.APPROVAL,
    status: TaskStatus.ASSIGNED,
    priority: TaskPriority.MEDIUM,
    assigneeId: 'user-002',
    createdBy: 'user-002',
    createdAt: '2025-01-23T11:00:00Z',
    updatedAt: '2025-01-23T11:00:00Z',
    dueDate: '2025-01-30T17:00:00Z',
    documents: [demoDocuments[4]], // Budget Approval Form
    comments: demoComments.filter(c => c.taskId === 'task-005')
  }
]

// Composable Hook
export const useDemoData = () => {
  const getUsers = (): User[] => demoUsers
  
  const getUser = (id: string): User | undefined => {
    return demoUsers.find(user => user.id === id)
  }
  
  const getTasks = (): Task[] => demoTasks
  
  const getTasksForUser = (userId: string): Task[] => {
    return demoTasks.filter(task => task.assigneeId === userId || task.createdBy === userId)
  }
  
  const getInTrayForUser = (userId: string): Task[] => {
    return demoTasks.filter(task => task.assigneeId === userId)
  }
  
  const getOutTrayForUser = (userId: string): Task[] => {
    return demoTasks.filter(task => task.createdBy === userId)
  }
  
  const getTask = (taskId: string): Task | undefined => {
    return demoTasks.find(task => task.id === taskId)
  }
  
  const getDocuments = (): Document[] => demoDocuments
  
  const getDocument = (documentId: string): Document | undefined => {
    return demoDocuments.find(doc => doc.id === documentId)
  }
  
  const getComments = (): Comment[] => demoComments
  
  const getCommentsForTask = (taskId: string): Comment[] => {
    return demoComments.filter(comment => comment.taskId === taskId)
  }
  
  return {
    // Data getters
    getUsers,
    getUser,
    getTasks,
    getTasksForUser,
    getInTrayForUser,
    getOutTrayForUser,
    getTask,
    getDocuments,
    getDocument,
    getComments,
    getCommentsForTask,
    
    // Raw data exports for initialization
    users: demoUsers,
    tasks: demoTasks,
    documents: demoDocuments,
    comments: demoComments
  }
}