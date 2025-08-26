<!--this page is to simulate the UI for different personas via simple buttons-->

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">TowerCo Workflow Demo</h1>
        <p class="text-gray-600">Experience the platform from different persona perspectives</p>
      </div>

      <!-- Simple persona selector -->
      <div class="flex justify-center gap-4 mb-8">
        <UButton 
          :variant="selectedPersona === 'sarah' ? 'solid' : 'outline'"
          @click="selectPersona('sarah')"
          size="lg"
        >
          👩‍🔧 Sarah Chen (Field Engineer)
        </UButton>
        <UButton 
          :variant="selectedPersona === 'marcus' ? 'solid' : 'outline'"
          @click="selectPersona('marcus')"
          size="lg"
        >
          👨‍💼 Marcus Rodriguez (Site Manager)
        </UButton>
      </div>

      <!-- Persona content -->
      <div v-if="currentPersonaData" class="bg-white rounded-lg shadow-lg p-6">
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">{{ currentPersonaData.avatar }}</span>
            <div>
              <h2 class="text-xl font-semibold">{{ currentPersonaData.name }}</h2>
              <p class="text-gray-600">{{ currentPersonaData.role }} • {{ currentPersonaData.department }}</p>
            </div>
          </div>
        </div>

        <!-- Simple dashboard -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UCard>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ currentPersonaData.inTrayCount }}</div>
              <div class="text-sm text-gray-600">In-Tray Tasks</div>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ currentPersonaData.outTrayCount }}</div>
              <div class="text-sm text-gray-600">Out-Tray Tasks</div>
            </div>
          </UCard>
          <UCard>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600">{{ currentPersonaData.urgentCount }}</div>
              <div class="text-sm text-gray-600">Urgent Tasks</div>
            </div>
          </UCard>
        </div>

        <!-- Sample tasks -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div class="space-y-3">
            <UCard v-for="task in currentPersonaData.sampleTasks" :key="task.id" class="p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-semibold">{{ task.title }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
                </div>
                <UBadge :color="task.priority === 'urgent' ? 'red' : task.priority === 'high' ? 'orange' : 'blue'">
                  {{ task.priority }}
                </UBadge>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedPersona = ref('sarah')

const personaData = {
  sarah: {
    name: 'Sarah Chen',
    role: 'Field Engineer',
    department: 'Field Operations',
    avatar: '👩‍🔧',
    inTrayCount: 8,
    outTrayCount: 3,
    urgentCount: 2,
    sampleTasks: [
      {
        id: '1',
        title: 'Site Safety Inspection - Tower 247A',
        description: 'Complete monthly safety inspection and submit compliance report',
        priority: 'urgent'
      },
      {
        id: '2', 
        title: 'Equipment Maintenance Log Update',
        description: 'Update maintenance records for generators and cooling systems',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Weather Monitoring System Check',
        description: 'Verify weather monitoring equipment is functioning correctly',
        priority: 'high'
      }
    ]
  },
  marcus: {
    name: 'Marcus Rodriguez',
    role: 'Site Manager',
    department: 'Site Management',
    avatar: '👨‍💼',
    inTrayCount: 12,
    outTrayCount: 7,
    urgentCount: 4,
    sampleTasks: [
      {
        id: '1',
        title: 'Quarterly Budget Review',
        description: 'Review Q3 budget allocations and prepare Q4 forecast',
        priority: 'urgent'
      },
      {
        id: '2',
        title: 'Staff Schedule Coordination',
        description: 'Coordinate field engineer schedules for upcoming maintenance window',
        priority: 'urgent'
      },
      {
        id: '3',
        title: 'Vendor Contract Renewal',
        description: 'Review and negotiate terms for security services contract',
        priority: 'medium'
      }
    ]
  }
}

const currentPersonaData = computed(() => {
  return personaData[selectedPersona.value]
})

const selectPersona = (persona: string) => {
  selectedPersona.value = persona
}
</script>