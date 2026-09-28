<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteNav from './components/SiteNav.vue'

const route = useRoute()
const isHome = computed(() => route.name === 'home')
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--home': isHome }">
    <SiteNav />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

/* 首页一屏站：外壳锁定视口高，hero 弹性填满剩余空间，不出现滚动条 */
.app-shell--home {
  height: 100vh;
}

.app-shell--home main {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.app-shell--home main :deep(.hero) {
  flex: 1;
}
</style>
