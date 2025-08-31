<template>
  <UBadge 
    :variant="badgeVariant"
    :color="badgeColor"
    :size="size"
    class="font-medium"
  >
    <UIcon 
      v-if="showIcon" 
      :name="iconName" 
      class="w-3 h-3 mr-1" 
    />
    {{ priority }}
  </UBadge>
</template>

<script setup lang="ts">
export type TaskPriority = 'High' | 'Medium' | 'Low'

interface Props {
  priority: TaskPriority
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const { priority, size = 'sm', showIcon = false } = defineProps<Props>()

const badgeConfig = computed(() => {
  switch (priority) {
    case 'High':
      return { 
        variant: 'solid' as const, 
        color: 'red',
        icon: 'i-heroicons-arrow-up'
      }
    case 'Medium':
      return { 
        variant: 'solid' as const, 
        color: 'orange',
        icon: 'i-heroicons-minus'
      }
    case 'Low':
      return { 
        variant: 'solid' as const, 
        color: 'gray',
        icon: 'i-heroicons-arrow-down'
      }
    default:
      return { 
        variant: 'soft' as const, 
        color: 'gray',
        icon: 'i-heroicons-question-mark-circle'
      }
  }
})

const badgeVariant = computed(() => badgeConfig.value.variant)
const badgeColor = computed(() => badgeConfig.value.color)
const iconName = computed(() => badgeConfig.value.icon)
</script>