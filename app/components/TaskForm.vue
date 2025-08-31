<template>
  <div class="space-y-4">
    <h3 class="text-base font-semibold leading-6 text-gray-900 mb-4">
      New Task
    </h3>
    
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
                  class="w-full"
                />
              </template>
            </BaseFormField>
          </div>
        </div>
        
        <BaseFormField
          label="File Attachment"
          :hint="'PDF, PNG, JPG (max. 2MB)'"
          :error="validationErrors.attachment"
        >
          <template #default>
            <UFileUpload 
              v-model="formState.attachment"
              label="Drop your file here"
              accept="image/png, image/jpeg, application/pdf"
              color="primary"
              highlight
              description="PDF, PNG, JPG (max. 2MB)"
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
        
        <div class="flex justify-end pt-4">
          <div class="flex gap-2">
            <UButton 
              v-if="props.showResetButton"
              color="error" 
              variant="outline" 
              size="xs" 
              type="button"
              @click="handleReset"
            >
              Reset Data
            </UButton>
            <UButton 
              color="primary" 
              type="submit"
              :loading="isSubmitting"
            >
              Create
            </UButton>
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">

interface TaskFormData {
  category: string | undefined
  description: string
  attachment: File | null
  note: string
}

interface ValidationErrors {
  category?: string
  description?: string
  attachment?: string
  note?: string
}

interface Props {
  showResetButton?: boolean
}

interface Emits {
  (e: 'submit', data: TaskFormData): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  showResetButton: false
})

const emit = defineEmits<Emits>()

const formState = reactive<TaskFormData>({
  category: undefined,
  description: '',
  attachment: null,
  note: ''
})

const validationErrors = ref<ValidationErrors>({})
const isSubmitting = ref(false)

const categoryOptions = [
  'LCN',
  'SAR', 
  'TP',
  'LOO',
  'TA',
  'Other'
]

const validateForm = (): boolean => {
  const errors: ValidationErrors = {}
  
  if (!formState.category) {
    errors.category = 'Category is required'
  }
  
  if (!formState.description.trim()) {
    errors.description = 'Description is required'
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
  
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    emit('submit', { ...formState })
    
    // Reset form after successful submission
    formState.category = undefined
    formState.description = ''
    formState.attachment = null
    formState.note = ''
    validationErrors.value = {}
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = () => {
  emit('reset')
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
  () => formState.attachment,
  () => {
    if (validationErrors.value.attachment) {
      validationErrors.value.attachment = undefined
    }
  }
)
</script>