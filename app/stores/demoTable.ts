import { defineStore } from 'pinia'

export interface TaskData {
  id: string
  task: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track'
  priority: 'High' | 'Medium' | 'Low'
  assignee: string | null
}

export const useDemoTableStore = defineStore('demoTable', () => {
  const unassignedTasks = ref<TaskData[]>([])
  const assignedTasks = ref<TaskData[]>([])
  
  const STORAGE_KEYS = {
    unassignedTasks: 'towerco-demo-unassigned-tasks',
    assignedTasks: 'towerco-demo-assigned-tasks'
  }

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEYS.unassignedTasks, JSON.stringify(unassignedTasks.value))
        localStorage.setItem(STORAGE_KEYS.assignedTasks, JSON.stringify(assignedTasks.value))
      } catch (error) {
        console.error('Error saving demo table data to localStorage:', error)
      }
    }
  }

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      try {
        const savedUnassigned = localStorage.getItem(STORAGE_KEYS.unassignedTasks)
        const savedAssigned = localStorage.getItem(STORAGE_KEYS.assignedTasks)
        
        if (savedUnassigned) {
          unassignedTasks.value = JSON.parse(savedUnassigned)
        } else {
          initializeDefaultTasks()
        }
        
        if (savedAssigned) {
          assignedTasks.value = JSON.parse(savedAssigned)
        }
      } catch (error) {
        console.error('Error loading demo table data from localStorage:', error)
        initializeDefaultTasks()
      }
    } else {
      initializeDefaultTasks()
    }
  }

  const initializeDefaultTasks = () => {
    unassignedTasks.value = [
      {
        id: '1',
        task: 'Site Survey Complete',
        status: 'Completed',
        priority: 'High',
        assignee: null
      },
      {
        id: '2',
        task: 'Equipment Installation',
        status: 'In Progress',
        priority: 'High',
        assignee: null
      },
      {
        id: '3',
        task: 'Compliance Review',
        status: 'Pending',
        priority: 'Medium',
        assignee: null
      },
      {
        id: '4',
        task: 'Network Testing',
        status: 'Scheduled',
        priority: 'High',
        assignee: null
      },
      {
        id: '5',
        task: 'Project Milestone',
        status: 'On Track',
        priority: 'Low',
        assignee: null
      }
    ]
    saveToLocalStorage()
  }

  const addTask = (taskData: Omit<TaskData, 'id' | 'assignee'>) => {
    const newTask: TaskData = {
      ...taskData,
      id: (Date.now()).toString(),
      assignee: null
    }
    unassignedTasks.value.push(newTask)
    saveToLocalStorage()
    return newTask
  }

  const assignTask = (taskId: string, assigneeName: string) => {
    const taskIndex = unassignedTasks.value.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
      const task = { ...unassignedTasks.value[taskIndex] }
      task.assignee = assigneeName
      
      // Remove from unassigned tasks
      unassignedTasks.value.splice(taskIndex, 1)
      
      // Add to assigned tasks
      assignedTasks.value.push(task)
      
      saveToLocalStorage()
      return task
    }
    
    return null
  }

  const unassignTask = (taskId: string) => {
    const taskIndex = assignedTasks.value.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
      const task = { ...assignedTasks.value[taskIndex] }
      task.assignee = null
      
      // Remove from assigned tasks
      assignedTasks.value.splice(taskIndex, 1)
      
      // Add back to unassigned tasks
      unassignedTasks.value.push(task)
      
      saveToLocalStorage()
      return task
    }
    
    return null
  }

  const updateTaskStatus = (taskId: string, status: TaskData['status'], isAssigned: boolean = false) => {
    const targetArray = isAssigned ? assignedTasks.value : unassignedTasks.value
    const taskIndex = targetArray.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
      targetArray[taskIndex].status = status
      saveToLocalStorage()
      return targetArray[taskIndex]
    }
    
    return null
  }

  const updateTask = (taskId: string, updatedTask: Partial<TaskData>) => {
    // Check unassigned tasks first
    let taskIndex = unassignedTasks.value.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
      unassignedTasks.value[taskIndex] = { ...unassignedTasks.value[taskIndex], ...updatedTask }
      saveToLocalStorage()
      return unassignedTasks.value[taskIndex]
    }
    
    // Check assigned tasks if not found in unassigned
    taskIndex = assignedTasks.value.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
      assignedTasks.value[taskIndex] = { ...assignedTasks.value[taskIndex], ...updatedTask }
      saveToLocalStorage()
      return assignedTasks.value[taskIndex]
    }
    
    return null
  }

  const deleteTask = (taskId: string) => {
    // Check unassigned tasks first
    let taskIndex = unassignedTasks.value.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
      unassignedTasks.value.splice(taskIndex, 1)
      saveToLocalStorage()
      return true
    }
    
    // Check assigned tasks if not found in unassigned
    taskIndex = assignedTasks.value.findIndex(task => task.id === taskId)
    
    if (taskIndex !== -1) {
      assignedTasks.value.splice(taskIndex, 1)
      saveToLocalStorage()
      return true
    }
    
    return false
  }

  const resetData = () => {
    assignedTasks.value = []
    initializeDefaultTasks()
  }

  // Auto-save watchers
  watch([unassignedTasks, assignedTasks], () => {
    saveToLocalStorage()
  }, { deep: true })

  return {
    // State - Direct access for UTable compatibility
    unassignedTasks: unassignedTasks,
    assignedTasks: assignedTasks,
    
    // Actions
    loadFromLocalStorage,
    initializeDefaultTasks,
    addTask,
    assignTask,
    unassignTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    resetData,
    saveToLocalStorage
  }
})