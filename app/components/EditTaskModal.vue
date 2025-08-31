<template>
  <UModal 
    v-model:open="isOpen"
    title="Edit Task"
    description="Update task details"
  >
    <template #body>
      <UForm :state="formState">
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <UInput 
                v-model="formState.category"
                placeholder="Enter task category"
              />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <UInput 
                v-model="formState.description"
                placeholder="Enter task description"
              />
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <USelect
                v-model="formState.status"
                :items="statusOptions"
                placeholder="Select status"
                variant="outline"
                class="w-full"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180',
                  content: 'w-full'
                }"
              />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <USelect
                v-model="formState.priority"
                :items="priorityOptions"
                placeholder="Select priority"
                variant="outline"
                class="w-full"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180',
                  content: 'w-full'
                }"
              />
            </div>
          </div>
          
          <UTextarea 
            v-model="formState.note"
            label="Additional note (optional):"
            placeholder="Enter additional notes..."
            class="w-full"
          />
          
          <div class="flex justify-between pt-4">
            <UButton 
              color="error" 
              variant="outline" 
              @click="handleDelete"
            >
              Delete
            </UButton>
            <div class="flex gap-2">
              <UButton 
                color="neutral" 
                @click="handleCancel"
              >
                Cancel
              </UButton>
              <UButton 
                color="primary" 
                @click="handleSave"
              >
                Save
              </UButton>
            </div>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { TaskData } from '~/stores/demoTable'

type TaskStatus = 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track'
type TaskPriority = 'High' | 'Medium' | 'Low'

interface Props {
  open: boolean
  task: TaskData | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'save', updatedTask: Partial<TaskData>): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const formState = reactive({
  category: '',
  description: '',
  status: undefined as TaskStatus | undefined,
  priority: undefined as TaskPriority | undefined,
  note: ''
})

const statusOptions: TaskStatus[] = [
  'Pending',
  'In Progress', 
  'Completed',
  'Scheduled',
  'On Track'
]

const priorityOptions: TaskPriority[] = [
  'Low',
  'Medium',
  'High'
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
  }
}, { immediate: true })

const handleSave = () => {
  if (props.task && 
      formState.category.trim() && 
      formState.description.trim() &&
      formState.status &&
      formState.priority) {
    
    const updatedTask = {
      ...props.task,
      task: `${formState.category}: ${formState.description}`,
      status: formState.status,
      priority: formState.priority,
      note: formState.note
    }
    
    emit('save', updatedTask)
    isOpen.value = false
  }
}

const handleCancel = () => {
  isOpen.value = false
}

const handleDelete = () => {
  emit('delete')
}
</script>