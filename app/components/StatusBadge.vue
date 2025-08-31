<template>
  <UBadge 
    :variant="badgeVariant"
    :color="badgeColor"
    :size="size"
    class="font-medium"
  >
    {{ status }}
  </UBadge>
</template>

<script setup lang="ts">
export type TaskStatus = 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'On Track'

interface Props {
  status: TaskStatus
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const { status, size = 'sm' } = defineProps<Props>()

const badgeConfig = computed(() => {
  switch (status) {
    case 'Completed':
      return { variant: 'solid' as const, color: 'green' }
    case 'In Progress':
      return { variant: 'solid' as const, color: 'blue' }
    case 'Pending':
      return { variant: 'solid' as const, color: 'yellow' }
    case 'Scheduled':
      return { variant: 'solid' as const, color: 'purple' }
    case 'On Track':
      return { variant: 'solid' as const, color: 'emerald' }
    default:
      return { variant: 'soft' as const, color: 'gray' }
  }
})

const badgeVariant = computed(() => badgeConfig.value.variant)
const badgeColor = computed(() => badgeConfig.value.color)
</script>