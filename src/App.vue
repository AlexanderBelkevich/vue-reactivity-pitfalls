<template>
  <div class="page">
    <header class="hero">
      <div class="hero__text">
        <h1>{{ ui.title }}</h1>
        <p>{{ ui.subtitle }}</p>
        <div class="lang-toggle">
          <button
            class="lang-btn"
            :class="{ 'lang-btn--active': lang === 'ru' }"
            @click="lang = 'ru'"
          >
            RU
          </button>
          <button
            class="lang-btn"
            :class="{ 'lang-btn--active': lang === 'en' }"
            @click="lang = 'en'"
          >
            EN
          </button>
        </div>
        <div class="author">
          <div class="author__label">{{ ui.authorLabel }}</div>
          <div class="author__name">
            {{ lang === 'ru' ? 'Александр Белькевич' : 'Alexander Belkevich' }}
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

    <main class="layout">
      <section class="panel">
        <CaseList
          :cases="caseCards"
          :selected-id="selectedId"
          :title="ui.casesTitle"
          @select="selectCase"
        />
      </section>

      <section class="panel panel--wide">
        <header class="case-header">
          <h2>{{ caseText.title }}</h2>
          <p>{{ caseText.summary }}</p>
          <div class="plain">
            {{ ui.plainLabel }} {{ caseText.plain }}
          </div>
        </header>

        <div class="case-logic-host" aria-hidden="true">
          <component
            :is="currentCase.component"
            ref="caseRef"
            :log="addLog"
            :lang="lang"
            :key="`${selectedId}-${lang}`"
          />
        </div>

        <div class="case-grid">
          <div class="card card--wide">
            <h3>{{ ui.codeTitle }}</h3>
            <div v-html="highlightedCode" class="code"></div>
          </div>

          <div class="card card--wide">
            <h3>{{ ui.stepsTitle }}</h3>
            <ol class="steps">
              <li v-for="step in caseText.steps" :key="step">{{ step }}</li>
            </ol>
            <div class="expected">
              <span>{{ ui.expectedLabel }}</span>
              {{ caseText.expected }}
            </div>
          </div>

          <div class="card">
            <h3>{{ ui.actionsTitle }}</h3>
            <div class="actions">
              <button
                v-for="action in actions"
                :key="action.label"
                class="btn"
                @click="action.run"
              >
                {{ action.label }}
              </button>
            </div>
          </div>

          <div class="card">
            <h3>{{ ui.stateTitle }}</h3>
            <ul class="state-list">
              <li v-for="item in viewItems" :key="item.label">
                <span class="state-label">{{ item.label }}</span>
                <span class="state-value">{{ formatValue(item.get()) }}</span>
              </li>
            </ul>
          </div>

          <div class="card">
            <h3>{{ ui.notesTitle }}</h3>
            <ul class="notes">
              <li v-for="note in caseText.notes" :key="note">{{ note }}</li>
            </ul>
          </div>

          <div class="card">
            <h3>{{ ui.termsTitle }}</h3>
            <div class="terms">
              <article v-for="item in currentCase.terms" :key="item.name" class="terms__item">
                <div class="terms__title">{{ item.name }}</div>
                <div class="terms__desc">{{ item.desc[lang] }}</div>
                <a class="terms__link" :href="item.link" target="_blank" rel="noreferrer">
                  {{ ui.docsLabel }}
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <LogPanel
          :logs="logs"
          :title="ui.logTitle"
          :hint="ui.logHint"
          :empty="ui.logEmpty"
          :locale="lang === 'ru' ? 'ru-RU' : 'en-US'"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import CaseList from './components/CaseList.vue'
import LogPanel from './components/LogPanel.vue'
import { cases } from './cases'
import { codeToHtml } from 'shiki'

const lang = ref('ru')
const selectedId = ref(cases[0].id)
const logs = ref([])
const viewItems = ref([])
const actions = ref([])
const highlightedCode = ref('')
const caseRef = ref(null)

const ui = computed(() => {
  const labels = {
    ru: {
      title: 'Подводные камни реактивности',
      subtitle:
        'Небольшая песочница: кликай на действия и смотри, где Vue ведет себя неожиданно.',
      casesTitle: 'Кейсы',
      plainLabel: 'По-простому:',
      actionsTitle: 'Действия',
      stateTitle: 'Состояние',
      stepsTitle: 'Как тестировать',
      expectedLabel: 'Ожидаемо:',
      codeTitle: 'Код',
      notesTitle: 'Что важно помнить',
      termsTitle: 'Термины и ссылки',
      docsLabel: 'Документация',
      authorLabel: 'Автор',
      authorLink: 'Telegram-группа',
      logTitle: 'Лог реактивности',
      logHint: 'Первые строки — самые свежие события.',
      logEmpty: 'Пока пусто. Запусти любое действие.',
    },
    en: {
      title: 'Reactivity Pitfalls',
      subtitle:
        'A small playground: click actions and see where Vue behaves unexpectedly.',
      casesTitle: 'Cases',
      plainLabel: 'In simple words:',
      actionsTitle: 'Actions',
      stateTitle: 'State',
      stepsTitle: 'How to test',
      expectedLabel: 'Expected:',
      codeTitle: 'Code',
      notesTitle: 'Key takeaways',
      termsTitle: 'Terms and links',
      docsLabel: 'Docs',
      authorLabel: 'Author',
      authorLink: 'Telegram group',
      logTitle: 'Reactivity log',
      logHint: 'Newest events are on top.',
      logEmpty: 'Nothing yet. Run an action.',
    },
  }
  return labels[lang.value]
})

const currentCase = computed(() => {
  return cases.find((item) => item.id === selectedId.value) ?? cases[0]
})

const caseText = computed(() => currentCase.value.text[lang.value])

const caseCards = computed(() =>
  cases.map((item) => ({
    id: item.id,
    title: item.text[lang.value].title,
    short: item.short[lang.value],
  })),
)

watch(currentCase, async (c) => {
  highlightedCode.value = await codeToHtml(c.code.trim(), {
    lang: 'javascript',
    theme: 'vitesse-dark',
  })
}, { immediate: true, deep: true })

watch(selectedId, () => {
  logs.value = []
})

watch(
  caseRef,
  (ref) => {
    if (ref?.view) {
      viewItems.value = ref.view
      actions.value = ref.actions
    } else {
      viewItems.value = []
      actions.value = []
    }
  },
  { flush: 'post' },
)

const addLog = (message) => {
  logs.value.unshift({
    id: `${Date.now()}-${Math.random()}`,
    time: new Date(),
    message,
  })
}

const selectCase = (id) => {
  selectedId.value = id
}

const formatValue = (value) => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    const preview = value.slice(0, 6).join(', ')
    return value.length > 6
      ? `[${preview}, …] (${lang.value === 'ru' ? 'всего' : 'total'} ${value.length})`
      : `[${preview}] (${lang.value === 'ru' ? 'всего' : 'total'} ${value.length})`
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 72px;
}

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

.layout {
  display: grid;
  grid-template-columns: 260px 1fr 260px;
  gap: 20px;
}

.panel {
  background: var(--card);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--stroke);
}

.panel--wide {
  padding: 24px;
}

.case-header h2 {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.case-header p {
  color: var(--muted);
  margin-bottom: 18px;
}

.plain {
  background: #fff6e5;
  border: 1px solid var(--stroke);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.95rem;
  color: var(--ink);
  margin-bottom: 16px;
}

.case-logic-host {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

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

@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .panel {
    order: 0;
  }
}
</style>
