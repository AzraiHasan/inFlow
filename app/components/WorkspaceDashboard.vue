<template>
  <div class="workspace-dashboard">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-inbox-stack" />
            <h3 class="text-lg font-semibold">Assigned Task Views</h3>
          </div>
          <div class="text-sm text-gray-500">
            Tasks assigned to team members
          </div>
        </div>
      </template>

      <UTabs v-model="selectedTab" :items="personaTabs">
        <template #item="{ item }">
          <div class="space-y-4">
            <!-- Tab Content Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-2xl">{{ item.persona.avatar }}</div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ item.persona.name }}</h4>
                  <p class="text-sm text-gray-600">{{ formatRole(item.persona.role) }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-500">{{ item.tasks.length }} tasks</div>
                <div class="text-xs text-gray-400">{{ formatDepartment(item.persona.department) }}</div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="item.tasks.length === 0" class="text-center py-8">
              <div class="text-gray-400 mb-2">
                <UIcon name="i-heroicons-inbox" class="w-12 h-12 mx-auto" />
              </div>
              <h5 class="text-lg font-medium text-gray-600">No assigned tasks</h5>
              <p class="text-sm text-gray-500">{{ item.persona.name }} has no tasks assigned yet.</p>
            </div>

            <!-- Task List -->
            <div v-else class="space-y-3">
              <div
                v-for="task in item.tasks"
                :key="task.id"
                class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <!-- Task Status Icon -->
                <div class="flex-shrink-0 mt-1">
                  <StatusBadge :status="task.status" />
                </div>

                <!-- Task Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <h5 class="text-sm font-medium text-gray-900 truncate">{{ task.title }}</h5>
                      <p v-if="task.description" class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
                    </div>
                    <div class="flex items-center gap-2 ml-3 flex-shrink-0">
                      <PriorityBadge :priority="task.priority" />
                      <UBadge
                        v-if="task.documents.length > 0"
                        color="blue"
                        variant="subtle"
                        size="xs"
                      >
                        {{ task.documents.length }} docs
                      </UBadge>
                    </div>
                  </div>

                  <!-- Task Metadata -->
                  <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-user" class="w-3 h-3" />
                      <span>{{ getCreatedByName(task.createdBy) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                      <span>{{ formatDate(task.createdAt) }}</span>
                    </div>
                    <div v-if="task.dueDate" class="flex items-center gap-1" :class="{ 'text-red-500': isOverdue(task.dueDate) }">
                      <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                      <span>Due {{ formatDate(task.dueDate) }}</span>
                    </div>
                  </div>

                  <!-- Task Actions -->
                  <div class="flex items-center gap-2 mt-3">
                    <UButton size="xs" variant="outline" @click="viewTask(task)">
                      <UIcon name="i-heroicons-eye" class="w-3 h-3 mr-1" />
                      View
                    </UButton>
                    <UButton
                      v-if="task.comments.length > 0"
                      size="xs"
                      variant="ghost"
                      @click="viewComments(task)"
                    >
                      <UIcon name="i-heroicons-chat-bubble-left" class="w-3 h-3 mr-1" />
                      {{ task.comments.length }}
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { User, Task } from '~/types'
import { UserRole, Department, TaskStatus } from '~/types'

interface PersonaTab {
  key: string
  label: string
  icon?: string
  badge?: number
  persona: User
  tasks: Task[]
}

// Data service integration
const dataService = useDataService()

// Component state
const selectedTab = ref(0)

// Initialize data
onMounted(() => {
  dataService.initializeData()
})

// Computed properties - Filter to show only the 2 main personas as per plan
const mainPersonas = computed(() => 
  dataService.users.value.filter(user => 
    user.role === UserRole.FIELD_ENGINEER || user.role === UserRole.SITE_MANAGER
  )
)

// Create persona tabs with task counts
const personaTabs = computed<PersonaTab[]>(() => {
  return mainPersonas.value.map(persona => {
    const personaTasks = dataService.getPersonaTasks(persona)
    const assignedTasks = personaTasks.inTray.filter(task => 
      task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.CANCELLED
    )
    const pendingCount = assignedTasks.filter(task => 
      task.status === TaskStatus.ASSIGNED || task.status === TaskStatus.IN_PROGRESS
    ).length

    return {
      key: persona.id,
      label: `${persona.avatar || '👤'} ${persona.name} ${pendingCount > 0 ? `(${pendingCount})` : ''}`,
      badge: pendingCount > 0 ? pendingCount : undefined,
      persona,
      tasks: assignedTasks
    }
  })
})

// Helper methods
const formatRole = (role: UserRole): string => {
  const roleLabels: Record<UserRole, string> = {
    [UserRole.FIELD_ENGINEER]: 'Field Engineer',
    [UserRole.SITE_MANAGER]: 'Site Manager',
    [UserRole.COMPLIANCE_OFFICER]: 'Compliance Officer',
    [UserRole.PROJECT_MANAGER]: 'Project Manager',
    [UserRole.TECHNICAL_LEAD]: 'Technical Lead',
    [UserRole.OPERATIONS_MANAGER]: 'Operations Manager'
  }
  return roleLabels[role] || role
}

const formatDepartment = (department: Department): string => {
  const deptLabels: Record<Department, string> = {
    [Department.FIELD_OPERATIONS]: 'Field Operations',
    [Department.SITE_MANAGEMENT]: 'Site Management', 
    [Department.COMPLIANCE]: 'Compliance',
    [Department.PROJECT_MANAGEMENT]: 'Project Management',
    [Department.ENGINEERING]: 'Engineering',
    [Department.OPERATIONS]: 'Operations'
  }
  return deptLabels[department] || department
}

const getCreatedByName = (userId: string): string => {
  const user = dataService.getUserById(userId)
  return user ? user.name : 'Unknown'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date()
}

// Event handlers
const viewTask = (task: Task) => {
  // Placeholder for task viewing functionality
  console.log('View task:', task.id, task.title)
}

const viewComments = (task: Task) => {
  // Placeholder for comments viewing functionality  
  console.log('View comments for task:', task.id, task.comments.length)
}
</script>

<style scoped>
.workspace-dashboard {
  @apply w-full;
}
</style>