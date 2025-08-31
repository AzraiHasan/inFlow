<template>
  <section :class="containerClass">
    <!-- Section Header -->
    <div v-if="title || description || $slots.header" :class="headerClass">
      <div v-if="$slots.header">
        <slot name="header" />
      </div>
      <div v-else-if="title || description">
        <h2 v-if="title" :class="titleClass">
          {{ title }}
        </h2>
        <p v-if="description" :class="descriptionClass">
          {{ description }}
        </p>
      </div>

      <!-- Section Actions -->
      <div v-if="$slots.actions" class="mt-4 sm:mt-0">
        <slot name="actions" />
      </div>
    </div>

    <!-- Section Content -->
    <div :class="contentClass">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
export interface Props {
  title?: string
  description?: string
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  headerSpacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'white' | 'gray' | 'transparent'
  border?: boolean | 'top' | 'bottom' | 'all'
  shadow?: boolean | 'sm' | 'md' | 'lg'
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const { 
  title,
  description,
  spacing = 'md',
  headerSpacing = 'md',
  background = 'transparent',
  border = false,
  shadow = false,
  rounded = false,
  padding = 'none'
} = defineProps<Props>()

const spacingConfig = computed(() => {
  switch (spacing) {
    case 'none': return ''
    case 'xs': return 'mt-2'
    case 'sm': return 'mt-4'
    case 'md': return 'mt-8'
    case 'lg': return 'mt-12'
    case 'xl': return 'mt-16'
    default: return 'mt-8'
  }
})

const headerSpacingConfig = computed(() => {
  switch (headerSpacing) {
    case 'none': return ''
    case 'xs': return 'mb-2'
    case 'sm': return 'mb-4'
    case 'md': return 'mb-6'
    case 'lg': return 'mb-8'
    case 'xl': return 'mb-10'
    default: return 'mb-6'
  }
})

const backgroundConfig = computed(() => {
  switch (background) {
    case 'white': return 'bg-white'
    case 'gray': return 'bg-gray-50'
    case 'transparent': return ''
    default: return ''
  }
})

const borderConfig = computed(() => {
  if (border === false) return ''
  if (border === true || border === 'all') return 'border border-gray-200'
  if (border === 'top') return 'border-t border-gray-200'
  if (border === 'bottom') return 'border-b border-gray-200'
  return ''
})

const shadowConfig = computed(() => {
  if (shadow === false) return ''
  if (shadow === true || shadow === 'md') return 'shadow-md'
  if (shadow === 'sm') return 'shadow-sm'
  if (shadow === 'lg') return 'shadow-lg'
  return ''
})

const roundedConfig = computed(() => {
  if (rounded === false) return ''
  if (rounded === true || rounded === 'md') return 'rounded-md'
  if (rounded === 'sm') return 'rounded-sm'
  if (rounded === 'lg') return 'rounded-lg'
  if (rounded === 'xl') return 'rounded-xl'
  return ''
})

const paddingConfig = computed(() => {
  switch (padding) {
    case 'none': return ''
    case 'xs': return 'p-2'
    case 'sm': return 'p-4'
    case 'md': return 'p-6'
    case 'lg': return 'p-8'
    case 'xl': return 'p-10'
    default: return ''
  }
})

const containerClass = computed(() => [
  spacingConfig.value,
  backgroundConfig.value,
  borderConfig.value,
  shadowConfig.value,
  roundedConfig.value,
  paddingConfig.value
])

const headerClass = computed(() => [
  'flex flex-col sm:flex-row sm:items-center sm:justify-between',
  headerSpacingConfig.value
])

const titleClass = computed(() => [
  'text-xl font-semibold text-gray-900'
])

const descriptionClass = computed(() => [
  'text-gray-600 mt-1'
])

const contentClass = computed(() => [
  'w-full'
])
</script>