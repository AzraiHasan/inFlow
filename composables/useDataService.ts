import { ref, computed } from 'vue'
import { useDemoData } from './useDemoData'
import type { User, Task, Document, Comment, TaskStatus } from '../app/types'

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'inflow-demo-users',
  TASKS: 'inflow-demo-tasks', 
  DOCUMENTS: 'inflow-demo-documents',
  COMMENTS: 'inflow-demo-comments',
  ACTIVE_PERSONA: 'inflow-active-persona',
  INITIALIZED: 'inflow-demo-initialized'
} as const

// Global reactive state
const activePersonaId = ref<string | null>(null)
const users = ref<User[]>([])
const tasks = ref<Task[]>([])
const documents = ref<Document[]>([])
const comments = ref<Comment[]>([])

export const useDataService = () => {
  const { users: demoUsers, tasks: demoTasks, documents: demoDocuments, comments: demoComments } = useDemoData()
  
  // Initialize demo data from localStorage or defaults
  const initializeDemoData = () => {
    try {
      if (!import.meta.client) return
      
      const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
      
      if (isInitialized) {
        // Load from localStorage
        const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS)
        const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS)
        const storedDocuments = localStorage.getItem(STORAGE_KEYS.DOCUMENTS)
        const storedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS)
        const storedPersona = localStorage.getItem(STORAGE_KEYS.ACTIVE_PERSONA)
        
        users.value = storedUsers ? JSON.parse(storedUsers) : demoUsers
        tasks.value = storedTasks ? JSON.parse(storedTasks) : demoTasks
        documents.value = storedDocuments ? JSON.parse(storedDocuments) : demoDocuments
        comments.value = storedComments ? JSON.parse(storedComments) : demoComments
        activePersonaId.value = storedPersona || demoUsers[0]?.id || null
      } else {
        // First time initialization - use demo data
        resetToDefaults()
      }
    } catch (error) {
      console.error('Error initializing demo data:', error)
      resetToDefaults()
    }
  }
  
  // Reset to default demo data
  const resetToDefaults = () => {
    users.value = [...demoUsers]
    tasks.value = [...demoTasks]
    documents.value = [...demoDocuments]
    comments.value = [...demoComments]
    activePersonaId.value = demoUsers[0]?.id || null
    saveToLocalStorage()
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  }
  
  // Save all data to localStorage
  const saveToLocalStorage = () => {
    try {
      if (!import.meta.client) return
      
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users.value))
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks.value))
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents.value))
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments.value))
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PERSONA, activePersonaId.value || '')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }
  
  // Persona Management
  const setActivePersona = (userId: string) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      activePersonaId.value = userId
      saveToLocalStorage()
    }
  }
  
  const activePersona = computed(() => {
    return users.value.find(u => u.id === activePersonaId.value) || null
  })
  
  // User Methods
  const getUsers = () => users.value
  
  const getUser = (id: string): User | undefined => {
    return users.value.find(user => user.id === id)
  }
  
  // Task Methods
  const getTasks = () => tasks.value
  
  const getTasksForUser = (userId: string): Task[] => {
    return tasks.value.filter(task => task.assigneeId === userId || task.createdBy === userId)
  }
  
  const getInTrayForUser = (userId: string): Task[] => {
    return tasks.value.filter(task => task.assigneeId === userId)
  }
  
  const getOutTrayForUser = (userId: string): Task[] => {
    return tasks.value.filter(task => task.createdBy === userId)
  }
  
  const getTask = (taskId: string): Task | undefined => {
    return tasks.value.find(task => task.id === taskId)
  }
  
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = {
        ...tasks.value[taskIndex],
        status,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }
  
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.value.push(newTask)
    saveToLocalStorage()
    return newTask
  }
  
  const deleteTask = (taskId: string) => {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
      
      // Also remove associated documents and comments
      documents.value = documents.value.filter(doc => !doc.description?.includes(taskId))
      comments.value = comments.value.filter(comment => comment.taskId !== taskId)
      
      saveToLocalStorage()
      return true
    }
    return false
  }
  
  // Document Methods
  const getDocuments = () => documents.value
  
  const getDocument = (documentId: string): Document | undefined => {
    return documents.value.find(doc => doc.id === documentId)
  }
  
  const getDocumentsForTask = (taskId: string): Document[] => {
    const task = getTask(taskId)
    return task?.documents || []
  }
  
  const addDocument = (taskIdHint: string, document: Omit<Document, 'id' | 'uploadedAt' | 'version' | 'versions'>) => {
    const docId = `doc-${Date.now()}`
    const newDocument: Document = {
      ...document,
      id: docId,
      uploadedAt: new Date().toISOString(),
      version: 1,
      versions: [{
        id: `version-${docId}-v1`,
        version: 1,
        uploadedBy: document.uploadedBy,
        uploadedAt: new Date().toISOString(),
        url: document.url,
        changes: 'Initial version'
      }]
    }
    
    // Add document to global documents array
    documents.value.push(newDocument)
    saveToLocalStorage()
    return newDocument
  }

  const addDocumentToTask = (taskId: string, document: Omit<Document, 'id' | 'uploadedAt' | 'version' | 'versions'>) => {
    const docId = `doc-${Date.now()}`
    const newDocument: Document = {
      ...document,
      id: docId,
      uploadedAt: new Date().toISOString(),
      version: 1,
      versions: [{
        id: `version-${docId}-v1`,
        version: 1,
        uploadedBy: document.uploadedBy,
        uploadedAt: new Date().toISOString(),
        url: document.url,
        changes: 'Initial version'
      }]
    }
    
    // Add document to global documents array
    documents.value.push(newDocument)
    
    // Add document to task
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      tasks.value[taskIndex].documents.push(newDocument)
      tasks.value[taskIndex].updatedAt = new Date().toISOString()
    }
    
    saveToLocalStorage()
    return newDocument
  }

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
  
  // Comment Methods
  const getComments = () => comments.value
  
  const getCommentsForTask = (taskId: string): Comment[] => {
    return comments.value.filter(comment => comment.taskId === taskId)
  }
  
  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>): Comment => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    comments.value.push(newComment)
    
    // Add comment to task
    const taskIndex = tasks.value.findIndex(task => task.id === comment.taskId)
    if (taskIndex !== -1) {
      tasks.value[taskIndex].comments.push(newComment)
      tasks.value[taskIndex].updatedAt = new Date().toISOString()
    }
    
    saveToLocalStorage()
    return newComment
  }
  
  const updateComment = (commentId: string, content: string) => {
    const commentIndex = comments.value.findIndex(comment => comment.id === commentId)
    if (commentIndex !== -1) {
      comments.value[commentIndex] = {
        ...comments.value[commentIndex],
        content,
        updatedAt: new Date().toISOString()
      }
      
      // Update comment in task
      const taskId = comments.value[commentIndex].taskId
      const taskIndex = tasks.value.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        const taskCommentIndex = tasks.value[taskIndex].comments.findIndex(c => c.id === commentId)
        if (taskCommentIndex !== -1) {
          tasks.value[taskIndex].comments[taskCommentIndex] = comments.value[commentIndex]
          tasks.value[taskIndex].updatedAt = new Date().toISOString()
        }
      }
      
      saveToLocalStorage()
    }
  }
  
  // Statistics and Analytics
  const getTaskStatsForUser = (userId: string) => {
    const userTasks = getTasksForUser(userId)
    const inTrayTasks = getInTrayForUser(userId)
    const outTrayTasks = getOutTrayForUser(userId)
    
    return {
      total: userTasks.length,
      inTray: inTrayTasks.length,
      outTray: outTrayTasks.length,
      completed: userTasks.filter(t => t.status === 'completed').length,
      inProgress: userTasks.filter(t => t.status === 'in_progress').length,
      pendingReview: userTasks.filter(t => t.status === 'pending_review').length,
      approved: userTasks.filter(t => t.status === 'approved').length
    }
  }
  
  // Clear all data and reset
  const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    
    users.value = []
    tasks.value = []
    documents.value = []
    comments.value = []
    activePersonaId.value = null
  }
  
  return {
    // Initialization
    initializeDemoData,
    resetToDefaults,
    clearAllData,
    
    // Persona management
    activePersona: readonly(activePersona),
    activePersonaId: readonly(activePersonaId),
    setActivePersona,
    
    // Data access
    users: readonly(users),
    tasks: readonly(tasks),
    documents: readonly(documents),
    comments: readonly(comments),
    
    // User methods
    getUsers,
    getUser,
    
    // Task methods
    getTasks,
    getTasksForUser,
    getInTrayForUser,
    getOutTrayForUser,
    getTask,
    updateTaskStatus,
    addTask,
    deleteTask,
    
    // Document methods
    getDocuments,
    getDocument,
    getDocumentsForTask,
    addDocument,
    addDocumentToTask,
    deleteDocumentsByTaskId,
    
    // Comment methods
    getComments,
    getCommentsForTask,
    addComment,
    updateComment,
    
    // Analytics
    getTaskStatsForUser
  }
}