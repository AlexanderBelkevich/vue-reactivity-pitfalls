<template>
  <div class="page">
    <Hero v-model="locale" />

    <main class="layout">
      <section class="panel">
        <CaseList
          :cases="caseCards"
          :selected-id="selectedId"
          @select="selectCase"
        />
      </section>

      <section class="panel panel--wide">
        <CaseDetailHeader :case-text="caseText" />

        <div class="case-logic-host" aria-hidden="true">
          <component
            :is="currentCase.component"
            ref="caseRef"
            :log="addLog"
            :key="`${selectedId}-${locale}`"
          />
        </div>

        <CaseDetailGrid
          :case-text="caseText"
          :current-case="currentCase"
          :highlighted-code="highlightedCode"
          :view-items="viewItems"
          :actions="resolvedActions"
        />
      </section>

      <section class="panel">
        <LogPanel :logs="logs" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import CaseList from './components/CaseList.vue'
import CaseDetailGrid from './components/CaseDetailGrid.vue'
import CaseDetailHeader from './components/CaseDetailHeader.vue'
import Hero from './components/Hero.vue'
import LogPanel from './components/LogPanel.vue'
import { cases } from './cases'
import { codeToHtml } from 'shiki'
import { useI18n, useLocaleProvider } from './i18n.js'

const { locale } = useLocaleProvider()
const { t } = useI18n()

const selectedId = ref(cases[0].id)
const logs = ref([])
const viewItems = ref([])
const actions = ref([])
const highlightedCode = ref('')
const caseRef = ref(null)

const currentCase = computed(() => {
  return cases.find((item) => item.id === selectedId.value) ?? cases[0]
})

const caseText = computed(() => currentCase.value.text[locale.value])

const caseCards = computed(() =>
  cases.map((item) => ({
    id: item.id,
    title: item.text[locale.value].title,
    short: item.short[locale.value],
  })),
)

const resolvedActions = computed(() => {
  const a = actions.value
  return a && typeof a.value !== 'undefined' ? a.value : Array.isArray(a) ? a : []
})

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
