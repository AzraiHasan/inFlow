<template>
  <UCard class="w-full max-w-2xl">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-cloud-arrow-up-20-solid" />
        <h3 class="text-lg font-semibold">Upload Document</h3>
      </div>
    </template>

    <div class="space-y-6">
      <!-- File Upload -->
      <div>
        <label class="block text-sm font-medium mb-2">Select File</label>
        <UFileUpload
          v-model="selectedFiles"
          :accept="acceptedFileTypes"
          :max-size="maxFileSize"
          :multiple="false"
          @change="handleFileChange"
        >
          <template #default="{ open }">
            <UButton variant="outline" class="w-full justify-center" @click="open">
              <UIcon name="i-heroicons-document-plus" class="mr-2" />
              Choose File
            </UButton>
          </template>
        </UFileUpload>
        <p class="text-xs text-gray-500 mt-2">
          Accepted formats: PDF, JPEG, PNG. Maximum size: {{ formatFileSize(maxFileSize) }}
        </p>
      </div>

      <!-- Selected File Preview -->
      <div v-if="selectedFile" class="p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-3">
          <UIcon :name="getFileIcon(selectedFile.type)" class="text-2xl" />
          <div class="flex-1">
            <p class="font-medium">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
          </div>
          <UButton
            size="xs"
            color="red"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="removeFile"
          />
        </div>
      </div>

      <!-- Document Category -->
      <div>
        <label class="block text-sm font-medium mb-2">Document Category</label>
        <USelect
          v-model="selectedCategory"
          :options="categoryOptions"
          placeholder="Select a category"
          size="lg"
        />
      </div>

      <!-- Document Description -->
      <div>
        <label class="block text-sm font-medium mb-2">Description</label>
        <UTextarea
          v-model="description"
          placeholder="Provide a brief description of this document..."
          :rows="3"
          size="lg"
        />
      </div>

      <!-- Upload Button -->
      <div class="flex justify-end gap-3">
        <UButton variant="ghost" @click="cancelUpload">
          Cancel
        </UButton>
        <UButton
          :disabled="!canUpload"
          :loading="isUploading"
          @click="handleUpload"
        >
          <UIcon name="i-heroicons-cloud-arrow-up" class="mr-2" />
          Upload Document
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { DocumentCategory } from '~/types'
import type { Document } from '~/types'

interface Props {
  taskId?: string
}

interface Emits {
  (e: 'uploaded', document: Document): void
  (e: 'cancelled'): void
}

const props = withDefaults(defineProps<Props>(), {
  taskId: ''
})

const emit = defineEmits<Emits>()

// Data service integration
const { addDocument, currentPersona } = useDataService()

// File upload state
const selectedFiles = ref<File[]>([])
const selectedCategory = ref<DocumentCategory>()
const description = ref('')
const isUploading = ref(false)

// File validation
const acceptedFileTypes = 'application/pdf,image/jpeg,image/png'
const maxFileSize = 10 * 1024 * 1024 // 10MB

// Computed properties
const selectedFile = computed(() => selectedFiles.value[0] || null)
const canUpload = computed(() => 
  selectedFile.value && 
  selectedCategory.value && 
  description.value.trim().length > 0 &&
  props.taskId &&
  !isUploading.value
)

// Category options for dropdown
const categoryOptions = computed(() => [
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

// Methods
const handleFileChange = (files: File[]) => {
  selectedFiles.value = files
}

const removeFile = () => {
  selectedFiles.value = []
}

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
  return 'i-heroicons-document'
}

const handleUpload = async () => {
  if (!canUpload.value || !selectedFile.value || !selectedCategory.value || !props.taskId) return

  isUploading.value = true
  
  try {
    // Create a data URL for the file (in a real app, you'd upload to a server)
    const reader = new FileReader()
    const fileData = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(selectedFile.value!)
    })

    // Create document data (omit id and uploadedAt as required by addDocument)
    const documentData = {
      name: selectedFile.value.name,
      type: selectedFile.value.type,
      size: selectedFile.value.size,
      category: selectedCategory.value,
      description: description.value.trim(),
      uploadedBy: currentPersona.value?.id || 'unknown-user',
      version: 1,
      url: fileData, // In production, this would be the server URL
      versions: []
    }

    // Add document using data service
    const newDocument = addDocument(props.taskId, documentData)
    
    emit('uploaded', newDocument)
    resetForm()

  } catch (error) {
    console.error('Upload failed:', error)
    // In a real app, you'd show a proper error notification
  } finally {
    isUploading.value = false
  }
}

const cancelUpload = () => {
  resetForm()
  emit('cancelled')
}

const resetForm = () => {
  selectedFiles.value = []
  selectedCategory.value = undefined
  description.value = ''
  isUploading.value = false
}
</script>