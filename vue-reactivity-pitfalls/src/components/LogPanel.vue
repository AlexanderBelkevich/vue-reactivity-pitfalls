<template>
  <div class="log-panel">
    <h3>{{ title }}</h3>
    <p class="log-hint">{{ hint }}</p>
    <div class="log-list">
      <div v-if="!logs.length" class="log-empty">{{ empty }}</div>
      <div v-for="item in logs" :key="item.id" class="log-item">
        <span class="log-time">{{ formatTime(item.time) }}</span>
        <span class="log-message">{{ item.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logs: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
    required: true,
  },
  empty: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
})

const formatTime = (value) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>
