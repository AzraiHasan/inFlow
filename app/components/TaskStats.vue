<template>
  <div class="task-stats space-y-6">
    <!-- Overall Statistics Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <UCard class="bg-blue-50 border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-600 text-sm font-medium">Total Tasks</p>
            <p class="text-2xl font-bold text-blue-900">{{ stats.total }}</p>
          </div>
          <UIcon name="i-heroicons-clipboard-document-list" class="text-3xl text-blue-500" />
        </div>
      </UCard>

      <UCard class="bg-yellow-50 border-yellow-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-600 text-sm font-medium">In Progress</p>
            <p class="text-2xl font-bold text-yellow-900">{{ stats.inProgress }}</p>
          </div>
          <UIcon name="i-heroicons-clock" class="text-3xl text-yellow-500" />
        </div>
      </UCard>

      <UCard class="bg-green-50 border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-600 text-sm font-medium">Completed</p>
            <p class="text-2xl font-bold text-green-900">{{ stats.completed }}</p>
          </div>
          <UIcon name="i-heroicons-check-circle" class="text-3xl text-green-500" />
        </div>
      </UCard>

      <UCard class="bg-red-50 border-red-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-600 text-sm font-medium">Overdue</p>
            <p class="text-2xl font-bold text-red-900">{{ stats.overdue }}</p>
          </div>
          <UIcon name="i-heroicons-exclamation-triangle" class="text-3xl text-red-500" />
        </div>
      </UCard>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Status Distribution -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-chart-pie" />
            <h3 class="text-lg font-semibold">Status Distribution</h3>
          </div>
        </template>
        
        <div class="space-y-3">
          <div
            v-for="statusItem in statusDistribution"
            :key="statusItem.status"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getStatusColor(statusItem.status)"
              />
              <span class="text-sm font-medium">{{ formatStatus(statusItem.status) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">{{ statusItem.count }}</span>
              <div class="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full"
                  :class="getStatusColor(statusItem.status)"
                  :style="{ width: `${statusItem.percentage}%` }"
                />
              </div>
              <span class="text-xs text-gray-500 w-8">{{ Math.round(statusItem.percentage) }}%</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Priority Distribution -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-flag" />
            <h3 class="text-lg font-semibold">Priority Breakdown</h3>
          </div>
        </template>
        
        <div class="space-y-3">
          <div
            v-for="priorityItem in priorityDistribution"
            :key="priorityItem.priority"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getPriorityColor(priorityItem.priority)"
              />
              <span class="text-sm font-medium">{{ formatPriority(priorityItem.priority) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">{{ priorityItem.count }}</span>
              <div class="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full"
                  :class="getPriorityColor(priorityItem.priority)"
                  :style="{ width: `${priorityItem.percentage}%` }"
                />
              </div>
              <span class="text-xs text-gray-500 w-8">{{ Math.round(priorityItem.percentage) }}%</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity and Assignee Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Task Types -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-squares-2x2" />
            <h3 class="text-lg font-semibold">Task Types</h3>
          </div>
        </template>
        
        <div class="space-y-2">
          <div
            v-for="typeItem in typeDistribution"
            :key="typeItem.type"
            class="flex items-center justify-between p-2 rounded hover:bg-gray-50"
          >
            <div class="flex items-center gap-3">
              <UIcon :name="getTypeIcon(typeItem.type)" class="text-gray-500" />
              <span class="text-sm font-medium">{{ formatType(typeItem.type) }}</span>
            </div>
            <UBadge variant="subtle" size="xs">{{ typeItem.count }}</UBadge>
          </div>
        </div>
      </UCard>

      <!-- Completion Rate -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-chart-bar" />
            <h3 class="text-lg font-semibold">Completion Rate</h3>
          </div>
        </template>
        
        <div class="space-y-4">
          <div class="text-center">
            <div class="text-4xl font-bold text-green-600">{{ completionRate }}%</div>
            <p class="text-sm text-gray-600">Tasks Completed</p>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-green-500 h-3 rounded-full transition-all duration-500"
              :style="{ width: `${completionRate}%` }"
            />
          </div>

          <div class="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <div class="font-semibold text-green-600">{{ stats.completed }}</div>
              <div class="text-gray-500">Completed</div>
            </div>
            <div>
              <div class="font-semibold text-gray-600">{{ stats.total - stats.completed }}</div>
              <div class="text-gray-500">Remaining</div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Time-based Analytics -->
    <div v-if="showTimeAnalytics" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar-days" />
            <h3 class="text-sm font-semibold">This Week</h3>
          </div>
        </template>
        
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Created</span>
            <span class="text-sm font-medium">{{ weeklyStats.created }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Completed</span>
            <span class="text-sm font-medium">{{ weeklyStats.completed }}</span>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar-days" />
            <h3 class="text-sm font-semibold">This Month</h3>
          </div>
        </template>
        
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Created</span>
            <span class="text-sm font-medium">{{ monthlyStats.created }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-gray-600">Completed</span>
            <span class="text-sm font-medium">{{ monthlyStats.completed }}</span>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-clock" />
            <h3 class="text-sm font-semibold">Avg Completion</h3>
          </div>
        </template>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ avgCompletionTime }}</div>
          <p class="text-xs text-gray-600">days</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'
import { TaskStatus, TaskPriority, TaskType } from '~/types'

interface Props {
  tasks: Task[]
  showTimeAnalytics?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTimeAnalytics: true
})

// Basic statistics
const stats = computed(() => {
  const now = new Date()
  
  return {
    total: props.tasks.length,
    completed: props.tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
    inProgress: props.tasks.filter(task => 
      task.status === TaskStatus.IN_PROGRESS || 
      task.status === TaskStatus.ASSIGNED ||
      task.status === TaskStatus.PENDING_REVIEW
    ).length,
    overdue: props.tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== TaskStatus.COMPLETED
    ).length
  }
})

// Completion rate
const completionRate = computed(() => {
  if (stats.value.total === 0) return 0
  return Math.round((stats.value.completed / stats.value.total) * 100)
})

// Status distribution
const statusDistribution = computed(() => {
  const statusCounts = props.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<TaskStatus, number>)

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status as TaskStatus,
    count,
    percentage: (count / props.tasks.length) * 100
  })).sort((a, b) => b.count - a.count)
})

// Priority distribution
const priorityDistribution = computed(() => {
  const priorityCounts = props.tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<TaskPriority, number>)

  const priorityOrder = [TaskPriority.URGENT, TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW]
  
  return priorityOrder.map(priority => ({
    priority,
    count: priorityCounts[priority] || 0,
    percentage: ((priorityCounts[priority] || 0) / props.tasks.length) * 100
  })).filter(item => item.count > 0)
})

// Type distribution
const typeDistribution = computed(() => {
  const typeCounts = props.tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1
    return acc
  }, {} as Record<TaskType, number>)

  return Object.entries(typeCounts).map(([type, count]) => ({
    type: type as TaskType,
    count
  })).sort((a, b) => b.count - a.count)
})

// Time-based analytics
const weeklyStats = computed(() => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return {
    created: props.tasks.filter(task => new Date(task.createdAt) >= weekAgo).length,
    completed: props.tasks.filter(task => 
      task.status === TaskStatus.COMPLETED && 
      new Date(task.updatedAt) >= weekAgo
    ).length
  }
})

const monthlyStats = computed(() => {
  const now = new Date()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  return {
    created: props.tasks.filter(task => new Date(task.createdAt) >= monthAgo).length,
    completed: props.tasks.filter(task => 
      task.status === TaskStatus.COMPLETED && 
      new Date(task.updatedAt) >= monthAgo
    ).length
  }
})

const avgCompletionTime = computed(() => {
  const completedTasks = props.tasks.filter(task => task.status === TaskStatus.COMPLETED)
  if (completedTasks.length === 0) return 0
  
  const totalDays = completedTasks.reduce((sum, task) => {
    const created = new Date(task.createdAt)
    const completed = new Date(task.updatedAt)
    const diffTime = Math.abs(completed.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return sum + diffDays
  }, 0)
  
  return Math.round(totalDays / completedTasks.length)
})

// Helper methods
const getStatusColor = (status: TaskStatus): string => {
  const colors: Record<TaskStatus, string> = {
    [TaskStatus.DRAFT]: 'bg-gray-400',
    [TaskStatus.ASSIGNED]: 'bg-blue-400',
    [TaskStatus.IN_PROGRESS]: 'bg-yellow-400',
    [TaskStatus.PENDING_REVIEW]: 'bg-orange-400',
    [TaskStatus.APPROVED]: 'bg-green-400',
    [TaskStatus.REJECTED]: 'bg-red-400',
    [TaskStatus.COMPLETED]: 'bg-green-500',
    [TaskStatus.CANCELLED]: 'bg-gray-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: 'bg-blue-400',
    [TaskPriority.MEDIUM]: 'bg-yellow-400',
    [TaskPriority.HIGH]: 'bg-orange-400',
    [TaskPriority.URGENT]: 'bg-red-500'
  }
  return colors[priority] || 'bg-gray-400'
}

const formatStatus = (status: TaskStatus): string => {
  const labels: Record<TaskStatus, string> = {
    [TaskStatus.DRAFT]: 'Draft',
    [TaskStatus.ASSIGNED]: 'Assigned',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.PENDING_REVIEW]: 'Pending Review',
    [TaskStatus.APPROVED]: 'Approved',
    [TaskStatus.REJECTED]: 'Rejected',
    [TaskStatus.COMPLETED]: 'Completed',
    [TaskStatus.CANCELLED]: 'Cancelled'
  }
  return labels[status] || status
}

const formatPriority = (priority: TaskPriority): string => {
  const labels: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: 'Low Priority',
    [TaskPriority.MEDIUM]: 'Medium Priority',
    [TaskPriority.HIGH]: 'High Priority',
    [TaskPriority.URGENT]: 'Urgent'
  }
  return labels[priority] || priority
}

const formatType = (type: TaskType): string => {
  const labels: Record<TaskType, string> = {
    [TaskType.REVIEW]: 'Review',
    [TaskType.APPROVAL]: 'Approval',
    [TaskType.INFORMATION]: 'Information',
    [TaskType.ACTION]: 'Action'
  }
  return labels[type] || type
}

const getTypeIcon = (type: TaskType): string => {
  const icons: Record<TaskType, string> = {
    [TaskType.REVIEW]: 'i-heroicons-eye',
    [TaskType.APPROVAL]: 'i-heroicons-check-circle',
    [TaskType.INFORMATION]: 'i-heroicons-information-circle',
    [TaskType.ACTION]: 'i-heroicons-bolt'
  }
  return icons[type] || 'i-heroicons-rectangle-stack'
}
</script>