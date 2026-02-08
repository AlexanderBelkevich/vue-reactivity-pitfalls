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

        <div class="case-grid">
          <div class="card card--wide">
            <h3>{{ ui.codeTitle }}</h3>
            <pre class="code"><code>{{ currentCase.code }}</code></pre>
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
import { computed, effectScope, onMounted, ref, watch } from 'vue'
import CaseList from './components/CaseList.vue'
import LogPanel from './components/LogPanel.vue'
import { cases } from './cases'

const lang = ref('ru')
const selectedId = ref(cases[0].id)
const logs = ref([])
const viewItems = ref([])
const actions = ref([])
let scope = null

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

const addLog = (message) => {
  logs.value.unshift({
    id: `${Date.now()}-${Math.random()}`,
    time: new Date(),
    message,
  })
}

const setupCase = () => {
  if (scope) scope.stop()
  logs.value = []
  viewItems.value = []
  actions.value = []

  scope = effectScope()
  scope.run(() => {
    const instance = currentCase.value.create({ log: addLog, lang: lang.value })
    viewItems.value = instance.view
    actions.value = instance.actions
    if (instance.init) instance.init()
  })
}

const selectCase = (id) => {
  selectedId.value = id
}

watch([selectedId, lang], setupCase)

onMounted(setupCase)

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
