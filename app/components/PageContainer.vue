<template>
  <div :class="outerContainerClass">
    <div :class="innerContainerClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'none'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'white' | 'gray' | 'slate' | 'transparent'
  minHeight?: 'screen' | 'auto' | 'content'
  centered?: boolean
}

const { 
  maxWidth = '7xl',
  padding = 'md',
  background = 'gray',
  minHeight = 'screen',
  centered = true
} = defineProps<Props>()

const maxWidthConfig = computed(() => {
  switch (maxWidth) {
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-md'
    case 'lg': return 'max-w-lg'
    case 'xl': return 'max-w-xl'
    case '2xl': return 'max-w-2xl'
    case '3xl': return 'max-w-3xl'
    case '4xl': return 'max-w-4xl'
    case '5xl': return 'max-w-5xl'
    case '6xl': return 'max-w-6xl'
    case '7xl': return 'max-w-7xl'
    case 'full': return 'max-w-full'
    case 'none': return ''
    default: return 'max-w-7xl'
  }
})

const paddingConfig = computed(() => {
  switch (padding) {
    case 'none': return ''
    case 'xs': return 'p-2'
    case 'sm': return 'p-4'
    case 'md': return 'py-6 px-4 sm:px-6 lg:px-8'
    case 'lg': return 'py-8 px-4 sm:px-6 lg:px-8'
    case 'xl': return 'py-12 px-4 sm:px-6 lg:px-8'
    default: return 'py-6 px-4 sm:px-6 lg:px-8'
  }
})

const backgroundConfig = computed(() => {
  switch (background) {
    case 'white': return 'bg-white'
    case 'gray': return 'bg-gray-50'
    case 'slate': return 'bg-slate-50'
    case 'transparent': return ''
    default: return 'bg-gray-50'
  }
})

const minHeightConfig = computed(() => {
  switch (minHeight) {
    case 'screen': return 'min-h-screen'
    case 'auto': return 'min-h-0'
    case 'content': return 'min-h-fit'
    default: return 'min-h-screen'
  }
})

const outerContainerClass = computed(() => [
  minHeightConfig.value,
  backgroundConfig.value
])

const innerContainerClass = computed(() => [
  maxWidthConfig.value,
  paddingConfig.value,
  {
    'mx-auto': centered,
    'w-full': maxWidth !== 'none'
  }
])
</script>