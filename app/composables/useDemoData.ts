import type { User, Task, Document, Comment} from '~/types';
import { TaskType, TaskStatus, TaskPriority, UserRole, Department, DocumentCategory } from '~/types'

export const useDemoData = () => {
  // Demo Users - All 6 personas for TowerCo workflow
  const demoUsers: User[] = [
    {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@towerco.com',
      department: Department.FIELD_OPERATIONS,
      role: UserRole.FIELD_ENGINEER,
      avatar: '👩‍🔧'
    },
    {
      id: 'user-2', 
      name: 'Marcus Rodriguez',
      email: 'marcus.rodriguez@towerco.com',
      department: Department.SITE_MANAGEMENT,
      role: UserRole.SITE_MANAGER,
      avatar: '👨‍💼'
    },
    {
      id: 'user-3',
      name: 'Dr. Emily Watson',
      email: 'emily.watson@towerco.com',
      department: Department.COMPLIANCE,
      role: UserRole.COMPLIANCE_OFFICER,
      avatar: '👩‍⚖️'
    },
    {
      id: 'user-4',
      name: 'James Thompson',
      email: 'james.thompson@towerco.com', 
      department: Department.PROJECT_MANAGEMENT,
      role: UserRole.PROJECT_MANAGER,
      avatar: '👨‍💻'
    },
    {
      id: 'user-5',
      name: 'Priya Patel',
      email: 'priya.patel@towerco.com',
      department: Department.ENGINEERING,
      role: UserRole.TECHNICAL_LEAD,
      avatar: '👩‍🔬'
    },
    {
      id: 'user-6',
      name: 'Robert Kim',
      email: 'robert.kim@towerco.com',
      department: Department.OPERATIONS,
      role: UserRole.OPERATIONS_MANAGER,
      avatar: '👨‍⚡'
    }
  ]

  // Demo Documents with version history
  const demoDocuments: Document[] = [
    {
      id: 'doc-1',
      name: 'Site Survey Report - Tower 247',
      type: 'application/pdf',
      size: 2457600, // 2.4MB
      category: DocumentCategory.SITE_SURVEY,
      description: 'Comprehensive site survey including soil analysis, access road evaluation, and preliminary foundation requirements for Tower 247.',
      uploadedBy: 'user-1',
      uploadedAt: '2024-08-20T14:30:00Z',
      version: 2,
      url: '/api/documents/doc-1-v2.pdf',
      versions: [
        {
          id: 'doc-1-v1',
          version: 1,
          uploadedBy: 'user-1',
          uploadedAt: '2024-08-20T10:15:00Z',
          url: '/api/documents/doc-1-v1.pdf',
          changes: 'Initial survey report'
        },
        {
          id: 'doc-1-v2',
          version: 2,
          uploadedBy: 'user-1',
          uploadedAt: '2024-08-20T14:30:00Z',
          url: '/api/documents/doc-1-v2.pdf',
          changes: 'Added soil analysis and revised foundation recommendations'
        }
      ]
    },
    {
      id: 'doc-2',
      name: 'Environmental Impact Assessment',
      type: 'application/pdf',
      size: 5242880, // 5MB
      category: DocumentCategory.ENVIRONMENTAL,
      description: 'Environmental impact assessment report including wildlife protection regulations and permit requirements.',
      uploadedBy: 'user-3',
      uploadedAt: '2024-08-21T09:45:00Z',
      version: 1,
      url: '/api/documents/doc-2-v1.pdf',
      versions: [
        {
          id: 'doc-2-v1',
          version: 1,
          uploadedBy: 'user-3',
          uploadedAt: '2024-08-21T09:45:00Z',
          url: '/api/documents/doc-2-v1.pdf',
          changes: 'Initial environmental assessment'
        }
      ]
    },
    {
      id: 'doc-3',
      name: 'Tower Installation Checklist',
      type: 'application/vnd.ms-excel',
      size: 1024000, // 1MB
      category: DocumentCategory.INSTALLATION_GUIDE,
      description: 'Comprehensive pre-installation checklist including equipment verification, safety protocols, and team readiness assessment.',
      uploadedBy: 'user-5',
      uploadedAt: '2024-08-22T16:20:00Z',
      version: 3,
      url: '/api/documents/doc-3-v3.xlsx',
      versions: [
        {
          id: 'doc-3-v1',
          version: 1,
          uploadedBy: 'user-5',
          uploadedAt: '2024-08-22T11:00:00Z',
          url: '/api/documents/doc-3-v1.xlsx',
          changes: 'Initial checklist template'
        },
        {
          id: 'doc-3-v2',
          version: 2,
          uploadedBy: 'user-2',
          uploadedAt: '2024-08-22T13:15:00Z',
          url: '/api/documents/doc-3-v2.xlsx',
          changes: 'Added safety protocols section'
        },
        {
          id: 'doc-3-v3',
          version: 3,
          uploadedBy: 'user-5',
          uploadedAt: '2024-08-22T16:20:00Z',
          url: '/api/documents/doc-3-v3.xlsx',
          changes: 'Updated equipment specifications and added QC checkpoints'
        }
      ]
    }
  ]

  // Demo Comments with realistic collaboration
  const demoComments: Comment[] = [
    {
      id: 'comment-1',
      content: 'Site survey completed. Found some concerns with soil stability on the north side. @marcus.rodriguez please review before proceeding with foundation work.',
      authorId: 'user-1',
      createdAt: '2024-08-20T15:30:00Z',
      mentions: ['user-2'],
      taskId: 'task-1'
    },
    {
      id: 'comment-2', 
      content: 'Thanks @sarah.chen for flagging this. I\'ve reviewed the soil analysis and agree we need additional reinforcement. Will coordinate with engineering team.',
      authorId: 'user-2',
      createdAt: '2024-08-20T16:45:00Z',
      mentions: ['user-1'],
      taskId: 'task-1'
    },
    {
      id: 'comment-3',
      content: 'Environmental assessment shows no significant impact to local wildlife. Permits should be approved within 3-5 business days. @james.thompson please track this for project timeline.',
      authorId: 'user-3',
      createdAt: '2024-08-21T10:15:00Z',
      mentions: ['user-4'],
      taskId: 'task-2'
    },
    {
      id: 'comment-4',
      content: 'Perfect timing. I\'ve updated the project schedule to account for the permit approval window. @robert.kim - can you confirm resource availability for the installation window?',
      authorId: 'user-4',
      createdAt: '2024-08-21T11:30:00Z',
      mentions: ['user-6'],
      taskId: 'task-2'
    },
    {
      id: 'comment-5',
      content: 'Installation team is ready. I\'ve reviewed the updated checklist and all equipment is on-site. Great work on the safety protocols @marcus.rodriguez!',
      authorId: 'user-6',
      createdAt: '2024-08-22T17:00:00Z',
      mentions: ['user-2'],
      taskId: 'task-3'
    },
    {
      id: 'comment-6',
      content: 'Thank you! Safety is our top priority. The checklist now includes all new OSHA requirements. @priya.patel - can you validate the technical specifications in v3?',
      authorId: 'user-2',
      createdAt: '2024-08-22T17:30:00Z',
      mentions: ['user-5'],
      taskId: 'task-3'
    }
  ]

  // Demo Tasks with comprehensive workflow stages
  const demoTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Tower Site 247 - Initial Survey and Assessment',
      description: 'Conduct comprehensive site survey for new tower installation at location 247. Include soil analysis, access road evaluation, and preliminary foundation requirements.',
      type: TaskType.REVIEW,
      status: TaskStatus.PENDING_REVIEW,
      priority: TaskPriority.HIGH,
      assigneeId: 'user-2', // Marcus (Site Manager) - assigned to review Sarah's work
      createdBy: 'user-1', // Sarah (Field Engineer)
      createdAt: '2024-08-20T09:00:00Z',
      updatedAt: '2024-08-20T16:45:00Z',
      dueDate: '2024-08-25T17:00:00Z',
      documents: demoDocuments.slice(0, 1), // Site Survey Report
      comments: demoComments.slice(0, 2)
    },
    {
      id: 'task-2',
      title: 'Environmental Compliance Review - Tower 247',
      description: 'Complete environmental impact assessment and obtain necessary permits for tower installation. Ensure compliance with local wildlife protection regulations.',
      type: TaskType.APPROVAL,
      status: TaskStatus.APPROVED,
      priority: TaskPriority.MEDIUM,
      assigneeId: 'user-4', // James (Project Manager) - to track approval
      createdBy: 'user-3', // Emily (Compliance Officer)
      createdAt: '2024-08-21T08:00:00Z',
      updatedAt: '2024-08-21T11:30:00Z',
      dueDate: '2024-08-28T12:00:00Z',
      documents: demoDocuments.slice(1, 2), // Environmental Impact Assessment
      comments: demoComments.slice(2, 4)
    },
    {
      id: 'task-3',
      title: 'Tower Installation - Pre-Installation Checklist',
      description: 'Complete final pre-installation checklist including equipment verification, safety protocols, and team readiness assessment.',
      type: TaskType.ACTION,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      assigneeId: 'user-6', // Robert (Operations Manager)
      createdBy: 'user-5', // Priya (Technical Lead)
      createdAt: '2024-08-22T10:00:00Z',
      updatedAt: '2024-08-22T17:30:00Z',
      dueDate: '2024-08-24T08:00:00Z',
      documents: demoDocuments.slice(2, 3), // Tower Installation Checklist
      comments: demoComments.slice(4, 6)
    },
    {
      id: 'task-4',
      title: 'Quarterly Safety Audit - Zone 3',
      description: 'Conduct quarterly safety audit for all tower sites in Zone 3. Review safety protocols, equipment maintenance records, and incident reports.',
      type: TaskType.REVIEW,
      status: TaskStatus.ASSIGNED,
      priority: TaskPriority.MEDIUM,
      assigneeId: 'user-1', // Sarah (Field Engineer)
      createdBy: 'user-3', // Emily (Compliance Officer)
      createdAt: '2024-08-23T10:00:00Z',
      updatedAt: '2024-08-23T10:00:00Z',
      dueDate: '2024-08-30T17:00:00Z',
      documents: [],
      comments: []
    },
    {
      id: 'task-5',
      title: 'Equipment Maintenance Schedule - Q4 Planning',
      description: 'Plan and schedule preventive maintenance for all tower equipment in preparation for Q4. Coordinate with field teams and ensure minimal service disruption.',
      type: TaskType.INFORMATION,
      status: TaskStatus.DRAFT,
      priority: TaskPriority.LOW,
      assigneeId: 'user-6', // Robert (Operations Manager)
      createdBy: 'user-4', // James (Project Manager)
      createdAt: '2024-08-23T14:00:00Z',
      updatedAt: '2024-08-23T14:00:00Z',
      dueDate: '2024-09-15T17:00:00Z',
      documents: [],
      comments: []
    }
  ]

  return {
    users: demoUsers,
    tasks: demoTasks,
    documents: demoDocuments,
    comments: demoComments
  }
}