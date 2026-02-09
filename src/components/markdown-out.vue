<template>
  <div class="markdown-body" v-html="rendered" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { createMarkdownExit } from 'markdown-exit'
import { codeToHtml } from 'shiki'
import { useTheme, shikiThemeName } from '../theme.js'

const props = defineProps({
  content: { type: String, default: '' },
})

const { theme } = useTheme()
const md = createMarkdownExit({
  highlight(code, lang) {
    return codeToHtml(code, {
      lang: lang || 'text',
      theme: shikiThemeName(theme.value),
    })
  },
})

const rendered = ref('')

watch(
  [() => props.content, theme],
  async ([content]) => {
    if (!content?.trim()) {
      rendered.value = ''
      return
    }
    const current = content
    const html = await md.renderAsync(content)
    if (props.content === current) {
      rendered.value = html
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.markdown-body {
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.5;
}

.markdown-body :deep(p) {
  margin: 0 0 0.75em;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.markdown-body :deep(h1) { font-size: 1.25rem; }
.markdown-body :deep(h2) { font-size: 1.1rem; }
.markdown-body :deep(h3),
.markdown-body :deep(h4) { font-size: 1rem; }

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 0.75em;
  padding-left: 1.5em;
}

.markdown-body :deep(li) {
  margin-bottom: 0.25em;
}

.markdown-body :deep(code) {
  background: var(--card-alt);
  padding: 0.15em 0.4em;
  border-radius: 6px;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  margin: 0.75em 0;
  padding: 12px;
  border-radius: 12px;
  background: var(--card-alt);
  border: 1px solid var(--stroke);
  overflow-x: auto;
}

.markdown-body :deep(pre.shiki) {
  border-color: var(--stroke);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(a) {
  color: var(--accent);
}

.markdown-body :deep(blockquote) {
  margin: 0.75em 0;
  padding-left: 1em;
  border-left: 3px solid var(--stroke);
  color: var(--muted);
}
</style>
