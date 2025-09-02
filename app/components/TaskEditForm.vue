<template>
  <div class="space-y-4">
    <UForm :state="formState" @submit="handleSubmit">
      <div class="space-y-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <BaseFormField
              label="Category"
              required
              :error="validationErrors.category"
            >
              <template #default="{ fieldId }">
                <USelect
                  :id="fieldId"
                  v-model="formState.category"
                  :items="categoryOptions"
                  placeholder="Choose a category..."
                  variant="outline"
                  class="w-full"
                  :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180',
                    content: 'w-full'
                  }"
                />
              </template>
            </BaseFormField>
          </div>
          
          <div class="flex-1">
            <BaseFormField
              label="Description"
              required
              :error="validationErrors.description"
            >
              <template #default="{ fieldId }">
                <UInput 
                  :id="fieldId"
                  v-model="formState.description"
                  placeholder="Enter task description"
                />
              </template>
            </BaseFormField>
          </div>
        </div>
        
        <div class="flex gap-4">
          <div class="flex-1">
            <StatusSelect
              v-model="formState.status"
              required
              :error="validationErrors.status"
            />
          </div>
          
          <div class="flex-1">
            <PrioritySelect
              v-model="formState.priority"
              required
              :error="validationErrors.priority"
            />
          </div>
        </div>
        
        <!-- Existing Attachments Display -->
        <div v-if="formState.existingAttachments.length > 0" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Current Files</label>
          <div class="space-y-2">
            <div 
              v-for="doc in formState.existingAttachments"
              :key="doc.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
            >
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="getFileIcon(doc.type)" 
                  class="w-4 h-4 text-gray-500"
                />
                <span class="text-sm text-gray-700 truncate max-w-[200px]">{{ doc.name }}</span>
                <span class="text-xs text-gray-500">({{ formatFileSize(doc.size) }})</span>
              </div>
              <UButton 
                variant="ghost" 
                size="xs" 
                color="error"
                @click="removeExistingAttachment(doc.id)"
              >
                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
        </div>
        
        <!-- File Upload Section -->
        <BaseFormField
          label="File Attachment"
          :hint="formState.existingAttachments.length > 0 ? 'Upload new file to replace existing attachments' : 'PDF, PNG, JPG (max. 2MB)'"
          :error="validationErrors.attachment"
        >
          <template #default>
            <UFileUpload 
              v-model="formState.attachment"
              label="Drop your file here"
              accept="image/png, image/jpeg, application/pdf"
              color="primary"
              highlight
              :description="formState.existingAttachments.length > 0 ? 'New file will replace existing attachments' : 'PDF, PNG, JPG (max. 2MB)'"
              @update:model-value="handleFileChange"
            />
          </template>
        </BaseFormField>
        
        <BaseFormField
          label="Additional note (optional)"
          :error="validationErrors.note"
        >
          <template #default="{ fieldId }">
            <UTextarea 
              :id="fieldId"
              v-model="formState.note"
              placeholder="Enter additional notes..."
              class="w-full"
            />
          </template>
        </BaseFormField>
        
        <div class="flex justify-between pt-4">
          <UButton 
            v-if="showDeleteButton"
            color="error" 
            variant="outline"
            type="button"
            @click="handleDelete"
          >
            Delete
          </UButton>
          <div class="flex gap-2 ml-auto">
            <UButton 
              color="neutral"
              type="button" 
              @click="handleCancel"
            >
              Cancel
            </UButton>
            <UButton 
              color="primary" 
              type="submit"
              :loading="isSubmitting"
            >
              Save
            </UButton>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { TaskData, Document } from '~/types'
import { DocumentCategory } from '~/types'
import type { TaskStatus } from './StatusSelect.vue'
import type { TaskPriority } from './PrioritySelect.vue'

interface TaskEditFormData {
  category: string
  description: string
  status: TaskStatus | undefined
  priority: TaskPriority | undefined
  note: string
  attachment: File | null
  existingAttachments: Document[]
}

interface ValidationErrors {
  category?: string
  description?: string
  status?: string
  priority?: string
  note?: string
  attachment?: string
}

interface Props {
  task?: TaskData | null
  showDeleteButton?: boolean
}

interface Emits {
  (e: 'save', updatedTask: Partial<TaskData>): void
  (e: 'delete' | 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
  showDeleteButton: true
})

const emit = defineEmits<Emits>()

const formState = reactive<TaskEditFormData>({
  category: '',
  description: '',
  status: undefined,
  priority: undefined,
  note: '',
  attachment: null,
  existingAttachments: []
})

const validationErrors = ref<ValidationErrors>({})
const isSubmitting = ref(false)

// Data service for managing documents
const dataService = useDataService()

// File change handler
const handleFileChange = (file: File | null) => {
  console.log('TaskEditForm DEBUG: File change detected')
  console.log('TaskEditForm DEBUG: File object type:', typeof file)
  console.log('TaskEditForm DEBUG: File:', file)
  
  if (file) {
    console.log('TaskEditForm DEBUG: Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    })
    formState.attachment = file
  } else {
    console.log('TaskEditForm DEBUG: No file selected or files cleared')
    formState.attachment = null
  }
}

// Get file icon based on type
const getFileIcon = (fileType: string): string => {
  if (fileType.includes('image')) {
    return 'i-heroicons-photo'
  }
  return 'i-heroicons-document-text'
}

// Format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Remove existing attachment
const removeExistingAttachment = (documentId: string) => {
  console.log('TaskEditForm DEBUG: Removing attachment with ID:', documentId)
  // Remove from local state
  formState.existingAttachments = formState.existingAttachments.filter(doc => doc.id !== documentId)
  // Remove from data service
  dataService.deleteDocument(documentId)
}

const categoryOptions = [
  'LCN',
  'SAR', 
  'TP',
  'LOO',
  'TA',
  'Other'
]

// Watch for task changes to populate form
watch(() => props.task, (newTask) => {
  if (newTask) {
    const [category, description] = newTask.task.split(': ')
    formState.category = category || ''
    formState.description = description || newTask.task
    formState.status = newTask.status
    formState.priority = newTask.priority
    formState.note = newTask.note || ''
    
    // Load existing attachments for this task
    const demoPattern = `Attachment for demo-task-${newTask.id}`
    const workflow2Pattern = `Attachment for workflow2-task-${newTask.id}`
    
    console.log('TaskEditForm DEBUG: Loading attachments for task', newTask.id)
    console.log('TaskEditForm DEBUG: Searching patterns:', demoPattern, workflow2Pattern)
    
    const existingAttachments = dataService.documents.value.filter(doc => 
      doc.description?.includes(demoPattern) || doc.description?.includes(workflow2Pattern)
    )
    
    console.log('TaskEditForm DEBUG: Found attachments:', existingAttachments.length)
    formState.existingAttachments = existingAttachments
    
    // Reset new attachment when task changes
    formState.attachment = null
    
    // Clear validation errors when task changes
    validationErrors.value = {}
  }
}, { immediate: true })

const validateForm = (): boolean => {
  const errors: ValidationErrors = {}
  
  if (!formState.category.trim()) {
    errors.category = 'Category is required'
  }
  
  if (!formState.description.trim()) {
    errors.description = 'Description is required'
  }
  
  if (!formState.status) {
    errors.status = 'Status is required'
  }
  
  if (!formState.priority) {
    errors.priority = 'Priority is required'
  }
  
  // File size validation (2MB limit)
  if (formState.attachment && formState.attachment.size > 2 * 1024 * 1024) {
    errors.attachment = 'File size must be less than 2MB'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  
  if (!props.task || !validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Process file attachment if present
    console.log('TaskEditForm DEBUG: Checking for attachment, formState.attachment:', formState.attachment)
    if (formState.attachment) {
      try {
        const file = formState.attachment
        console.log('TaskEditForm DEBUG: Processing attachment:', {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified
        })
        
        // Determine the task prefix based on current task patterns
        const isWorkflow2 = formState.existingAttachments.some(doc => 
          doc.description?.includes('workflow2-task-')
        )
        const taskPrefix = isWorkflow2 ? 'workflow2-task' : 'demo-task'
        
        // If we're uploading a new file, remove existing attachments first (replacement behavior)
        if (formState.existingAttachments.length > 0) {
          console.log('TaskEditForm DEBUG: Removing existing attachments for replacement')
          formState.existingAttachments.forEach(doc => {
            dataService.deleteDocument(doc.id)
          })
        }
        
        // Create document data for the new attachment
        const documentData = {
          name: file.name,
          type: file.type,
          size: file.size,
          category: DocumentCategory.SITE_SURVEY, // Default category, could be made configurable
          description: `Attachment for ${taskPrefix}-${props.task.id}`,
          uploadedBy: 'Current User', // This should ideally come from user context
          uploadedAt: new Date().toISOString(),
          url: `mock-url-for-${file.name}` // In a real app, this would be the actual uploaded file URL
        }
        
        // Add document to data service (this will persist to localStorage)
        const addedDoc = dataService.addDocument(`${taskPrefix}-${props.task.id}`, documentData)
        console.log('TaskEditForm DEBUG: File attachment stored successfully with ID:', addedDoc.id)
        console.log('TaskEditForm DEBUG: Document description stored as:', addedDoc.description)
        
      } catch (error) {
        console.error('TaskEditForm DEBUG ERROR: Processing file attachment failed:', error)
        console.error('TaskEditForm DEBUG ERROR: Stack trace:', error instanceof Error ? error.stack : String(error))
      }
    } else {
      console.log('TaskEditForm DEBUG: No attachment found in formState')
    }
    
    const updatedTask: Partial<TaskData> = {
      ...props.task,
      task: `${formState.category}: ${formState.description}`,
      status: formState.status!,
      priority: formState.priority!,
      note: formState.note
    }
    
    emit('save', updatedTask)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Reset validation errors
  validationErrors.value = {}
  emit('cancel')
}

const handleDelete = () => {
  emit('delete')
}

// Clear validation errors when form values change
watch(
  () => formState.category,
  () => {
    if (validationErrors.value.category) {
      validationErrors.value.category = undefined
    }
  }
)

watch(
  () => formState.description,
  () => {
    if (validationErrors.value.description) {
      validationErrors.value.description = undefined
    }
  }
)

watch(
  () => formState.status,
  () => {
    if (validationErrors.value.status) {
      validationErrors.value.status = undefined
    }
  }
)

watch(
  () => formState.priority,
  () => {
    if (validationErrors.value.priority) {
      validationErrors.value.priority = undefined
    }
  }
)

watch(
  () => formState.attachment,
  (newFile, oldFile) => {
    console.log('TaskEditForm DEBUG: Attachment watcher triggered')
    console.log('TaskEditForm DEBUG: Old file:', oldFile?.name || 'null')
    console.log('TaskEditForm DEBUG: New file:', newFile?.name || 'null')
    
    if (validationErrors.value.attachment) {
      validationErrors.value.attachment = undefined
    }
  }
)
</script>