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
                <UButton color="primary" @click="createTask">Create</UButton>
              </div>
            </div>
          </UForm>
        </div>
        
        <!-- Second Column - UTable (2/3 width) -->
        <div class="col-span-2">
          <UTable :data="demoTableStore.unassignedTasks" :columns="tableColumns" />
        </div>
      </div>
      
      <!-- Assigned Tasks Section -->
      <div class="mt-8">
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Assigned Tasks</h3>
          <p class="text-gray-600">Tasks that have been assigned to team members</p>
        </div>
        <UTable :data="demoTableStore.assignedTasks" :columns="assignedTaskColumns" />
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
            
            <div class="flex justify-end gap-2 pt-4">
              <UButton color="neutral" @click="isEditModalOpen = false">Cancel</UButton>
              <UButton color="primary" @click="saveTaskEdit">Save</UButton>
            </div>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TaskData } from '~/stores/demoTable'
import { DocumentCategory } from '~/types'

const demoTableStore = useDemoTableStore()
const dataService = useDataService()

// Initialize data service
onMounted(() => {
  dataService.initializeData()
  console.log('DEBUG: Data service initialized')
  console.log('DEBUG: Current documents on mount:', dataService.documents.value)
  console.log('DEBUG: Current persona:', dataService.currentPersona.value)
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
const editFormState = reactive({
  category: '',
  description: '',
  status: undefined as 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track' | undefined,
  priority: undefined as 'High' | 'Medium' | 'Low' | undefined
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
  console.log('formState:', formState)
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
      console.log('DEBUG: Rendering files for task:', {
        taskId: task.id,
        allDocuments: dataService.documents.value.length,
        searchingFor: `demo-task-${task.id}`
      })
      
      const documents = dataService.documents.value.filter(doc => {
        console.log('DEBUG: Checking document:', {
          docId: doc.id,
          description: doc.description,
          matches: doc.description?.includes(`demo-task-${task.id}`)
        })
        return doc.description?.includes(`demo-task-${task.id}`)
      })
      
      console.log('DEBUG: Found documents for task', task.id, ':', documents)
      
      if (documents.length === 0) {
        return h('span', { class: 'text-gray-400 text-sm' }, 'No files')
      }
      
      return h('div', { class: 'space-y-1' }, documents.map(doc => 
        h('div', { class: 'flex items-center space-x-2' }, [
          h(resolveComponent('UIcon'), { 
            name: doc.type.includes('image') ? 'i-heroicons-photo' : 'i-heroicons-document-text',
            class: 'w-4 h-4 text-gray-500'
          }),
          h('a', {
            href: doc.url,
            download: doc.name,
            class: 'text-xs text-blue-600 hover:underline truncate max-w-[100px]',
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
] as any

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
] as any

const createTask = async () => {
  console.log('Create button clicked')
  console.log('Form state before validation:', formState)
  
  if (!formState.category || !formState.description.trim()) {
    console.log('Validation failed - category or description is empty')
    console.log('Category:', formState.category)
    console.log('Description:', formState.description)
    return
  }

  // Create task for demo table
  const newTask = {
    task: `${formState.category}: ${formState.description}`,
    status: 'Pending' as const,
    priority: 'Medium' as const
  }
  
  console.log('Creating task:', newTask)
  const createdTask = demoTableStore.addTask(newTask)
  console.log('Task added to store')

  // Process file attachment if present
  console.log('DEBUG: Checking for attachment, formState.attachment:', formState.attachment)
  if (formState.attachment) {
    try {
      const file = formState.attachment
      console.log('DEBUG: Processing attachment:', {
        name: file.name,
        type: file.type,
        size: file.size,
        taskId: createdTask.id
      })
      
      // Convert file to base64
      const base64Data = await fileToBase64(file)
      console.log('DEBUG: Base64 conversion complete, data length:', base64Data.length)
      
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
      
      console.log('DEBUG: About to add document with data:', documentData)
      
      // Add document to data service (this will persist to localStorage)
      const addedDoc = dataService.addDocument(`demo-task-${createdTask.id}`, documentData)
      console.log('DEBUG: File attachment stored successfully:', addedDoc)
      console.log('DEBUG: Current documents in store:', dataService.documents.value)
      
    } catch (error) {
      console.error('ERROR: Processing file attachment failed:', error)
    }
  } else {
    console.log('DEBUG: No attachment found in formState')
  }

  // Reset form
  console.log('Resetting form')
  formState.category = undefined
  formState.description = ''
  formState.attachment = null
  formState.note = ''
  console.log('Form reset complete')
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
      priority: editFormState.priority as 'High' | 'Medium' | 'Low'
    }
    
    demoTableStore.updateTask(selectedTaskForEdit.value.id, updatedTask)
    isEditModalOpen.value = false
    selectedTaskForEdit.value = null
  }
}

</script>