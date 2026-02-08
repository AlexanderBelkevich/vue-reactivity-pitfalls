<template>
  <div class="page">
    <Hero v-model="lang" />

    <main class="layout">
      <section class="panel">
        <CaseList
          :cases="caseCards"
          :selected-id="selectedId"
          :title="t('case.casesTitle')"
          @select="selectCase"
        />
      </section>

      <section class="panel panel--wide">
        <CaseDetailHeader :case-text="caseText" :plain-label="t('case.plainLabel')" />

        <div class="case-logic-host" aria-hidden="true">
          <component
            :is="currentCase.component"
            ref="caseRef"
            :log="addLog"
            :lang="lang"
            :key="`${selectedId}-${lang}`"
          />
        </div>

        <CaseDetailGrid
          :case-text="caseText"
          :current-case="currentCase"
          :highlighted-code="highlightedCode"
          :view-items="viewItems"
          :actions="actions"
          :lang="lang"
          :format-value="formatValue"
        />
      </section>

      <section class="panel">
        <LogPanel
          :logs="logs"
          :title="t('log.title')"
          :hint="t('log.hint')"
          :empty="t('log.empty')"
          :locale="lang === 'ru' ? 'ru-RU' : 'en-US'"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch, provide } from 'vue'
import CaseList from './components/CaseList.vue'
import CaseDetailGrid from './components/CaseDetailGrid.vue'
import CaseDetailHeader from './components/CaseDetailHeader.vue'
import Hero from './components/Hero.vue'
import LogPanel from './components/LogPanel.vue'
import { cases } from './cases'
import { codeToHtml } from 'shiki'
import { useI18n } from './i18n.js'

const lang = ref('ru')
const { t } = useI18n(lang)
provide('t', t)

const selectedId = ref(cases[0].id)
const logs = ref([])
const viewItems = ref([])
const actions = ref([])
const highlightedCode = ref('')
const caseRef = ref(null)

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
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 72px;
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

.case-logic-host {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
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
