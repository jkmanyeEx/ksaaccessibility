<script setup lang="ts">
import { ref } from 'vue';
import { ClipboardList, LayoutGrid, LogOut } from 'lucide-vue-next';
import ReportForm from './ReportForm.vue';
import Feed from './Feed.vue';

const props = defineProps<{
  user: { name: string, studentId: string }
}>();

const emit = defineEmits(['logout']);

const activeTab = ref('report');

const handleReportSubmitted = () => {
  activeTab.value = 'feed';
};
</script>

<template>
  <div class="dashboard">
    <header class="top-nav glass-card">
      <div class="brand">
        <span class="app-title">KSA Auditor</span>
      </div>
      <div class="user-meta">
        <div class="user-text">
          <span class="name">{{ user.name }}</span>
          <span class="id">{{ user.studentId }}</span>
        </div>
        <button class="logout-btn" @click="emit('logout')">
          <LogOut :size="18" />
        </button>
      </div>
    </header>

    <main class="content">
      <div class="tab-content fade-in" :key="activeTab">
        <ReportForm v-if="activeTab === 'report'" @submitted="handleReportSubmitted" />
        <Feed v-else />
      </div>
    </main>

    <nav class="bottom-nav glass-card">
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'report' }"
        @click="activeTab = 'report'"
      >
        <div class="icon-wrapper">
          <ClipboardList :size="24" />
        </div>
        <span>보고하기</span>
      </button>
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'feed' }"
        @click="activeTab = 'feed'"
      >
        <div class="icon-wrapper">
          <LayoutGrid :size="24" />
        </div>
        <span>피드</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.top-nav {
  position: sticky;
  top: 12px;
  margin: 12px 16px 8px 16px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  z-index: 100;
}

.app-title {
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--primary);
  letter-spacing: -0.5px;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.name {
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.2;
}

.id {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.logout-btn {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 120px 16px;
  -webkit-overflow-scrolling: touch;
}

.bottom-nav {
  position: fixed;
  bottom: 24px;
  left: 20px;
  right: 20px;
  height: 76px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 28px;
  z-index: 1000;
  padding: 0 10px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 4px;
  padding: 8px 0;
}

.icon-wrapper {
  padding: 6px;
  border-radius: 16px;
  transition: all 0.3s;
}

.nav-item.active {
  color: var(--primary);
}

.nav-item.active .icon-wrapper {
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}
</style>
