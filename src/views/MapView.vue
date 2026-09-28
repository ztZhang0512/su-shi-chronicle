<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
// 按需引入：只注册本站用到的图表与组件，避免全量 ECharts 打进包里
import * as echarts from 'echarts/core'
import { LinesChart, ScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import chinaGeo from '../assets/china-geo.json'
import { places, route, legs, placeById, phaseByKey } from '../data/places'
import { events } from '../data/events'
import { poemsByPlace } from '../data/poems'

echarts.use([LinesChart, ScatterChart, GeoComponent, TooltipComponent, CanvasRenderer])

const mapEl = ref(null)
let chart = null

// 与 ECharts lines 布局一致的曲率（linesLayout.js：cp = 中点 - (y1-y2, x2-x1)*curveness）
const CURVE = 0.18
const STEP_MS = 2500   // 每段行程停留时长
const GROW_MS = 1200   // 描线生长时长

const selectedId = ref(null)
const selected = computed(() => (selectedId.value ? placeById[selectedId.value] : null))

// 按行程首到顺序去重排列（侧栏行迹简表用）
const orderedPlaces = computed(() => {
  const seen = new Set()
  const list = []
  for (const id of route) {
    if (!seen.has(id)) {
      seen.add(id)
      list.push(placeById[id])
    }
  }
  return list
})

// ---- 行迹演示：逐段描线，走过实色、当前描线生长、未来虚影 ----
const playing = ref(false)
const legIndex = ref(-1)
let playTimer = 0
let growRaf = 0
let growShapes = []   // [描线 Polyline, 笔尖 Circle]
let growingIndex = -1 // 正在由描线动画接管的段；-1 表示无

const currentLeg = computed(() =>
  playing.value && legIndex.value >= 0 ? legs[legIndex.value] : null
)

function stopPlayTimer() {
  if (playTimer) {
    clearTimeout(playTimer)
    playTimer = 0
  }
}

function removeGrowShapes() {
  growRaf && cancelAnimationFrame(growRaf)
  growRaf = 0
  if (chart) for (const s of growShapes) chart.getZr().remove(s)
  growShapes = []
  growingIndex = -1
}

function togglePlay() {
  if (playing.value) {
    stopPlayTimer()
    removeGrowShapes()
    playing.value = false
    legIndex.value = -1
    updateSelection()
  } else {
    playing.value = true
    legIndex.value = 0
    growingIndex = legIndex.value
    updateSelection()
    growLeg(legs[0])
    let i = 0
    const stepNext = () => {
      playTimer = setTimeout(() => {
        i += 1
        if (i >= legs.length) {
          stopPlayTimer()
          removeGrowShapes()
          playing.value = false
          legIndex.value = -1
          updateSelection()
          return
        }
        // 上一段交给 ECharts 静态线，新一段开始描线生长
        removeGrowShapes()
        legIndex.value = i
        growingIndex = i
        updateSelection()
        growLeg(legs[i])
        stepNext()
      }, STEP_MS)
    }
    stepNext()
  }
}

// 卷轴式描线：二次贝塞尔采样 + stroke 揭示（lineDashOffset 动画）+ 笔尖圆点
function growLeg(leg) {
  if (!chart) return
  const zr = chart.getZr()
  const a = placeById[leg.from]
  const b = placeById[leg.to]
  const p1 = chart.convertToPixel({ geoIndex: 0 }, [a.lon, a.lat])
  const p2 = chart.convertToPixel({ geoIndex: 0 }, [b.lon, b.lat])
  const cp = [
    (p1[0] + p2[0]) / 2 - (p1[1] - p2[1]) * CURVE,
    (p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * CURVE
  ]
  const N = 60
  const pts = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const mt = 1 - t
    pts.push([
      mt * mt * p1[0] + 2 * mt * t * cp[0] + t * t * p2[0],
      mt * mt * p1[1] + 2 * mt * t * cp[1] + t * t * p2[1]
    ])
  }
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  }
  const col = leg.exile ? '#9E2B25' : '#596E76'
  const line = new echarts.graphic.Polyline({
    shape: { points: pts },
    style: {
      stroke: col,
      lineWidth: 2.4,
      lineCap: 'round',
      opacity: 0.95,
      lineDash: [total, total],
      lineDashOffset: total
    },
    silent: true,
    z: 6,
    zlevel: 1
  })
  const tip = new echarts.graphic.Circle({
    shape: { cx: pts[0][0], cy: pts[0][1], r: 3.2 },
    style: { fill: col },
    silent: true,
    z: 7,
    zlevel: 1
  })
  zr.add(line)
  zr.add(tip)
  growShapes = [line, tip]

  const t0 = performance.now()
  const tick = now => {
    if (!growShapes.length) return
    const t = Math.min(1, (now - t0) / GROW_MS)
    const e = t * t * (3 - 2 * t) // smoothstep，起笔收笔都柔和
    line.style.lineDashOffset = total * (1 - e)
    line.dirty(true)
    const q = 1 - e
    tip.shape.cx = q * q * p1[0] + 2 * q * e * cp[0] + e * e * p2[0]
    tip.shape.cy = q * q * p1[1] + 2 * q * e * cp[1] + e * e * p2[1]
    tip.dirty(true)
    if (t < 1) {
      growRaf = requestAnimationFrame(tick)
    } else {
      zr.remove(tip)
      growShapes = [line]
    }
  }
  growRaf = requestAnimationFrame(tick)
}

// ---- 图表数据 ----
const EXILE = ['huangzhou', 'huizhou', 'danzhou']

// 东部密集区标签手工错位，避免互相压盖
const LABEL_POS = {
  meishan: 'left',
  fengxiang: 'top',
  bianjing: 'top',
  dengzhou: 'top',
  mizhou: 'top',
  xuzhou: 'right',
  huzhou: 'left',
  huangzhou: 'bottom',
  yingzhou: 'left',
  yangzhou: 'top',
  dingzhou: 'left',
  changzhou: 'right',
  hangzhou: 'bottom',
  huizhou: 'right',
  danzhou: 'left'
}

function lineItem(leg, style) {
  const a = placeById[leg.from]
  const b = placeById[leg.to]
  return { coords: [[a.lon, a.lat], [b.lon, b.lat]], lineStyle: style }
}

// 全部路段：演示中按「已走 / 当前 / 未走」分档；当前段若在描线中则暂隐
function linesData() {
  return legs.map((leg, i) => {
    if (!playing.value) {
      return lineItem(leg, { color: leg.exile ? '#9E2B25' : '#87A6B3', opacity: 0.55, width: 1.3 })
    }
    if (i < legIndex.value) {
      return lineItem(leg, { color: leg.exile ? '#9E2B25' : '#596E76', opacity: 0.7, width: 1.6 })
    }
    if (i === legIndex.value) {
      if (i === growingIndex) return lineItem(leg, { opacity: 0, width: 0 })
      const col = leg.exile ? '#9E2B25' : '#596E76'
      return lineItem(leg, { color: col, opacity: 0.95, width: 2.4 })
    }
    return lineItem(leg, { color: '#87A6B3', opacity: 0.14, width: 1 })
  })
}

function scatterData() {
  const focus = currentLeg.value ? currentLeg.value.to : selectedId.value
  return places.map(p => {
    const isFocus = p.id === focus
    const isSel = p.id === selectedId.value
    return {
      name: p.name,
      id: p.id,
      value: [p.lon, p.lat],
      symbolSize: isFocus || isSel ? 15 : EXILE.includes(p.id) ? 13 : 10,
      label: {
        position: LABEL_POS[p.id] ?? 'right',
        color: isFocus || isSel ? '#3A3A3A' : '#5F635D',
        fontWeight: isFocus || isSel ? 600 : 400
      },
      itemStyle: {
        color: EXILE.includes(p.id) ? '#9E2B25' : '#87A6B3',
        borderColor: isFocus || isSel ? '#3A3A3A' : '#F3F5F0',
        borderWidth: isFocus || isSel ? 2.5 : 1.5,
        shadowBlur: isFocus || isSel ? 8 : 0,
        shadowOffsetY: isFocus || isSel ? 2 : 0,
        shadowColor: 'rgba(58, 58, 58, 0.35)'
      }
    }
  })
}

function buildOption() {
  return {
    tooltip: {
      trigger: 'item',
      textStyle: { fontFamily: 'Noto Serif SC, STFangsong, FangSong, serif', color: '#3A3A3A' },
      backgroundColor: '#F3F5F0',
      borderColor: '#C0C4BD',
      formatter: p => {
        if (p.seriesType !== 'scatter') return ''
        const d = placeById[p.data.id]
        return `<strong>${d.name}</strong>（今${d.modern}）<br/>${d.years}<br/>${d.role}`
      }
    },
    geo: {
      map: 'song-china',
      roam: true,
      scaleLimit: { min: 0.8, max: 8 },
      layoutCenter: ['50%', '54%'],
      layoutSize: '155%',
      itemStyle: { areaColor: '#DDDFD8', borderColor: '#C0C4BD', borderWidth: 0.6 },
      emphasis: { disabled: true },
      select: { disabled: true }
    },
    series: [
      {
        name: '行迹路线',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 1,
        z: 2,
        lineStyle: { curveness: CURVE },
        data: linesData()
      },
      {
        name: '行迹地点',
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        data: scatterData(),
        label: {
          show: true,
          distance: 6,
          color: '#5F635D',
          fontFamily: 'Noto Serif SC, STFangsong, FangSong, serif',
          fontSize: 12,
          formatter: '{b}'
        }
      }
    ]
  }
}

// 选择/演示变化只做合并更新（不含 geo），用户的缩放/平移状态得以保留
function updateSelection() {
  if (chart) {
    chart.setOption({ series: [{ data: linesData() }, { data: scatterData() }] })
  }
}

function resetView() {
  if (chart) {
    chart.dispatchAction({ type: 'restore' })
    removeGrowShapes()
    updateSelection()
  }
}

const onResize = () => {
  if (chart) {
    chart.resize()
    // 画布尺寸变了，正在生长的像素坐标描线作废，交回静态线
    if (growShapes.length) {
      removeGrowShapes()
      updateSelection()
    }
  }
}

onMounted(() => {
  echarts.registerMap('song-china', chinaGeo)
  chart = echarts.init(mapEl.value)
  chart.setOption(buildOption())
  chart.on('click', params => {
    if (params.seriesType === 'scatter') selectedId.value = params.data.id
  })
  chart.on('geoRoam', () => {
    if (growShapes.length) {
      removeGrowShapes()
      updateSelection()
    }
  })
  window.addEventListener('resize', onResize)
  window.__mapChart = chart
})

onBeforeUnmount(() => {
  stopPlayTimer()
  growRaf && cancelAnimationFrame(growRaf)
  window.removeEventListener('resize', onResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})

watch(selectedId, updateSelection)

const selectedEvents = computed(() => {
  if (!selected.value) return []
  return events.filter(e => e.placeId === selected.value.id)
})
const selectedPoems = computed(() =>
  selected.value ? poemsByPlace(selected.value.id) : []
)
</script>

<template>
  <section class="container-wide map-page">
    <header class="map-head">
      <h1 class="plaque">行迹地图</h1>
      <p class="text-muted map-sub">从眉山到常州，宦游与贬谪的一生；点击地名看当地事迹与作品</p>
    </header>

    <div class="map-layout">
      <div class="map-wrap paper">
        <div ref="mapEl" class="map-canvas" aria-label="苏轼一生迁徙路线图"></div>
        <Transition name="fade-slide">
          <div v-if="currentLeg" class="route-caption" :key="legIndex">
            <span class="cap-year year-calligraphy">{{ currentLeg.year }}</span>
            <span class="cap-text">{{ currentLeg.label }}</span>
            <span class="cap-route text-faint">{{ placeById[currentLeg.from].name }} → {{ placeById[currentLeg.to].name }}</span>
          </div>
        </Transition>
        <div class="map-controls">
          <button class="map-btn" type="button" @click="togglePlay">
            {{ playing ? '停止演示' : '播放行迹' }}
          </button>
          <button class="map-btn" type="button" @click="resetView">重置视角</button>
        </div>
        <p class="map-hint text-faint">滚轮缩放 · 拖拽平移</p>
        <p class="map-legend text-faint">
          <span class="dot dot-normal"></span>宦游居停
          <span class="dot dot-exile"></span>贬谪之地
          <span class="line-demo line-demo-normal"></span>宦游之路
          <span class="line-demo line-demo-exile"></span>贬谪之路
        </p>
      </div>

      <aside class="map-aside">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="selected" key="detail">
            <div class="place-head">
              <h2 class="place-name font-display">{{ selected.name }}</h2>
              <span class="tag">{{ selected.role }}</span>
            </div>
            <p class="text-faint">今{{ selected.modern }}，{{ selected.years }}</p>
            <p class="place-desc text-muted">{{ selected.desc }}</p>

            <div v-if="selectedEvents.length" class="aside-block">
              <h3 class="aside-title">事迹</h3>
              <ul>
                <li v-for="e in selectedEvents" :key="e.year + e.title" class="ev-item">
                  <span class="ev-year year-calligraphy">{{ e.year }}</span>
                  <strong>{{ e.title }}</strong>
                  <span class="text-muted ev-desc">{{ e.desc }}</span>
                </li>
              </ul>
            </div>

            <div v-if="selectedPoems.length" class="aside-block">
              <h3 class="aside-title">此地作品</h3>
              <router-link
                v-for="p in selectedPoems"
                :key="p.id"
                class="place-poem"
                :to="`/shici/${p.id}`"
              >
                <span class="p-year">{{ p.year }}</span>
                <span class="font-poem">{{ p.title }}</span>
              </router-link>
            </div>
            <p v-else class="text-faint">暂无收录于此地的作品</p>

            <button class="btn-seal back-btn" type="button" @click="selectedId = null">
              返回行迹简表
            </button>
          </div>

          <div v-else key="list">
            <h2 class="aside-title">行迹简表</h2>
            <button
              v-for="p in orderedPlaces"
              :key="p.id"
              type="button"
              class="place-row"
              :class="{ exile: EXILE.includes(p.id) }"
              @click="selectedId = p.id"
            >
              <span class="place-row-name font-display">{{ p.name }}</span>
              <span class="place-row-years text-faint">{{ p.years }}</span>
            </button>
          </div>
        </Transition>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.map-page {
  padding-block: 64px var(--section-gap);
}

.map-head {
  text-align: center;
  margin-bottom: 48px;
}

.map-sub {
  margin-top: 14px;
  letter-spacing: 0.14em;
}

.map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 40px;
  align-items: start;
}

.map-wrap {
  position: relative;
  padding: 12px;
}

.map-canvas {
  width: 100%;
  height: min(72vh, 700px);
  min-height: 420px;
}

.route-caption {
  position: absolute;
  left: 20px;
  top: 16px;
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(243, 245, 240, 0.94);
  border: 1px solid var(--ink-border);
  border-radius: var(--radius);
}

.cap-year {
  font-size: 24px;
  color: var(--ink-accent-deep);
}

.cap-text {
  font-size: 15px;
  letter-spacing: 0.08em;
}

.cap-route {
  letter-spacing: 0.04em;
}

.map-controls {
  position: absolute;
  right: 20px;
  top: 16px;
  display: flex;
  gap: 8px;
}

.map-btn {
  padding: 4px 14px;
  min-height: 32px;
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.14em;
  text-indent: 0.14em;
  color: var(--ink-text-2);
  background: rgba(243, 245, 240, 0.9);
  border: 1px solid var(--ink-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: color 0.2s ease-out, border-color 0.2s ease-out, transform 0.15s ease-out;
}

.map-btn:hover {
  color: var(--ink-accent-deep);
  border-color: var(--ink-accent);
}

.map-btn:active {
  transform: translateY(1px);
}

.map-hint {
  position: absolute;
  right: 20px;
  bottom: 16px;
  pointer-events: none;
}

.map-legend {
  position: absolute;
  left: 20px;
  bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  flex-wrap: wrap;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 14px;
}

.dot:first-child {
  margin-left: 0;
}

.dot-normal {
  background: #87a6b3;
}

.dot-exile {
  background: #9e2b25;
}

.line-demo {
  display: inline-block;
  width: 22px;
  height: 0;
  border-top: 2px solid #87a6b3;
  margin-left: 14px;
  vertical-align: middle;
}

.line-demo-exile {
  border-top-color: #9e2b25;
}

.map-aside {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 侧栏内容切换：淡入上移，200ms 内完成 */
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

.place-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
}

.place-name {
  font-size: 40px;
  letter-spacing: 0.16em;
}

.place-desc {
  font-size: 15px;
  line-height: 1.9;
}

.aside-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: var(--ink-text);
  margin-bottom: 6px;
}

.ev-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-block: 10px;
  font-size: 15px;
}

.ev-year {
  font-size: 18px;
  color: var(--ink-accent-deep);
}

.ev-desc {
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

.place-poem .p-year {
  font-family: var(--font-display);
  color: var(--ink-text-3);
}

.place-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 4px;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--ink-border);
  font-family: var(--font-ui);
  cursor: pointer;
  color: var(--ink-text-2);
  transition: color 0.2s ease-out, background-color 0.2s ease-out, transform 0.15s ease-out;
}

.place-row:hover {
  color: var(--ink-text);
  background: rgba(135, 166, 179, 0.1);
}

.place-row:active {
  transform: translateY(1px);
}

.place-row.exile .place-row-name {
  color: var(--ink-seal);
}

.place-row-name {
  font-size: 22px;
  letter-spacing: 0.14em;
}

.place-row-years {
  letter-spacing: 0.04em;
}

.back-btn {
  margin-top: 8px;
  align-self: flex-start;
}

@media (max-width: 980px) {
  .map-layout {
    grid-template-columns: 1fr;
  }
  .map-canvas {
    height: 56vh;
  }
  .place-name {
    font-size: 32px;
  }
  .route-caption {
    max-width: 70%;
  }
}
</style>
