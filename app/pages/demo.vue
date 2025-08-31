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
        
        <!-- Second Column - UTable (2/3 width) -->
        <div class="col-span-2">
          <div class="mb-2 text-xs text-gray-600">
            DEBUG: Tasks={{ demoTableStore.unassignedTasks.length }}, Docs={{ dataService.documents.value.length }}
          </div>
          <UTable :data="demoTableStore.unassignedTasks" :columns="tableColumns as any" />
        </div>
      </div>
      
      <!-- Assigned Tasks Section -->
      <div class="mt-8">
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Assigned Tasks</h3>
          <p class="text-gray-600">Tasks that have been assigned to team members</p>
        </div>
        <UTable :data="demoTableStore.assignedTasks" :columns="assignedTaskColumns as any" />
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
import { h, resolveComponent } from 'vue'
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

const tableColumns = [
  {
    key: 'category',
    header: 'Category',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return task.task.split(': ')[0] || ''
    }
  },
  {
    key: 'description',
    header: 'Description', 
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return task.task.split(': ')[1] || task.task
    }
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'priority',
    header: 'Priority'
  },
  {
    key: 'attachments',
    header: 'Files',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      console.log('FILE UPLOAD DEBUG: ===============================================')
      console.log('FILE UPLOAD DEBUG: Rendering files for TASK ROW:', {
        taskId: task.id,
        taskDescription: task.task,
        taskStatus: task.status,
        taskPriority: task.priority,
        allDocuments: dataService.documents.value.length,
        searchingFor: `demo-task-${task.id}`
      })
      console.log('FILE UPLOAD DEBUG: All available documents:', dataService.documents.value.map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
        matchesPattern: d.description?.includes(`demo-task-${task.id}`)
      })))
      
      const documents = dataService.documents.value.filter(doc => {
        const matches = doc.description?.includes(`demo-task-${task.id}`)
        console.log('FILE UPLOAD DEBUG: Checking document:', {
          docId: doc.id,
          docName: doc.name,
          description: doc.description,
          searchPattern: `demo-task-${task.id}`,
          matches: matches
        })
        return matches
      })
      
      console.log('FILE UPLOAD DEBUG: Found', documents.length, 'documents for task', task.id)
      if (documents.length > 0) {
        console.log('FILE UPLOAD DEBUG: MATCHED Document details:', documents.map(d => ({ 
          id: d.id, 
          name: d.name, 
          description: d.description 
        })))
      } else {
        console.log('FILE UPLOAD DEBUG: NO MATCHES - Task pattern was:', `demo-task-${task.id}`)
        console.log('FILE UPLOAD DEBUG: Available document patterns:', dataService.documents.value.map(d => d.description))
        
        // Check if any document contains the task ID without the prefix
        const alternativeMatches = dataService.documents.value.filter(doc => 
          doc.description?.includes(task.id)
        )
        if (alternativeMatches.length > 0) {
          console.log('FILE UPLOAD DEBUG: ALTERNATIVE MATCHES (without demo-task prefix):', alternativeMatches.map(d => ({
            id: d.id,
            name: d.name, 
            description: d.description
          })))
        }
      }
      
      if (documents.length === 0) {
        return h('span', { class: 'text-gray-400 text-sm' }, 'No files')
      }
      
      console.log('FILE UPLOAD DEBUG: RENDERING', documents.length, 'documents for task', task.id)
      console.log('FILE UPLOAD DEBUG: Documents being rendered:', documents.map(d => d.name))
      console.log('FILE UPLOAD DEBUG: ===============================================')
      
      return h('div', { class: 'space-y-1' }, documents.map(doc => 
        h('div', { class: 'flex items-center space-x-2' }, [
          h(resolveComponent('UIcon'), { 
            name: doc.type.includes('image') ? 'i-heroicons-photo' : 'i-heroicons-document-text',
            class: 'w-4 h-4 text-gray-500'
          }),
          h('button', {
            onClick: () => openPreview(doc as Document),
            class: 'text-xs text-blue-600 hover:underline truncate max-w-[100px] cursor-pointer',
            title: doc.name
          }, doc.name)
        ])
      ))
    }
  },
  {
    key: 'assignee',
    header: 'Assignee',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      if (!task.assignee) {
        return h(resolveComponent('UButton'), {
          variant: 'outline',
          size: 'xs',
          onClick: () => openAssignModal(task)
        }, () => 'Assign')
      }
      return task.assignee
    }
  },
  {
    key: 'edit',
    header: 'Edit',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return h(resolveComponent('UButton'), {
        variant: 'ghost',
        size: 'xs',
        onClick: () => openEditModal(task)
      }, () => h(resolveComponent('UIcon'), {
        name: 'i-heroicons-pencil',
        class: 'w-4 h-4'
      }))
    }
  }
]

const assignedTaskColumns = [
  {
    key: 'category',
    header: 'Category',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return task.task.split(': ')[0] || ''
    }
  },
  {
    key: 'description',
    header: 'Description',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return task.task.split(': ')[1] || task.task
    }
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'priority',
    header: 'Priority'
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: () => 'draft'
  }
]

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

const openAssignModal = (task: TaskData) => {
  console.log('Opening assign modal for task:', task)
  selectedTaskForAssignment.value = task
  isAssignModalOpen.value = true
  console.log('Modal opened, selectedTaskForAssignment:', selectedTaskForAssignment.value)
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

const openEditModal = (task: TaskData) => {
  selectedTaskForEdit.value = task
  isEditModalOpen.value = true
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