<!--this page is to simulate the UI for different personas via simple buttons-->

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">TowerCo Workflow Demo</h1>
        <p class="text-gray-600">Experience the platform from different persona perspectives</p>
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- First Column - UCard -->
        <div>
          <UCard>
            <template #header>
              <h3 class="text-base font-semibold leading-6 text-gray-900">
                Card Title
              </h3>
            </template>
            
            <p class="text-gray-600">
              This is a basic UCard example with header and body content. You can add any content here.
            </p>
            
            <template #footer>
              <div class="flex justify-end">
                <UButton color="primary">Action</UButton>
              </div>
            </template>
          </UCard>
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