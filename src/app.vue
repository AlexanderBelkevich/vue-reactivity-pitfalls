<template>
  <div class="page">
    <Hero />

    <main class="layout">
      <section class="panel">
        <CaseList />
      </section>

      <section class="panel panel--wide">
        <CaseDetailHeader />

        <component
          :is="currentCase.component"
          v-slot="{ actions, view }"
        >
          <CaseDetailGrid :actions="actions" :view-items="view" />
        </component>
      </section>

      <section class="panel">
        <LogPanel />
      </section>
    </main>
  </div>
</template>

<script setup>
import CaseList from './components/case-list.vue'
import CaseDetailGrid from './components/case-detail-grid.vue'
import CaseDetailHeader from './components/case-detail-header.vue'
import Hero from './components/hero.vue'
import LogPanel from './components/log-panel.vue'
import { useCases } from './use-cases.js'

const { currentCase } = useCases()
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

@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .panel {
    order: 0;
  }
}
</style>
