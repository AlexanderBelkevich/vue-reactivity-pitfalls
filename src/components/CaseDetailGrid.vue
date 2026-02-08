<template>
  <div class="case-grid">
    <div class="card card--wide">
      <h3>{{ t('case.codeTitle') }}</h3>
      <div v-html="highlightedCode" class="code"></div>
    </div>

    <div class="card card--wide">
      <h3>{{ t('case.stepsTitle') }}</h3>
      <ol class="steps">
        <li v-for="step in caseText.steps" :key="step">{{ step }}</li>
      </ol>
      <div class="expected">
        <span>{{ t('case.expectedLabel') }}</span>
        {{ caseText.expected }}
      </div>
    </div>

    <div class="card">
      <h3>{{ t('case.actionsTitle') }}</h3>
      <div class="actions">
        <button
          v-for="action in actions"
          :key="action.label"
          type="button"
          class="btn"
          @click="action.run"
        >
          {{ action.label }}
        </button>
      </div>
    </div>

    <div class="card">
      <h3>{{ t('case.stateTitle') }}</h3>
      <ul class="state-list">
        <li v-for="item in viewItems" :key="item.label">
          <span class="state-label">{{ item.label }}</span>
          <span class="state-value">{{ formatValue(item.get()) }}</span>
        </li>
      </ul>
    </div>

    <div class="card">
      <h3>{{ t('case.notesTitle') }}</h3>
      <ul class="notes">
        <li v-for="note in caseText.notes" :key="note">{{ note }}</li>
      </ul>
    </div>

    <div class="card">
      <h3>{{ t('case.termsTitle') }}</h3>
      <div class="terms">
        <article
          v-for="item in currentCase.terms"
          :key="item.name"
          class="terms__item"
        >
          <div class="terms__title">{{ item.name }}</div>
          <div class="terms__desc">{{ item.desc[locale] }}</div>
          <a
            class="terms__link"
            :href="item.link"
            target="_blank"
            rel="noreferrer"
          >
            {{ t('case.docsLabel') }}
          </a>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../i18n.js'

defineProps({
  caseText: {
    type: Object,
    required: true,
  },
  currentCase: {
    type: Object,
    required: true,
  },
  highlightedCode: {
    type: String,
    default: '',
  },
  viewItems: {
    type: Array,
    required: true,
  },
  actions: {
    type: Array,
    required: true,
  },
})

const { t, locale } = useI18n()

const formatValue = (value) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    const preview = value.slice(0, 6).join(', ')
    const totalLabel = t.value('common.arrayTotal')
    return value.length > 6
      ? `[${preview}, …] (${totalLabel} ${value.length})`
      : `[${preview}] (${totalLabel} ${value.length})`
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
</script>

<style scoped>
.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  background: var(--card-alt);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--stroke);
}

.card h3 {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 12px;
}

.card--wide {
  grid-column: 1 / -1;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  background: var(--accent);
  color: white;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 10px 18px rgba(255, 107, 53, 0.25);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(255, 107, 53, 0.32);
}

.state-list {
  list-style: none;
  display: grid;
  gap: 10px;
}

.state-list li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.95rem;
}

.state-label {
  color: var(--muted);
}

.state-value {
  font-weight: 600;
}

.code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  background: #0d0f12;
  color: #f7f2e8;
  padding: 12px;
  border-radius: 12px;
  min-height: 140px;
}

.notes {
  list-style: disc;
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}

.steps {
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
  font-size: 0.9rem;
}

.expected {
  margin-top: 12px;
  padding: 10px;
  border-radius: 12px;
  background: #fff6e5;
  border: 1px solid var(--stroke);
  font-size: 0.9rem;
  color: var(--ink);
}

.expected span {
  font-weight: 600;
  margin-right: 6px;
  color: var(--accent-dark);
}

.terms {
  display: grid;
  gap: 10px;
}

.terms__item {
  background: #fffdf8;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid var(--stroke);
  display: grid;
  gap: 6px;
}

.terms__title {
  font-weight: 700;
}

.terms__desc {
  color: var(--muted);
  font-size: 0.9rem;
}

.terms__link {
  color: var(--accent-dark);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.terms__link:hover {
  text-decoration: underline;
}
</style>
