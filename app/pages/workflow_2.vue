<!--this is workflow 2 page with independent state management and data persistence-->

<template>
  <NuxtLayout name="default">
    <div class="p-6">
    <div class="max-w-full">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">TowerCo Workflow 2</h1>
        <p class="text-gray-600">Infrastructure and security management workflow with independent state</p>
      </div>
      
      <div class="grid grid-cols-3 gap-6 mb-8">
        <!-- First Column - Task Form -->
        <div class="col-span-1">
          <TaskForm 
            show-reset-button
            @submit="handleTaskSubmit"
            @reset="resetAllData"
          />
        </div>
        
        <!-- Second Column - Unassigned Tasks Table (2/3 width) -->
        <div class="col-span-2">
          <div class="mb-2 text-xs text-gray-600">
            DEBUG: Unassigned={{ workflow2TableStore.unassignedTasks.length }}, Assigned={{ workflow2TableStore.assignedTasks.length }}, Docs={{ dataService.documents.value.length }}
          </div>
          
          <!-- Unassigned Tasks Table -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Unassigned Tasks</h2>
            <TaskTable 
              :tasks="workflow2TableStore.unassignedTasks"
              @assign="openAssignModal"
              @edit="openEditModal"
              @preview="openPreview"
            />
          </div>
        </div>
      </div>
      
      <!-- Full-width Assigned Tasks Section -->
      <div class="mt-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Assigned Tasks</h2>
        <TaskTable 
          :tasks="workflow2TableStore.assignedTasks"
          :show-actions-column="false"
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { TaskData } from '~/types'
import { DocumentCategory, type Document } from '~/types'

const workflow2TableStore = useWorkflow2TableStore()
const demoTableStore = useDemoTableStore()
const dataService = useWorkflow2DataService()

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
  workflow2TableStore.loadFromLocalStorage()
  demoTableStore.loadFromLocalStorage() // Load both stores for cross-workflow functionality
  console.log('FILE UPLOAD DEBUG: === WORKFLOW2 TABLE STORE DEBUG ===')
  console.log('FILE UPLOAD DEBUG: All tasks loaded:', workflow2TableStore.unassignedTasks.map(t => ({
    id: t.id,
    task: t.task,
    status: t.status
  })))
  console.log('FILE UPLOAD DEBUG: Task ID to description mapping:')
  workflow2TableStore.unassignedTasks.forEach((task, index) => {
    console.log(`FILE UPLOAD DEBUG: Row ${index}: ID="${task.id}" -> "${task.task}"`)
  })
  console.log('FILE UPLOAD DEBUG: === END WORKFLOW2 TABLE STORE DEBUG ===')
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
    originalOwner: 'Farahin' as const,
    note: formData.note
  }
  
  console.log('FILE UPLOAD DEBUG: Creating task:', newTask)
  const createdTask = workflow2TableStore.addTask(newTask)
  console.log('FILE UPLOAD DEBUG: Task added to store with ID:', createdTask.id)
  console.log('FILE UPLOAD DEBUG: Current unassigned tasks count:', workflow2TableStore.unassignedTasks.length)

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
        expectedDocumentDescription: `Attachment for ${createdTask.id}`
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
        description: `Attachment for ${createdTask.id}`,
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
      const addedDoc = dataService.addDocument(createdTask.id, documentData)
      console.log('FILE UPLOAD DEBUG: File attachment stored successfully with ID:', addedDoc.id)
      console.log('FILE UPLOAD DEBUG: Document description stored as:', addedDoc.description)
      console.log('FILE UPLOAD DEBUG: Current documents in store after adding:', dataService.documents.value.length)
      console.log('FILE UPLOAD DEBUG: All document descriptions:', dataService.documents.value.map(d => ({ id: d.id, description: d.description })))
      
      // Documents should now appear reactively without page reload
      console.log('FILE UPLOAD DEBUG: Document upload complete - should trigger reactivity')
      
    } catch (error) {
      console.error('FILE UPLOAD DEBUG ERROR: Processing file attachment failed:', error)
      console.error('FILE UPLOAD DEBUG ERROR: Stack trace:', error instanceof Error ? error.stack : String(error))
    }
  } else {
    console.log('FILE UPLOAD DEBUG: No attachment found in formData')
  }
  
  console.log('FILE UPLOAD DEBUG: Final task count:', workflow2TableStore.unassignedTasks.length)
  console.log('FILE UPLOAD DEBUG: Final document count:', dataService.documents.value.length)
  console.log('=== FILE UPLOAD DEBUG: Process complete ===')
}

const openAssignModal = (taskId: string) => {
  const task = [...workflow2TableStore.unassignedTasks, ...workflow2TableStore.assignedTasks].find(t => t.id === taskId)
  if (task) {
    console.log('Opening assign modal for task:', task)
    selectedTaskForAssignment.value = task
    isAssignModalOpen.value = true
    console.log('Modal opened, selectedTaskForAssignment:', selectedTaskForAssignment.value)
  }
}

const assignTask = (assigneeName: string, taskId: string) => {
  if (assigneeName === 'Ariffin') {
    const taskIndex = workflow2TableStore.unassignedTasks.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      const task = { ...workflow2TableStore.unassignedTasks[taskIndex] }
      
      if (task.originalOwner === 'Ariffin') {
        // Return to owner: Move task to Farahin's Assigned (she delegated it back) and Ariffin's Unassigned
        task.assignee = assigneeName
        workflow2TableStore.unassignedTasks.splice(taskIndex, 1)
        workflow2TableStore.assignedTasks.push(task)
        
        // Clean up original delegation from Ariffin's assigned tasks if it exists
        const ariffinAssignedIndex = demoTableStore.assignedTasks.findIndex(t => t.id === taskId)
        if (ariffinAssignedIndex !== -1) {
          demoTableStore.assignedTasks.splice(ariffinAssignedIndex, 1)
        }
        
        workflow2TableStore.saveToLocalStorage()
        demoTableStore.saveToLocalStorage()
        
        // Add back to Ariffin's unassigned (original owner gets it back)
        const taskCopy = { ...task }
        taskCopy.assignee = null
        demoTableStore.unassignedTasks.push(taskCopy)
        demoTableStore.saveToLocalStorage()
        
        // RETURN-TO-OWNER DOCUMENT SYNC: Copy current documents from Farahin's workflow to Ariffin's workflow
        const sourceDataService = dataService  // workflow2 data service (Farahin)
        const targetDataService = useDataService()  // workflow1 data service (Ariffin)
        
        console.log('Return-to-owner DEBUG: Syncing documents from Farahin to Ariffin for task:', task.id)
        
        // Remove any existing documents in target workflow (Ariffin)
        const existingTargetDocs = targetDataService.documents.value.filter(doc => 
          doc.description?.includes(`Attachment for ${task.id}`)
        )
        console.log('Return-to-owner DEBUG: Removing existing documents in Ariffin workflow:', existingTargetDocs.length)
        
        existingTargetDocs.forEach(doc => {
          console.log('Return-to-owner DEBUG: Removing document:', doc.name)
          targetDataService.deleteDocument(doc.id)
        })
        
        // Copy current documents from source workflow (Farahin)
        const taskDocuments = sourceDataService.documents.value.filter(doc => 
          doc.description?.includes(`Attachment for ${task.id}`)
        )
        
        console.log('Return-to-owner DEBUG: Copying documents to Ariffin workflow:', taskDocuments.length)
        
        taskDocuments.forEach(doc => {
          console.log('Return-to-owner DEBUG: Copying document:', doc.name)
          
          targetDataService.addDocument(task.id, {
            name: doc.name,
            type: doc.type,
            size: doc.size,
            category: doc.category,
            description: `Attachment for ${task.id}`,
            uploadedBy: doc.uploadedBy || 'return-to-owner-copy',
            version: doc.version || 1,
            url: doc.url,
            versions: doc.versions || []
          })
        })
        
        console.log('Task returned to original owner Ariffin, Farahin tracks delegation:', task)
      } else {
        // Cross-assignment: Keep in Farahin's Assigned AND add to Ariffin's Unassigned
        task.assignee = assigneeName
        workflow2TableStore.unassignedTasks.splice(taskIndex, 1)
        workflow2TableStore.assignedTasks.push(task)
        workflow2TableStore.saveToLocalStorage()
        
        // Add copy to Ariffin's Unassigned Tasks
        const taskCopy = { ...task }
        taskCopy.assignee = null
        demoTableStore.unassignedTasks.push(taskCopy)
        demoTableStore.saveToLocalStorage()
        
        // CROSS-WORKFLOW DOCUMENT SHARING: Copy documents to target workflow
        const sourceDataService = dataService  // workflow2 data service
        const targetDataService = useDataService()  // workflow1 data service
        
        console.log('Cross-assignment DEBUG: Checking for documents to copy from workflow2 to workflow1')
        console.log('Cross-assignment DEBUG: Source documents:', sourceDataService.documents.value.length)
        console.log('Cross-assignment DEBUG: Target documents before copy:', targetDataService.documents.value.length)
        
        // STEP 1: Remove any existing documents for this task in target workflow (replacement behavior)
        console.log('Cross-assignment DEBUG: Removing existing documents from target workflow for task:', task.id)
        const existingTargetDocs = targetDataService.documents.value.filter(doc => 
          doc.description?.includes(`Attachment for ${task.id}`)
        )
        console.log('Cross-assignment DEBUG: Found existing documents in target to remove:', existingTargetDocs.length)
        
        existingTargetDocs.forEach(doc => {
          console.log('Cross-assignment DEBUG: Removing existing document:', doc.name, 'ID:', doc.id)
          targetDataService.deleteDocument(doc.id)
        })
        
        // STEP 2: Find current documents in source workflow to copy
        const taskDocuments = sourceDataService.documents.value.filter(doc => 
          doc.description?.includes(`Attachment for ${task.id}`)
        )
        
        console.log('Cross-assignment DEBUG: Found task documents to copy:', taskDocuments.length)
        
        // STEP 3: Copy each document to the target workflow
        taskDocuments.forEach(doc => {
          console.log('Cross-assignment DEBUG: Copying document:', doc.name, 'with description:', doc.description)
          console.log('Cross-assignment DEBUG: Source URL type:', doc.url?.startsWith('data:') ? 'base64' : 'other')
          console.log('Cross-assignment DEBUG: Source URL preview:', doc.url?.substring(0, 100) + '...')
          
          // Create copy of document for target workflow
          const docCopy = {
            ...doc,
            // Keep same description pattern for the task ID
            description: `Attachment for ${task.id}`,
            uploadedBy: doc.uploadedBy || 'cross-workflow-copy'
          }
          
          // Add to target workflow's document store
          const addedDoc = targetDataService.addDocument(task.id, {
            name: docCopy.name,
            type: docCopy.type,
            size: docCopy.size,
            category: docCopy.category,
            description: docCopy.description,
            uploadedBy: docCopy.uploadedBy,
            version: docCopy.version || 1,
            url: docCopy.url,
            versions: docCopy.versions || []
          })
          
          console.log('Cross-assignment DEBUG: Document copied to target workflow with ID:', addedDoc.id)
          console.log('Cross-assignment DEBUG: Target URL type:', addedDoc.url?.startsWith('data:') ? 'base64' : 'other')
        })
        
        console.log('Cross-assignment DEBUG: Target documents after copy:', targetDataService.documents.value.length)
        console.log('Task cross-assigned - appears in both workflows:', task)
      }
    } else {
      console.error('Could not find task to assign!')
    }
  } else {
    // Self-assignment: use existing logic
    const result = workflow2TableStore.assignTask(taskId, assigneeName)
    if (result) {
      console.log('Task self-assigned:', result)
    } else {
      console.error('Could not find task to assign!')
    }
  }
  selectedTaskForAssignment.value = null
}

const openEditModal = (taskId: string) => {
  const task = [...workflow2TableStore.unassignedTasks, ...workflow2TableStore.assignedTasks].find(t => t.id === taskId)
  if (task) {
    selectedTaskForEdit.value = task
    isEditModalOpen.value = true
  }
}

const saveTaskEdit = (updatedTask: Partial<TaskData>) => {
  if (selectedTaskForEdit.value) {
    workflow2TableStore.updateTask(selectedTaskForEdit.value.id, updatedTask)
    selectedTaskForEdit.value = null
  }
}

const confirmDeleteTask = () => {
  if (selectedTaskForEdit.value) {
    const taskId = selectedTaskForEdit.value.id
    
    // Delete from demo table store
    const deleted = workflow2TableStore.deleteTask(taskId)
    
    if (deleted) {
      // Also remove associated documents from data service
      dataService.deleteDocumentsByTaskId(taskId)
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
    console.log('FILE UPLOAD DEBUG: === RESETTING ALL WORKFLOW2 DATA ===')
    
    // Clear Workflow2Table store data
    localStorage.removeItem('towerco-workflow2-unassigned-tasks')
    localStorage.removeItem('towerco-workflow2-assigned-tasks')
    
    // Clear Workflow2 Data Service data
    localStorage.removeItem('inflow-workflow2-users')
    localStorage.removeItem('inflow-workflow2-tasks')
    localStorage.removeItem('inflow-workflow2-documents')
    localStorage.removeItem('inflow-workflow2-comments')
    localStorage.removeItem('inflow-workflow2-persona')
    localStorage.removeItem('inflow-workflow2-initialized')
    
    // Clear in-memory data immediately
    workflow2TableStore.unassignedTasks.splice(0)
    workflow2TableStore.assignedTasks.splice(0)
    // Clear all documents using data service method
    dataService.clearAllDocuments()
    
    console.log('FILE UPLOAD DEBUG: All data cleared')
    console.log('FILE UPLOAD DEBUG: Tasks remaining:', workflow2TableStore.unassignedTasks.length)
    console.log('FILE UPLOAD DEBUG: Documents remaining:', dataService.documents.value.length)
    console.log('FILE UPLOAD DEBUG: === WORKFLOW2 DATA RESET COMPLETE ===')
    
    // Don't reload - just show empty state
  }
}

</script>