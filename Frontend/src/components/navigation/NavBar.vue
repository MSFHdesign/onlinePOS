<template>
  <nav class="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Company Logo/Name -->
        <CompanyLogo />
        
        <!-- Search Bar -->
        <SearchBar />
        
        <!-- Navigation Items -->
        <div class="flex items-center space-x-4">
          <NavLinks />
          <ThemeToggler class="hidden sm:block" />
          <LoginButton />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import CompanyLogo from './CompanyLogo.vue';
import SearchBar from './SearchBar.vue';
import NavLinks from './NavLinks.vue';
import LoginButton from './LoginButton.vue';
import ThemeToggler from '../theme/ThemeToggler.vue';
</script> 