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
          <div v-if="document?.url?.startsWith('data:')" class="w-full">
            <img 
              :src="document.url" 
              :alt="document?.name || 'Image'"
              class="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg mx-auto"
            />
          </div>
          <div v-else class="flex items-center justify-center h-64 border rounded-lg bg-gray-50">
            <div class="text-center p-8">
              <UIcon name="i-heroicons-photo" class="mx-auto text-6xl text-gray-400 mb-4" />
              <p class="text-gray-600 mb-2">Invalid image URL</p>
              <p class="text-sm text-gray-500">URL: {{ document?.url }}</p>
              <p class="text-xs text-red-500 mt-2">Please re-upload the image</p>
            </div>
          </div>
        </div>
        
        <!-- PDF Preview -->
        <div v-else-if="isPDF(document)" class="w-full h-[65vh] mb-6">
          <div v-if="document?.url?.startsWith('data:')" class="w-full h-full">
            <iframe 
              :src="document.url"
              class="w-full h-full border rounded-lg shadow-sm"
              title="PDF Preview"
            />
          </div>
          <div v-else class="flex items-center justify-center h-full border rounded-lg bg-gray-50">
            <div class="text-center p-8">
              <UIcon name="i-heroicons-document-text" class="mx-auto text-6xl text-gray-400 mb-4" />
              <p class="text-gray-600 mb-2">Invalid document URL</p>
              <p class="text-sm text-gray-500">URL: {{ document?.url }}</p>
              <p class="text-xs text-red-500 mt-2">Please re-upload the document</p>
            </div>
          </div>
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

// Debug logging for document preview
watch(() => props.document, (newDoc) => {
  if (newDoc) {
    console.log('FilePreviewModal DEBUG: Document received for preview:', {
      name: newDoc.name,
      type: newDoc.type,
      size: newDoc.size,
      urlType: newDoc.url?.startsWith('data:') ? 'base64' : 'other',
      urlPreview: newDoc.url?.substring(0, 100) + (newDoc.url && newDoc.url.length > 100 ? '...' : ''),
      fullUrl: newDoc.url
    })
  }
}, { immediate: true })

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
    console.log('FilePreviewModal DEBUG: Download requested for:', props.document.name)
    console.log('FilePreviewModal DEBUG: URL type:', props.document.url?.startsWith('data:') ? 'base64' : 'other')
    
    if (props.document.url?.startsWith('data:')) {
      // Handle base64 data URL download
      const link = document.createElement('a')
      link.href = props.document.url
      link.download = props.document.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      console.log('FilePreviewModal DEBUG: Base64 download initiated')
    } else {
      // Handle mock or invalid URLs
      console.warn('FilePreviewModal DEBUG: Cannot download - invalid URL:', props.document.url)
      alert('Download not available - invalid document URL. Please re-upload the document.')
    }
  }
}
</script>