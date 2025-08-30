<!--this page is to simulate the UI for different personas via simple buttons-->

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">TowerCo Workflow Demo</h1>
        <p class="text-gray-600">Experience the platform from different persona perspectives</p>
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- First Column - UForm -->
        <div>
          <UForm :state="formState">
            <div class="space-y-4">
              <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
                New Task
              </h3>
              
              <div class="flex gap-4">
                <UInput 
                  v-model="formState.category"
                  label="Category"
                  placeholder="Enter task category"
                  class="flex-1"
                />
                
                <UInput 
                  v-model="formState.description"
                  label="Description"
                  placeholder="Enter task description"
                  class="flex-1"
                />
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
        
        <!-- Second Column - UTable -->
        <div>
          <UTable :data="tableData" :columns="tableColumns" />
        </div>
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
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
type TaskData = {
  id: string
  task: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track'
  priority: 'High' | 'Medium' | 'Low'
  assignee: string | null
}

const formState = reactive({
  category: '',
  description: '',
  attachment: null,
  note: ''
})

const isAssignModalOpen = ref(false)
const selectedTaskForAssignment = ref<TaskData | null>(null)

const availableAssignees = [
  'Sarah Chen',
  'Marcus Rodriguez',
  'Dr. Emily Watson',
  'Alex Thompson',
  'Jamie Liu',
  'Chris Park'
]

const tableData = ref<TaskData[]>([
  {
    id: '1',
    task: 'Site Survey Complete',
    status: 'Completed',
    priority: 'High',
    assignee: 'Sarah Chen'
  },
  {
    id: '2',
    task: 'Equipment Installation',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Marcus Rodriguez'
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
    assignee: 'Marcus Rodriguez'
  }
])

const tableColumns = [
  {
    accessorKey: 'task',
    header: 'Task'
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
    cell: ({ row }: { row: any }) => {
      if (!row.assignee) {
        return h(resolveComponent('UButton'), {
          variant: 'outline',
          size: 'xs',
          onClick: () => openAssignModal(row)
        }, () => 'Assign')
      }
      return row.assignee
    }
  }
]

const createTask = () => {
  if (!formState.category.trim() || !formState.description.trim()) {
    return
  }

  const newTask: TaskData = {
    id: (tableData.value.length + 1).toString(),
    task: `${formState.category}: ${formState.description}`,
    status: 'Pending',
    priority: 'Medium',
    assignee: null
  }

  tableData.value.push(newTask)

  // Reset form
  formState.category = ''
  formState.description = ''
  formState.attachment = null
  formState.note = ''
}

const openAssignModal = (task: TaskData) => {
  selectedTaskForAssignment.value = task
  isAssignModalOpen.value = true
}

const assignTask = (assigneeName: string) => {
  if (selectedTaskForAssignment.value) {
    selectedTaskForAssignment.value.assignee = assigneeName
    isAssignModalOpen.value = false
    selectedTaskForAssignment.value = null
  }
}
</script>