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
import { watch, nextTick } from 'vue'

interface Props {
  task: TaskData
}

interface Emits {
  (e: 'preview', document: Document): void
}

const { task } = defineProps<Props>()
const emit = defineEmits<Emits>()

const dataService = useDataService()

// Force refresh mechanism - define before use
const refreshKey = ref(0)

// Filter documents for this specific task
const documents = computed(() => {
  // Include refreshKey to force reactivity
  refreshKey.value
  
  const searchPattern = `Attachment for demo-task-${task.id}`
  const timestamp = new Date().toISOString()
  console.log(`FileAttachmentsCell DEBUG [${timestamp}]: COMPUTED RE-RUN for task ${task.id} (refresh: ${refreshKey.value})`)
  console.log('FileAttachmentsCell DEBUG: Search pattern:', searchPattern)
  console.log('FileAttachmentsCell DEBUG: Available documents:', dataService.documents.value.length)
  console.log('FileAttachmentsCell DEBUG: All document descriptions:', dataService.documents.value.map(d => d.description))
  
  const filtered = dataService.documents.value.filter(doc => {
    const matches = doc.description?.includes(searchPattern)
    console.log('FileAttachmentsCell DEBUG: Document description:', doc.description, 'matches:', matches)
    return matches
  })
  
  console.log('FileAttachmentsCell DEBUG: Filtered documents count:', filtered.length)
  return filtered
})
const forceRefresh = () => {
  refreshKey.value++
  console.log(`FileAttachmentsCell DEBUG: Force refresh triggered for task ${task.id}`)
}

// Watch documents changes for this specific task
watch(() => dataService.documents.value.length, (newLength, oldLength) => {
  console.log(`FileAttachmentsCell DEBUG: Documents length changed from ${oldLength} to ${newLength} for task ${task.id}`)
  
  // Force refresh when documents are added
  if (newLength > (oldLength || 0)) {
    nextTick(() => {
      forceRefresh()
    })
  }
}, { immediate: true })

// Watch the documents array directly for reactivity
watch(() => dataService.documents.value, (newDocs, oldDocs) => {
  console.log(`FileAttachmentsCell DEBUG: Documents array changed for task ${task.id}`)
  console.log(`FileAttachmentsCell DEBUG: New docs length: ${newDocs?.length}, Old docs length: ${oldDocs?.length}`)
  forceRefresh()
}, { deep: true })

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