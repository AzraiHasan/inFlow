<template>
  <UModal 
    v-model:open="isOpen"
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
            @click="handleAssign(assignee)"
          >
            {{ assignee }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TaskData } from '~/stores/demoTable'

interface Props {
  open: boolean
  task: TaskData | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'assign', assignee: string, taskId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const availableAssignees = [
  'Sarah Chen',
  'Marcus Rodriguez',  
  'Dr. Emily Watson',
  'Alex Thompson',
  'Jamie Liu',
  'Chris Park'
]

const handleAssign = (assignee: string) => {
  if (props.task) {
    emit('assign', assignee, props.task.id)
    isOpen.value = false
  }
}
</script>