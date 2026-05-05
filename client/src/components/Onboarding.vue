<script setup lang="ts">
import { ref } from 'vue';
import { ShieldCheck, ArrowRight } from 'lucide-vue-next';

const emit = defineEmits(['onboard']);

const name = ref('');
const studentId = ref('');
const error = ref('');

const handleSubmit = () => {
  if (!name.value || !studentId.value) {
    error.value = '모든 필드를 입력해주세요.';
    return;
  }

  const idPattern = /^25-\d{3}$/;
  if (!idPattern.test(studentId.value)) {
    error.value = '학번 형식이 올바르지 않습니다. (25-XXX)';
    return;
  }

  emit('onboard', { name: name.value, studentId: studentId.value });
};
</script>

<template>
  <div class="onboarding-screen fade-in">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="header">
      <div class="icon-box glass-card">
        <ShieldCheck :size="48" stroke-width="1.5" />
      </div>
      <h1 class="app-name">KSA Auditor</h1>
    </div>

    <div class="glass-card form-container login-div">
      <div class="form-title">
        <h2>학생 확인</h2>
      </div>

      <div class="input-group">
        <label>성함</label>
        <input v-model="name" type="text" placeholder="이름을 적어주세요" />
      </div>

      <div class="input-group">
        <label>학번</label>
        <input v-model="studentId" type="text" placeholder="25-000 형식으로 적어주세요" />
      </div>

      <div v-if="error" class="error-box">
        <span>{{ error }}</span>
      </div>

      <button class="btn-primary start-btn" @click="handleSubmit">
        <span>시작하기</span>
        <ArrowRight :size="20" />
      </button>
    </div>

  </div>
</template>

<style scoped>
.onboarding-screen {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-blobs {
  position: absolute;
  inset: 0;
  z-index: -1;
  filter: blur(80px);
  opacity: 0.5;
}

.blob {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
}

.blob-1 {
  background: var(--primary);
  top: -100px;
  left: -100px;
  animation: float 10s infinite alternate;
}

.blob-2 {
  background: #a855f7;
  bottom: -100px;
  right: -100px;
  animation: float 12s infinite alternate-reverse;
}

@keyframes float {
  from { transform: translate(0, 0); }
  to { transform: translate(40px, 40px); }
}

.header {
  text-align: center;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-box {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: var(--primary);
  border-radius: 20px;
}

.app-name {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-main);
  letter-spacing: -1.5px;
}

.login-div {
  margin: 20px auto;
  width: calc(100% - 32px);
  max-width: 400px;
}

.form-container {
  padding: 24px 20px;
}

.form-title h2 {
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.form-title p {
  display: none;
}

.error-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--error);
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.start-btn {
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 1.05rem;
  border-radius: 16px;
}

.spacer {
  height: 40px;
}
</style>
