<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
// 按需引入：关系图 + 提示框
import * as echarts from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { people, personEdges, GROUPS } from '../data/people'
import { poemById } from '../data/poems'
import { loadCorpus } from '../data/corpus'

echarts.use([GraphChart, TooltipComponent, CanvasRenderer])

const chartEl = ref(null)
let chart = null

const selectedId = ref('su-shi')
const selected = computed(() => people.find(p => p.id === selectedId.value) || people[0])
const personById = Object.fromEntries(people.map(p => [p.id, p]))

const allEdges = (() => {
  const list = personEdges.map(([a, b]) => [a, b])
  people.forEach(p => {
    if (!p.center) list.push(['su-shi', p.id])
  })
  return list
})()

const neighbors = computed(() => {
  const set = new Set()
  if (!selectedId.value) return set
  allEdges.forEach(([a, b]) => {
    if (a === selectedId.value) set.add(b)
    if (b === selectedId.value) set.add(a)
  })
  return set
})

// ---- 印章式字章头像：宣纸底 + 组别色环 + 行书单字，运行时 canvas 生成 ----
const avatarCache = {}
function avatarDataURL(person, size = 128) {
  const key = person.id + size
  if (avatarCache[key]) return avatarCache[key]
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const r = size / 2
  ctx.fillStyle = '#F3F5F0'
  ctx.beginPath(); ctx.arc(r, r, r - 4, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = GROUPS[person.group].color
  ctx.lineWidth = person.center ? 10 : 5
  ctx.beginPath(); ctx.arc(r, r, r - 5, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = person.center ? '#9E2B25' : '#3A3A3A'
  const fsize = Math.round(size * 0.62)
  ctx.font = `600 ${fsize}px "FZ Su Shi Xing Shu", "LXGW WenKai", KaiTi, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(person.mono, r, r + fsize * 0.05)
  const url = c.toDataURL('image/png')
  avatarCache[key] = url
  return url
}

// ---- 手动径向布局：苏轼居中，家人内环，座主政坛/方外门生外环，宫闱居顶 ----
function layoutNodes(w, h) {
  const cx = w / 2
  const cy = h * 0.54
  // 留出节点半径与下方名字的边距，避免最外环被画布边缘裁切
  const s = Math.min(w / 1240, h / 840)
  const pos = { 'su-shi': [cx, cy] }
  const ring = (ids, r, angles) => {
    ids.forEach((id, i) => {
      const a = angles[i] * Math.PI / 180
      pos[id] = [cx + Math.cos(a) * r * s, cy - Math.sin(a) * r * s]
    })
  }
  ring(['su-zhe', 'su-guo', 'wang-runzhi', 'su-mai', 'wang-chaoyun', 'wang-fu', 'su-xun', 'cheng-furen'],
    205, [15, 60, 105, 150, 195, 240, 285, 330])
  ring(['ou-yang-xiu', 'wang-an-shi', 'si-ma-guang', 'zhang-dun', 'song-shen-zong'],
    335, [95, 135, 175, 215, 255])
  ring(['wen-tong', 'fo-yin', 'can-liao', 'huang-ting-jian', 'qin-guan'],
    335, [-5, -45, -80, 30, 65])
  pos['cao-tai-hou'] = [cx + Math.cos(-90 * Math.PI / 180) * 360 * s, cy - Math.sin(-90 * Math.PI / 180) * 360 * s]
  return pos
}

function graphData(w, h) {
  const pos = layoutNodes(w, h)
  const sel = selectedId.value
  const dim = !!sel

  const nodes = people.map(p => {
    const isSel = p.id === sel
    const dimmed = dim && !isSel && !neighbors.value.has(p.id)
    return {
      name: p.id,
      x: pos[p.id][0],
      y: pos[p.id][1],
      symbol: 'image://' + avatarDataURL(p, 128),
      symbolSize: p.center ? 84 : 62,
      itemStyle: { opacity: dimmed ? 0.16 : 1 },
      label: {
        show: true,
        position: 'bottom',
        distance: 5,
        formatter: p.name,
        color: dimmed ? '#C0C4BD' : isSel ? '#3A3A3A' : '#5F635D',
        fontWeight: isSel ? 600 : 400,
        fontSize: 13
      }
    }
  })

  const edgeStyle = (a, b) => {
    const touches = sel && (a === sel || b === sel)
    return {
      color: touches ? '#596E76' : '#87A6B3',
      opacity: dim ? (touches ? 0.85 : 0.05) : 0.32,
      width: touches ? 1.8 : 1.1,
      curveness: 0.12
    }
  }

  const links = allEdges.map(([a, b]) => ({ source: a, target: b, lineStyle: edgeStyle(a, b) }))

  return { nodes, links }
}

function buildOption(w, h) {
  const { nodes, links } = graphData(w, h)
  return {
    tooltip: {
      formatter: p => {
        if (p.dataType !== 'node') return ''
        const d = personById[p.name]
        return `<strong>${d.name}</strong>　${d.years}<br/>${d.tag}`
      },
      textStyle: { fontFamily: 'Noto Serif SC, STFangsong, FangSong, serif', color: '#3A3A3A' },
      backgroundColor: '#F3F5F0',
      borderColor: '#C0C4BD'
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        zoom: 0.85,
        left: 0,
        top: 0,
        width: w,
        height: h,
        data: nodes,
        links: links,
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 6,
        emphasis: { focus: 'none' }
      }
    ]
  }
}

// 选择变化只做合并更新，缩放/平移状态得以保留
function updateSelection() {
  if (!chart) return
  const el = chartEl.value
  if (!el) return
  const { nodes, links } = graphData(el.clientWidth, el.clientHeight)
  chart.setOption({ series: [{ data: nodes, links }] })
}

function resetView() {
  if (chart) chart.dispatchAction({ type: 'restore' })
}

const onResize = () => {
  if (chart) chart.resize()
}

onMounted(async () => {
  chart = echarts.init(chartEl.value)
  // 字章要用页面字体：等行书/文楷的对应字符子集就绪再生成头像
  try {
    const chars = people.map(p => p.mono).join('') + people.map(p => p.name).join('')
    await Promise.allSettled([
      document.fonts.load('600 64px "FZ Su Shi Xing Shu"', chars),
      document.fonts.load('400 64px "LXGW WenKai"', chars)
    ])
  } catch {}
  const w = chartEl.value.clientWidth
  const h = chartEl.value.clientHeight
  chart.setOption(buildOption(w, h))
  chart.on('click', params => {
    if (params.dataType === 'node') selectedId.value = params.name
  })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})

watch(selectedId, updateSelection)

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
</script>

<template>
  <section class="container-wide people-page">
    <header class="people-head">
      <h1 class="plaque">人物谱</h1>
      <p class="text-muted people-sub">与东坡相遇的人们；点击印章看其人其事，拖拽平移、滚轮缩放</p>
    </header>

    <div class="people-layout">
      <div class="people-wrap paper">
        <div ref="chartEl" class="people-canvas" aria-label="苏轼人物关系图"></div>
        <p class="people-legend text-faint">
          <template v-for="(g, key) in GROUPS" :key="key">
            <span v-if="key !== 'center'" class="dot" :style="{ background: g.color }"></span>{{ g.name }}
          </template>
        </p>
      </div>

      <aside class="people-aside">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="selected" :key="selected.id">
            <h2 class="person-name font-display">{{ selected.name }}</h2>
            <p class="text-faint person-years">{{ selected.years }}</p>
            <p class="person-tagline font-poem">「{{ selected.tagline }}」</p>
            <p class="person-tag-row"><span class="tag">{{ selected.tag }}</span></p>
            <p class="person-summary text-muted">{{ selected.summary }}</p>

            <div v-if="selected.stories.length" class="aside-block">
              <h3 class="aside-title">轶事</h3>
              <div v-for="s in selected.stories" :key="s.t" class="ev-story">
                <span class="ev-story-title">{{ s.t }}</span>
                <p class="ev-story-text text-muted">{{ s.text }}</p>
              </div>
            </div>

            <div v-if="selected.poemIds.length" class="aside-block">
              <h3 class="aside-title">相关作品</h3>
              <router-link
                v-for="pid in selected.poemIds"
                :key="pid"
                class="place-poem"
                :to="`/shici/${pid}`"
              >
                <span class="font-poem">{{ poemTitle(pid) }}</span>
              </router-link>
            </div>

            <div class="aside-block">
              <h3 class="aside-title">出现的生平</h3>
              <p class="person-years-list">
                <span v-for="y in selected.appeared" :key="y" class="year-calligraphy year-chip">{{ y }}</span>
              </p>
              <router-link class="place-poem" to="/shengping">
                <span class="text-faint">在生平长卷中查看这些年份</span>
              </router-link>
            </div>
          </div>
        </Transition>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.people-page {
  padding-block: 64px var(--section-gap);
}

.people-head {
  text-align: center;
  margin-bottom: 48px;
}

.people-sub {
  margin-top: 14px;
  letter-spacing: 0.14em;
}

.people-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 40px;
  align-items: start;
}

.people-wrap {
  position: relative;
  padding: 12px;
}

.people-canvas {
  width: 100%;
  height: min(74vh, 720px);
  min-height: 460px;
}

.people-legend {
  position: absolute;
  left: 20px;
  bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  flex-wrap: wrap;
}

.people-legend .dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 14px;
}

.people-legend .dot:first-child {
  margin-left: 0;
}

.people-aside {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.person-name {
  font-size: 44px;
  letter-spacing: 0.16em;
}

.person-years {
  margin-top: 4px;
  letter-spacing: 0.1em;
}

.person-tagline {
  margin-top: 14px;
  font-size: 19px;
  line-height: 1.8;
  color: var(--ink-text);
}

.person-tag-row {
  margin-top: 12px;
}

.person-summary {
  font-size: 15px;
  line-height: 1.9;
}

.aside-block {
  margin-top: 28px;
}

.aside-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ink-text);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.aside-title::before {
  content: '';
  width: 9px;
  height: 9px;
  background: var(--ink-seal);
  border-radius: 1px;
  flex-shrink: 0;
}

.ev-story {
  padding-left: 14px;
  border-left: 1px solid var(--ink-seal);
  margin-bottom: 16px;
}

.ev-story-title {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--ink-seal);
  margin-bottom: 4px;
}

.ev-story-text {
  font-size: 14px;
  line-height: 1.85;
}

.place-poem {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 6px 2px;
  font-size: 15px;
  color: var(--ink-text-2);
}

.place-poem:hover {
  color: var(--ink-accent-deep);
  text-decoration: none;
}

.person-years-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.year-chip {
  font-size: 17px;
  color: var(--ink-accent-deep);
}

@media (max-width: 980px) {
  .people-layout {
    grid-template-columns: 1fr;
  }
  .people-canvas {
    height: 62vh;
  }
  .person-name {
    font-size: 36px;
  }
}
</style>
