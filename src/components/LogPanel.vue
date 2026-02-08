<template>
  <div class="log-panel">
    <h3>{{ t('log.title') }}</h3>
    <p class="log-hint">{{ t('log.hint') }}</p>
    <div class="log-list">
      <div v-if="!logs.length" class="log-empty">{{ t('log.empty') }}</div>
      <div v-for="item in logs" :key="item.id" class="log-item">
        <span class="log-time">{{ formatTime(item.time) }}</span>
        <span class="log-message">{{ item.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n.js'
import { useCases } from '../useCases.js'

const { t, locale } = useI18n()
const { logs } = useCases()
const dateLocale = computed(() => (locale.value === 'ru' ? 'ru-RU' : 'en-US'))

const formatTime = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleTimeString(dateLocale.value, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>

<style scoped>
.log-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-panel h3 {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.log-hint {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 8px;
}

.log-list {
  display: grid;
  gap: 8px;
}

.log-item {
  background: #fdf7ee;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid var(--stroke);
  font-size: 0.85rem;
}

.log-time {
  font-family: 'JetBrains Mono', monospace;
  margin-right: 6px;
  color: var(--accent-dark);
}

.log-empty {
  color: var(--muted);
  padding: 10px;
  border: 1px dashed var(--stroke);
  border-radius: 10px;
}
</style>
