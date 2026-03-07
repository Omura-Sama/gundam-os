<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-primary font-weight-bold tactical-header">
          <v-icon size="x-large" color="primary" class="mr-3">mdi-crosshairs-gps</v-icon>
          Targeting & Weaponry Control
        </h1>
        <p class="text-secondary subtitle-1">ERP Module: Sales & Procurement Hub</p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="tactical-card elevation-6">
          <v-card-title class="text-warning font-weight-bold py-4">
            <v-icon left color="warning" class="mr-2">mdi-radar</v-icon>
            Active Procurement Optics
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-12 text-center">
            <v-icon size="100" color="secondary" class="mb-4 opacity-50 pulse-icon">mdi-satellite-uplink</v-icon>
            <h2 class="text-secondary font-weight-regular mt-2">No Active Targets Found</h2>
            <p class="text-grey mt-2">Weaponry UI is standing by for new Purchase Orders (PO) or Sales Orders (SO).</p>
            <v-btn color="primary" variant="outlined" class="mt-6">
              <v-icon left class="mr-2">mdi-target</v-icon> INITIATE MANUAL SCAN
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Tactical Sales dummy page
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

.pulse-icon {
  animation: pulse-opacity 3s infinite;
}

@keyframes pulse-opacity {
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
}
</style>
