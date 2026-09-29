<script setup>
import { computed } from 'vue'
import { quotes } from '../data/events'

// 每次进入随机换一句，附全篇入口
const daily = computed(() => quotes[Math.floor(Math.random() * quotes.length)])
</script>

<template>
  <section class="hero">
    <p class="eyebrow-zh hero-eyebrow">北宋 · 1037 – 1101</p>
    <h1 class="hero-name font-display">苏轼</h1>
    <p class="hero-alias">字子瞻，号东坡居士</p>

    <div class="hero-quote vertical-text font-display" aria-hidden="true">
      一蓑烟雨任平生
    </div>

    <nav class="hero-entries" aria-label="站点入口">
      <router-link class="btn-seal" to="/shengping">走进生平</router-link>
      <router-link class="btn-seal" to="/shici">诗词编年</router-link>
      <router-link class="btn-seal" to="/renwu">人物谱</router-link>
      <router-link class="btn-seal" to="/ditu">行迹地图</router-link>
    </nav>

    <hr class="ink-divider" />

    <div class="hero-daily">
      <p class="hero-random font-poem">{{ daily.text }}</p>
      <router-link class="hero-daily-link" :to="`/shici/${daily.pid}`">读全篇</router-link>
    </div>
  </section>
</template>

<style scoped>
.hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 64px 24px;
}

.hero-eyebrow {
  margin-bottom: 8px;
}

.hero-name {
  font-size: clamp(88px, 16vw, 152px);
  line-height: 1.05;
  letter-spacing: 0.2em;
  text-indent: 0.2em;
  color: var(--ink-text);
}

.hero-alias {
  margin-top: 12px;
  letter-spacing: 0.3em;
  color: var(--ink-text-2);
  font-size: 16px;
}

.hero-quote {
  position: absolute;
  top: 50%;
  right: clamp(16px, 8vw, 128px);
  transform: translateY(-58%);
  font-size: clamp(20px, 2.6vw, 30px);
  color: var(--ink-accent-deep);
  height: 280px;
}

@media (max-width: 900px) {
  .hero-quote {
    display: none;
  }
}

.hero-entries {
  margin-top: 72px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-daily {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hero-random {
  font-size: 18px;
  letter-spacing: 0.18em;
  color: var(--ink-text-2);
}

.hero-daily-link {
  font-size: 14px;
  letter-spacing: 0.18em;
  color: var(--ink-accent-deep);
  border-bottom: 1px solid rgba(89, 110, 118, 0.4);
  padding-bottom: 2px;
}

.hero-daily-link:hover {
  text-decoration: none;
  border-bottom-color: var(--ink-accent-deep);
}

.hero-random::before,
.hero-random::after {
  content: '';
  display: inline-block;
  width: 36px;
  height: 1px;
  background: var(--ink-border);
  vertical-align: middle;
  margin-inline: 16px;
}

@media (max-width: 640px) {
  .hero-random {
    font-size: 15px;
    letter-spacing: 0.1em;
  }
  .hero-random::before,
  .hero-random::after {
    display: none;
  }
}
</style>
