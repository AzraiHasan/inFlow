import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useDataService } from '~/composables/useDataService'
import type { User, Task, Document, TaskStatus } from '../app/types'

export const useWorkflowStore = defineStore('workflow', () => {
  const dataService = useDataService()
  
  // Initialize data when store is first used
  let initialized = false
  
  const initialize = () => {
    if (!initialized) {
      dataService.initializeDemoData()
      initialized = true
    }
  }
  
  // Computed values for reactive access
  const activePersona = computed<User | null>(() => {
    initialize()
    return dataService.activePersona.value
  })
  
  const users = computed<User[]>(() => {
    initialize()
    return dataService.users.value
  })
  
  const tasks = computed<Task[]>(() => {
    initialize()
    return dataService.tasks.value
  })
  
  const documents = computed<Document[]>(() => {
    initialize()
    return dataService.documents.value
  })
  
  const comments = computed<Comment[]>(() => {
    initialize()
    return dataService.comments.value
  })
  
  // Persona-specific computed values
  const currentUserInTray = computed<Task[]>(() => {
    if (!activePersona.value) return []
    return dataService.getInTrayForUser(activePersona.value.id)
  })
  
  const currentUserOutTray = computed<Task[]>(() => {
    if (!activePersona.value) return []
    return dataService.getOutTrayForUser(activePersona.value.id)
  })
  
  const currentUserTasks = computed<Task[]>(() => {
    if (!activePersona.value) return []
    return dataService.getTasksForUser(activePersona.value.id)
  })
  
  const currentUserStats = computed(() => {
    if (!activePersona.value) return null
    return dataService.getTaskStatsForUser(activePersona.value.id)
  })
  
  // Task filtering computed values
  const tasksByStatus = computed(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      draft: [],
      assigned: [],
      in_progress: [],
      pending_review: [],
      approved: [],
      rejected: [],
      completed: [],
      cancelled: []
    }
    
    tasks.value.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task)
      }
    })
    
    return grouped
  })
  
  const urgentTasks = computed<Task[]>(() => {
    return tasks.value.filter(task => task.priority === 'urgent')
  })
  
  const overdueTasks = computed<Task[]>(() => {
    const now = new Date()
    return tasks.value.filter(task => {
      if (!task.dueDate) return false
      return new Date(task.dueDate) < now && !['completed', 'approved', 'cancelled'].includes(task.status)
    })
  })
  
  // Actions
  const setActivePersona = (userId: string) => {
    initialize()
    dataService.setActivePersona(userId)
  }
  
  const getTask = (taskId: string): Task | undefined => {
    initialize()
    return dataService.getTask(taskId)
  }
  
  const getUser = (userId: string): User | undefined => {
    initialize()
    return dataService.getUser(userId)
  }
  
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    initialize()
    dataService.updateTaskStatus(taskId, status)
  }
  
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    initialize()
    return dataService.addTask(task)
  }
  
  const getCommentsForTask = (taskId: string): Comment[] => {
    initialize()
    return dataService.getCommentsForTask(taskId)
  }
  
  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
    initialize()
    return dataService.addComment(comment)
  }
  
  const updateComment = (commentId: string, content: string) => {
    initialize()
    dataService.updateComment(commentId, content)
  }
  
  const getDocumentsForTask = (taskId: string): Document[] => {
    initialize()
    return dataService.getDocumentsForTask(taskId)
  }
  
  const addDocumentToTask = (taskId: string, document: Omit<Document, 'id' | 'uploadedAt' | 'version' | 'versions'>) => {
    initialize()
    return dataService.addDocumentToTask(taskId, document)
  }
  
  const resetToDefaults = () => {
    initialize()
    dataService.resetToDefaults()
  }
  
  const clearAllData = () => {
    initialize()
    dataService.clearAllData()
    initialized = false
  }
  
  // Helper functions for task filtering
  const getTasksForUser = (userId: string): Task[] => {
    initialize()
    return dataService.getTasksForUser(userId)
  }
  
  const getInTrayForUser = (userId: string): Task[] => {
    initialize()
    return dataService.getInTrayForUser(userId)
  }
  
  const getOutTrayForUser = (userId: string): Task[] => {
    initialize()
    return dataService.getOutTrayForUser(userId)
  }
  
  // Advanced filtering functions
  const filterTasks = (options: {
    status?: TaskStatus[]
    priority?: string[]
    assigneeId?: string
    createdBy?: string
    search?: string
  }) => {
    initialize()
    
    let filtered = [...tasks.value]
    
    if (options.status?.length) {
      filtered = filtered.filter(task => options.status!.includes(task.status))
    }
    
    if (options.priority?.length) {
      filtered = filtered.filter(task => options.priority!.includes(task.priority))
    }
    
    if (options.assigneeId) {
      filtered = filtered.filter(task => task.assigneeId === options.assigneeId)
    }
    
    if (options.createdBy) {
      filtered = filtered.filter(task => task.createdBy === options.createdBy)
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      )
    }
    
    return filtered
  }
  
  return {
    // State
    activePersona,
    users,
    tasks,
    documents,
    comments,
    
    // Current user specific
    currentUserInTray,
    currentUserOutTray,
    currentUserTasks,
    currentUserStats,
    
    // Filtered data
    tasksByStatus,
    urgentTasks,
    overdueTasks,
    
    // Actions
    initialize,
    setActivePersona,
    getTask,
    getUser,
    updateTaskStatus,
    addTask,
    getCommentsForTask,
    addComment,
    updateComment,
    getDocumentsForTask,
    addDocumentToTask,
    resetToDefaults,
    clearAllData,
    
    // Helper functions
    getTasksForUser,
    getInTrayForUser,
    getOutTrayForUser,
    filterTasks
  }
})