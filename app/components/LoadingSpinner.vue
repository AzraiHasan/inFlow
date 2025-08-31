<template>
  <div :class="containerClass">
    <div :class="spinnerClass">
      <div class="animate-spin rounded-full border-2 border-current border-t-transparent" :style="sizeStyle" />
    </div>
    <div v-if="text" :class="textClass">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  color?: 'primary' | 'gray' | 'white' | 'blue' | 'green' | 'yellow' | 'red'
  centered?: boolean
  overlay?: boolean
}

const { 
  size = 'md', 
  text, 
  color = 'primary', 
  centered = false, 
  overlay = false 
} = defineProps<Props>()

const sizeConfig = computed(() => {
  switch (size) {
    case 'xs': return { width: '12px', height: '12px' }
    case 'sm': return { width: '16px', height: '16px' }
    case 'md': return { width: '24px', height: '24px' }
    case 'lg': return { width: '32px', height: '32px' }
    case 'xl': return { width: '48px', height: '48px' }
    default: return { width: '24px', height: '24px' }
  }
})

const colorConfig = computed(() => {
  switch (color) {
    case 'primary': return 'text-primary-500'
    case 'gray': return 'text-gray-500'
    case 'white': return 'text-white'
    case 'blue': return 'text-blue-500'
    case 'green': return 'text-green-500'
    case 'yellow': return 'text-yellow-500'
    case 'red': return 'text-red-500'
    default: return 'text-primary-500'
  }
})

const sizeStyle = computed(() => ({
  width: sizeConfig.value.width,
  height: sizeConfig.value.height
}))

const containerClass = computed(() => [
  'flex flex-col items-center gap-2',
  {
    'justify-center min-h-[200px]': centered && !overlay,
    'fixed inset-0 bg-black/20 backdrop-blur-sm z-50 justify-center items-center': overlay,
    'justify-center': centered && overlay
  }
])

const spinnerClass = computed(() => [
  'flex items-center justify-center',
  colorConfig.value
])

const textClass = computed(() => [
  'text-sm font-medium',
  {
    'text-gray-600': color !== 'white',
    'text-white': color === 'white'
  }
])
</script>