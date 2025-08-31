<template>
  <UModal 
    v-model:open="isOpen"
    title="Edit Task"
    description="Update task details"
  >
    <template #body>
      <TaskEditForm
        :task="props.task"
        @save="handleSave"
        @delete="handleDelete"
        @cancel="handleCancel"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TaskData } from '~/types'

interface Props {
  open: boolean
  task: TaskData | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'save', updatedTask: Partial<TaskData>): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const handleSave = (updatedTask: Partial<TaskData>) => {
  emit('save', updatedTask)
  isOpen.value = false
}

const handleCancel = () => {
  isOpen.value = false
}

const handleDelete = () => {
  emit('delete')
  isOpen.value = false
}
</script>