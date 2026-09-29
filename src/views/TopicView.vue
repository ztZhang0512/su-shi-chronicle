<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { topics } from '../data/topics'
import { poemById } from '../data/poems'
import { loadCorpus } from '../data/corpus'
import { people } from '../data/people'

const route = useRoute()
const topic = computed(() => topics.find(t => t.id === route.params.id))

const index = computed(() =>
  topic.value ? topics.findIndex(t => t.id === topic.value.id) : -1
)
const prev = computed(() => (index.value > 0 ? topics[index.value - 1] : null))
const next = computed(() =>
  index.value >= 0 && index.value < topics.length - 1 ? topics[index.value + 1] : null
)

const personById = Object.fromEntries(people.map(p => [p.id, p]))
function personName(id) {
  return personById[id]?.name || id
}

// 相关作品标题：编年名篇同步可查，全集条目懒加载补题名
const corpusTitles = ref({})
onMounted(async () => {
  const data = await loadCorpus()
  const map = {}
  data.poems.forEach(p => { map[p.id] = p.title })
  corpusTitles.value = map
})
function poemTitle(pid) {
  return poemById[pid]?.title || corpusTitles.value[pid] || '全集条目'
}

// 页面标题
watch(
  () => route.params.id,
  () => {
    document.title = topic.value
      ? `${topic.value.title} · 事件专题 · 一蓑烟雨`
      : '事件专题 · 一蓑烟雨 · 苏轼编年诗传'
  },
  { immediate: true }
)
</script>

<template>
  <section v-if="topic" class="container topic-page">
    <nav class="detail-back" aria-label="返回生平长卷">
      <router-link class="back-link" to="/shengping">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M7.5 2 3.5 6l4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>返回生平长卷</span>
      </router-link>
    </nav>

    <header class="topic-head">
      <h1 class="topic-title font-display">{{ topic.title }}</h1>
      <div class="head-meta">
        <span class="tag">{{ topic.period }}</span>
        <span class="text-faint">{{ topic.places }}</span>
      </div>
      <p class="topic-lead font-poem">「{{ topic.lead }}」</p>
    </header>

    <div class="topic-body">
      <section v-for="sec in topic.sections" :key="sec.title" class="topic-section">
        <h2 class="section-title">{{ sec.title }}</h2>
        <p class="section-text">{{ sec.text }}</p>
        <p class="zhu-note section-source">出处：{{ sec.source }}</p>
      </section>

      <section class="topic-section">
        <h2 class="section-title">事件时间线</h2>
        <ol class="topic-timeline">
          <li v-for="t in topic.timeline" :key="t.date + t.text" class="tl-item">
            <span class="tl-date year-calligraphy">{{ t.date }}</span>
            <span class="tl-text text-muted">{{ t.text }}</span>
          </li>
        </ol>
      </section>

      <section v-if="topic.poemIds.length" class="topic-section">
        <h2 class="section-title">关联诗文</h2>
        <div class="topic-poems">
          <router-link
            v-for="pid in topic.poemIds"
            :key="pid"
            class="place-poem"
            :to="`/shici/${pid}`"
          >
            <span class="font-poem">{{ poemTitle(pid) }}</span>
          </router-link>
        </div>
      </section>

      <section v-if="topic.peopleIds.length" class="topic-section">
        <h2 class="section-title">相关人物</h2>
        <div class="topic-people">
          <router-link
            v-for="pid in topic.peopleIds"
            :key="pid"
            class="tag tag-person"
            :to="`/renwu?p=${pid}`"
          >{{ personName(pid) }}</router-link>
        </div>
      </section>

      <section class="topic-section">
        <h2 class="section-title">史料出处</h2>
        <ul class="topic-sources">
          <li v-for="s in topic.sources" :key="s" class="text-faint">{{ s }}</li>
        </ul>
      </section>
    </div>

    <nav v-if="prev || next" class="detail-pager jie-list" aria-label="上一专题下一专题">
      <router-link v-if="prev" class="pager-link" :to="`/shijian/${prev.id}`">
        <span class="text-faint">上一事件</span>
        <span class="font-poem">{{ prev.title }}</span>
      </router-link>
      <span v-else></span>
      <router-link v-if="next" class="pager-link pager-next" :to="`/shijian/${next.id}`">
        <span class="text-faint">下一事件</span>
        <span class="font-poem">{{ next.title }}</span>
      </router-link>
    </nav>
  </section>

  <section v-else class="container topic-page">
    <p class="text-muted">未找到该事件专题</p>
    <p><router-link class="btn-seal" to="/shengping">返回生平长卷</router-link></p>
  </section>
</template>

<style scoped>
.topic-page {
  padding-block: 64px var(--section-gap);
}

/* 卷首 */
.topic-head {
  margin-bottom: 48px;
}

.topic-title {
  font-size: clamp(44px, 7vw, 64px);
  letter-spacing: 0.16em;
  line-height: 1.2;
}

.head-meta {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.topic-lead {
  margin-top: 18px;
  font-size: 20px;
  color: var(--ink-accent-deep);
}

/* 单栏阅读版式 */
.topic-body {
  max-width: 760px;
  margin-inline: auto;
}

.topic-section {
  margin-block-end: 56px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ink-text);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-title::before {
  content: '';
  width: 9px;
  height: 9px;
  background: var(--ink-seal);
  border-radius: 1px;
  flex-shrink: 0;
}

.section-text {
  font-size: 16px;
  line-height: 2.05;
  color: var(--ink-text);
}

.section-source {
  margin-top: 12px;
  font-size: 13px;
}

/* 事件内时间线 */
.topic-timeline {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-left: 14px;
  border-left: 1px solid var(--ink-border);
}

.tl-item {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.tl-date {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--ink-accent-deep);
  min-width: 76px;
}

.tl-text {
  font-size: 15px;
  line-height: 1.85;
}

/* 关联诗文与人物 */
.topic-poems {
  display: flex;
  flex-direction: column;
}

.place-poem {
  display: inline-flex;
  align-items: baseline;
  padding: 6px 2px;
  font-size: 15px;
  color: var(--ink-text-2);
}

.place-poem:hover {
  color: var(--ink-accent-deep);
  text-decoration: none;
}

.topic-people {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-person {
  cursor: pointer;
}

.tag-person:hover {
  color: var(--ink-seal);
  border-color: var(--ink-seal);
  text-decoration: none;
}

/* 史料清单 */
.topic-sources {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 专题互链 */
.detail-pager {
  max-width: 760px;
  margin-inline: auto;
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

/* 顶部返回（与详情页同款） */
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
</style>
