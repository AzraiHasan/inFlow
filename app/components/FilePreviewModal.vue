<template>
  <UModal 
    v-model:open="isOpen"
    :title="document?.name || 'File Preview'"
    :description="`Preview of ${document?.name || 'file'}`"
    fullscreen
  >
    <template #body>
      <div class="p-8 m-4">
        <!-- Image Preview -->
        <div v-if="isImage(document)" class="flex justify-center mb-6">
          <nuxt-img 
            :src="document?.url || ''" 
            :alt="document?.name || 'Image'"
            class="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg"
          />
        </div>
        
        <!-- PDF Preview -->
        <div v-else-if="isPDF(document)" class="w-full h-[65vh] mb-6">
          <iframe 
            :src="document?.url || ''"
            class="w-full h-full border rounded-lg shadow-sm"
            title="PDF Preview"
          />
        </div>
        
        <!-- Other File Info -->
        <div v-else class="text-center p-8 mb-6">
          <UIcon 
            name="i-heroicons-document-text" 
            class="mx-auto text-6xl text-gray-400 mb-4"
          />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ document?.name }}</h3>
          <p class="text-gray-600 mb-1">File Type: {{ document?.type }}</p>
          <p class="text-gray-600 mb-4">Size: {{ formatFileSize(document?.size || 0) }}</p>
          <p class="text-sm text-gray-500">Preview not available for this file type</p>
        </div>
      </div>
    </template>
    
    <template #footer>
      <div class="flex justify-between items-center px-8 py-6 mx-4 border-t bg-gray-50/50">
        <div class="text-sm text-gray-600">
          {{ document?.name }} • {{ formatFileSize(document?.size || 0) }}
        </div>
        <div class="flex gap-3">
          <UButton 
            variant="outline"
            @click="handleClose"
          >
            Close
          </UButton>
          <UButton 
            icon="i-heroicons-arrow-down-tray"
            @click="handleDownload"
          >
            Download
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Document } from '~/types'

interface Props {
  open: boolean
  document: Document | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const isImage = (document: Document | null) => {
  return document?.type?.startsWith('image/')
}

const isPDF = (document: Document | null) => {
  return document?.type === 'application/pdf'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleClose = () => {
  isOpen.value = false
}

const handleDownload = () => {
  if (props.document) {
    const link = document.createElement('a')
    link.href = props.document.url
    link.download = props.document.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>