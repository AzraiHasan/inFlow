<template>
  <div class="document-list">
    <!-- Header -->
    <div v-if="showHeader" class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Documents</h3>
        <p class="text-sm text-gray-600">{{ documents.length }} {{ documents.length === 1 ? 'document' : 'documents' }}</p>
      </div>
      <div class="flex gap-2">
        <!-- View Toggle -->
        <div class="flex border rounded-lg">
          <UButton
            size="xs"
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            class="rounded-r-none"
            @click="viewMode = 'list'"
          >
            <UIcon name="i-heroicons-list-bullet" />
          </UButton>
          <UButton
            size="xs"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            class="rounded-l-none"
            @click="viewMode = 'grid'"
          >
            <UIcon name="i-heroicons-squares-2x2" />
          </UButton>
        </div>

        <!-- Filter by Category -->
        <USelect
          v-if="showFilters"
          v-model="selectedCategory"
          :options="categoryFilterOptions"
          placeholder="All Categories"
          size="xs"
          class="w-40"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredDocuments.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-document" class="text-4xl text-gray-300 mb-2" />
      <p class="text-gray-500">{{ documents.length === 0 ? 'No documents uploaded yet' : 'No documents match your filters' }}</p>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="space-y-2">
      <div
        v-for="document in filteredDocuments"
        :key="document.id"
        class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <!-- File Icon -->
        <UIcon :name="getFileIcon(document.type)" class="text-2xl text-gray-400" />

        <!-- Document Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-medium text-gray-900 truncate">{{ document.name }}</h4>
            <UBadge :color="getCategoryColor(document.category)" variant="subtle" size="xs">
              {{ formatCategory(document.category) }}
            </UBadge>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span>{{ formatFileSize(document.size) }}</span>
            <span>{{ formatDate(document.uploadedAt) }}</span>
            <span v-if="document.description" class="truncate max-w-xs">{{ document.description }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1">
          <UButton
            size="xs"
            variant="ghost"
            @click="$emit('preview', document)"
          >
            <UIcon name="i-heroicons-eye" />
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            @click="downloadDocument(document)"
          >
            <UIcon name="i-heroicons-arrow-down-tray" />
          </UButton>
          <UButton
            v-if="canDelete"
            size="xs"
            variant="ghost"
            color="red"
            @click="$emit('delete', document)"
          >
            <UIcon name="i-heroicons-trash" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="document in filteredDocuments"
        :key="document.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="$emit('preview', document)"
      >
        <!-- Preview Thumbnail -->
        <div class="mb-3 flex items-center justify-center h-20">
          <div v-if="document.type.startsWith('image/')" class="w-full h-full">
            <NuxtImg
              :src="document.url"
              :alt="document.name"
              class="w-full h-full object-cover rounded"
              loading="lazy"
            />
          </div>
          <UIcon v-else :name="getFileIcon(document.type)" class="text-3xl text-gray-400" />
        </div>

        <!-- Document Info -->
        <div class="space-y-2">
          <h4 class="font-medium text-sm text-gray-900 truncate" :title="document.name">
            {{ document.name }}
          </h4>
          <div class="flex items-center justify-between">
            <UBadge :color="getCategoryColor(document.category)" variant="subtle" size="xs">
              {{ formatCategory(document.category) }}
            </UBadge>
            <span class="text-xs text-gray-500">{{ formatFileSize(document.size) }}</span>
          </div>
          <div class="text-xs text-gray-500">{{ formatDate(document.uploadedAt) }}</div>
        </div>

        <!-- Grid Actions -->
        <div class="mt-3 flex justify-end gap-1" @click.stop>
          <UButton
            size="xs"
            variant="ghost"
            @click="downloadDocument(document)"
          >
            <UIcon name="i-heroicons-arrow-down-tray" />
          </UButton>
          <UButton
            v-if="canDelete"
            size="xs"
            variant="ghost"
            color="red"
            @click="$emit('delete', document)"
          >
            <UIcon name="i-heroicons-trash" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '~/types'
import { DocumentCategory } from '~/types'

interface Props {
  documents: Document[]
  showHeader?: boolean
  showFilters?: boolean
  canDelete?: boolean
  defaultViewMode?: 'list' | 'grid'
}

interface Emits {
  (e: 'preview' | 'delete' | 'download', document: Document): void
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFilters: true,
  canDelete: true,
  defaultViewMode: 'list'
})

const emit = defineEmits<Emits>()

// Component state
const viewMode = ref<'list' | 'grid'>(props.defaultViewMode)
const selectedCategory = ref<DocumentCategory | ''>('')

// Filter options
const categoryFilterOptions = computed(() => [
  { label: 'All Categories', value: '' },
  { label: 'Site Survey', value: DocumentCategory.SITE_SURVEY },
  { label: 'Environmental Report', value: DocumentCategory.ENVIRONMENTAL },
  { label: 'Safety Inspection', value: DocumentCategory.SAFETY_INSPECTION },
  { label: 'Maintenance Report', value: DocumentCategory.MAINTENANCE_REPORT },
  { label: 'Compliance Document', value: DocumentCategory.COMPLIANCE_DOCUMENT },
  { label: 'Technical Specification', value: DocumentCategory.TECHNICAL_SPECIFICATION },
  { label: 'Installation Guide', value: DocumentCategory.INSTALLATION_GUIDE },
  { label: 'Permit', value: DocumentCategory.PERMIT },
  { label: 'Contract', value: DocumentCategory.CONTRACT },
  { label: 'Other', value: DocumentCategory.OTHER }
])

// Filtered documents
const filteredDocuments = computed(() => {
  let filtered = props.documents

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(doc => doc.category === selectedCategory.value)
  }

  // Sort by upload date (newest first)
  return filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
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

const formatCategory = (category: DocumentCategory): string => {
  const categoryLabels: Record<DocumentCategory, string> = {
    [DocumentCategory.SITE_SURVEY]: 'Site Survey',
    [DocumentCategory.ENVIRONMENTAL]: 'Environmental',
    [DocumentCategory.SAFETY_INSPECTION]: 'Safety',
    [DocumentCategory.MAINTENANCE_REPORT]: 'Maintenance',
    [DocumentCategory.COMPLIANCE_DOCUMENT]: 'Compliance',
    [DocumentCategory.TECHNICAL_SPECIFICATION]: 'Technical',
    [DocumentCategory.INSTALLATION_GUIDE]: 'Installation',
    [DocumentCategory.PERMIT]: 'Permit',
    [DocumentCategory.CONTRACT]: 'Contract',
    [DocumentCategory.OTHER]: 'Other'
  }
  return categoryLabels[category] || category
}

const getCategoryColor = (category: DocumentCategory): string => {
  const categoryColors: Record<DocumentCategory, string> = {
    [DocumentCategory.SITE_SURVEY]: 'blue',
    [DocumentCategory.ENVIRONMENTAL]: 'green',
    [DocumentCategory.SAFETY_INSPECTION]: 'red',
    [DocumentCategory.MAINTENANCE_REPORT]: 'orange',
    [DocumentCategory.COMPLIANCE_DOCUMENT]: 'purple',
    [DocumentCategory.TECHNICAL_SPECIFICATION]: 'cyan',
    [DocumentCategory.INSTALLATION_GUIDE]: 'indigo',
    [DocumentCategory.PERMIT]: 'yellow',
    [DocumentCategory.CONTRACT]: 'pink',
    [DocumentCategory.OTHER]: 'gray'
  }
  return categoryColors[category] || 'gray'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const downloadDocument = (document: Document) => {
  // Create a temporary link element to trigger download
  const link = document.createElement('a')
  link.href = document.url
  link.download = document.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  emit('download', document)
}
</script>