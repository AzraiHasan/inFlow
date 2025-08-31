<template>
  <UModal 
    v-model:open="isOpen"
    title="Delete Task"
    description="Are you sure you want to delete this task? This action cannot be undone."
  >
    <template #body>
      <div class="flex items-center gap-3 p-4">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-2xl" />
        <div>
          <p class="font-medium text-gray-900">Are you sure you want to delete this task?</p>
          <p class="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
        </div>
      </div>
      
      <div class="flex justify-end gap-2 px-4 pb-4">
        <UButton 
          color="neutral" 
          variant="ghost" 
          @click="handleCancel"
        >
          Cancel
        </UButton>
        <UButton 
          color="error" 
          @click="handleConfirm"
        >
          Delete
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const handleCancel = () => {
  isOpen.value = false
}

const handleConfirm = () => {
  emit('confirm')
  isOpen.value = false
}
</script>