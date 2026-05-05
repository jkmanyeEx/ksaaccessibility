<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { MapPin, Lightbulb } from 'lucide-vue-next';

interface Report {
  id: number;
  student_name: string;
  student_id: string;
  issue_name: string;
  description: string;
  severity: number;
  suggested_fix: string;
  photo_path: string;
  created_at: string;
}

const reports = ref<Report[]>([]);
const loading = ref(true);

const fetchReports = async () => {
  try {
    const response = await axios.get('/api/reports');
    reports.value = response.data.sort((a: Report, b: Report) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch {
    console.error('피드를 불러오지 못했습니다.');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchReports);

const severityMap: Record<number, { name: string; tag: string; color: string }> = {
  1: { name: '완전 차단', tag: 'Barrier',   color: '#ef4444' },
  2: { name: '위험 지대', tag: 'Hazard',    color: '#f97316' },
  3: { name: '도움 필수', tag: 'Dependent', color: '#f59e0b' },
  4: { name: '불편 지체', tag: 'Clumsy',    color: '#84cc16' },
  5: { name: '단순 미흡', tag: 'Minor',     color: '#10b981' },
};

const getSeverity = (level: number) => severityMap[level] ?? { name: '미분류', tag: '', color: '#94a3b8' };

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return '방금 전';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 전`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>

<template>
  <div class="feed slide-up">

    <div v-if="loading" class="state-box">
      <div class="spinner"></div>
      <p>제보 목록을 불러오는 중...</p>
    </div>

    <div v-else-if="reports.length === 0" class="state-box glass-card empty">
      <MapPin :size="40" class="empty-icon" />
      <h3>아직 제보가 없어요</h3>
      <p>학교를 돌아보며<br>불편한 곳을 가장 먼저 알려주세요.</p>
    </div>

    <div v-else class="reports-list">
      <div v-for="report in reports" :key="report.id" class="report-card glass-card">

        <div class="card-top">
          <h3 class="issue-name">{{ report.issue_name }}</h3>
          <div class="severity-chip"
            :style="{ color: getSeverity(report.severity).color, background: getSeverity(report.severity).color + '15' }">
            <span class="chip-dot" :style="{ background: getSeverity(report.severity).color }"></span>
            {{ getSeverity(report.severity).name }}
            <span class="chip-tag">{{ getSeverity(report.severity).tag }}</span>
          </div>
        </div>

        <img :src="report.photo_path" class="report-img" alt="현장 사진" />

        <div class="card-body">
          <p class="description">{{ report.description }}</p>

          <div v-if="report.suggested_fix" class="fix-box">
            <Lightbulb :size="14" class="fix-icon" />
            <p>{{ report.suggested_fix }}</p>
          </div>

          <div class="card-footer">
            <div class="author-chip">
              <span class="avatar">{{ report.student_name.charAt(0) }}</span>
              <span class="author-name">{{ report.student_name }}</span>
              <span class="author-id">{{ report.student_id }}</span>
            </div>
            <span class="timestamp">{{ formatDate(report.created_at) }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.feed {
  padding-bottom: 20px;
}

/* ── Loading / Empty ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: #adb5bd;
  gap: 12px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(99, 102, 241, 0.12);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty {
  margin-top: 16px;
  padding: 48px 28px;
}

.empty-icon {
  color: #c9cfe0;
  margin-bottom: 4px;
}

.empty h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #5a6478;
  margin: 0;
}

.empty p {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

/* ── Cards ── */
.reports-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-card {
  overflow: hidden;
  padding: 0;
}

.card-top {
  padding: 16px 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.issue-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.3;
  flex: 1;
  margin: 0;
}

.severity-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 800;
  white-space: nowrap;
  flex-shrink: 0;
}

.chip-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.chip-tag {
  font-weight: 500;
  opacity: 0.7;
  font-size: 0.68rem;
  letter-spacing: 0.2px;
}

/* ── Image ── */
.report-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
}

/* ── Body ── */
.card-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.description {
  font-size: 0.95rem;
  color: #3a4252;
  line-height: 1.6;
  margin: 0;
}

.fix-box {
  display: flex;
  gap: 8px;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  padding: 10px 12px;
  align-items: flex-start;
}

.fix-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--primary);
}

.fix-box p {
  margin: 0;
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
}

/* ── Footer ── */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-chip {
  display: flex;
  align-items: center;
  gap: 7px;
}

.avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3a4252;
}

.author-id {
  font-size: 0.75rem;
  color: #adb5bd;
}

.timestamp {
  font-size: 0.75rem;
  color: #adb5bd;
  font-weight: 500;
}
</style>
