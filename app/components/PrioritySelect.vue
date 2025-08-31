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
        :items="priorityOptions"
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
export type TaskPriority = 'Low' | 'Medium' | 'High'

interface Props {
  modelValue?: TaskPriority
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

interface Emits {
  (e: 'update:modelValue', value: TaskPriority | undefined): void
}

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: 'Priority',
  placeholder: 'Select priority',
  required: false,
  disabled: false,
  error: '',
  hint: ''
})

const emit = defineEmits<Emits>()

const priorityOptions: TaskPriority[] = [
  'Low',
  'Medium',
  'High'
]

const handleUpdate = (value: TaskPriority | undefined) => {
  emit('update:modelValue', value)
}
</script>