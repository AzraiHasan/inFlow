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

const availableAssignees = [
  'Sarah Chen',
  'Marcus Rodriguez',
  'Dr. Emily Watson',
  'Alex Thompson',
  'Jamie Liu',
  'Chris Park'
]

// Initialize store data on mount
onMounted(() => {
  demoTableStore.loadFromLocalStorage()
})

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

</script>