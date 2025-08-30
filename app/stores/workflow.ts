import { defineStore } from 'pinia'
import type { User, Task, Document, Comment as _Comment } from '~/types';
import { TaskStatus, TaskPriority } from '~/types'

export const useWorkflowStore = defineStore('workflow', () => {
  // Get data service composable
  const dataService = useDataService()
  
  // Core state
  const isInitialized = ref(false)
  const currentPersona = ref<User | null>(null)
  const selectedTaskId = ref<string | null>(null)

  // Initialize store and data
  const initialize = async () => {
    if (!isInitialized.value) {
      dataService.initializeData()
      currentPersona.value = dataService.currentPersona.value
      isInitialized.value = true
    }
  }

  // Persona management
  const setPersona = (persona: User) => {
    currentPersona.value = persona
    dataService.setPersona(persona)
    selectedTaskId.value = null // Clear selected task when switching personas
  }

  const resetData = () => {
    dataService.resetToDemo()
    currentPersona.value = dataService.currentPersona.value
    selectedTaskId.value = null
  }

  // Task management
  const selectTask = (taskId: string | null) => {
    selectedTaskId.value = taskId
  }

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return dataService.createTask(taskData)
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    return dataService.updateTask(taskId, updates)
  }

  const addTaskComment = (taskId: string, content: string, mentions: string[] = []) => {
    if (!currentPersona.value) return null
    
    return dataService.addComment(taskId, {
      content,
      authorId: currentPersona.value.id,
      mentions,
      taskId
    })
  }

  const addTaskDocument = (taskId: string, documentData: Omit<Document, 'id' | 'uploadedAt'>) => {
    return dataService.addDocument(taskId, documentData)
  }

  // Computed properties
  const allPersonas = computed(() => dataService.allPersonas.value)
  
  const allUsers = computed(() => dataService.users.value)
  
  const allTasks = computed(() => dataService.tasks.value)
  
  const currentPersonaTasks = computed(() => {
    if (!currentPersona.value) return { inTray: [], outTray: [] }
    return dataService.getPersonaTasks(currentPersona.value)
  })

  const selectedTask = computed(() => {
    if (!selectedTaskId.value) return null
    return dataService.getTaskById(selectedTaskId.value) || null
  })

  const tasksByStatus = computed(() => {
    const tasks = allTasks.value
    return {
      draft: tasks.filter(t => t.status === TaskStatus.DRAFT),
      assigned: tasks.filter(t => t.status === TaskStatus.ASSIGNED),
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
      pendingReview: tasks.filter(t => t.status === TaskStatus.PENDING_REVIEW),
      approved: tasks.filter(t => t.status === TaskStatus.APPROVED),
      rejected: tasks.filter(t => t.status === TaskStatus.REJECTED),
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED),
      cancelled: tasks.filter(t => t.status === TaskStatus.CANCELLED)
    }
  })

  const tasksByPriority = computed(() => {
    const tasks = allTasks.value
    return {
      urgent: tasks.filter(t => t.priority === TaskPriority.URGENT),
      high: tasks.filter(t => t.priority === TaskPriority.HIGH),
      medium: tasks.filter(t => t.priority === TaskPriority.MEDIUM),
      low: tasks.filter(t => t.priority === TaskPriority.LOW)
    }
  })

  const overdueTasks = computed(() => {
    const now = new Date()
    return allTasks.value.filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) {
        return false
      }
      return new Date(task.dueDate) < now
    })
  })

  const analytics = computed(() => dataService.getAnalytics())

  // Utility functions
  const getUserById = (userId: string) => dataService.getUserById(userId)
  
  const getTaskById = (taskId: string) => dataService.getTaskById(taskId)

  const formatTaskStatus = (status: TaskStatus): string => {
    const statusMap = {
      [TaskStatus.DRAFT]: 'Draft',
      [TaskStatus.ASSIGNED]: 'Assigned',
      [TaskStatus.IN_PROGRESS]: 'In Progress',
      [TaskStatus.PENDING_REVIEW]: 'Pending Review',
      [TaskStatus.APPROVED]: 'Approved',
      [TaskStatus.REJECTED]: 'Rejected',
      [TaskStatus.COMPLETED]: 'Completed',
      [TaskStatus.CANCELLED]: 'Cancelled'
    }
    return statusMap[status] || status
  }

  const formatTaskPriority = (priority: TaskPriority): string => {
    const priorityMap = {
      [TaskPriority.LOW]: 'Low',
      [TaskPriority.MEDIUM]: 'Medium', 
      [TaskPriority.HIGH]: 'High',
      [TaskPriority.URGENT]: 'Urgent'
    }
    return priorityMap[priority] || priority
  }

  const getStatusColor = (status: TaskStatus) => {
    const colorMap = {
      [TaskStatus.DRAFT]: 'neutral',
      [TaskStatus.ASSIGNED]: 'info',
      [TaskStatus.IN_PROGRESS]: 'warning',
      [TaskStatus.PENDING_REVIEW]: 'primary',
      [TaskStatus.APPROVED]: 'success',
      [TaskStatus.REJECTED]: 'error',
      [TaskStatus.COMPLETED]: 'success',
      [TaskStatus.CANCELLED]: 'neutral'
    } as const
    return colorMap[status] || 'neutral'
  }

  const getPriorityColor = (priority: TaskPriority) => {
    const colorMap = {
      [TaskPriority.LOW]: 'info',
      [TaskPriority.MEDIUM]: 'warning',
      [TaskPriority.HIGH]: 'error', 
      [TaskPriority.URGENT]: 'error'
    } as const
    return colorMap[priority] || 'neutral'
  }

  return {
    // State
    isInitialized: readonly(isInitialized),
    currentPersona: readonly(currentPersona),
    selectedTaskId: readonly(selectedTaskId),
    
    // Computed
    allPersonas,
    allUsers,
    allTasks,
    currentPersonaTasks,
    selectedTask,
    tasksByStatus,
    tasksByPriority, 
    overdueTasks,
    analytics,

    // Actions
    initialize,
    setPersona,
    resetData,
    selectTask,
    createTask,
    updateTask,
    addTaskComment,
    addTaskDocument,

    // Utilities
    getUserById,
    getTaskById,
    formatTaskStatus,
    formatTaskPriority,
    getStatusColor,
    getPriorityColor
  }
})