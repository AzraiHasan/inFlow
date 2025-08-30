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
      
      <!-- Assigned Tasks Section -->
      <div class="mt-8">
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Assigned Tasks</h3>
          <p class="text-gray-600">Tasks that have been assigned to team members</p>
        </div>
        <UTable :data="assignedTasks" :columns="assignedTaskColumns" />
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

const assignedTaskColumns = [
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
    accessorKey: 'assignee',
    header: 'Assignee'
  }
]

const assignedTasks = computed(() => 
  tableData.value.filter(task => task.assignee !== null)
)

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

const openAssignModal = (task: any) => {
  console.log('Opening assign modal for task:', task)
  // Extract the original task data from the UTable row object
  const actualTask = task.original || task
  console.log('Actual task data:', actualTask)
  selectedTaskForAssignment.value = actualTask
  isAssignModalOpen.value = true
  console.log('Modal opened, selectedTaskForAssignment:', selectedTaskForAssignment.value)
}

const assignTask = (assigneeName: string) => {
  console.log('assignTask called with:', assigneeName)
  console.log('selectedTaskForAssignment:', selectedTaskForAssignment.value)
  console.log('All task IDs in tableData:', tableData.value.map(t => ({ id: t.id, task: t.task })))
  
  if (selectedTaskForAssignment.value) {
    // Find and update the task in the main table data - try multiple approaches
    let taskIndex = tableData.value.findIndex(task => task.id === selectedTaskForAssignment.value!.id)
    console.log('Found task index by ID:', taskIndex)
    
    // If not found by ID, try by task name
    if (taskIndex === -1) {
      taskIndex = tableData.value.findIndex(task => task.task === selectedTaskForAssignment.value!.task)
      console.log('Found task index by task name:', taskIndex)
    }
    
    // If still not found, try by reference
    if (taskIndex === -1) {
      taskIndex = tableData.value.findIndex(task => task === selectedTaskForAssignment.value!)
      console.log('Found task index by reference:', taskIndex)
    }
    
    if (taskIndex !== -1) {
      console.log('Before assignment - tableData[' + taskIndex + ']:', tableData.value[taskIndex])
      // Use direct assignment to ensure reactivity
      tableData.value[taskIndex].assignee = assigneeName
      console.log('After assignment - tableData[' + taskIndex + ']:', tableData.value[taskIndex])
      
      // Force reactivity by creating a new array reference
      tableData.value = [...tableData.value]
      console.log('Updated tableData:', tableData.value)
      console.log('Assigned tasks (filtered):', tableData.value.filter(task => task.assignee !== null))
    } else {
      console.error('Could not find task to assign!')
    }
    isAssignModalOpen.value = false
    selectedTaskForAssignment.value = null
  } else {
    console.log('No selectedTaskForAssignment found')
  }
}
</script>