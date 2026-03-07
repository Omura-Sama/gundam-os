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
        
        <!-- Only show Active Modules in Sidebar -->
        <v-list-item
          v-for="mod in installedPacks"
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
              TACTICAL HUD (PHASE 8)
            </h1>
            <p class="text-secondary subtitle-1">Gundam-OS Core Engine Status: Online</p>
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <!-- Active Modules Radar Card -->
          <v-col cols="12" md="6">
            <v-card class="tactical-card elevation-6">
              <v-card-title class="text-primary font-weight-bold">
                <v-icon left color="primary" class="mr-2">mdi-radar</v-icon>
                Active Striker Packs ({{ installedPacks.length }})
              </v-card-title>
              <v-divider></v-divider>
              <v-list bg-color="transparent" theme="dark">
                <v-list-item v-for="mod in installedPacks" :key="mod.name" class="py-3">
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-package-variant-closed</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold">{{ mod.name }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption mt-1">{{ mod.description || 'No description available.' }}</v-list-item-subtitle>
                  <div class="text-caption text-secondary mt-1">Vers: {{ mod.version }}</div>
                  
                  <template v-slot:append>
                    <v-chip color="success" size="small" variant="elevated" class="pulse-chip">
                      {{ mod.status.replace('🟢', '') }}
                    </v-chip>
                  </template>
                </v-list-item>
                
                <v-list-item v-if="installedPacks.length === 0 && !loading">
                  <v-list-item-title class="text-warning">No Active Striker Packs Detected</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- Available / Discovered Modules Card -->
          <v-col cols="12" md="6">
            <v-card class="tactical-card elevation-6" style="border-color: rgba(245, 176, 65, 0.4) !important;">
              <v-card-title class="text-warning font-weight-bold">
                <v-icon left color="warning" class="mr-2">mdi-magnify-scan</v-icon>
                Signal Detected: Uninstalled Modules ({{ availablePacks.length }})
              </v-card-title>
              <v-divider></v-divider>
              <v-list bg-color="transparent" theme="dark">
                <v-list-item v-for="mod in availablePacks" :key="mod.name" class="py-3">
                  <template v-slot:prepend>
                    <v-icon color="warning">mdi-package-variant</v-icon>
                  </template>
                  <v-list-item-title class="font-weight-bold text-warning">{{ mod.name }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption mt-1">{{ mod.description || 'Unknown system architecture detected.' }}</v-list-item-subtitle>
                  <div class="text-caption text-secondary mt-1">Vers: {{ mod.version }}</div>
                  
                  <template v-slot:append>
                    <v-btn 
                      color="warning" 
                      variant="outlined" 
                      size="small" 
                      class="mt-2"
                      @click="installModule(mod.name)"
                      :loading="installingModule === mod.name"
                    >
                      <v-icon left size="small" class="mr-1">mdi-download</v-icon> INSTALL
                    </v-btn>
                  </template>
                </v-list-item>

                <v-list-item v-if="availablePacks.length === 0 && !loading">
                  <v-list-item-title class="text-secondary text-center py-4">All detected Striker Packs are currently equipped.</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

interface ModuleDetail {
  name: string;
  version: string;
  description?: string;
  status: string;
}

const allModules = ref<ModuleDetail[]>([]);
const loading = ref(true);
const installingModule = ref<string | null>(null);

const installedPacks = computed(() => {
  return allModules.value.filter(m => m.status.includes('Active'));
});

const availablePacks = computed(() => {
  return allModules.value.filter(m => m.status.includes('Available'));
});

const getModuleIcon = (name: string) => {
  if (name.toLowerCase().includes('pilot')) return 'mdi-account-group';
  if (name.toLowerCase().includes('rifle')) return 'mdi-pistol';
  if (name.toLowerCase().includes('shield')) return 'mdi-shield-check';
  if (name.toLowerCase().includes('hr')) return 'mdi-badge-account-horizontal-outline';
  if (name.toLowerCase().includes('medic')) return 'mdi-hospital-box';
  return 'mdi-cube-outline';
}

const logout = () => {
  localStorage.removeItem('gundam_jwt');
  router.push('/login');
}

const fetchModules = async () => {
  loading.value = true;
  const token = localStorage.getItem('gundam_jwt');
  try {
    const response = await axios.get('/api/core/modules', {
      headers: { Authorization: `Bearer ${token}` }
    });
    allModules.value = response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      logout();
    }
  } finally {
    loading.value = false;
  }
}

const installModule = async (moduleName: string) => {
  installingModule.value = moduleName;
  const token = localStorage.getItem('gundam_jwt');
  try {
    await axios.post('/api/core/modules/install', { moduleName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Re-fetch radar after successful installation
    await fetchModules();
  } catch (error) {
    console.error("Failed to install module:", error);
    alert(`Failed to activate ${moduleName}`);
  } finally {
    installingModule.value = null;
  }
}

onMounted(() => {
  fetchModules();
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
  border: 1px solid rgba(0, 232, 143, 0.3) !important;
  border-radius: 8px;
  transition: all 0.3s ease;
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
