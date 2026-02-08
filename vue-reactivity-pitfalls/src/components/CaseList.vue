<template>
  <div class="case-list">
    <h3>{{ title }}</h3>
    <button
      v-for="item in cases"
      :key="item.id"
      class="case-item"
      :class="{ 'case-item--active': item.id === selectedId }"
      @click="$emit('select', item.id)"
    >
      <span class="case-title">{{ item.title }}</span>
      <span class="case-sub">{{ item.short }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  cases: {
    type: Array,
    required: true,
  },
  selectedId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

defineEmits(['select'])
</script>
