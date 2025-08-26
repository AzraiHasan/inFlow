<template>
  <div>
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">inFlow</h1>
            <UBadge color="primary" variant="subtle" class="ml-3">Internal Platform</UBadge>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            TowerCo Workflow Platform
          </h2>
          <p class="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Streamline your operational workflows with secure document management, 
            task-based collaboration, and comprehensive audit trails. Built for internal teams.
          </p>
          <div class="mt-10">
            <UButton 
              to="/demo"
            >
              Try Demo
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-3xl font-bold tracking-tight text-gray-900">
            Key Features
          </h3>
          <p class="mt-4 text-lg text-gray-600">
            Everything you need to digitize and centralize your operational workflows
          </p>
        </div>
        
        <div class="mt-16">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1 -->
            <div class="relative p-6">
              <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-blue-600" />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 text-center">Task-Based Workflow</h4>
              <p class="mt-2 text-gray-600 text-center">
                Create, assign, and track tasks with document containers and real-time collaboration.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="relative p-6">
              <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg">
                <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-green-600" />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 text-center">Secure Document Management</h4>
              <p class="mt-2 text-gray-600 text-center">
                Secure upload, storage, and automatic version control for all your documents.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="relative p-6">
              <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg">
                <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-purple-600" />
              </div>
              <h4 class="text-xl font-semibold text-gray-900 text-center">Audit & Analytics</h4>
              <p class="mt-2 text-gray-600 text-center">
                Comprehensive audit logs and dashboard analytics for complete transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-gray-500">
          <p>© 2025 TowerCo Workflow Platform - Internal Use Only</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>