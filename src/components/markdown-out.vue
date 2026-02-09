<template>
  <div class="markdown-body" v-html="rendered" @click="onAnchorClick" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { createMarkdownExit } from 'markdown-exit'
import { codeToHtml } from 'shiki'
import { useTheme, shikiThemeName } from '../theme.js'
import { useCases } from '../use-cases.js'

const props = defineProps({
  content: { type: String, default: '' },
})

const { theme } = useTheme()
const { currentCase, sectionHash } = useCases()
const md = createMarkdownExit({
  highlight(code, lang) {
    return codeToHtml(code, {
      lang: lang || 'text',
      theme: shikiThemeName(theme.value),
    })
  },
})

function slugify(text) {
  const t = String(text)
    .replace(/<[^>]+>/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return t || 'section'
}

/** Добавляет id и якорные ссылки к h2, h3, h4 */
function addHeadingIds(html, getLinkHref) {
  if (!getLinkHref) return html
  const seen = {}
  return html.replace(
    /<(h[2-4])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (match, tag, attrs = '', inner) => {
      const slug = slugify(inner)
      const uniq = seen[slug] ? `${slug}-${++seen[slug]}` : ((seen[slug] = 1), slug)
      const href = getLinkHref(uniq)
      return `<${tag} id="${uniq}"${attrs}><a href="${href}" class="md-anchor" aria-hidden="true">§</a>${inner}</${tag}>`
    },
  )
}

const rendered = ref('')

watch(
  [() => props.content, theme, currentCase],
  async ([content]) => {
    if (!content?.trim()) {
      rendered.value = ''
      return
    }
    const current = content
    let html = await md.renderAsync(content)
    if (props.content === current && currentCase.value) {
      html = addHeadingIds(html, (slug) => sectionHash(slug))
      rendered.value = html
    }
  },
  { immediate: true },
)

function onAnchorClick(e) {
  const link = e.target.closest?.('.md-anchor')
  if (!link) return
  e.preventDefault()
  const href = link.getAttribute('href')
  if (href) location.hash = href
  const heading = link.closest?.('h2, h3, h4')
  if (heading?.id) {
    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
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

.markdown-body :deep(.md-anchor) {
  margin-right: 0.25em;
  color: var(--muted);
  text-decoration: none;
  font-weight: normal;
}

.markdown-body :deep(.md-anchor:hover) {
  color: var(--accent);
}
</style>
