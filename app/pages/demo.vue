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
          <UForm>
            <div class="space-y-4">
              <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
                New Task
              </h3>
              
              <div class="flex gap-4">
                <UInput 
                  label="Category"
                  placeholder="Enter task category"
                  class="flex-1"
                />
                
                <UInput 
                  label="Description"
                  placeholder="Enter task description"
                  class="flex-1"
                />
              </div>
              
              <UFileUpload 
                label="Attachment"
                accept="*"
              />
              
              <UTextarea 
                label="Additional note (optional):"
                placeholder="Enter additional notes..."
                class="w-full"
              />
              
              <div class="flex justify-end pt-4">
                <UButton color="primary">Create</UButton>
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
  </div>
</template>

<script setup lang="ts">
type TaskData = {
  id: string
  task: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track'
  priority: 'High' | 'Medium' | 'Low'
  assignee: string
}

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
    assignee: 'Dr. Emily Watson'
  },
  {
    id: '4',
    task: 'Network Testing',
    status: 'Scheduled',
    priority: 'High',
    assignee: 'Sarah Chen'
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
    accessorKey: 'assignee',
    header: 'Assignee'
  }
]
</script>