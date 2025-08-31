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
                <UInput 
                  :id="fieldId"
                  v-model="formState.category"
                  placeholder="Enter task category"
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
import type { TaskData } from '~/stores/demoTable'
import type { TaskStatus } from './StatusSelect.vue'
import type { TaskPriority } from './PrioritySelect.vue'

interface TaskEditFormData {
  category: string
  description: string
  status: TaskStatus | undefined
  priority: TaskPriority | undefined
  note: string
}

interface ValidationErrors {
  category?: string
  description?: string
  status?: string
  priority?: string
  note?: string
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
  note: ''
})

const validationErrors = ref<ValidationErrors>({})
const isSubmitting = ref(false)

// Watch for task changes to populate form
watch(() => props.task, (newTask) => {
  if (newTask) {
    const [category, description] = newTask.task.split(': ')
    formState.category = category || ''
    formState.description = description || newTask.task
    formState.status = newTask.status
    formState.priority = newTask.priority
    formState.note = newTask.note || ''
    
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
</script>