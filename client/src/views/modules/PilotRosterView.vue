<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-primary font-weight-bold tactical-header">
          <v-icon size="x-large" color="primary" class="mr-3">mdi-account-group</v-icon>
          PILOT ROSTER SYSTEM
        </h1>
        <p class="text-secondary subtitle-1">Core roster module managing Pilot authentication and HR security.</p>
      </v-col>
    </v-row>

    <!-- Data Table Card -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="tactical-card elevation-6">
          <v-card-title class="text-secondary font-weight-bold d-flex justify-space-between align-center">
            <div>
              <v-icon left color="secondary" class="mr-2">mdi-shield-check</v-icon>
              Registered Pilots
            </div>
            
            <v-chip color="primary" variant="outlined">
              <v-icon left>mdi-account-multiple</v-icon>
              {{ pilots.length }} Active
            </v-chip>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-data-table
            :headers="headers"
            :items="pilots"
            :loading="loading"
            class="tactical-table"
            theme="dark"
          >
            <!-- Custom Cell Renderers -->
            <template v-slot:item.isSuperAdmin="{ item }">
              <v-chip
                :color="item.isSuperAdmin ? 'error' : 'info'"
                size="small"
                variant="flat"
              >
                {{ item.isSuperAdmin ? 'LEVEL-5 COMMANDER' : 'STANDARD PILOT' }}
              </v-chip>
            </template>

            <template v-slot:item.createdAt="{ item }">
              {{ new Date(item.createdAt).toLocaleString() }}
            </template>
            
            <template v-slot:item.actions="{ item }">
               <v-btn icon="mdi-pencil" size="small" variant="text" color="secondary" title="Modify Permissions"></v-btn>
               <v-btn icon="mdi-delete" size="small" variant="text" color="error" title="Revoke Access"></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

interface Pilot {
  id: number;
  email: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

const pilots = ref<Pilot[]>([]);
const loading = ref(true);

const headers: any = [
  { title: 'Pilot ID (Email)', key: 'email', align: 'start' },
  { title: 'Clearance Level', key: 'isSuperAdmin', align: 'center' },
  { title: 'Enrollment Date', key: 'createdAt', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false }
];

const fetchPilots = async () => {
  loading.value = true;
  const token = localStorage.getItem('gundam_jwt');
  try {
    const response = await axios.get('/api/pilot', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // the /api/pilot endpoint returns an inner 'data' array based on previous phases
    pilots.value = response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem('gundam_jwt');
      router.push('/login');
    }
    console.error("Failed to fetch Pilots", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchPilots();
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
}

/* Customizing the Vuetify Data Table to fit the Tactical Theme */
:deep(.tactical-table) {
  background: transparent !important;
}

:deep(.tactical-table th) {
  background-color: rgba(18, 28, 34, 0.9) !important;
  color: #00D1FF !important;
  font-weight: bold;
  letter-spacing: 1px;
}

:deep(.tactical-table tbody tr:hover) {
  background-color: rgba(0, 232, 143, 0.1) !important;
}

:deep(.tactical-table td) {
  border-bottom: 1px solid rgba(0, 232, 143, 0.1) !important;
}
</style>
