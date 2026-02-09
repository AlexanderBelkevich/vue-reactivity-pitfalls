<template>
  <div class="case-grid">
    <template v-for="(segment, i) in segments" :key="i">
      <!-- md-сегменты: заголовок из card[locale].title, остальное из MD. Первый сегмент — без дублирования # в тексте -->
      <div
        v-if="segment.type === 'md'"
        class="case-md"
      >
        <h2 v-if="i === 0" class="case-md__title">{{ headerTitle }}</h2>
        <MarkdownOut :content="i === 0 ? firstSegmentBody(segment.content) : segment.content" />
      </div>
      <!-- блок: компонент из реестра, данные из контекста родителя -->
      <component
        v-else-if="segment.type === 'block' && blockRegistry[segment.name]"
        :is="blockRegistry[segment.name].component"
        v-bind="getBlockProps(segment.name)"
      />
    </template>
  </div>
</template>

<script setup>
import { computed, toValue } from 'vue'
import MarkdownOut from '../markdown-out.vue'

const props = defineProps({
  /** Сырой контент MD (заголовок # в первом сегменте не показывается — берётся из card). Текст, > plain, ::: blockName */
  content: { type: String, default: '' },
  /** Реестр блоков: { blockName: { component, getProps(ctx) } } */
  blockRegistry: { type: Object, required: true },
  /** Контекст для блоков (currentCase, caseText, t, locale, actions, view, …) */
  context: { type: Object, required: true },
})

const BLOCK_RE = /^::: (\w+)\s*$/gm

const segments = computed(() => {
  const content = props.content ?? ''
  const list = []
  let lastEnd = 0
  let m
  BLOCK_RE.lastIndex = 0
  while ((m = BLOCK_RE.exec(content)) !== null) {
    const before = content.slice(lastEnd, m.index).trim()
    if (before) list.push({ type: 'md', content: before })
    list.push({ type: 'block', name: m[1] })
    lastEnd = m.index + m[0].length
  }
  const tail = content.slice(lastEnd).trim()
  if (tail) list.push({ type: 'md', content: tail })
  return list
})

/** Заголовок из card[locale].title (без дублирования в MD) */
const headerTitle = computed(() => {
  const caseItem = toValue(props.context.currentCase)
  const localeVal = toValue(props.context.locale)
  return caseItem?.card?.[localeVal]?.title ?? ''
})

/** Убирает первую строку "# Заголовок" из контента первого сегмента */
function firstSegmentBody(content) {
  if (!content?.trim()) return ''
  return content.replace(/^# .+?\n?/, '').trim()
}

function getBlockProps(name) {
  const reg = props.blockRegistry[name]
  if (!reg?.getProps) return {}
  return reg.getProps(props.context)
}
</script>

<style scoped>
.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.case-md {
  grid-column: 1 / -1;
}

.case-md__title {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.case-md :deep(h1),
.case-md :deep(h2) {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.case-md :deep(p) {
  color: var(--muted);
  margin-bottom: 18px;
}

.case-md :deep(blockquote) {
  margin: 0.75em 0;
  padding: 10px 12px;
  border-left: none;
  border-radius: 12px;
  background: var(--plain-bg);
  border: 1px solid var(--stroke);
  color: var(--ink);
  font-size: 0.95rem;
}
</style>
