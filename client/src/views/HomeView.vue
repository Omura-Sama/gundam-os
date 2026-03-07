<template>
  <v-container fluid class="pa-6">
    <!-- AI Warning Overlay -->
    <v-snackbar
      v-model="aiWarning"
      color="error"
      elevation="24"
      location="top"
      timeout="-1"
      class="tactical-snackbar"
    >
      <div class="d-flex align-center font-weight-bold text-subtitle-1">
        <v-icon class="mr-3 blink-icon">mdi-alert-decagram</v-icon>
        WARNING: MISSION PARAMETERS ESTABLISHED. ARMOR AND WEAPONRY SETUP REQUIRED.
      </div>
      <template v-slot:actions>
        <v-btn color="white" variant="elevated" class="text-error font-weight-bold" @click="aiWarning = false">ACKNOWLEDGE</v-btn>
      </template>
    </v-snackbar>

    <v-row>
      <v-col cols="12">
        <h1 class="text-primary font-weight-bold tactical-header">
          <v-icon size="x-large" color="primary" class="mr-3">mdi-monitor-dashboard</v-icon>
          TACTICAL HUD (PHASE 10)
        </h1>
        <p class="text-secondary subtitle-1">Gundam-OS Core Engine Status: Online</p>
      </v-col>
    </v-row>

    <!-- OS Telemetry Dashboard -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card class="tactical-card elevation-6 mb-4">
          <v-card-title class="text-secondary font-weight-bold">
            <v-icon left color="secondary" class="mr-2">mdi-engine-outline</v-icon>
            Inner Frame Telemetry
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row align="center" justify="center" class="text-center py-4">
              
              <!-- CPU Load -->
              <v-col cols="12" md="4">
                <div class="text-overline text-secondary mb-2">CPU LOAD (1m Avg)</div>
                <v-progress-circular
                  :model-value="healthData ? healthData.cpuLoad * 100 : 0"
                  :color="getCpuColor(healthData?.cpuLoad || 0)"
                  :size="120"
                  :width="12"
                >
                  <span class="text-h6 font-weight-bold">{{ healthData ? (healthData.cpuLoad * 100).toFixed(0) : 0 }}%</span>
                </v-progress-circular>
              </v-col>

              <!-- Memory Usage -->
              <v-col cols="12" md="4">
                <div class="text-overline text-secondary mb-2">MEMORY CONSUMPTION</div>
                <v-progress-circular
                  :model-value="healthData ? parseFloat(healthData.memory.usagePercent) : 0"
                  :color="getMemColor(healthData ? parseFloat(healthData.memory.usagePercent) : 0)"
                  :size="120"
                  :width="12"
                >
                  <span class="text-h6 font-weight-bold">{{ healthData ? healthData.memory.usagePercent : 0 }}%</span>
                </v-progress-circular>
                <div class="text-caption mt-2 text-grey">
                  {{ formatBytes(healthData?.memory.used || 0) }} / {{ formatBytes(healthData?.memory.total || 0) }}
                </div>
              </v-col>

              <!-- Server Uptime -->
              <v-col cols="12" md="4">
                <div class="text-overline text-secondary mb-2">SYSTEM UPTIME</div>
                <div class="text-h4 font-weight-black text-primary mt-6">
                  {{ formatUptime(healthData?.uptime || 0) }}
                </div>
                <div class="text-caption mt-2 text-grey">Since Engine Ignition</div>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <!-- Active Modules Radar Card -->
      <v-col cols="12" md="6">
        <v-card class="tactical-card elevation-6 h-100">
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
              
              <!-- Badges for Active Modules if data exists -->
              <div v-if="mod.category || mod.weight" class="mt-2 mb-1">
                <v-chip v-if="mod.category" color="info" size="x-small" variant="outlined" class="mr-2">{{ mod.category }}</v-chip>
                <v-chip v-if="mod.weight" :color="getWeightColor(mod.weight)" size="x-small" variant="flat">{{ mod.weight }} Scale</v-chip>
              </div>

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

      <!-- Holographic Armament Config Wizard -->
      <v-col cols="12" md="6">
        <v-card class="tactical-card elevation-6 h-100 holographic-border">
          <v-card-title class="text-warning font-weight-bold">
            <v-icon left color="warning" class="mr-2">mdi-cogs</v-icon>
            Holographic Armament Setup ({{ availablePacks.length }})
          </v-card-title>
          <v-divider color="warning"></v-divider>
          
          <v-card-text v-if="availablePacks.length > 0" class="text-caption text-warning mb-2">
            Select ERP modules based on your current operational scale to prevent system encumbrance.
          </v-card-text>

          <v-list bg-color="transparent" theme="dark">
            <v-list-item v-for="mod in availablePacks" :key="mod.name" class="py-4 item-holographic">
              <template v-slot:prepend>
                <v-icon color="warning" size="large">mdi-hexagon-outline</v-icon>
              </template>
              
              <v-list-item-title class="font-weight-bold text-warning text-h6">{{ mod.name }}</v-list-item-title>
              
              <!-- Scale and Category Badges -->
              <div class="mt-2 mb-2 d-flex align-center flex-wrap gap-2">
                <v-chip 
                  color="warning" 
                  size="small" 
                  variant="outlined" 
                  prepend-icon="mdi-tag-outline"
                >
                  {{ mod.category || 'Uncategorized' }}
                </v-chip>

                <v-chip 
                  :color="getWeightColor(mod.weight || 'Medium')" 
                  size="small" 
                  variant="flat"
                  prepend-icon="mdi-weight"
                >
                  {{ mod.weight || 'Medium' }} Scale
                </v-chip>
              </div>

              <v-list-item-subtitle class="text-body-2 mt-1 text-white opacity-80" style="white-space: normal;">
                {{ mod.description || 'Unknown system architecture detected.' }}
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <v-btn 
                  color="warning" 
                  variant="flat" 
                  size="default" 
                  class="mt-2 font-weight-bold equip-btn text-black"
                  @click="installModule(mod.name)"
                  :loading="installingModule === mod.name"
                >
                  <v-icon left size="small" class="mr-1">mdi-plus-box-outline</v-icon> EQUIP
                </v-btn>
              </template>
            </v-list-item>

            <v-list-item v-if="availablePacks.length === 0 && !loading">
              <v-list-item-title class="text-success text-center py-6 font-weight-bold">
                <v-icon color="success" size="large" class="mb-2 d-block mx-auto">mdi-check-decagram</v-icon>
                All Systems Nominal. Arsenal Fully Equipped.
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

interface ModuleDetail {
  name: string;
  version: string;
  description?: string;
  category?: string;
  weight?: string;
  status: string;
}

interface TelemetryData {
  uptime: number;
  cpuLoad: number;
  memory: {
    total: number;
    free: number;
    used: number;
    usagePercent: string;
  }
}

const allModules = ref<ModuleDetail[]>([]);
const healthData = ref<TelemetryData | null>(null);
const loading = ref(true);
const installingModule = ref<string | null>(null);
const aiWarning = ref(false);
let pollingInterval: NodeJS.Timeout;

const installedPacks = computed(() => allModules.value.filter(m => m.status.includes('Active')));
const availablePacks = computed(() => allModules.value.filter(m => m.status.includes('Available')));

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatUptime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getCpuColor = (load: number) => {
  if (load < 0.5) return 'success';
  if (load < 0.8) return 'warning';
  return 'error';
};

const getMemColor = (percent: number) => {
  if (percent < 60) return 'success';
  if (percent < 85) return 'warning';
  return 'error';
};

const getWeightColor = (weight: string) => {
  if (weight === 'Light') return 'success';
  if (weight === 'Medium') return 'info';
  if (weight === 'Heavy') return 'error';
  return 'secondary';
};

const logout = () => {
  localStorage.removeItem('gundam_jwt');
  router.push('/login');
}

const fetchHealth = async () => {
  try {
    const res = await axios.get('/api/core/health');
    healthData.value = res.data.data;
  } catch (error) {
    console.error("Failed to read telemetry");
  }
};

const fetchModules = async () => {
  loading.value = true;
  const token = localStorage.getItem('gundam_jwt');
  try {
    const response = await axios.get('/api/core/modules', {
      headers: { Authorization: `Bearer ${token}` }
    });
    allModules.value = response.data.data;
    
    // AI Warning Trigger
    if (availablePacks.value.length > 0) {
      aiWarning.value = true;
    }

  } catch (error: any) {
    if (error.response?.status === 401) logout();
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
    await fetchModules();
  } catch (error) {
    console.error("Failed to install module:", error);
    alert(`Failed to equip ${moduleName}`);
  } finally {
    installingModule.value = null;
  }
}

onMounted(() => {
  fetchModules();
  fetchHealth();
  // Poll Telemetry every 2 seconds
  pollingInterval = setInterval(fetchHealth, 2000);
});

onUnmounted(() => {
  clearInterval(pollingInterval);
});
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
  transition: all 0.3s ease;
}

.holographic-border {
  border: 2px solid rgba(245, 176, 65, 0.6) !important;
  box-shadow: inset 0 0 20px rgba(245, 176, 65, 0.1), 0 0 15px rgba(245, 176, 65, 0.2) !important;
}

.item-holographic {
  background: linear-gradient(90deg, rgba(245, 176, 65, 0.05) 0%, transparent 100%);
  border-left: 3px solid #F5B041;
  margin-bottom: 12px;
  border-radius: 0 8px 8px 0;
}

.equip-btn {
  letter-spacing: 1.5px;
}

.pulse-chip {
  animation: pulse 2s infinite;
}

.blink-icon {
  animation: blink 1s infinite alternate;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 232, 143, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(0, 232, 143, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 232, 143, 0); }
}

@keyframes blink {
  0% { opacity: 1; text-shadow: 0 0 10px #FF2A2A; }
  100% { opacity: 0.4; text-shadow: none; }
}

.gap-2 {
  gap: 8px;
}
</style>
