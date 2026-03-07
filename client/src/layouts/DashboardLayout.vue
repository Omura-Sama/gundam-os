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
        <v-list-item prepend-icon="mdi-radar" title="Core Dashboard" to="/" exact></v-list-item>
        
        <!-- Only show Active Modules in Sidebar as Router Links -->
        <v-list-item
          v-for="mod in installedPacks"
          :key="mod.name"
          :prepend-icon="getModuleIcon(mod.name)"
          :title="mod.name"
          :to="`/module/${mod.name.toLowerCase()}`"
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

    <!-- Main Content Rendering Area (Nested Routes) -->
    <v-main class="tactical-main">
      <router-view></router-view>
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

const installedPacks = computed(() => {
  return allModules.value.filter(m => m.status.includes('Active'));
});

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

const fetchModules = async () => {
  const token = localStorage.getItem('gundam_jwt');
  try {
    const response = await axios.get('/api/core/modules', {
      headers: { Authorization: `Bearer ${token}` }
    });
    allModules.value = response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) logout();
  }
}

// In a real app with pinia, we'd watch for installation events to re-fetch this.
// For now, we fetch on mount.
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

.tactical-main {
  height: 100vh;
  overflow-y: auto;
}
</style>
