<template>
  <div>
    <span 
      v-if="documents.length === 0"
      class="text-gray-400 text-sm"
    >
      No files
    </span>
    <div 
      v-else
      class="space-y-1"
    >
      <div 
        v-for="doc in documents"
        :key="doc.id"
        class="flex items-center space-x-2"
      >
        <UIcon 
          :name="getFileIcon(doc.type)" 
          class="w-4 h-4 text-gray-500"
        />
        <button
          :title="doc.name"
          class="text-xs text-blue-600 hover:underline truncate max-w-[100px] cursor-pointer"
          @click="handlePreview(doc)"
        >
          {{ doc.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskData } from '~/stores/demoTable'
import type { Document } from '~/types'

interface Props {
  task: TaskData
}

interface Emits {
  (e: 'preview', document: Document): void
}

const { task } = defineProps<Props>()
const emit = defineEmits<Emits>()

const dataService = useDataService()

// Filter documents for this specific task
const documents = computed(() => {
  return dataService.documents.value.filter(doc => 
    doc.description?.includes(`demo-task-${task.id}`)
  )
})

const getFileIcon = (fileType: string): string => {
  if (fileType.includes('image')) {
    return 'i-heroicons-photo'
  }
  return 'i-heroicons-document-text'
}

const handlePreview = (document: Document) => {
  emit('preview', document)
}
</script>