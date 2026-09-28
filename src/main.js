import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'lxgw-wenkai-webfont/style.css'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/600.css'
import '@fontsource/noto-serif-sc/700.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

createApp(App).use(router).mount('#app')
