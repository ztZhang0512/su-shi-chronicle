<script setup>
import { ref, computed } from 'vue'
import { phases } from '../data/places'
import { events } from '../data/events'
import { poemsByPhase } from '../data/poems'

const scroller = ref(null)
const segRefs = ref([])
const active = ref(0)

// 按住拖动卷轴：滚动条隐藏后，给鼠标用户原生的横向平移手感；
// 松手后带惯性滑行（速度指数衰减），避免急停的生硬感
const dragging = ref(false)
let dragStartX = 0
let dragStartLeft = 0
let dragMoved = false
let glideId = 0
let velocity = 0
let lastX = 0
let lastT = 0

function cancelGlide() {
  if (glideId) {
    cancelAnimationFrame(glideId)
    glideId = 0
  }
}

function onDragStart(e) {
  lockIndex = null
  cancelGlide()
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  dragging.value = true
  dragMoved = false
  velocity = 0
  dragStartX = e.clientX
  lastX = e.clientX
  lastT = performance.now()
  dragStartLeft = scroller.value ? scroller.value.scrollLeft : 0
}

function onDragMove(e) {
  if (!dragging.value) return
  const now = performance.now()
  const dx = e.clientX - dragStartX
  if (!dragMoved && Math.abs(dx) > 5) {
    dragMoved = true
    // 拖动确认后才捕获指针；过早捕获会把点击事件也重定向到容器，链接点不开
    scroller.value?.setPointerCapture?.(e.pointerId)
  }
  if (dragMoved && scroller.value) {
    scroller.value.scrollLeft = dragStartLeft - dx
    const dt = now - lastT
    if (dt > 0) {
      // 采样瞬时速度并平滑，供松手后惯性使用
      velocity = 0.8 * velocity + 0.2 * (-(e.clientX - lastX) / dt)
    }
    lastX = e.clientX
    lastT = now
  }
}

function onDragEnd() {
  dragging.value = false
  // 松手惯性：速度低于阈值或触到边界即停
  if (!scroller.value || Math.abs(velocity) < 0.2) return
  cancelGlide()
  let v = velocity
  let last = performance.now()
  const step = now => {
    if (!scroller.value) return
    const dt = now - last
    last = now
    const before = scroller.value.scrollLeft
    scroller.value.scrollLeft = before + v * dt
    v *= Math.pow(0.94, dt / 16.7)
    const stopped = Math.abs(v) < 0.02 || scroller.value.scrollLeft === before
    if (!stopped) glideId = requestAnimationFrame(step)
  }
  glideId = requestAnimationFrame(step)
}

// 拖动结束后吞掉误触的点击（避免拖完刚好落在一篇作品上）
function onClickCapture(e) {
  if (dragMoved) {
    e.preventDefault()
    e.stopPropagation()
    dragMoved = false
  }
}

const eventsByPhase = computed(() => {
  const m = {}
  for (const ph of phases) m[ph.key] = events.filter(e => e.phase === ph.key)
  return m
})

// 点击 Tab 后锁定高亮，直到用户手动滚动（拖拽/滚轮）才恢复跟随
let lockIndex = null

function onScroll() {
  if (lockIndex !== null) return
  const el = scroller.value
  if (!el) return
  // 高亮跟随「最左边可见的段」，与阅读直觉一致
  let idx = 0
  segRefs.value.forEach((seg, i) => {
    if (seg && seg.offsetLeft <= el.scrollLeft + 80) idx = i
  })
  active.value = idx
}

function onUserScroll() {
  cancelGlide()
  lockIndex = null
  onScroll()
}

function goTo(i) {
  const el = scroller.value
  const seg = segRefs.value[i]
  if (!el || !seg) return
  // 让目标段出现在长卷视口中央，并锁定高亮到该段
  cancelGlide()
  lockIndex = i
  active.value = i
  const left = seg.offsetLeft + seg.offsetWidth / 2 - el.clientWidth / 2
  el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
}
</script>

<template>
  <section class="tl-page">
    <header class="container tl-head">
      <h1 class="plaque">生平长卷</h1>
      <p class="tl-sub text-muted">横向拖动长卷，八段人生，六十六年</p>
    </header>

    <div class="tl-ruler">
      <div class="container-wide tl-tabs" role="tablist" aria-label="人生阶段">
        <button
          v-for="(ph, i) in phases"
          :key="ph.key"
          class="tl-tab"
          :class="{ active: i === active }"
          type="button"
          @click="goTo(i)"
        >
          <span class="t">{{ ph.name }}</span>
          <span class="y text-faint">{{ ph.range }}</span>
        </button>
      </div>
    </div>

    <div
      ref="scroller"
      class="tl-scroll"
      :class="{ dragging }"
      @scroll.passive="onScroll"
      @wheel.passive="onUserScroll"
      @pointerdown="onDragStart"
      @pointermove="onDragMove"
      @pointerup="onDragEnd"
      @pointercancel="onDragEnd"
      @click.capture="onClickCapture"
    >
      <article
        v-for="(ph, i) in phases"
        :key="ph.key"
        :ref="el => (segRefs[i] = el)"
        class="phase-seg"
      >
        <div class="seg-year year-calligraphy">{{ ph.range.slice(0, 4) }}</div>
        <h2 class="seg-name font-display">{{ ph.name }}</h2>
        <p class="seg-short text-muted">{{ ph.short }}</p>

        <ol class="seg-events">
          <li v-for="ev in eventsByPhase[ph.key]" :key="ev.year + ev.title" class="seg-event">
            <div class="year-node">
              <span class="year">{{ ev.approx ? '约 ' : '' }}{{ ev.year }}</span>
              <span v-if="ev.eraLabel" class="ev-era text-faint">{{ ev.eraLabel }}</span>
            </div>
            <h3 class="ev-title">{{ ev.title }}</h3>
            <router-link
              v-if="ev.deep"
              class="deep-link"
              :to="`/shijian/${ev.deep}`"
              title="读这一事件的始末"
            >始末</router-link>
            <p class="ev-desc text-muted">{{ ev.desc }}</p>
            <div v-if="ev.stories" class="ev-stories">
              <div v-for="s in ev.stories" :key="s.t" class="ev-story">
                <span class="ev-story-title">{{ s.t }}</span>
                <p class="ev-story-text text-muted">{{ s.text }}</p>
              </div>
            </div>
          </li>
        </ol>

        <div v-if="poemsByPhase(ph.key).length" class="seg-poems">
          <p class="text-faint seg-poems-label">此间作品</p>
          <router-link
            v-for="p in poemsByPhase(ph.key)"
            :key="p.id"
            class="poem-chip"
            :to="`/shici/${p.id}`"
          >
            <span class="p-year">{{ p.year }}</span>
            <span class="p-title font-poem">{{ p.title }}</span>
          </router-link>
        </div>
        <div v-else class="seg-poems">
          <p class="text-faint">此段暂无收录作品</p>
        </div>
      </article>
      <div class="tl-tail" aria-hidden="true"></div>
    </div>
  </section>
</template>

<style scoped>
.tl-page {
  padding-block: 64px 0;
}

.tl-head {
  text-align: center;
  margin-bottom: 40px;
}

.tl-sub {
  margin-top: 14px;
  letter-spacing: 0.2em;
}

/* 阶段标尺：粘在导航下方 */
.tl-ruler {
  position: sticky;
  top: 64px;
  z-index: 30;
  background: rgba(235, 237, 230, 0.92);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--ink-border);
  border-bottom: 1px solid var(--ink-border);
}

.tl-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tl-tabs::-webkit-scrollbar {
  display: none;
}

.tl-tab {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  padding: 10px 16px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  font-family: var(--font-ui);
  cursor: pointer;
  color: var(--ink-text-2);
  transition: color 0.2s ease-out, border-color 0.2s ease-out;
}

.tl-tab .t {
  font-size: 15px;
  letter-spacing: 0.14em;
  white-space: nowrap;
}

.tl-tab .y {
  font-size: 12px;
}

.tl-tab:hover {
  color: var(--ink-text);
}

.tl-tab.active {
  color: var(--ink-text);
  border-bottom-color: var(--ink-seal);
}

/* 横向长卷：滚动条隐藏，右缘渐隐如卷轴待展；鼠标按住拖动，松手带惯性 */
.tl-scroll {
  display: flex;
  overflow-x: auto;
  padding: 64px 24px 96px;
  scrollbar-width: none;
  cursor: grab;
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 56px), transparent);
  mask-image: linear-gradient(to right, #000 calc(100% - 56px), transparent);
}

.tl-scroll::-webkit-scrollbar {
  display: none;
}

.tl-scroll.dragging {
  cursor: grabbing;
  user-select: none;
}

.phase-seg {
  flex: 0 0 auto;
  width: min(560px, 86vw);
  scroll-snap-align: start;
  border-left: 1px solid var(--ink-border);
  padding: 0 40px 0 32px;
}

.seg-year {
  font-size: 72px;
  color: var(--ink-accent-deep);
  opacity: 0.9;
}

.seg-name {
  font-size: 40px;
  letter-spacing: 0.2em;
  margin-top: 8px;
}

.seg-short {
  margin-top: 8px;
  letter-spacing: 0.06em;
}

.seg-events {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ev-title {
  display: inline;
  font-size: 17px;
  font-weight: 600;
  margin-left: 2px;
}

.ev-era {
  font-size: 13px;
  letter-spacing: 0.08em;
}

.ev-desc {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.85;
}

.deep-link {
  display: inline-block;
  margin-left: 10px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.7;
  letter-spacing: 0.1em;
  color: var(--ink-seal);
  border: 1px solid var(--ink-seal);
  border-radius: var(--radius);
  vertical-align: middle;
  transition: all 0.2s ease-out;
}

.deep-link:hover {
  color: var(--ink-seal-paper);
  background: var(--ink-seal);
  text-decoration: none;
}

/* 轶事层：朱批样式，有出处的旧闻小事 */
.ev-stories {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ev-story {
  padding-left: 14px;
  border-left: 1px solid var(--ink-seal);
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

.seg-poems {
  margin-top: 32px;
  border-top: 1px solid var(--ink-border);
  padding-top: 20px;
}

.seg-poems-label {
  letter-spacing: 0.3em;
  margin-bottom: 10px;
}

.poem-chip {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 7px 4px;
  border-radius: var(--radius);
  color: var(--ink-text-2);
  transition: color 0.2s ease-out, background-color 0.2s ease-out;
}

.poem-chip:hover {
  color: var(--ink-accent-deep);
  background: rgba(135, 166, 179, 0.12);
  text-decoration: none;
}

.p-year {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--ink-text-3);
  flex-shrink: 0;
}

.p-title {
  font-size: 16px;
}

.tl-tail {
  flex: 0 0 8vw;
}

@media (max-width: 768px) {
  .tl-ruler {
    top: 0;
  }
  .tl-scroll {
    padding-block: 40px 64px;
  }
  .phase-seg {
    padding-inline: 24px 16px;
  }
  .seg-year {
    font-size: 56px;
  }
  .seg-name {
    font-size: 32px;
  }
}
</style>
