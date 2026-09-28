<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { poemsSorted, poemById, poemsByPlace } from '../data/poems'
import { loadCorpus } from '../data/corpus'
import { noteFor } from '../data/poem-notes'
import { events } from '../data/events'
import { phaseByKey } from '../data/places'

const route = useRoute()

const corpusEntry = ref(null)
const corpusState = ref('idle') // idle | loading | ready

const curated = computed(() => poemById[route.params.id])
const corpus = computed(() => (curated.value ? null : corpusEntry.value))
const entry = computed(() => curated.value ?? corpus.value)
const isCorpus = computed(() => !curated.value && !!corpus.value)

// 编年名篇同步渲染；全集条目按需异步加载，并按篇设置页面标题
watch(
  () => route.params.id,
  async id => {
    document.title = '诗词编年 · 一蓑烟雨 · 苏轼编年诗传'
    if (poemById[id]) {
      corpusEntry.value = null
      corpusState.value = 'ready'
      document.title = `${poemById[id].title} · 一蓑烟雨`
      return
    }
    corpusState.value = 'loading'
    const data = await loadCorpus()
    if (id !== route.params.id) return
    corpusEntry.value = data.poems.find(p => p.id === id) || null
    corpusState.value = 'ready'
    if (corpusEntry.value) document.title = `${corpusEntry.value.title} · 一蓑烟雨`
  },
  { immediate: true }
)

const index = computed(() =>
  curated.value ? poemsSorted.findIndex(p => p.id === curated.value.id) : -1
)
const prev = computed(() =>
  index.value > 0 ? poemsSorted[index.value - 1] : null
)
const next = computed(() =>
  index.value >= 0 && index.value < poemsSorted.length - 1
    ? poemsSorted[index.value + 1]
    : null
)

const lines = computed(() =>
  curated.value ? curated.value.paragraphs : (corpus.value?.lines ?? [])
)

// 「此时的苏轼」：所在阶段 + 距该作最近的一次人生事件（仅编年名篇）
const context = computed(() => {
  if (!curated.value) return null
  const past = events.filter(e => e.year <= curated.value.year)
  return {
    phase: phaseByKey[curated.value.phase],
    event: past.length ? past[past.length - 1] : null
  }
})

const samePlace = computed(() => {
  if (!curated.value || !curated.value.placeId) return []
  return poemsByPlace(curated.value.placeId).filter(p => p.id !== curated.value.id)
})

const age = computed(() =>
  curated.value ? curated.value.year - 1037 : null
)

const corpusPhaseName = computed(() =>
  corpus.value?.phase ? phaseByKey[corpus.value.phase]?.name : null
)

const corpusNote = computed(() => (isCorpus.value ? noteFor(corpus.value) : null))
</script>

<template>
  <section v-if="entry" class="container detail-page">
    <nav class="detail-back" aria-label="返回列表">
      <router-link class="back-link" to="/shici">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M7.5 2 3.5 6l4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ isCorpus ? '返回全集检索' : '返回诗词编年' }}</span>
      </router-link>
    </nav>

    <header class="detail-head">
      <div class="head-meta">
        <span class="tag">{{ entry.type }}</span>
        <template v-if="curated">
          <span class="year-node"><span class="year">{{ entry.year }}</span></span>
          <span class="text-faint">{{ entry.dateLabel }}</span>
          <span class="text-faint">{{ entry.place }}</span>
          <span class="text-faint">时年 {{ age }}</span>
        </template>
        <template v-else>
          <span v-if="entry.year != null" class="year-node">
            <span class="year">{{ entry.year }}</span>
            <span v-if="entry.yearApprox" class="text-faint">约</span>
          </span>
          <span v-else-if="entry.yearLabel" class="text-faint">{{ entry.yearLabel }}</span>
          <span v-else class="tag">未系年</span>
          <span v-if="corpusPhaseName" class="text-faint">{{ corpusPhaseName }}时期</span>
        </template>
      </div>
      <h1 class="detail-title font-display">{{ entry.title }}</h1>
    </header>

    <div class="detail-grid">
      <article class="paper original" aria-label="原文">
        <div class="original-scroll">
          <div class="poem-text font-poem">
            <p v-for="(para, i) in lines" :key="i">{{ para }}</p>
          </div>
        </div>
      </article>

      <aside class="detail-aside">
        <!-- 全集条目：注释 + 系年推断依据 + 来源 -->
        <template v-if="isCorpus">
          <div v-if="corpusNote" class="aside-block">
            <h2 class="aside-title">简注</h2>
            <p class="note-text">{{ corpusNote }}</p>
          </div>

          <div class="aside-block">
            <h2 class="aside-title">系年推断</h2>
            <p v-if="entry.evidence" class="zhu-note evidence-text">{{ entry.evidence }}</p>
            <p v-else class="note-text">
              此篇暂无可靠的系年证据，故未编年。苏轼诗文的题序中常见年号（如「元丰五年」）、
              干支（如「乙卯」）与任职地名（如「超然台」「雪堂」），是推断写作时间的三条主要线索。
            </p>
          </div>
          <div class="aside-block">
            <h2 class="aside-title">文本来源</h2>
            <p class="note-text">
              原文取自开源数据集 chinese-poetry 的《全宋诗》《全宋词》苏轼部分，
              繁体已转简体。文本疑误之处以点校本为准。
            </p>
          </div>
        </template>

        <!-- 编年名篇：背景注 + 此时的苏轼 + 同地作品 -->
        <template v-else>
          <div class="aside-block">
            <h2 class="aside-title">背景注</h2>
            <p class="note-text">{{ curated.note }}</p>
          </div>

          <div v-if="context" class="aside-block">
            <h2 class="aside-title">此时的苏轼</h2>
            <p class="text-faint context-phase">{{ context.phase.name }}（{{ context.phase.range }}）</p>
            <p v-if="context.event" class="context-event">
              <span class="ev-year year-calligraphy">{{ context.event.year }}</span>
              <strong>{{ context.event.title }}</strong>
              <span class="text-muted ev-desc">{{ context.event.desc }}</span>
            </p>
          </div>

          <div v-if="samePlace.length" class="aside-block">
            <h2 class="aside-title">此地其他作品</h2>
            <router-link
              v-for="p in samePlace"
              :key="p.id"
              class="same-place-link"
              :to="`/shici/${p.id}`"
            >
              <span class="p-year">{{ p.year }}</span>
              <span class="font-poem">{{ p.title }}</span>
            </router-link>
          </div>
        </template>
      </aside>
    </div>

    <nav v-if="curated" class="detail-pager jie-list" aria-label="上一篇下一篇">
      <router-link v-if="prev" class="pager-link" :to="`/shici/${prev.id}`">
        <span class="text-faint">前一年</span>
        <span class="font-poem">{{ prev.year }} · {{ prev.title }}</span>
      </router-link>
      <span v-else></span>
      <router-link v-if="next" class="pager-link pager-next" :to="`/shici/${next.id}`">
        <span class="text-faint">后一年</span>
        <span class="font-poem">{{ next.year }} · {{ next.title }}</span>
      </router-link>
    </nav>
  </section>

  <section v-else-if="corpusState === 'loading'" class="container detail-page">
    <p class="text-muted">语料加载中…</p>
  </section>

  <section v-else class="container detail-page">
    <p class="text-muted">未找到该作品</p>
    <p><router-link class="btn-seal" to="/shici">返回诗词编年</router-link></p>
  </section>
</template>

<style scoped>
.detail-page {
  padding-block: 64px var(--section-gap);
}

/* 顶部返回：细箭头 + 文字，双态齐全 */
.detail-back {
  margin-bottom: 28px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  letter-spacing: 0.18em;
  color: var(--ink-text-2);
  transition: color 0.2s ease-out;
}

.back-link svg {
  width: 11px;
  height: 11px;
  transition: transform 0.2s ease-out;
}

.back-link:hover {
  color: var(--ink-accent-deep);
  text-decoration: none;
}

.back-link:hover svg {
  transform: translateX(-2px);
}

.back-link:focus-visible {
  outline: 2px solid var(--ink-focus);
  outline-offset: 2px;
  border-radius: var(--radius);
}

.detail-head {
  margin-bottom: 40px;
}

.head-meta {
  display: flex;
  align-items: baseline;
  gap: 18px;
  flex-wrap: wrap;
}

.detail-title {
  margin-top: 14px;
  font-size: clamp(28px, 6vw, 52px);
  letter-spacing: 0.14em;
  line-height: 1.25;
}

.detail-grid {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

/* 原文纸面：横排从上到下；纸面固定高度，内层滚动，印章钉在纸面左下 */
.original {
  grid-column: 2;
  grid-row: 1;
  position: relative;
}

.original-scroll {
  max-height: min(78vh, 840px);
  overflow: auto;
  padding: 40px 44px 44px;
  scrollbar-width: thin;
  scrollbar-color: #c9cdbf transparent;
}

.original-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.original-scroll::-webkit-scrollbar-thumb {
  background: #c9cdbf;
  border-radius: 3px;
}

.original-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.poem-text {
  font-size: 20px;
  line-height: 2.2;
  letter-spacing: 0.08em;
  color: var(--ink-text);
}

.poem-text p + p {
  margin-block-start: 1.6em;
}

.detail-aside {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.aside-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ink-text);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.aside-title::before {
  content: '';
  width: 9px;
  height: 9px;
  background: var(--ink-seal);
  border-radius: 1px;
  flex-shrink: 0;
}

.note-text {
  font-size: 15px;
  line-height: 1.9;
  color: var(--ink-text-2);
}

.evidence-text {
  font-size: 15px;
  line-height: 1.9;
}

.context-phase {
  letter-spacing: 0.12em;
  margin-bottom: 8px;
}

.context-event {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
}

.ev-year {
  font-size: 20px;
  color: var(--ink-accent-deep);
}

.ev-desc {
  font-size: 14px;
  line-height: 1.85;
}

.same-place-link {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 6px 2px;
  font-size: 15px;
  color: var(--ink-text-2);
  transition: color 0.2s ease-out;
}

.same-place-link:hover {
  color: var(--ink-accent-deep);
  text-decoration: none;
}

.same-place-link .p-year {
  font-family: var(--font-display);
  color: var(--ink-text-3);
}

.detail-pager {
  margin-top: var(--section-gap);
  display: flex;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid var(--ink-border);
}

.pager-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-block: 20px;
  font-size: 16px;
  color: var(--ink-text-2);
  max-width: 46%;
}

.pager-link:hover {
  color: var(--ink-accent-deep);
  text-decoration: none;
}

.pager-next {
  text-align: right;
}

@media (max-width: 860px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .original {
    grid-column: 1;
    grid-row: 1;
  }
  .detail-aside {
    grid-column: 1;
    grid-row: 2;
  }
  .original-scroll {
    max-height: none;
    padding: 32px 28px 56px;
  }
  .poem-text {
    font-size: 18px;
  }
  .detail-pager {
    flex-direction: column;
  }
  .pager-link,
  .pager-next {
    max-width: 100%;
  }
}
</style>
