import type { User, Task, Document, Comment} from '~/types';
import { UserRole as _UserRole } from '~/types'

export const useDataService = () => {
  const { users: demoUsers, tasks: demoTasks, documents: demoDocuments, comments: demoComments } = useDemoData()
  
  // Reactive data stores
  const users = ref<User[]>([])
  const tasks = ref<Task[]>([])
  const documents = ref<Document[]>([])
  const comments = ref<Comment[]>([])
  const currentPersona = ref<User | null>(null)
  
  // Local storage keys
  const STORAGE_KEYS = {
    users: 'towerco-users',
    tasks: 'towerco-tasks', 
    documents: 'towerco-documents',
    comments: 'towerco-comments',
    currentPersona: 'towerco-current-persona'
  }

  // Initialize data from localStorage or use demo data
  const initializeData = () => {
    if (import.meta.client) {
      try {
        // Load from localStorage or use demo data as fallback
        users.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || 'null') || demoUsers
        tasks.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) || 'null') || demoTasks
        documents.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.documents) || 'null') || demoDocuments
        comments.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.comments) || 'null') || demoComments
        
        const savedPersona = JSON.parse(localStorage.getItem(STORAGE_KEYS.currentPersona) || 'null')
        currentPersona.value = savedPersona || users.value[0] || null // Default to first user
      } catch (error) {
        console.warn('Error loading from localStorage, using demo data:', error)
        resetToDemo()
      }
    } else {
      // SSR fallback
      users.value = demoUsers
      tasks.value = demoTasks
      documents.value = demoDocuments
      comments.value = demoComments
      currentPersona.value = users.value[0] || null
    }
  }

  // Save data to localStorage
  const saveToLocalStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users.value))
        localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks.value))
        localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(documents.value))
        localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments.value))
        localStorage.setItem(STORAGE_KEYS.currentPersona, JSON.stringify(currentPersona.value))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  // Reset data to demo state
  const resetToDemo = () => {
    users.value = [...demoUsers]
    tasks.value = [...demoTasks]
    documents.value = [...demoDocuments]
    comments.value = [...demoComments]
    currentPersona.value = users.value[0] || null
    saveToLocalStorage()
  }

  // Set active persona
  const setPersona = (persona: User) => {
    currentPersona.value = persona
    saveToLocalStorage()
  }

  // Get tasks filtered by persona
  const getPersonaTasks = (persona: User) => {
    return {
      inTray: tasks.value.filter(task => task.assigneeId === persona.id),
      outTray: tasks.value.filter(task => task.createdBy === persona.id)
    }
  }

  // Get user by ID
  const getUserById = (userId: string): User | undefined => {
    return users.value.find(user => user.id === userId)
  }

  // Get task by ID
  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.value.find(task => task.id === taskId)
  }

  // Add new task
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      documents: [],
      comments: []
    }
    tasks.value.push(newTask)
    saveToLocalStorage()
    return newTask
  }

  // Update task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      const updatedTask = {
        ...tasks.value[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      tasks.value[taskIndex] = updatedTask
      saveToLocalStorage()
      return updatedTask
    }
    return null
  }

  // Add comment to task
  const addComment = (taskId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString()
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: now,
      taskId
    }
    
    comments.value.push(newComment)
    
    // Update task to include comment
    const task = getTaskById(taskId)
    if (task) {
      task.comments.push(newComment)
      updateTask(taskId, { comments: task.comments })
    }
    
    saveToLocalStorage()
    return newComment
  }

  // Add document to task
  const addDocument = (taskId: string, documentData: Omit<Document, 'id' | 'uploadedAt'>) => {
    const now = new Date().toISOString()
    const newDocument: Document = {
      ...documentData,
      id: `doc-${Date.now()}`,
      uploadedAt: now
    }
    
    documents.value.push(newDocument)
    
    // Update task to include document
    const task = getTaskById(taskId)
    if (task) {
      task.documents.push(newDocument)
      updateTask(taskId, { documents: task.documents })
    }
    
    saveToLocalStorage()
    return newDocument
  }

  // Delete documents by task ID hint
  const deleteDocumentsByTaskId = (taskIdHint: string) => {
    const initialLength = documents.value.length
    documents.value = documents.value.filter(doc => 
      !doc.description?.includes(taskIdHint)
    )
    
    if (documents.value.length !== initialLength) {
      saveToLocalStorage()
      return true
    }
    return false
  }

  // Get statistics for analytics
  const getAnalytics = () => {
    const totalTasks = tasks.value.length
    const completedTasks = tasks.value.filter(task => task.status === 'completed').length
    const pendingTasks = tasks.value.filter(task => task.status === 'assigned' || task.status === 'in_progress').length
    const overdueTasksCount = tasks.value.filter(task => {
      if (!task.dueDate) return false
      return new Date(task.dueDate) < new Date() && task.status !== 'completed'
    }).length

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasksCount,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  }

  // Computed properties
  const allPersonas = computed(() => users.value)
  const currentPersonaTasks = computed(() => 
    currentPersona.value ? getPersonaTasks(currentPersona.value) : { inTray: [], outTray: [] }
  )

  // Watchers to auto-save on data changes
  watch([users, tasks, documents, comments, currentPersona], () => {
    saveToLocalStorage()
  }, { deep: true })

  return {
    // State
    users: readonly(users),
    tasks: readonly(tasks),
    documents: readonly(documents),
    comments: readonly(comments),
    currentPersona: readonly(currentPersona),
    
    // Computed
    allPersonas,
    currentPersonaTasks,
    
    // Methods
    initializeData,
    resetToDemo,
    setPersona,
    getPersonaTasks,
    getUserById,
    getTaskById,
    createTask,
    updateTask,
    addComment,
    addDocument,
    deleteDocumentsByTaskId,
    getAnalytics,
    saveToLocalStorage
  }
}