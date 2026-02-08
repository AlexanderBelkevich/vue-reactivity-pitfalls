<template>
  <div class="page">
    <Hero />

    <main class="layout">
      <section class="panel">
        <CaseList />
      </section>

      <section class="panel panel--wide">
        <CaseDetailHeader />

        <div class="case-logic-host" aria-hidden="true">
          <component
            :is="currentCase.component"
            ref="caseRef"
          />
        </div>

        <CaseDetailGrid />
      </section>

      <section class="panel">
        <LogPanel />
      </section>
    </main>
  </div>
</template>

<script setup>
import CaseList from './components/CaseList.vue'
import CaseDetailGrid from './components/CaseDetailGrid.vue'
import CaseDetailHeader from './components/CaseDetailHeader.vue'
import Hero from './components/Hero.vue'
import LogPanel from './components/LogPanel.vue'
import { useCases } from './useCases.js'

const { currentCase, caseRef } = useCases()
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
