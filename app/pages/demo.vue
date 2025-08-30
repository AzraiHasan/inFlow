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
                  <UDropdownMenu 
                    :items="categoryDropdownItems"
                    :ui="{ content: 'w-full' }"
                  >
                    <UButton 
                      variant="outline" 
                      :label="formState.category || 'Select category'"
                      trailing-icon="i-heroicons-chevron-down-20-solid"
                      class="w-full justify-between"
                    />
                  </UDropdownMenu>
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
                label="Attachment"
                accept="*"
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
                <UDropdownMenu 
                  :items="statusDropdownItems"
                  :ui="{ content: 'w-full' }"
                >
                  <UButton 
                    variant="outline" 
                    :label="editFormState.status || 'Select status'"
                    trailing-icon="i-heroicons-chevron-down-20-solid"
                    class="w-full justify-between"
                  />
                </UDropdownMenu>
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <UDropdownMenu 
                  :items="priorityDropdownItems"
                  :ui="{ content: 'w-full' }"
                >
                  <UButton 
                    variant="outline" 
                    :label="editFormState.priority || 'Select priority'"
                    trailing-icon="i-heroicons-chevron-down-20-solid"
                    class="w-full justify-between"
                  />
                </UDropdownMenu>
              </div>
            </div>
            
            <div class="flex justify-end gap-2 pt-4">
              <UButton color="gray" @click="isEditModalOpen = false">Cancel</UButton>
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

const demoTableStore = useDemoTableStore()

const formState = reactive({
  category: '',
  description: '',
  attachment: null,
  note: ''
})

const isAssignModalOpen = ref(false)
const selectedTaskForAssignment = ref<TaskData | null>(null)
const isEditModalOpen = ref(false)
const selectedTaskForEdit = ref<TaskData | null>(null)
const editFormState = reactive({
  category: '',
  description: '',
  status: '',
  priority: ''
})

const availableAssignees = [
  'Sarah Chen',
  'Marcus Rodriguez',
  'Dr. Emily Watson',
  'Alex Thompson',
  'Jamie Liu',
  'Chris Park'
]

const statusOptions = [
  'Pending',
  'In Progress', 
  'Completed',
  'Scheduled',
  'On Track'
]

const priorityOptions = [
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

const statusDropdownItems = computed(() => [
  statusOptions.map(status => ({
    label: status,
    click: () => {
      editFormState.status = status
    }
  }))
])

const priorityDropdownItems = computed(() => [
  priorityOptions.map(priority => ({
    label: priority,
    click: () => {
      editFormState.priority = priority
    }
  }))
])

const categoryDropdownItems = computed(() => [
  categoryOptions.map(category => ({
    label: category,
    click: () => {
      formState.category = category
    }
  }))
])

// Initialize store data on mount
onMounted(() => {
  demoTableStore.loadFromLocalStorage()
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

const createTask = () => {
  if (!formState.category.trim() || !formState.description.trim()) {
    return
  }

  demoTableStore.addTask({
    task: `${formState.category}: ${formState.description}`,
    status: 'Pending',
    priority: 'Medium'
  })

  // Reset form
  formState.category = ''
  formState.description = ''
  formState.attachment = null
  formState.note = ''
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
  if (selectedTaskForEdit.value && editFormState.category.trim() && editFormState.description.trim()) {
    const updatedTask = {
      ...selectedTaskForEdit.value,
      task: `${editFormState.category}: ${editFormState.description}`,
      status: editFormState.status,
      priority: editFormState.priority
    }
    
    demoTableStore.updateTask(selectedTaskForEdit.value.id, updatedTask)
    isEditModalOpen.value = false
    selectedTaskForEdit.value = null
  }
}

</script>