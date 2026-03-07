<template>
  <v-layout class="tactical-layout">
    <!-- Dynamic Sidebar -->
    <v-navigation-drawer
      expand-on-hover
      rail
      theme="dark"
      class="tactical-sidebar"
      color="rgba(18, 28, 34, 0.9)"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-shield-account-outline"
          title="Active Pilot"
          subtitle="System Override"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-radar" title="Core Dashboard" value="dashboard"></v-list-item>
        
        <!-- Dynamic Modules Rendered Here -->
        <v-list-item
          v-for="mod in activeModules"
          :key="mod.name"
          :prepend-icon="getModuleIcon(mod.name)"
          :title="mod.name"
          :value="mod.name"
        ></v-list-item>
      </v-list>
      
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="error" variant="text" @click="logout" prepend-icon="mdi-logout">
            EJECT
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <h1 class="text-primary font-weight-bold tactical-header">
              <v-icon size="x-large" color="primary" class="mr-3">mdi-monitor-dashboard</v-icon>
              TACTICAL HUD (PHASE 7)
            </h1>
            <p class="text-secondary subtitle-1">Gundam-OS Core Engine Status: Online</p>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <!-- Active Modules Radar Card -->
          <v-col cols="12" md="6">
            <v-card class="tactical-card elevation-6">
              <v-card-title class="text-secondary font-weight-bold">
                <v-icon left color="secondary" class="mr-2">mdi-radar</v-icon>
                Active Striker Packs ({{ activeModules.length }})
              </v-card-title>
              <v-divider></v-divider>
              <v-list bg-color="transparent" theme="dark">
                <v-list-item v-for="mod in activeModules" :key="mod.name" class="py-3">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-package-variant-closed</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">{{ mod.name }}</v-list-item-title>
                  <v-list-item-subtitle>Vers: {{ mod.version }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <v-chip color="success" size="small" variant="elevated" class="pulse-chip">
                      {{ mod.status.replace('🟢', '') }}
                    </v-chip>
                  </template>
                </v-list-item>
                
                <v-list-item v-if="activeModules.length === 0 && !loading">
                  <v-list-item-title class="text-warning">No Striker Packs Detected</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- System Matrix (Placeholder) -->
          <v-col cols="12" md="6">
            <v-card class="tactical-card elevation-6">
              <v-card-title class="text-primary font-weight-bold">
                <v-icon left color="primary" class="mr-2">mdi-chart-bar</v-icon>
                System Telemetry
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="d-flex justify-center align-center" style="height: 200px">
                <v-progress-circular
                  :size="120"
                  :width="8"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
                <div class="position-absolute text-center">
                  <span class="text-h5 font-weight-bold text-secondary">SYNC</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const activeModules = ref<Array<{name: string, version: string, status: string}>>([]);
const loading = ref(true);

const getModuleIcon = (name: string) => {
  if (name.toLowerCase().includes('pilot')) return 'mdi-account-group';
  if (name.toLowerCase().includes('rifle')) return 'mdi-pistol';
  if (name.toLowerCase().includes('shield')) return 'mdi-shield-check';
  return 'mdi-cube-outline';
}

const logout = () => {
  localStorage.removeItem('gundam_jwt');
  router.push('/login');
}

onMounted(async () => {
  const token = localStorage.getItem('gundam_jwt');
  try {
    const response = await axios.get('/api/core/modules', {
      headers: { Authorization: `Bearer ${token}` }
    });
    activeModules.value = response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      logout(); // Token invalid
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.tactical-layout {
  height: 100vh;
  background: radial-gradient(circle at top right, #121C22 0%, #0B1116 100%);
  position: relative;
  overflow: hidden;
}

/* Tactical Background Grid */
.tactical-layout::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 232, 143, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 232, 143, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.tactical-sidebar {
  border-right: 1px solid rgba(0, 232, 143, 0.2) !important;
  backdrop-filter: blur(10px);
}

.tactical-header {
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 15px rgba(0, 232, 143, 0.3);
}

.tactical-card {
  background: rgba(18, 28, 34, 0.6) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 209, 255, 0.2) !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tactical-card:hover {
  border-color: rgba(0, 209, 255, 0.5) !important;
  box-shadow: 0 0 15px rgba(0, 209, 255, 0.1) !important;
}

.pulse-chip {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 232, 143, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(0, 232, 143, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 232, 143, 0); }
}
</style>
