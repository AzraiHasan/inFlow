export interface User {
  id: string
  name: string
  email: string
  department: string
  role: string
  avatar?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  documents: Document[]
  comments: Comment[]
}

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
  version: number
  url: string
  versions: DocumentVersion[]
}

export interface DocumentVersion {
  id: string
  version: number
  uploadedBy: string
  uploadedAt: string
  url: string
  changes?: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  createdAt: string
  updatedAt?: string
  mentions: string[]
  taskId: string
}

export enum TaskType {
  REVIEW = 'review',
  APPROVAL = 'approval',
  INFORMATION = 'information',
  ACTION = 'action'
}

export enum TaskStatus {
  DRAFT = 'draft',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum UserRole {
  FIELD_ENGINEER = 'field_engineer',
  SITE_MANAGER = 'site_manager',
  COMPLIANCE_OFFICER = 'compliance_officer',
  PROJECT_MANAGER = 'project_manager',
  TECHNICAL_LEAD = 'technical_lead',
  OPERATIONS_MANAGER = 'operations_manager'
}

export enum Department {
  FIELD_OPERATIONS = 'field_operations',
  SITE_MANAGEMENT = 'site_management',
  COMPLIANCE = 'compliance',
  PROJECT_MANAGEMENT = 'project_management',
  ENGINEERING = 'engineering',
  OPERATIONS = 'operations'
}