<template>
  <div class="file-preview">
    <!-- Image Preview -->
    <div v-if="isImage" class="image-preview">
      <NuxtImg 
        :src="document.url" 
        :alt="document.name"
        class="max-w-full max-h-96 object-contain rounded-lg"
        loading="lazy"
      />
    </div>

    <!-- PDF Preview -->
    <div v-else-if="isPdf" class="pdf-preview">
      <iframe
        :src="document.url"
        class="w-full h-96 border rounded-lg"
        frameborder="0"
        title="PDF Preview"
      />
      <div class="mt-2 text-sm text-gray-500 text-center">
        PDF document preview
      </div>
    </div>

    <!-- Generic File Preview -->
    <div v-else class="generic-preview">
      <div class="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <UIcon :name="getFileIcon(document.type)" class="text-4xl text-gray-400 mb-2" />
        <div class="text-center">
          <p class="text-sm font-medium text-gray-900">{{ document.name }}</p>
          <p class="text-xs text-gray-500">{{ formatFileSize(document.size) }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ getFileTypeLabel(document.type) }}</p>
        </div>
        
        <!-- Download Button for Non-Previewable Files -->
        <UButton
          v-if="showDownloadButton"
          size="sm"
          variant="outline"
          class="mt-3"
          @click="downloadFile"
        >
          <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />
          Download
        </UButton>
      </div>
    </div>

    <!-- File Metadata -->
    <div v-if="showMetadata" class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span class="font-medium text-gray-700">Size:</span>
          <span class="text-gray-600 ml-1">{{ formatFileSize(document.size) }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Type:</span>
          <span class="text-gray-600 ml-1">{{ getFileTypeLabel(document.type) }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Category:</span>
          <span class="text-gray-600 ml-1">{{ formatCategory(document.category) }}</span>
        </div>
        <div>
          <span class="font-medium text-gray-700">Version:</span>
          <span class="text-gray-600 ml-1">{{ document.version }}</span>
        </div>
        <div class="col-span-2">
          <span class="font-medium text-gray-700">Uploaded:</span>
          <span class="text-gray-600 ml-1">{{ formatDate(document.uploadedAt) }}</span>
        </div>
        <div v-if="document.description" class="col-span-2">
          <span class="font-medium text-gray-700">Description:</span>
          <span class="text-gray-600 ml-1">{{ document.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '~/types'
import { DocumentCategory } from '~/types'

interface Props {
  document: Document
  showMetadata?: boolean
  showDownloadButton?: boolean
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  showMetadata: false,
  showDownloadButton: true,
  maxHeight: '24rem'
})

// File type detection
const isImage = computed(() => {
  return props.document.type.startsWith('image/')
})

const isPdf = computed(() => {
  return props.document.type === 'application/pdf'
})

// Helper methods
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (mimeType: string): string => {
  if (mimeType === 'application/pdf') return 'i-heroicons-document-text'
  if (mimeType.startsWith('image/')) return 'i-heroicons-photo'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'i-heroicons-table-cells'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'i-heroicons-presentation-chart-line'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'i-heroicons-document-text'
  if (mimeType.startsWith('video/')) return 'i-heroicons-film'
  if (mimeType.startsWith('audio/')) return 'i-heroicons-musical-note'
  return 'i-heroicons-document'
}

const getFileTypeLabel = (mimeType: string): string => {
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF Document',
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/svg+xml': 'SVG Image',
    'image/webp': 'WebP Image',
    'application/msword': 'Word Document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.ms-excel': 'Excel Spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
    'text/plain': 'Text File',
    'text/csv': 'CSV File',
    'application/json': 'JSON File',
    'text/html': 'HTML File',
    'text/css': 'CSS File',
    'application/javascript': 'JavaScript File',
    'application/zip': 'ZIP Archive',
    'video/mp4': 'MP4 Video',
    'audio/mp3': 'MP3 Audio',
    'audio/mpeg': 'MPEG Audio'
  }
  
  return typeMap[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown File'
}

const formatCategory = (category: DocumentCategory): string => {
  const categoryLabels: Record<DocumentCategory, string> = {
    [DocumentCategory.SITE_SURVEY]: 'Site Survey',
    [DocumentCategory.ENVIRONMENTAL]: 'Environmental Report',
    [DocumentCategory.SAFETY_INSPECTION]: 'Safety Inspection',
    [DocumentCategory.MAINTENANCE_REPORT]: 'Maintenance Report',
    [DocumentCategory.COMPLIANCE_DOCUMENT]: 'Compliance Document',
    [DocumentCategory.TECHNICAL_SPECIFICATION]: 'Technical Specification',
    [DocumentCategory.INSTALLATION_GUIDE]: 'Installation Guide',
    [DocumentCategory.PERMIT]: 'Permit',
    [DocumentCategory.CONTRACT]: 'Contract',
    [DocumentCategory.OTHER]: 'Other'
  }
  return categoryLabels[category] || category
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const downloadFile = () => {
  // Create a temporary link element to trigger download
  const link = document.createElement('a')
  link.href = props.document.url
  link.download = props.document.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.file-preview {
  @apply w-full;
}

.image-preview img {
  @apply shadow-md;
}

.pdf-preview iframe {
  @apply shadow-md;
}
</style>