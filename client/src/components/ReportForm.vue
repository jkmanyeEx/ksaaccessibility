<script setup lang="ts">
import { ref, computed } from 'vue';
import { Camera, Send } from 'lucide-vue-next';
import axios from 'axios';

const emit = defineEmits(['submitted']);

const issueName = ref('');
const description = ref('');
const severity = ref(3);
const suggestedFix = ref('');
const photo = ref<File | null>(null);
const photoPreview = ref<string | null>(null);
const loading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const severityGuidelines = [
  { level: 1, name: '완전 차단', tag: 'Barrier', color: '#ef4444', desc: '통과나 이용이 전혀 불가능한 상태예요.' },
  { level: 2, name: '위험 지대', tag: 'Hazard', color: '#f97316', desc: '사용하다 다칠 위험이 있는 상태예요.' },
  { level: 3, name: '도움 필수', tag: 'Dependent', color: '#f59e0b', desc: '혼자서는 어렵고 타인의 도움이 필요해요.' },
  { level: 4, name: '불편 지체', tag: 'Clumsy', color: '#84cc16', desc: '혼자 가능하지만 힘들고 시간이 걸려요.' },
  { level: 5, name: '단순 미흡', tag: 'Minor', color: '#10b981', desc: '사용에 지장은 없지만 개선이 필요해요.' },
];

const currentGuideline = computed(() => severityGuidelines.find(g => g.level === severity.value));

const handlePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    photo.value = target.files[0];
    photoPreview.value = URL.createObjectURL(target.files[0]);
  }
};

const submitReport = async () => {
  if (!issueName.value || !description.value || !photo.value) {
    alert('사진과 필수 항목을 모두 입력해주세요.');
    return;
  }

  loading.value = true;
  const formData = new FormData();
  formData.append('issue_name', issueName.value);
  formData.append('description', description.value);
  formData.append('severity', severity.value.toString());
  formData.append('suggested_fix', suggestedFix.value);
  formData.append('photo', photo.value);

  const user = JSON.parse(localStorage.getItem('ksa_user') || '{}');
  formData.append('student_name', user.name);
  formData.append('student_id', user.studentId);

  try {
    await axios.post('/api/reports', formData);
    emit('submitted');
  } catch {
    alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="report-form slide-up">
    <div class="glass-card form-box">

      <div class="input-group">
        <label>위치와 불편 사항</label>
        <input v-model="issueName" type="text" placeholder="건물명, 층, 구체적인 장소를 포함해 주세요" />
      </div>

      <div class="input-group">
        <label>현장 사진</label>
        <div class="photo-upload-area" @click="fileInput?.click()">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            accept="image/*"
            capture="environment"
            @change="handlePhotoUpload"
          />
          <div v-if="!photoPreview" class="placeholder">
            <Camera :size="36" />
            <span>탭하여 사진 찍기</span>
          </div>
          <img v-else :src="photoPreview" class="preview-img" />
        </div>
      </div>

      <div class="input-group">
        <label>상황 설명</label>
        <textarea v-model="description" rows="3" placeholder="어떤 점이 불편한지 구체적으로 적어주세요."></textarea>
      </div>

      <div class="input-group">
        <label>심각도 판단</label>
        <div class="severity-picker">
          <button
            v-for="g in severityGuidelines"
            :key="g.level"
            class="severity-btn"
            :class="{ active: severity === g.level }"
            :style="severity === g.level ? { background: g.color, borderColor: g.color } : {}"
            @click="severity = g.level"
          >
            {{ g.level }}
          </button>
        </div>

        <div v-if="currentGuideline" class="guideline-card" :style="{ borderColor: currentGuideline.color + '40' }">
          <div class="guideline-title">
            <span class="level-badge" :style="{ background: currentGuideline.color + '18', color: currentGuideline.color }">
              {{ currentGuideline.name }}
            </span>
            <span class="level-tag">{{ currentGuideline.tag }}</span>
          </div>
          <p class="guideline-desc">{{ currentGuideline.desc }}</p>
        </div>
      </div>

      <div class="input-group">
        <label>개선 제안 <span class="optional">선택</span></label>
        <textarea v-model="suggestedFix" rows="2" placeholder="어떻게 고치면 좋을지 생각이 있다면 남겨주세요."></textarea>
      </div>

      <button class="submit-btn" :disabled="loading" @click="submitReport">
        <Send v-if="!loading" :size="18" />
        <span>{{ loading ? '제출 중...' : '제보 완료' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.report-form {
  padding-bottom: 40px;
}

.form-box {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.photo-upload-area {
  width: 100%;
  aspect-ratio: 16/9;
  border: 1.5px dashed rgba(99, 102, 241, 0.25);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  background: rgba(248, 249, 255, 0.6);
  transition: border-color 0.2s, background 0.2s;
}

.photo-upload-area:hover {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.04);
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b0b7c3;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.severity-picker {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.severity-btn {
  flex: 1;
  height: 42px;
  border-radius: 12px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  background: white;
  font-weight: 700;
  font-size: 0.95rem;
  color: #adb5bd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.severity-btn.active {
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.guideline-card {
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid transparent;
  background: rgba(250, 250, 253, 0.8);
  transition: all 0.3s ease;
}

.guideline-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.level-badge {
  font-size: 0.8rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 8px;
}

.level-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #adb5bd;
  letter-spacing: 0.5px;
}

.guideline-desc {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
  margin: 0;
}

.optional {
  font-size: 0.75rem;
  font-weight: 500;
  color: #adb5bd;
  margin-left: 6px;
}

.submit-btn {
  width: 100%;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  font-family: inherit;
  letter-spacing: -0.2px;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
