<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">inFlow</h1>
            <UBadge color="primary" variant="subtle" class="ml-3">Internal Platform</UBadge>
          </div>
        </div>
      </div>
    </header>

    <div class="flex pt-16">
      <!-- Sidebar -->
      <nav class="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div class="p-6">
          <div class="space-y-6">
            <!-- Navigation Section -->
            <div>
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <div class="space-y-1">
                <NuxtLink 
                  to="/"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100"
                  :class="$route.path === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'"
                >
                  <UIcon name="i-heroicons-home" class="w-5 h-5 mr-3" />
                  Home
                </NuxtLink>
              </div>
            </div>

            <!-- Workflows Section -->
            <div>
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Workflows
              </h3>
              <div class="space-y-1">
                <NuxtLink 
                  to="/workflow_1"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100"
                  :class="$route.path === '/workflow_1' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'"
                >
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 mr-3" />
                  Ariffin
                </NuxtLink>
                <NuxtLink 
                  to="/workflow_2"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100"
                  :class="$route.path === '/workflow_2' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'"
                >
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-3" />
                  Farahin
                </NuxtLink>
              </div>
            </div>

            <!-- Quick Actions Section -->
            <div>
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div class="space-y-1">
                <button class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                  <UIcon name="i-heroicons-plus-circle" class="w-5 h-5 mr-3" />
                  New Task
                </button>
                <button class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                  <UIcon name="i-heroicons-document-plus" class="w-5 h-5 mr-3" />
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 ml-64">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout setup
</script>