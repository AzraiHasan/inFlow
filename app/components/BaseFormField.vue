<template>
  <div class="space-y-1">
    <label 
      v-if="label" 
      :for="fieldId"
      class="block text-sm font-medium text-gray-700"
      :class="labelClass"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="relative">
      <slot 
        :field-id="fieldId"
        :is-required="required"
        :has-error="hasError"
      />
    </div>
    <p 
      v-if="error" 
      :id="`${fieldId}-error`"
      class="text-sm text-red-600"
    >
      {{ error }}
    </p>
    <p 
      v-else-if="hint" 
      :id="`${fieldId}-hint`"
      class="text-sm text-gray-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  labelClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: '',
  hint: '',
  labelClass: ''
})

const fieldId = useId()
const hasError = computed(() => Boolean(props.error))
</script>