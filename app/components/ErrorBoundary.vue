<template>
  <div v-if="hasError" :class="errorContainerClass">
    <div class="text-center max-w-md mx-auto">
      <!-- Error Icon -->
      <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full">
        <UIcon 
          name="i-heroicons-exclamation-triangle-20-solid" 
          class="w-10 h-10 text-red-500"
        />
      </div>

      <!-- Error Heading -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        {{ errorTitle }}
      </h3>

      <!-- Error Message -->
      <p class="text-sm text-gray-500 mb-6">
        {{ errorMessage }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <UButton 
          variant="solid" 
          color="primary" 
          :loading="isRetrying"
          @click="retry"
        >
          {{ retryButtonText }}
        </UButton>
        
        <UButton 
          v-if="showReloadButton"
          variant="outline" 
          color="gray"
          @click="reloadPage"
        >
          Reload Page
        </UButton>
      </div>

      <!-- Debug Info (development only) -->
      <details v-if="showDebugInfo && errorDetails" class="mt-6 text-left">
        <summary class="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
          Technical Details
        </summary>
        <pre class="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-32">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>

  <!-- Normal content when no error -->
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  errorTitle?: string
  errorMessage?: string
  retryButtonText?: string
  showReloadButton?: boolean
  showDebugInfo?: boolean
  fallbackComponent?: string
  onRetry?: () => void | Promise<void>
}

const { 
  errorTitle = 'Something went wrong',
  errorMessage = 'An unexpected error occurred. Please try again or reload the page.',
  retryButtonText = 'Try Again',
  showReloadButton = true,
  showDebugInfo = import.meta.dev,
  onRetry
} = defineProps<Props>()

const emit = defineEmits<{
  error: [error: Error, instance: unknown]
  retry: []
}>()

const hasError = ref(false)
const errorDetails = ref<string>('')
const isRetrying = ref(false)

const errorContainerClass = computed(() => [
  'flex items-center justify-center min-h-[200px] p-6'
])

// Capture errors from child components
onErrorCaptured((error: Error, instance: unknown, info: string) => {
  console.error('ErrorBoundary caught an error:', error)
  console.error('Component instance:', instance)
  console.error('Error info:', info)

  hasError.value = true
  
  // Store error details for debugging
  errorDetails.value = `Error: ${error.message}\n\nStack: ${error.stack}\n\nComponent Info: ${info}`
  
  // Emit error event
  emit('error', error, instance)

  // Prevent the error from propagating further
  return false
})

// Watch for route changes to reset error state
const route = useRoute()
watch(() => route.fullPath, () => {
  if (hasError.value) {
    hasError.value = false
    errorDetails.value = ''
  }
})

const retry = async () => {
  isRetrying.value = true
  
  try {
    // Reset error state
    hasError.value = false
    errorDetails.value = ''
    
    // Call custom retry handler if provided
    if (onRetry) {
      await onRetry()
    }
    
    emit('retry')
    
    // Small delay to allow re-rendering
    await nextTick()
    
  } catch (error) {
    console.error('Error during retry:', error)
    // Re-enable error state if retry fails
    hasError.value = true
  } finally {
    isRetrying.value = false
  }
}

const reloadPage = () => {
  if (import.meta.client) {
    window.location.reload()
  }
}

// Expose methods for parent components
defineExpose({
  hasError: readonly(hasError),
  retry,
  clearError: () => {
    hasError.value = false
    errorDetails.value = ''
  }
})
</script>