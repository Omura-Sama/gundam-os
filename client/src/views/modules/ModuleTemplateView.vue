<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-primary font-weight-bold tactical-header">
          <v-icon size="x-large" color="primary" class="mr-3">mdi-application-cog-outline</v-icon>
          MODULAR SUBSYSTEM IDENTIFIED
        </h1>
        <p class="text-secondary subtitle-1">Gundam-OS Routing System: <strong>/module/{{ routeId }}</strong></p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="tactical-card elevation-6 holographic-border">
          <v-card-text class="py-12 text-center">
            <v-icon size="100" color="warning" class="mb-4 pulse-icon">mdi-hardhat</v-icon>
            <h2 class="text-warning font-weight-bold mt-2">INTERFACE UNDER CONSTRUCTION</h2>
            <p class="text-secondary mt-4 w-75 mx-auto">
              Sistem OS berhasil merouting Anda ke subsistem ini, namun User Interface spesifik untuk modul ini masih dalam tahap pembangunan oleh Tim Engineer. Silakan hubungi Markas Besar untuk jadwal perilisan interface.
            </p>
            <v-btn color="warning" variant="outlined" class="mt-6 font-weight-bold" @click="$router.push('/')">
              <v-icon left class="mr-2">mdi-keyboard-return</v-icon> RETURN TO CORE DASHBOARD
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeId = computed(() => route.params.id as string);
</script>

<style scoped>
.tactical-header {
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 15px rgba(0, 232, 143, 0.3);
}

.tactical-card {
  background: rgba(18, 28, 34, 0.6) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 232, 143, 0.3) !important;
  border-radius: 8px;
}

.holographic-border {
  border: 2px solid rgba(245, 176, 65, 0.6) !important;
  box-shadow: inset 0 0 20px rgba(245, 176, 65, 0.1), 0 0 15px rgba(245, 176, 65, 0.2) !important;
}

.pulse-icon {
  animation: pulse-opacity 2s infinite alternate;
}

@keyframes pulse-opacity {
  0% { opacity: 0.4; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1.05); }
}
</style>
