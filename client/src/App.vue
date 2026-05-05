<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Onboarding from './components/Onboarding.vue';
import Dashboard from './components/Dashboard.vue';

interface User {
  name: string;
  studentId: string;
}

const user = ref<User | null>(null);

onMounted(() => {
  const savedUser = localStorage.getItem('ksa_user');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }
});

const handleOnboard = (userData: User) => {
  user.value = userData;
  localStorage.setItem('ksa_user', JSON.stringify(userData));
};

const handleLogout = () => {
  user.value = null;
  localStorage.removeItem('ksa_user');
};
</script>

<template>
  <div class="app-container">
    <Onboarding v-if="!user" @onboard="handleOnboard" />
    <Dashboard v-else :user="user" @logout="handleLogout" />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
