<!--this page is to simulate the UI for different personas via simple buttons-->

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">TowerCo Workflow Demo</h1>
        <p class="text-gray-600">Experience the platform from different persona perspectives</p>
      </div>
      
      <div class="grid grid-cols-3 gap-6">
        <!-- First Column - UForm -->
        <div class="col-span-1">
          <UForm :state="formState">
            <div class="space-y-4">
              <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
                New Task
              </h3>
              
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <USelect
                    v-model="formState.category"
                    :items="categoryOptions"
                    placeholder="Choose a category..."
                    variant="outline"
                    class="w-full"
                    :ui="{
                      trailingIcon: 'group-data-[state=open]:rotate-180',
                      content: 'w-full'
                    }"
                  />
                </div>
                
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <UInput 
                    v-model="formState.description"
                    placeholder="Enter task description"
                    class="w-full"
                  />
                </div>
              </div>
              
              <UFileUpload 
                v-model="formState.attachment"
                label="Drop your file here"
                accept="image/png, image/jpeg, application/pdf"
                color="primary"
                highlight
                description="PDF, PNG, JPG (max. 2MB)"
              />
              
              <UTextarea 
                v-model="formState.note"
                label="Additional note (optional):"
                placeholder="Enter additional notes..."
                class="w-full"
              />
              
              <div class="flex justify-end pt-4">
                <div class="flex gap-2">
                  <UButton color="error" variant="outline" size="xs" @click="resetAllData">Reset Data</UButton>
                  <UButton color="primary" @click="createTask">Create</UButton>
                </div>
              </div>
            </div>
          </UForm>
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

    <!-- Assign Modal -->
    <UModal 
      v-model:open="isAssignModalOpen"
      title="Assign Task"
      description="Select an assignee for this task"
    >
      <template #body>
        <div class="space-y-3">
          <div v-for="assignee in availableAssignees" :key="assignee">
            <UButton 
              :label="assignee"
              variant="outline"
              class="w-full justify-start"
              @click="assignTask(assignee)"
            >
              {{ assignee }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Edit Modal -->
    <UModal 
      v-model:open="isEditModalOpen"
      title="Edit Task"
      description="Update task details"
    >
      <template #body>
        <UForm :state="editFormState">
          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <UInput 
                  v-model="editFormState.category"
                  placeholder="Enter task category"
                />
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <UInput 
                  v-model="editFormState.description"
                  placeholder="Enter task description"
                />
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <USelect
                  v-model="editFormState.status"
                  :items="statusOptions"
                  placeholder="Select status"
                  variant="outline"
                  class="w-full"
                  :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180',
                    content: 'w-full'
                  }"
                />
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <USelect
                  v-model="editFormState.priority"
                  :items="priorityOptions"
                  placeholder="Select priority"
                  variant="outline"
                  class="w-full"
                  :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180',
                    content: 'w-full'
                  }"
                />
              </div>
            </div>
            
            <UTextarea 
              v-model="editFormState.note"
              label="Additional note (optional):"
              placeholder="Enter additional notes..."
              class="w-full"
            />
            
            <div class="flex justify-between pt-4">
              <UButton color="error" variant="outline" @click="showDeleteConfirmation = true">Delete</UButton>
              <div class="flex gap-2">
                <UButton color="neutral" @click="isEditModalOpen = false">Cancel</UButton>
                <UButton color="primary" @click="saveTaskEdit">Save</UButton>
              </div>
            </div>
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal 
      v-model:open="showDeleteConfirmation"
      title="Delete Task"
      description="Are you sure you want to delete this task? This action cannot be undone."
    >
      <template #body>
        <div class="flex items-center gap-3 p-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-2xl" />
          <div>
            <p class="font-medium text-gray-900">Are you sure you want to delete this task?</p>
            <p class="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 px-4 pb-4">
          <UButton color="neutral" variant="ghost" @click="showDeleteConfirmation = false">Cancel</UButton>
          <UButton color="error" @click="confirmDeleteTask">Delete</UButton>
        </div>
      </template>
    </UModal>

    <!-- File Preview Modal -->
    <UModal 
      v-model:open="showPreview"
      :title="selectedDocument?.name || 'File Preview'"
      :description="`Preview of ${selectedDocument?.name || 'file'}`"
      fullscreen
    >
      <template #body>
        <div class="p-8 m-4">
          <!-- Image Preview -->
          <div v-if="isImage(selectedDocument)" class="flex justify-center mb-6">
            <nuxt-img 
              :src="selectedDocument?.url || ''" 
              :alt="selectedDocument?.name || 'Image'"
              class="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg"
            />
          </div>
          
          <!-- PDF Preview -->
          <div v-else-if="isPDF(selectedDocument)" class="w-full h-[65vh] mb-6">
            <iframe 
              :src="selectedDocument?.url || ''"
              class="w-full h-full border rounded-lg shadow-sm"
              title="PDF Preview"
            />
          </div>
          
          <!-- Other File Info -->
          <div v-else class="text-center p-8 mb-6">
            <UIcon 
              name="i-heroicons-document-text" 
              class="mx-auto text-6xl text-gray-400 mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ selectedDocument?.name }}</h3>
            <p class="text-gray-600 mb-1">File Type: {{ selectedDocument?.type }}</p>
            <p class="text-gray-600 mb-4">Size: {{ formatFileSize(selectedDocument?.size || 0) }}</p>
            <p class="text-sm text-gray-500">Preview not available for this file type</p>
          </div>
        </div>
      </template>
      
      <template #footer>
        <div class="flex justify-between items-center px-8 py-6 mx-4 border-t bg-gray-50/50">
          <div class="text-sm text-gray-600">
            {{ selectedDocument?.name }} • {{ formatFileSize(selectedDocument?.size || 0) }}
          </div>
          <div class="flex gap-3">
            <UButton 
              variant="outline"
              @click="showPreview = false"
            >
              Close
            </UButton>
            <UButton 
              icon="i-heroicons-arrow-down-tray"
              @click="downloadFromPreview()"
            >
              Download
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
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

const formState = reactive({
  category: undefined as string | undefined,
  description: '',
  attachment: null as File | null,
  note: ''
})

const isAssignModalOpen = ref(false)
const selectedTaskForAssignment = ref<TaskData | null>(null)
const isEditModalOpen = ref(false)
const selectedTaskForEdit = ref<TaskData | null>(null)
const showDeleteConfirmation = ref(false)
const showPreview = ref(false)
const selectedDocument = ref<Document | null>(null)
const editFormState = reactive({
  category: '',
  description: '',
  status: undefined as 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track' | undefined,
  priority: undefined as 'High' | 'Medium' | 'Low' | undefined,
  note: ''
})

const availableAssignees = [
  'Sarah Chen',
  'Marcus Rodriguez',
  'Dr. Emily Watson',
  'Alex Thompson',
  'Jamie Liu',
  'Chris Park'
]

const statusOptions: ('Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track')[] = [
  'Pending',
  'In Progress', 
  'Completed',
  'Scheduled',
  'On Track'
]

const priorityOptions: ('High' | 'Medium' | 'Low')[] = [
  'Low',
  'Medium',
  'High'
]

const categoryOptions = [
  'LCN',
  'SAR', 
  'TP',
  'LOO',
  'TA',
  'Other'
]



// Initialize store data on mount
onMounted(() => {
  demoTableStore.loadFromLocalStorage()
  console.log('FILE UPLOAD DEBUG: === DEMO TABLE STORE DEBUG ===')
  console.log('FILE UPLOAD DEBUG: Form state on mount:', formState)
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

const createTask = async () => {
  console.log('=== FILE UPLOAD DEBUG: Create button clicked ===')
  console.log('FILE UPLOAD DEBUG: Form state before validation:', {
    category: formState.category,
    description: formState.description,
    hasAttachment: !!formState.attachment,
    attachmentName: formState.attachment?.name,
    attachmentSize: formState.attachment?.size,
    attachmentType: formState.attachment?.type,
    note: formState.note
  })
  
  if (!formState.category || !formState.description.trim()) {
    console.log('FILE UPLOAD DEBUG: Validation failed - category or description is empty')
    console.log('FILE UPLOAD DEBUG: Category:', formState.category)
    console.log('FILE UPLOAD DEBUG: Description:', formState.description)
    return
  }

  // Create task for demo table
  const newTask = {
    task: `${formState.category}: ${formState.description}`,
    status: 'Pending' as const,
    priority: 'Medium' as const,
    note: formState.note
  }
  
  console.log('FILE UPLOAD DEBUG: Creating task:', newTask)
  const createdTask = demoTableStore.addTask(newTask)
  console.log('FILE UPLOAD DEBUG: Task added to store with ID:', createdTask.id)
  console.log('FILE UPLOAD DEBUG: Current unassigned tasks count:', demoTableStore.unassignedTasks.length)

  // Process file attachment if present
  console.log('FILE UPLOAD DEBUG: Checking for attachment, formState.attachment:', formState.attachment)
  if (formState.attachment) {
    try {
      const file = formState.attachment
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
    console.log('FILE UPLOAD DEBUG: No attachment found in formState')
  }

  // Reset form
  console.log('FILE UPLOAD DEBUG: Resetting form')
  const preResetState = {
    category: formState.category,
    description: formState.description,
    hasAttachment: !!formState.attachment,
    note: formState.note
  }
  console.log('FILE UPLOAD DEBUG: State before reset:', preResetState)
  
  formState.category = undefined
  formState.description = ''
  formState.attachment = null
  formState.note = ''
  
  console.log('FILE UPLOAD DEBUG: Form reset complete')
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

const assignTask = (assigneeName: string) => {
  if (selectedTaskForAssignment.value) {
    const result = demoTableStore.assignTask(selectedTaskForAssignment.value.id, assigneeName)
    if (result) {
      console.log('Task successfully assigned:', result)
    } else {
      console.error('Could not find task to assign!')
    }
    isAssignModalOpen.value = false
    selectedTaskForAssignment.value = null
  }
}

const openEditModal = (task: TaskData) => {
  selectedTaskForEdit.value = task
  const [category, description] = task.task.split(': ')
  editFormState.category = category || ''
  editFormState.description = description || task.task
  editFormState.status = task.status
  editFormState.priority = task.priority
  editFormState.note = task.note || ''
  isEditModalOpen.value = true
}

const saveTaskEdit = () => {
  if (selectedTaskForEdit.value && 
      editFormState.category.trim() && 
      editFormState.description.trim() &&
      editFormState.status &&
      editFormState.priority) {
    const updatedTask = {
      ...selectedTaskForEdit.value,
      task: `${editFormState.category}: ${editFormState.description}`,
      status: editFormState.status as 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track',
      priority: editFormState.priority as 'High' | 'Medium' | 'Low',
      note: editFormState.note
    }
    
    demoTableStore.updateTask(selectedTaskForEdit.value.id, updatedTask)
    isEditModalOpen.value = false
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
    showDeleteConfirmation.value = false
    isEditModalOpen.value = false
    selectedTaskForEdit.value = null
  }
}

const openPreview = (document: Document) => {
  selectedDocument.value = document
  showPreview.value = true
}

const isImage = (document: Document | null) => {
  return document?.type?.startsWith('image/')
}

const isPDF = (document: Document | null) => {
  return document?.type === 'application/pdf'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadFromPreview = () => {
  if (selectedDocument.value) {
    const link = document.createElement('a')
    link.href = selectedDocument.value.url
    link.download = selectedDocument.value.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
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