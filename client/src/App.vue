<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
// Root Component
</script>

<style>
/* Global Glassmorphism and scrollbar aesthetics */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0B1116;
}
::-webkit-scrollbar-thumb {
  background: #00E88F;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #00D1FF;
}
body, html {
  margin: 0;
  padding: 0;
  background-color: #0B1116;
  color: #fff;
  font-family: 'Roboto', sans-serif;
}
</style>
