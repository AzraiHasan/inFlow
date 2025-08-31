<template>
  <div class="flex items-center space-x-2">
    <UButton
      variant="ghost"
      size="xs"
      @click="handleEdit"
    >
      <UIcon 
        name="i-heroicons-pencil"
        class="w-4 h-4"
      />
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { TaskData } from '~/types'

interface Props {
  task: TaskData
}

interface Emits {
  (e: 'edit', taskId: string): void
}

const { task } = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleEdit = () => {
  emit('edit', task.id)
}
</script>