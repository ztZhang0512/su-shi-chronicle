<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { phases } from '../data/places'
import { poemsSorted, countByType } from '../data/poems'
import { loadCorpus } from '../data/corpus'
import { noteFor } from '../data/poem-notes'

const tab = ref('chronicle')

// ---- 编年名篇层 ----
const typeFilter = ref('全部')
const phaseFilter = ref('全部')
const types = ['全部', '诗', '词', '文']

const list = computed(() =>
  poemsSorted.filter(p => {
    const okType = typeFilter.value === '全部' || p.type === typeFilter.value
    const okPhase = phaseFilter.value === '全部' || p.phase === phaseFilter.value
    return okType && okPhase
  })
)

// ---- 全集检索层（语料懒加载，不进首屏主包） ----
const corpusAll = ref([])
const corpusMeta = ref({ total: '…', shi: '…', ci: '…' })
const corpusReady = ref(false)
const fullSearch = ref('')
const fullPhase = ref('全部')
const fullType = ref('全部')
const page = ref(1)
const PAGE_SIZE = 30

onMounted(async () => {
  const data = await loadCorpus()
  corpusMeta.value = data.meta
  corpusAll.value = data.poems
  corpusReady.value = true
})

// 全集搜索同时覆盖编年名篇（它们因去重不在全集列表里）
const curatedHits = computed(() => {
  const q = fullSearch.value.trim()
  if (!q) return []
  return poemsSorted.filter(p => {
    const okType = fullType.value === '全部' || p.type === fullType.value
    const okPhase =
      fullPhase.value === '全部'
        ? true
        : fullPhase.value === 'undated'
          ? false
          : p.phase === fullPhase.value
    if (!okType || !okPhase) return false
    return p.title.includes(q) || p.firstLine.includes(q) || (p.note || '').includes(q)
  })
})

const phaseOptions = [...phases.map(p => ({ key: p.key, name: p.name })), { key: 'undated', name: '未系年' }]

const fullFiltered = computed(() => {
  const q = fullSearch.value.trim()
  return corpusAll.value.filter(p => {
    if (fullType.value !== '全部' && p.type !== fullType.value) return false
    if (fullPhase.value === 'undated') {
      if (p.year != null || p.phase) return false
    } else if (fullPhase.value !== '全部' && p.phase !== fullPhase.value) {
      return false
    }
    if (q && !(p.title.includes(q) || p.lines.some(l => l.includes(q)))) return false
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(fullFiltered.value.length / PAGE_SIZE)))
const fullPage = computed(() =>
  fullFiltered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE)
)

watch([fullSearch, fullPhase, fullType], () => { page.value = 1 })

function gotoPage(p) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
}
</script>

<template>
  <section class="container poems-page">
    <header class="poems-head">
      <h1 class="plaque">诗词编年</h1>
      <p class="poems-count text-muted">
        编年名篇 {{ poemsSorted.length }} 篇（诗 {{ countByType('诗') }}、词 {{ countByType('词') }}、文 {{ countByType('文') }}）
        ；全集收录 {{ corpusMeta.total }} 篇（诗 {{ corpusMeta.shi }}、词 {{ corpusMeta.ci }}）
      </p>

      <div class="corpus-tabs" role="tablist" aria-label="切换浏览层">
        <button class="corpus-tab" :class="{ active: tab === 'chronicle' }" type="button" @click="tab = 'chronicle'">
          编年名篇
        </button>
        <button class="corpus-tab" :class="{ active: tab === 'full' }" type="button" @click="tab = 'full'">
          全集检索
        </button>
      </div>
    </header>

    <!-- ============ 编年名篇 ============ -->
    <template v-if="tab === 'chronicle'">
      <div class="poems-filters">
        <div class="chip-group" role="group" aria-label="按体裁筛选">
          <button
            v-for="t in types"
            :key="t"
            type="button"
            class="chip"
            :class="{ active: typeFilter === t }"
            @click="typeFilter = t"
          >{{ t }}</button>
        </div>
        <label class="phase-pick">
          <span class="text-faint">人生阶段</span>
          <select v-model="phaseFilter">
            <option value="全部">全部</option>
            <option v-for="ph in phases" :key="ph.key" :value="ph.key">{{ ph.name }}</option>
          </select>
        </label>
      </div>

      <ol class="jie-list poems-list">
        <li v-for="p in list" :key="p.id" class="jie-row poem-row">
          <router-link class="row-link" :to="`/shici/${p.id}`">
            <span class="row-year year-calligraphy">{{ p.year }}</span>
            <span class="row-main">
              <span class="row-title font-poem">{{ p.title }}</span>
              <span class="row-first text-muted font-poem">{{ p.firstLine }}</span>
            </span>
            <span class="row-meta">
              <span class="tag">{{ p.type }}</span>
              <span class="row-place text-faint">{{ p.place }}</span>
            </span>
          </router-link>
        </li>
      </ol>

      <p v-if="!list.length" class="text-faint">此阶段暂无收录作品</p>
    </template>

    <!-- ============ 全集检索 ============ -->
    <template v-else>
      <p class="full-disclaimer zhu-note">
        全集系年由规则推断（题序中的年号、干支、任职地名），非学界编年，仅供浏览参考；推断依据见各篇详情
      </p>

      <div class="poems-filters full-filters">
        <input
          v-model="fullSearch"
          class="full-search"
          type="search"
          placeholder="搜索题名或诗句（同时覆盖编年名篇）"
          aria-label="搜索题名或诗句"
        />
        <div class="chip-group" role="group" aria-label="按体裁筛选">
          <button
            v-for="t in ['全部', '诗', '词']"
            :key="t"
            type="button"
            class="chip"
            :class="{ active: fullType === t }"
            @click="fullType = t"
          >{{ t }}</button>
        </div>
        <label class="phase-pick">
          <span class="text-faint">人生阶段</span>
          <select v-model="fullPhase">
            <option value="全部">全部</option>
            <option v-for="ph in phaseOptions" :key="ph.key" :value="ph.key">{{ ph.name }}</option>
          </select>
        </label>
      </div>

      <template v-if="curatedHits.length">
        <p class="text-faint full-count">编年名篇匹配 {{ curatedHits.length }} 篇</p>
        <ol class="jie-list poems-list">
          <li v-for="p in curatedHits" :key="p.id" class="jie-row poem-row">
            <router-link class="row-link" :to="`/shici/${p.id}`">
              <span class="row-year-cell">
                <span class="row-year year-calligraphy">{{ p.year }}</span>
              </span>
              <span class="row-main">
                <span class="row-title font-poem">{{ p.title }}</span>
                <span class="row-first text-muted font-poem">{{ p.firstLine }}</span>
              </span>
              <span class="row-meta">
                <span class="tag tag-chronicle">编年</span>
                <span class="tag">{{ p.type }}</span>
                <span class="row-place text-faint">{{ p.place }}</span>
              </span>
            </router-link>
          </li>
        </ol>
      </template>

      <template v-if="corpusReady">
        <p class="text-faint full-count">
          全集匹配 {{ fullFiltered.length }} 篇<template v-if="totalPages > 1">，第 {{ page }} / {{ totalPages }} 页</template>
        </p>

        <ol class="jie-list poems-list">
          <li v-for="p in fullPage" :key="p.id" class="jie-row poem-row">
            <router-link class="row-link" :to="`/shici/${p.id}`">
              <span class="row-year-cell">
                <span v-if="p.year != null" class="row-year year-calligraphy">{{ p.year }}</span>
                <span v-else-if="p.yearLabel" class="row-yearlabel text-faint">{{ p.yearLabel }}</span>
                <span v-else class="row-yearlabel text-faint">未系年</span>
              </span>
              <span class="row-main">
                <span class="row-title font-poem">{{ p.title }}</span>
                <span class="row-first text-muted font-poem">{{ p.firstLine }}</span>
              </span>
              <span class="row-meta">
                <span v-if="noteFor(p)" class="seal note-mini" title="此篇有简注">注</span>
                <span class="tag">{{ p.type }}</span>
              </span>
            </router-link>
          </li>
        </ol>

        <p v-if="!fullPage.length" class="text-faint">没有符合条件的作品</p>

        <nav v-if="totalPages > 1" class="pager-nav" aria-label="全集分页">
          <button class="chip" type="button" :disabled="page <= 1" @click="gotoPage(page - 1)">上一页</button>
          <span class="text-faint">{{ page }} / {{ totalPages }}</span>
          <button class="chip" type="button" :disabled="page >= totalPages" @click="gotoPage(page + 1)">下一页</button>
        </nav>
      </template>
      <p v-else class="text-faint">全集语料加载中…</p>
    </template>
  </section>
</template>

<style scoped>
.poems-page {
  padding-block: 64px var(--section-gap);
}

.poems-head {
  text-align: center;
  margin-bottom: 40px;
}

.poems-count {
  margin-top: 14px;
  letter-spacing: 0.08em;
}

.corpus-tabs {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--ink-border);
}

.corpus-tab {
  padding: 10px 32px;
  font-family: var(--font-ui);
  font-size: 17px;
  letter-spacing: 0.2em;
  text-indent: 0.2em;
  color: var(--ink-text-2);
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s ease-out, border-color 0.2s ease-out;
}

.corpus-tab:hover {
  color: var(--ink-text);
}

.corpus-tab.active {
  color: var(--ink-text);
  border-bottom-color: var(--ink-seal);
  font-weight: 600;
}

.full-disclaimer {
  text-align: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.full-filters {
  align-items: center;
}

.full-search {
  flex: 1;
  min-width: 200px;
  max-width: 320px;
  min-height: 36px;
  padding: 4px 12px;
  font-family: var(--font-ui);
  font-size: 15px;
  color: var(--ink-text);
  background: var(--ink-surface);
  border: 1px solid var(--ink-border);
  border-radius: var(--radius);
  outline: none;
}

.full-search:focus {
  border-color: var(--ink-accent);
}

.full-count {
  margin-bottom: 8px;
}

.poems-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.chip-group {
  display: flex;
  gap: 8px;
}

.chip {
  padding: 4px 18px;
  min-height: 36px;
  font-family: var(--font-ui);
  font-size: 15px;
  letter-spacing: 0.2em;
  text-indent: 0.2em;
  color: var(--ink-text-2);
  background: transparent;
  border: 1px solid var(--ink-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.chip:hover {
  color: var(--ink-accent-deep);
  border-color: var(--ink-accent);
}

.chip.active {
  color: var(--ink-on-accent);
  background: var(--ink-accent);
  border-color: var(--ink-accent);
}

.chip:disabled {
  opacity: 0.4;
  cursor: default;
}

.chip:disabled:hover {
  color: var(--ink-text-2);
  border-color: var(--ink-border);
}

.phase-pick {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.phase-pick select {
  font-family: var(--font-ui);
  font-size: 15px;
  color: var(--ink-text);
  padding: 4px 8px;
  min-height: 36px;
  background: var(--ink-surface);
  border: 1px solid var(--ink-border);
  border-radius: var(--radius);
}

.poem-row {
  padding-block: 0;
}

.row-link {
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 24px;
  align-items: baseline;
  padding-block: 22px;
  color: inherit;
  transition: background-color 0.2s ease-out;
}

.row-link:hover {
  background: rgba(135, 166, 179, 0.1);
  text-decoration: none;
}

.row-year-cell {
  min-width: 0;
}

.row-year {
  font-size: 28px;
  color: var(--ink-accent-deep);
}

.row-yearlabel {
  font-size: 14px;
  letter-spacing: 0.04em;
  line-height: 1.6;
  display: inline-block;
}

.row-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.row-title {
  font-size: 19px;
  color: var(--ink-text);
}

.row-first {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-meta {
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.row-place {
  letter-spacing: 0.08em;
}

.note-mini {
  padding: 0 7px;
  font-size: 12px;
  line-height: 1.7;
  letter-spacing: 0;
  text-indent: 0;
}

/* 编年命中标记：朱砂描边小签 */
.tag-chronicle {
  color: var(--ink-seal);
  border-color: var(--ink-seal);
}

.pager-nav {
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

@media (max-width: 640px) {
  .row-link {
    grid-template-columns: 72px 1fr;
    gap: 14px;
  }
  .row-year {
    font-size: 22px;
  }
  .row-meta {
    grid-column: 2;
  }
  .full-search {
    max-width: none;
  }
}
</style>
