<template>
  <div class="persona-selector">
    <!-- Compact Mode (Default) -->
    <div v-if="!expanded" class="compact-mode">
      <UButton
        variant="outline"
        size="lg"
        class="w-full justify-start"
        @click="expanded = true"
      >
        <div class="flex items-center gap-3">
          <div class="text-2xl">{{ currentPersona?.avatar || '👤' }}</div>
          <div class="text-left">
            <div class="font-semibold">{{ currentPersona?.name || 'Select Persona' }}</div>
            <div class="text-xs text-gray-500">{{ formatRole(currentPersona?.role) }}</div>
          </div>
        </div>
        <UIcon name="i-heroicons-chevron-down" class="ml-auto" />
      </UButton>
    </div>

    <!-- Expanded Mode -->
    <div v-else class="expanded-mode">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" />
              <h3 class="text-lg font-semibold">Switch Persona</h3>
            </div>
            <UButton
              size="xs"
              variant="ghost"
              @click="expanded = false"
            >
              <UIcon name="i-heroicons-x-mark" />
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Current Persona Info -->
          <div v-if="currentPersona" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-3 mb-2">
              <div class="text-2xl">{{ currentPersona.avatar }}</div>
              <div class="flex-1">
                <h4 class="font-semibold text-blue-900">{{ currentPersona.name }}</h4>
                <p class="text-sm text-blue-700">{{ formatRole(currentPersona.role) }}</p>
                <p class="text-xs text-blue-600">{{ formatDepartment(currentPersona.department) }}</p>
              </div>
              <UBadge color="blue" variant="solid" size="xs">Current</UBadge>
            </div>
            <div class="text-sm text-blue-700">
              {{ getPersonaDescription(currentPersona) }}
            </div>
          </div>

          <!-- Available Personas -->
          <div class="space-y-2">
            <h5 class="text-sm font-medium text-gray-700 mb-2">Available Personas</h5>
            <div
              v-for="persona in availablePersonas"
              :key="persona.id"
              class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50"
              :class="{ 'bg-gray-50 border-gray-300': persona.id === currentPersona?.id }"
              @click="selectPersona(persona)"
            >
              <div class="text-2xl">{{ persona.avatar }}</div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">{{ persona.name }}</h4>
                <p class="text-sm text-gray-600">{{ formatRole(persona.role) }}</p>
                <p class="text-xs text-gray-500">{{ formatDepartment(persona.department) }}</p>
              </div>
              <div class="flex items-center gap-2">
                <UBadge
                  :color="getDepartmentColor(persona.department)"
                  variant="subtle"
                  size="xs"
                >
                  {{ formatDepartment(persona.department) }}
                </UBadge>
                <UIcon
                  v-if="persona.id === currentPersona?.id"
                  name="i-heroicons-check-circle"
                  class="text-green-500"
                />
              </div>
            </div>
          </div>

          <!-- Stats for Current Persona -->
          <div v-if="showStats && currentPersona" class="pt-4 border-t">
            <h5 class="text-sm font-medium text-gray-700 mb-3">{{ currentPersona.name }}'s Tasks</h5>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center p-2 bg-blue-50 rounded">
                <div class="text-lg font-bold text-blue-600">{{ personaStats.assigned }}</div>
                <div class="text-xs text-blue-600">Assigned</div>
              </div>
              <div class="text-center p-2 bg-green-50 rounded">
                <div class="text-lg font-bold text-green-600">{{ personaStats.created }}</div>
                <div class="text-xs text-green-600">Created</div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div v-if="showQuickActions" class="pt-4 border-t">
            <div class="flex gap-2">
              <UButton
                size="xs"
                variant="outline"
                class="flex-1"
                @click="resetToDemo"
              >
                <UIcon name="i-heroicons-arrow-path" class="mr-1" />
                Reset Demo
              </UButton>
              <UButton
                size="xs"
                variant="ghost"
                class="flex-1"
                @click="expanded = false"
              >
                Close
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { Department, UserRole } from '~/types'

interface Props {
  showStats?: boolean
  showQuickActions?: boolean
  autoClose?: boolean
}

interface Emits {
  (e: 'persona-changed', persona: User): void
  (e: 'reset-demo'): void
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true,
  showQuickActions: true,
  autoClose: true
})

const emit = defineEmits<Emits>()

// Data service integration
const dataService = useDataService()
const workflowStore = useWorkflowStore()

// Component state
const expanded = ref(false)

// Computed properties
const currentPersona = computed(() => dataService.currentPersona.value)
const availablePersonas = computed(() => dataService.users.value)
const allTasks = computed(() => dataService.tasks.value)

// Persona statistics
const personaStats = computed(() => {
  if (!currentPersona.value) return { assigned: 0, created: 0 }
  
  const assigned = allTasks.value.filter(task => task.assigneeId === currentPersona.value!.id).length
  const created = allTasks.value.filter(task => task.createdBy === currentPersona.value!.id).length
  
  return { assigned, created }
})

// Methods
const selectPersona = (persona: User) => {
  if (persona.id === currentPersona.value?.id) return
  
  // Update persona through store for proper state management
  workflowStore.setPersona(persona)
  
  emit('persona-changed', persona)
  
  if (props.autoClose) {
    expanded.value = false
  }
}

const resetToDemo = () => {
  dataService.resetToDemo()
  workflowStore.initialize()
  
  emit('reset-demo')
  
  if (props.autoClose) {
    expanded.value = false
  }
}

// Helper methods
const formatRole = (role?: UserRole): string => {
  if (!role) return 'Unknown Role'
  
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

const formatDepartment = (department?: Department): string => {
  if (!department) return 'Unknown Department'
  
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

const getDepartmentColor = (department: Department): string => {
  const colors: Record<Department, string> = {
    [Department.FIELD_OPERATIONS]: 'blue',
    [Department.SITE_MANAGEMENT]: 'green',
    [Department.COMPLIANCE]: 'purple',
    [Department.PROJECT_MANAGEMENT]: 'orange',
    [Department.ENGINEERING]: 'cyan',
    [Department.OPERATIONS]: 'pink'
  }
  return colors[department] || 'gray'
}

const getPersonaDescription = (persona: User): string => {
  const descriptions: Record<string, string> = {
    'user-1': 'Responsible for on-site field operations, equipment installation, and technical troubleshooting.',
    'user-2': 'Manages site operations, coordinates teams, and ensures project timelines are met.',
    'user-3': 'Ensures regulatory compliance, environmental standards, and safety protocols.',
    'user-4': 'Oversees project planning, resource allocation, and stakeholder communication.',
    'user-5': 'Leads technical design, system architecture, and engineering standards.',
    'user-6': 'Manages operational workflows, optimization, and performance metrics.'
  }
  return descriptions[persona.id] || 'Team member responsible for various operational tasks.'
}

// Initialize store on mount
onMounted(() => {
  workflowStore.initialize()
})

// Close on escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && expanded.value) {
    expanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.persona-selector {
  @apply w-full;
}

.compact-mode {
  @apply w-full;
}

.expanded-mode {
  @apply w-full;
}
</style>