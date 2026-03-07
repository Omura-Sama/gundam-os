<template>
  <div class="login-container">
    <v-card class="login-card elevation-24" color="rgba(18, 28, 34, 0.8)">
      <v-card-title class="text-center font-weight-bold text-primary pb-4 tactical-title">
        <v-icon size="large" color="primary" class="mr-2">mdi-robot-outline</v-icon>
        GUNDAM-OS COCKPIT
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Pilot ID (Email)"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Access Code"
            prepend-inner-icon="mdi-lock"
            type="password"
            variant="outlined"
            color="primary"
            required
            class="mt-2"
          ></v-text-field>
          <div v-if="errorMsg" class="text-error text-center mt-2">{{ errorMsg }}</div>
          <v-btn
            block
            color="primary"
            class="mt-6 font-weight-bold launch-btn"
            size="large"
            type="submit"
            :loading="loading"
          >
            INITIATE LAUNCH
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const response = await axios.post('/api/pilot/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('gundam_jwt', response.data.token);
    router.push('/');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Connection to Core failed.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #121C22 0%, #000000 100%);
  position: relative;
  overflow: hidden;
}

/* Add a subtle grid overlay for tactical feel */
.login-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 232, 143, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 232, 143, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 232, 143, 0.4) !important;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 232, 143, 0.1) !important;
}

.tactical-title {
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 232, 143, 0.5);
}

.launch-btn {
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
}
.launch-btn:hover {
  box-shadow: 0 0 15px rgba(0, 232, 143, 0.6);
  transform: translateY(-2px);
}
</style>
