<template>
  <UTable 
    :data="tasks" 
    :columns="tableColumns"
  />
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { TaskData } from '~/stores/demoTable'
import type { Document } from '~/types'

interface Props {
  tasks: TaskData[]
  showAssigneeColumn?: boolean
  showActionsColumn?: boolean
  showAttachmentsColumn?: boolean
}

interface Emits {
  (e: 'assign' | 'edit', taskId: string): void
  (e: 'preview', document: Document): void
}

const { 
  tasks, 
  showAssigneeColumn = true, 
  showActionsColumn = true,
  showAttachmentsColumn = true
} = defineProps<Props>()

const emit = defineEmits<Emits>()

// Base columns that are always shown
const baseColumns = [
  {
    key: 'category',
    header: 'Category',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return task.task.split(': ')[0] || ''
    }
  },
  {
    key: 'description',
    header: 'Description', 
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return task.task.split(': ')[1] || task.task
    }
  },
  {
    key: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return h(resolveComponent('StatusBadge'), {
        status: task.status
      })
    }
  },
  {
    key: 'priority',
    header: 'Priority',
    cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
      const task = row.original || row
      return h(resolveComponent('PriorityBadge'), {
        priority: task.priority
      })
    }
  }
]

// Conditional columns
const attachmentsColumn = {
  key: 'attachments',
  header: 'Files',
  cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
    const task = row.original || row
    return h(resolveComponent('FileAttachmentsCell'), {
      task,
      onPreview: (document: Document) => emit('preview', document)
    })
  }
}

const assigneeColumn = {
  key: 'assignee',
  header: 'Assignee',
  cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
    const task = row.original || row
    return h(resolveComponent('AssigneeCell'), {
      task,
      onAssign: (taskId: string) => emit('assign', taskId)
    })
  }
}

const actionsColumn = {
  key: 'edit',
  header: 'Actions',
  cell: ({ row }: { row: { original?: TaskData } & TaskData }) => {
    const task = row.original || row
    return h(resolveComponent('TaskActionsCell'), {
      task,
      onEdit: (taskId: string) => emit('edit', taskId)
    })
  }
}

// Build columns array dynamically based on props
const tableColumns = computed(() => {
  const columns = [...baseColumns]
  
  if (showAttachmentsColumn) {
    columns.push(attachmentsColumn)
  }
  
  if (showAssigneeColumn) {
    columns.push(assigneeColumn)
  }
  
  if (showActionsColumn) {
    columns.push(actionsColumn)
  }
  
  return columns
})
</script>