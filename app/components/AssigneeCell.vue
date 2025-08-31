<template>
  <div>
    <UButton
      v-if="!task.assignee"
      variant="outline"
      size="xs"
      @click="handleAssign"
    >
      Assign
    </UButton>
    <span 
      v-else
      class="text-sm text-gray-700"
    >
      {{ task.assignee }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { TaskData } from '~/types'

interface Props {
  task: TaskData
}

interface Emits {
  (e: 'assign', taskId: string): void
}

const { task } = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleAssign = () => {
  emit('assign', task.id)
}
</script>