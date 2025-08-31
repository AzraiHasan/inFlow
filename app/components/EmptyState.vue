<template>
  <div :class="containerClass">
    <div class="flex flex-col items-center text-center max-w-md mx-auto">
      <!-- Icon -->
      <div :class="iconContainerClass">
        <UIcon 
          :name="iconName" 
          :class="iconClass"
        />
      </div>

      <!-- Heading -->
      <h3 :class="headingClass">
        {{ heading }}
      </h3>

      <!-- Description -->
      <p v-if="description" :class="descriptionClass">
        {{ description }}
      </p>

      <!-- Actions -->
      <div v-if="$slots.actions" class="mt-6">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  icon?: string
  heading: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

const { 
  icon = 'i-heroicons-document-text-20-solid',
  heading,
  description,
  size = 'md',
  color = 'gray'
} = defineProps<Props>()

const iconName = computed(() => icon)

const sizeConfig = computed(() => {
  switch (size) {
    case 'sm':
      return {
        container: 'py-8',
        icon: 'w-8 h-8',
        iconContainer: 'w-16 h-16',
        heading: 'text-base',
        description: 'text-sm'
      }
    case 'md':
      return {
        container: 'py-12',
        icon: 'w-10 h-10',
        iconContainer: 'w-20 h-20',
        heading: 'text-lg',
        description: 'text-sm'
      }
    case 'lg':
      return {
        container: 'py-16',
        icon: 'w-12 h-12',
        iconContainer: 'w-24 h-24',
        heading: 'text-xl',
        description: 'text-base'
      }
    default:
      return {
        container: 'py-12',
        icon: 'w-10 h-10',
        iconContainer: 'w-20 h-20',
        heading: 'text-lg',
        description: 'text-sm'
      }
  }
})

const colorConfig = computed(() => {
  switch (color) {
    case 'gray': return { icon: 'text-gray-400', bg: 'bg-gray-100' }
    case 'blue': return { icon: 'text-blue-400', bg: 'bg-blue-100' }
    case 'green': return { icon: 'text-green-400', bg: 'bg-green-100' }
    case 'yellow': return { icon: 'text-yellow-400', bg: 'bg-yellow-100' }
    case 'red': return { icon: 'text-red-400', bg: 'bg-red-100' }
    case 'purple': return { icon: 'text-purple-400', bg: 'bg-purple-100' }
    default: return { icon: 'text-gray-400', bg: 'bg-gray-100' }
  }
})

const containerClass = computed(() => [
  'flex items-center justify-center w-full',
  sizeConfig.value.container
])

const iconContainerClass = computed(() => [
  'flex items-center justify-center rounded-full mb-4',
  sizeConfig.value.iconContainer,
  colorConfig.value.bg
])

const iconClass = computed(() => [
  sizeConfig.value.icon,
  colorConfig.value.icon
])

const headingClass = computed(() => [
  'font-semibold text-gray-900 mb-2',
  sizeConfig.value.heading
])

const descriptionClass = computed(() => [
  'text-gray-500 leading-relaxed',
  sizeConfig.value.description
])
</script>