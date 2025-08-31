<template>
  <BaseFormField 
    :label="label"
    :required="required" 
    :error="error"
    :hint="hint"
  >
    <template #default="{ fieldId }">
      <USelect
        :id="fieldId"
        :model-value="modelValue"
        :items="statusOptions"
        :placeholder="placeholder"
        :disabled="disabled"
        variant="outline"
        class="w-full"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180',
          content: 'w-full'
        }"
        @update:model-value="handleUpdate"
      />
    </template>
  </BaseFormField>
</template>

<script setup lang="ts">
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Scheduled' | 'On Track'

interface Props {
  modelValue?: TaskStatus
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

interface Emits {
  (e: 'update:modelValue', value: TaskStatus | undefined): void
}

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: 'Status',
  placeholder: 'Select status',
  required: false,
  disabled: false,
  error: '',
  hint: ''
})

const emit = defineEmits<Emits>()

const statusOptions: TaskStatus[] = [
  'Pending',
  'In Progress', 
  'Completed',
  'Scheduled',
  'On Track'
]

const handleUpdate = (value: TaskStatus | undefined) => {
  emit('update:modelValue', value)
}
</script>