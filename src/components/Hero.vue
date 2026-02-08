<template>
  <header class="hero">
    <div class="hero__text">
      <h1>{{ ui.title }}</h1>
      <p>{{ ui.subtitle }}</p>
      <div class="lang-toggle">
        <button
          class="lang-btn"
          :class="{ 'lang-btn--active': modelValue === 'ru' }"
          type="button"
          @click="$emit('update:modelValue', 'ru')"
        >
          RU
        </button>
        <button
          class="lang-btn"
          :class="{ 'lang-btn--active': modelValue === 'en' }"
          type="button"
          @click="$emit('update:modelValue', 'en')"
        >
          EN
        </button>
      </div>
      <div class="author">
        <div class="author__label">{{ ui.authorLabel }}</div>
        <div class="author__name">
          {{ modelValue === 'ru' ? 'Александр Белькевич' : 'Alexander Belkevich' }}
        </div>
        <a
          class="author__link"
          href="https://t.me/+1_SXM1gq1PE0MTli"
          target="_blank"
          rel="noreferrer"
        >
          {{ ui.authorLink }}
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  ui: {
    type: Object,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.hero {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}

.hero__text {
  max-width: 640px;
}

.hero h1 {
  font-size: clamp(2.4rem, 3vw, 3.4rem);
  letter-spacing: -0.02em;
  margin: 12px 0 12px;
}

.hero p {
  color: var(--muted);
  font-size: 1.05rem;
}

.lang-toggle {
  margin-top: 16px;
  display: inline-flex;
  gap: 8px;
  background: var(--card);
  padding: 6px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
}

.lang-btn {
  border: none;
  background: transparent;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  color: var(--muted);
}

.lang-btn--active {
  background: var(--accent);
  color: white;
  box-shadow: 0 8px 14px rgba(255, 107, 53, 0.25);
}

.author {
  margin-top: 18px;
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #fffdf8;
  border: 1px solid var(--stroke);
  max-width: 320px;
}

.author__label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.author__name {
  font-weight: 700;
  font-size: 1rem;
}

.author__link {
  color: var(--accent-dark);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.author__link:hover {
  text-decoration: underline;
}
</style>
