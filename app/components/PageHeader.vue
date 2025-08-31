<template>
  <div :class="containerClass">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Title and Description -->
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-3">
          <!-- Back Button (optional) -->
          <UButton 
            v-if="showBackButton"
            variant="ghost"
            color="gray"
            icon="i-heroicons-arrow-left-20-solid"
            class="shrink-0"
            @click="goBack"
          />

          <!-- Title -->
          <div>
            <h1 :class="titleClass">
              {{ title }}
            </h1>
            <p v-if="description" :class="descriptionClass">
              {{ description }}
            </p>
          </div>
        </div>

        <!-- Breadcrumbs (optional) -->
        <div v-if="breadcrumbs && breadcrumbs.length > 0" class="mt-2">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2">
              <li v-for="(crumb, index) in breadcrumbs" :key="crumb.name" class="flex items-center">
                <span v-if="index > 0" class="mx-2 text-gray-300">/</span>
                <NuxtLink 
                  v-if="crumb.to && index < breadcrumbs.length - 1"
                  :to="crumb.to" 
                  class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {{ crumb.name }}
                </NuxtLink>
                <span 
                  v-else 
                  class="text-sm"
                  :class="index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'"
                >
                  {{ crumb.name }}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="$slots.actions" class="flex-shrink-0">
        <div class="flex items-center gap-3">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Additional content below header -->
    <div v-if="$slots.content" class="mt-6">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  name: string
  to?: string
}

export interface Props {
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'center'
  showBackButton?: boolean
  breadcrumbs?: BreadcrumbItem[]
  border?: boolean
  background?: 'white' | 'gray' | 'transparent'
}

const { 
  title,
  description,
  size = 'md',
  align = 'left',
  showBackButton = false,
  breadcrumbs,
  border = false,
  background = 'transparent'
} = defineProps<Props>()

const emit = defineEmits<{
  back: []
}>()

const router = useRouter()

const sizeConfig = computed(() => {
  switch (size) {
    case 'sm':
      return {
        title: 'text-xl font-semibold',
        description: 'text-sm',
        container: 'py-4'
      }
    case 'md':
      return {
        title: 'text-3xl font-bold',
        description: 'text-base',
        container: 'py-6'
      }
    case 'lg':
      return {
        title: 'text-4xl font-bold',
        description: 'text-lg',
        container: 'py-8'
      }
    default:
      return {
        title: 'text-3xl font-bold',
        description: 'text-base',
        container: 'py-6'
      }
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

const containerClass = computed(() => [
  sizeConfig.value.container,
  backgroundConfig.value,
  {
    'text-center': align === 'center',
    'border-b border-gray-200': border
  }
])

const titleClass = computed(() => [
  sizeConfig.value.title,
  'text-gray-900'
])

const descriptionClass = computed(() => [
  sizeConfig.value.description,
  'text-gray-600 mt-1'
])

const goBack = () => {
  emit('back')
  if (!emit('back')) {
    router.back()
  }
}
</script>