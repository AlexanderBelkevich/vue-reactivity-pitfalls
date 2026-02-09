<template>
  <div class="card" :class="{ 'card--wide': wide }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  wide: { type: Boolean, default: false },
})
</script>

<style scoped>
.card {
  background: var(--card-alt);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--stroke);
}

.card--wide {
  grid-column: 1 / -1;
}

.card :deep(h3) {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 12px;
}
</style>
