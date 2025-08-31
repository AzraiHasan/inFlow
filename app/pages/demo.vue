<!--this page is to simulate the UI for different personas via simple buttons-->

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">TowerCo Workflow Demo</h1>
        <p class="text-gray-600">Experience the platform from different persona perspectives</p>
      </div>
      
      <div class="grid grid-cols-3 gap-6">
        <!-- First Column - Task Form -->
        <div class="col-span-1">
          <TaskForm 
            show-reset-button
            @submit="handleTaskSubmit"
            @reset="resetAllData"
          />
        </div>
        
        <!-- Second Column - Task Table (2/3 width) -->
        <div class="col-span-2">
          <div class="mb-2 text-xs text-gray-600">
            DEBUG: Tasks={{ demoTableStore.unassignedTasks.length }}, Docs={{ dataService.documents.value.length }}
          </div>
          <TaskTable 
            :tasks="demoTableStore.unassignedTasks"
            @assign="openAssignModal"
            @edit="openEditModal"
            @preview="openPreview"
          />
        </div>
      </div>
      
      <!-- Assigned Tasks Section -->
      <div class="mt-8">
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Assigned Tasks</h3>
          <p class="text-gray-600">Tasks that have been assigned to team members</p>
        </div>
        <TaskTable 
          :tasks="demoTableStore.assignedTasks"
          :show-assignee-column="false"
          @edit="openEditModal"
          @preview="openPreview"
        />
      </div>
    </div>

    <!-- Modal Components -->
    <AssignTaskModal 
      v-model:open="isAssignModalOpen"
      :task="selectedTaskForAssignment"
      @assign="assignTask"
    />
    
    <EditTaskModal 
      v-model:open="isEditModalOpen"
      :task="selectedTaskForEdit"
      @save="saveTaskEdit"
      @delete="showDeleteConfirmation = true"
    />
    
    <DeleteConfirmationModal 
      v-model:open="showDeleteConfirmation"
      @confirm="confirmDeleteTask"
    />
    
    <FilePreviewModal 
      v-model:open="showPreview"
      :document="selectedDocument"
    />
  </div>
</template>

<script setup lang="ts">
import type { TaskData } from '~/stores/demoTable'
import { DocumentCategory, type Document } from '~/types'

const demoTableStore = useDemoTableStore()
const dataService = useDataService()

// Initialize data service  
onMounted(() => {
  dataService.initializeData()
  console.log('FILE UPLOAD DEBUG: === INITIALIZATION DEBUG ===')
  console.log('FILE UPLOAD DEBUG: Data service initialized')
  console.log('FILE UPLOAD DEBUG: Current documents on mount:', dataService.documents.value.length)
  console.log('FILE UPLOAD DEBUG: Document details:', dataService.documents.value.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description
  })))
  console.log('FILE UPLOAD DEBUG: Current persona:', dataService.currentPersona.value)
  console.log('FILE UPLOAD DEBUG: === END INITIALIZATION DEBUG ===')
})

// Utility function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}


const isAssignModalOpen = ref(false)
const selectedTaskForAssignment = ref<TaskData | null>(null)
const isEditModalOpen = ref(false)
const selectedTaskForEdit = ref<TaskData | null>(null)
const showDeleteConfirmation = ref(false)
const showPreview = ref(false)
const selectedDocument = ref<Document | null>(null)





// Initialize store data on mount
onMounted(() => {
  demoTableStore.loadFromLocalStorage()
  console.log('FILE UPLOAD DEBUG: === DEMO TABLE STORE DEBUG ===')
  console.log('FILE UPLOAD DEBUG: All tasks loaded:', demoTableStore.unassignedTasks.map(t => ({
    id: t.id,
    task: t.task,
    status: t.status
  })))
  console.log('FILE UPLOAD DEBUG: Task ID to description mapping:')
  demoTableStore.unassignedTasks.forEach((task, index) => {
    console.log(`FILE UPLOAD DEBUG: Row ${index}: ID="${task.id}" -> "${task.task}"`)
  })
  console.log('FILE UPLOAD DEBUG: === END DEMO TABLE STORE DEBUG ===')
})



const handleTaskSubmit = async (formData: { category: string | undefined; description: string; attachment: File | null; note: string }) => {
  console.log('=== FILE UPLOAD DEBUG: Task form submitted ===')
  console.log('FILE UPLOAD DEBUG: Form data:', {
    category: formData.category,
    description: formData.description,
    hasAttachment: !!formData.attachment,
    attachmentName: formData.attachment?.name,
    attachmentSize: formData.attachment?.size,
    attachmentType: formData.attachment?.type,
    note: formData.note
  })

  // Create task for demo table
  const newTask = {
    task: `${formData.category}: ${formData.description}`,
    status: 'Pending' as const,
    priority: 'Medium' as const,
    note: formData.note
  }
  
  console.log('FILE UPLOAD DEBUG: Creating task:', newTask)
  const createdTask = demoTableStore.addTask(newTask)
  console.log('FILE UPLOAD DEBUG: Task added to store with ID:', createdTask.id)
  console.log('FILE UPLOAD DEBUG: Current unassigned tasks count:', demoTableStore.unassignedTasks.length)

  // Process file attachment if present
  console.log('FILE UPLOAD DEBUG: Checking for attachment, formData.attachment:', formData.attachment)
  if (formData.attachment) {
    try {
      const file = formData.attachment
      console.log('FILE UPLOAD DEBUG: Processing attachment:', {
        name: file.name,
        type: file.type,
        size: file.size,
        taskId: createdTask.id,
        expectedDocumentDescription: `Attachment for demo-task-${createdTask.id}`
      })
      
      // Convert file to base64
      const base64Data = await fileToBase64(file)
      console.log('FILE UPLOAD DEBUG: Base64 conversion complete, data length:', base64Data.length)
      console.log('FILE UPLOAD DEBUG: Base64 preview (first 100 chars):', base64Data.substring(0, 100))
      
      // Create document record
      const documentData = {
        name: file.name,
        type: file.type,
        size: file.size,
        category: DocumentCategory.OTHER,
        description: `Attachment for demo-task-${createdTask.id}`,
        uploadedBy: dataService.currentPersona.value?.id || 'demo-user',
        version: 1,
        url: base64Data, // Store base64 data URL
        versions: []
      }
      
      console.log('FILE UPLOAD DEBUG: About to add document with data:', {
        ...documentData,
        url: `${base64Data.substring(0, 50)}...[truncated]` // Don't log full base64
      })
      console.log('FILE UPLOAD DEBUG: Current persona:', dataService.currentPersona.value)
      console.log('FILE UPLOAD DEBUG: Documents before adding:', dataService.documents.value.length)
      
      // Add document to data service (this will persist to localStorage)
      const addedDoc = dataService.addDocument(`demo-task-${createdTask.id}`, documentData)
      console.log('FILE UPLOAD DEBUG: File attachment stored successfully with ID:', addedDoc.id)
      console.log('FILE UPLOAD DEBUG: Document description stored as:', addedDoc.description)
      console.log('FILE UPLOAD DEBUG: Current documents in store after adding:', dataService.documents.value.length)
      console.log('FILE UPLOAD DEBUG: All document descriptions:', dataService.documents.value.map(d => ({ id: d.id, description: d.description })))
      
    } catch (error) {
      console.error('FILE UPLOAD DEBUG ERROR: Processing file attachment failed:', error)
      console.error('FILE UPLOAD DEBUG ERROR: Stack trace:', error instanceof Error ? error.stack : String(error))
    }
  } else {
    console.log('FILE UPLOAD DEBUG: No attachment found in formData')
  }
  
  console.log('FILE UPLOAD DEBUG: Final task count:', demoTableStore.unassignedTasks.length)
  console.log('FILE UPLOAD DEBUG: Final document count:', dataService.documents.value.length)
  console.log('=== FILE UPLOAD DEBUG: Process complete ===')
}

const openAssignModal = (taskId: string) => {
  const task = [...demoTableStore.unassignedTasks, ...demoTableStore.assignedTasks].find(t => t.id === taskId)
  if (task) {
    console.log('Opening assign modal for task:', task)
    selectedTaskForAssignment.value = task
    isAssignModalOpen.value = true
    console.log('Modal opened, selectedTaskForAssignment:', selectedTaskForAssignment.value)
  }
}

const assignTask = (assigneeName: string, taskId: string) => {
  const result = demoTableStore.assignTask(taskId, assigneeName)
  if (result) {
    console.log('Task successfully assigned:', result)
  } else {
    console.error('Could not find task to assign!')
  }
  selectedTaskForAssignment.value = null
}

const openEditModal = (taskId: string) => {
  const task = [...demoTableStore.unassignedTasks, ...demoTableStore.assignedTasks].find(t => t.id === taskId)
  if (task) {
    selectedTaskForEdit.value = task
    isEditModalOpen.value = true
  }
}

const saveTaskEdit = (updatedTask: Partial<TaskData>) => {
  if (selectedTaskForEdit.value) {
    demoTableStore.updateTask(selectedTaskForEdit.value.id, updatedTask)
    selectedTaskForEdit.value = null
  }
}

const confirmDeleteTask = () => {
  if (selectedTaskForEdit.value) {
    const taskId = selectedTaskForEdit.value.id
    
    // Delete from demo table store
    const deleted = demoTableStore.deleteTask(taskId)
    
    if (deleted) {
      // Also remove associated documents from data service
      dataService.deleteDocumentsByTaskId(`demo-task-${taskId}`)
    }
    
    // Close modals and reset state
    isEditModalOpen.value = false
    selectedTaskForEdit.value = null
  }
}

const openPreview = (document: Document) => {
  selectedDocument.value = document
  showPreview.value = true
}


const resetAllData = () => {
  if (confirm('This will clear ALL data (tasks, documents, etc.) and start fresh. Continue?')) {
    console.log('FILE UPLOAD DEBUG: === RESETTING ALL DATA ===')
    
    // Clear DemoTable store data
    localStorage.removeItem('towerco-demo-unassigned-tasks')
    localStorage.removeItem('towerco-demo-assigned-tasks')
    
    // Clear Data Service data
    localStorage.removeItem('inflow-demo-users')
    localStorage.removeItem('inflow-demo-tasks')
    localStorage.removeItem('inflow-demo-documents')
    localStorage.removeItem('inflow-demo-comments')
    localStorage.removeItem('inflow-active-persona')
    localStorage.removeItem('inflow-demo-initialized')
    
    // Clear in-memory data immediately
    demoTableStore.unassignedTasks.splice(0)
    demoTableStore.assignedTasks.splice(0)
    // Clear all documents using data service method
    dataService.clearAllDocuments()
    
    console.log('FILE UPLOAD DEBUG: All data cleared')
    console.log('FILE UPLOAD DEBUG: Tasks remaining:', demoTableStore.unassignedTasks.length)
    console.log('FILE UPLOAD DEBUG: Documents remaining:', dataService.documents.value.length)
    console.log('FILE UPLOAD DEBUG: === DATA RESET COMPLETE ===')
    
    // Don't reload - just show empty state
  }
}

</script>