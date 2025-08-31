import { defineStore } from 'pinia'
import type { User, Task, Document, Comment } from '~/types'
import { TaskStatus, TaskPriority } from '~/types'

// Factory function to create persona-specific stores
export const createPersonaStore = (personaId: string, persona: User) => {
  return defineStore(`workflow-${personaId}`, () => {
    // Each persona gets their own isolated state
    const isInitialized = ref(false)
    const currentPersona = ref<User>(persona) // Fixed to this persona
    const selectedTaskId = ref<string | null>(null)
    
    // Persona-specific data - isolated from other personas
    const personaTasks = ref<Task[]>([])
    const personaDocuments = ref<Document[]>([])
    const personaComments = ref<Comment[]>([])
    
    // Local storage keys specific to this persona
    const STORAGE_KEYS = {
      tasks: `inflow-${personaId}-tasks`,
      documents: `inflow-${personaId}-documents`, 
      comments: `inflow-${personaId}-comments`,
      initialized: `inflow-${personaId}-initialized`
    }

    // Initialize persona's isolated data
    const initialize = async () => {
      if (!isInitialized.value) {
        console.log(`🏪 STORE: Initializing ${persona.name} (${personaId}) store`)
        
        // STEP 1: Clear all data stores - Start fresh
        console.log(`🧹 CLEAR: Clearing all data for ${persona.name}`)
        personaTasks.value = []
        personaDocuments.value = []
        personaComments.value = []
        
        if (import.meta.client) {
          // Clear localStorage for this persona
          Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key)
            console.log(`🧹 CLEAR: Removed localStorage key: ${key}`)
          })
        }
        
        console.log(`🧹 CLEAR: ${persona.name} data cleared - starting fresh`)
        
        // STEP 2 & 3: Initialize demo tasks based on persona
        if (personaId === 'user-1') {
          // Sarah gets 2 demo tasks
          console.log(`📋 DEMO: Creating 2 demo tasks for Sarah`)
          createDemoTask({
            title: 'Sarah Task 1: Equipment Installation',
            description: 'Install new communication equipment at Tower Site 101',
            type: 'action',
            status: 'assigned',
            priority: 'high',
            assigneeId: personaId
          })
          createDemoTask({
            title: 'Sarah Task 2: Safety Inspection', 
            description: 'Perform monthly safety inspection of tower infrastructure',
            type: 'review',
            status: 'assigned',
            priority: 'medium',
            assigneeId: personaId
          })
          console.log(`📋 DEMO: Sarah now has ${personaTasks.value.length} tasks`)
        } else if (personaId === 'user-2') {
          // Marcus gets 3 demo tasks
          console.log(`📋 DEMO: Creating 3 demo tasks for Marcus`)
          createDemoTask({
            title: 'Marcus Task 1: Site Coordination',
            description: 'Coordinate with field teams for Tower Site 102 installation',
            type: 'action',
            status: 'assigned',
            priority: 'urgent',
            assigneeId: personaId
          })
          createDemoTask({
            title: 'Marcus Task 2: Resource Planning',
            description: 'Plan resource allocation for Q4 tower installations',
            type: 'information',
            status: 'assigned', 
            priority: 'medium',
            assigneeId: personaId
          })
          createDemoTask({
            title: 'Marcus Task 3: Team Review',
            description: 'Review and approve field engineer task submissions',
            type: 'approval',
            status: 'pending_review',
            priority: 'high',
            assigneeId: personaId
          })
          console.log(`📋 DEMO: Marcus now has ${personaTasks.value.length} tasks`)
        }
        
        isInitialized.value = true
        saveToLocalStorage()
      }
    }

    // Save persona data to localStorage
    const saveToLocalStorage = () => {
      if (import.meta.client) {
        try {
          localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(personaTasks.value))
          localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(personaDocuments.value))
          localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(personaComments.value))
          localStorage.setItem(STORAGE_KEYS.initialized, 'true')
        } catch (error) {
          console.error(`🏪 STORE: ${persona.name} - Error saving to localStorage:`, error)
        }
      }
    }

    // Helper function to create demo tasks during initialization
    const createDemoTask = (taskData: any) => {
      const now = new Date().toISOString()
      const newTask: Task = {
        id: `${personaId}-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type as any,
        status: taskData.status as any,
        priority: taskData.priority as any,
        assigneeId: taskData.assigneeId,
        createdBy: personaId,
        createdAt: now,
        updatedAt: now,
        documents: [],
        comments: [],
        dueDate: undefined
      }
      
      personaTasks.value.push(newTask)
      console.log(`📋 DEMO: Created task "${newTask.title}" for ${persona.name} (ID: ${newTask.id})`)
      return newTask
    }

    // Task management - specific to this persona
    const selectTask = (taskId: string | null) => {
      selectedTaskId.value = taskId
    }

    const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log(`🏪 STORE: ${persona.name} creating task:`, taskData.title)
      
      const now = new Date().toISOString()
      const newTask: Task = {
        ...taskData,
        id: `${personaId}-task-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        documents: [],
        comments: [],
        createdBy: personaId,
        assigneeId: taskData.assigneeId || personaId // Default to self if not specified
      }
      
      personaTasks.value.push(newTask)
      saveToLocalStorage()
      return newTask
    }

    const updateTask = (taskId: string, updates: Partial<Task>) => {
      const taskIndex = personaTasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        const updatedTask = {
          ...personaTasks.value[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        personaTasks.value[taskIndex] = updatedTask
        saveToLocalStorage()
        return updatedTask
      }
      return null
    }

    const addTaskComment = (taskId: string, content: string, mentions: string[] = []) => {
      const now = new Date().toISOString()
      const newComment: Comment = {
        id: `${personaId}-comment-${Date.now()}`,
        content,
        authorId: personaId,
        mentions,
        taskId,
        createdAt: now
      }
      
      personaComments.value.push(newComment)
      
      // Update task to include comment
      const task = personaTasks.value.find(t => t.id === taskId)
      if (task) {
        task.comments.push(newComment)
        updateTask(taskId, { comments: task.comments })
      }
      
      saveToLocalStorage()
      return newComment
    }

    const addTaskDocument = (taskId: string, documentData: Omit<Document, 'id' | 'uploadedAt'>) => {
      const now = new Date().toISOString()
      const newDocument: Document = {
        ...documentData,
        id: `${personaId}-doc-${Date.now()}`,
        uploadedAt: now,
        uploadedBy: personaId
      }
      
      personaDocuments.value.push(newDocument)
      
      // Update task to include document
      const task = personaTasks.value.find(t => t.id === taskId)
      if (task) {
        task.documents.push(newDocument)
        updateTask(taskId, { documents: task.documents })
      }
      
      saveToLocalStorage()
      return newDocument
    }

    // Clear all persona data
    const resetPersonaData = () => {
      console.log(`🏪 STORE: Resetting all data for ${persona.name}`)
      personaTasks.value = []
      personaDocuments.value = []
      personaComments.value = []
      selectedTaskId.value = null
      
      // Clear localStorage
      if (import.meta.client) {
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key)
        })
      }
      
      saveToLocalStorage()
    }

    // Computed properties
    const myTasks = computed(() => 
      personaTasks.value.filter(task => task.assigneeId === personaId)
    )

    const createdTasks = computed(() =>
      personaTasks.value.filter(task => task.createdBy === personaId)
    )

    const activeTasks = computed(() =>
      myTasks.value.filter(task => 
        task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.CANCELLED
      )
    )

    const selectedTask = computed(() => {
      if (!selectedTaskId.value) return null
      return personaTasks.value.find(task => task.id === selectedTaskId.value) || null
    })

    const tasksByStatus = computed(() => {
      const tasks = personaTasks.value
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
      const tasks = personaTasks.value
      return {
        urgent: tasks.filter(t => t.priority === TaskPriority.URGENT),
        high: tasks.filter(t => t.priority === TaskPriority.HIGH),
        medium: tasks.filter(t => t.priority === TaskPriority.MEDIUM),
        low: tasks.filter(t => t.priority === TaskPriority.LOW)
      }
    })

    // Analytics specific to this persona
    const analytics = computed(() => {
      const totalTasks = personaTasks.value.length
      const completedTasks = personaTasks.value.filter(task => task.status === TaskStatus.COMPLETED).length
      const pendingTasks = personaTasks.value.filter(task => 
        task.status === TaskStatus.ASSIGNED || task.status === TaskStatus.IN_PROGRESS
      ).length
      
      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    })

    // Auto-save watchers
    watch([personaTasks, personaDocuments, personaComments], () => {
      saveToLocalStorage()
    }, { deep: true })

    return {
      // State
      isInitialized: readonly(isInitialized),
      currentPersona: readonly(currentPersona),
      selectedTaskId: readonly(selectedTaskId),
      
      // Data
      personaTasks: readonly(personaTasks),
      personaDocuments: readonly(personaDocuments),
      personaComments: readonly(personaComments),
      
      // Computed
      myTasks,
      createdTasks,
      activeTasks,
      selectedTask,
      tasksByStatus,
      tasksByPriority,
      analytics,
      
      // Actions
      initialize,
      resetPersonaData,
      selectTask,
      createTask,
      updateTask,
      addTaskComment,
      addTaskDocument,
      saveToLocalStorage
    }
  })
}

// Pre-defined persona stores
export const useSarahStore = () => {
  const sarahPersona: User = {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@towerco.com',
    department: 'FIELD_OPERATIONS' as any,
    role: 'FIELD_ENGINEER' as any,
    avatar: '👩‍🔧'
  }
  
  return createPersonaStore('user-1', sarahPersona)()
}

export const useMarcusStore = () => {
  const marcusPersona: User = {
    id: 'user-2', 
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@towerco.com',
    department: 'SITE_MANAGEMENT' as any,
    role: 'SITE_MANAGER' as any,
    avatar: '👨‍💼'
  }
  
  return createPersonaStore('user-2', marcusPersona)()
}