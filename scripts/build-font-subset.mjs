// 从系统安装的方正苏轼行书简体 TTF 生成站点字符子集 woff2。
// ⚠️ 方正字体文件不得随站点公开分发：本脚本仅在取得方正 Web 授权后使用，
// 未授权阶段展示层仅通过 CSS local() 引用本机字体即可。
// 用法：node scripts/build-font-subset.mjs [TTF路径]
import fs from 'node:fs'
import path from 'node:path'
import subsetFont from 'subset-font'

const TTF = process.argv[2] || 'C:/Windows/Fonts/FZSuSXSJW.TTF'
const OUT = path.resolve('src/assets/fonts/fz-su-shi.woff2')

// 收集站点会渲染的全部字符：数据层 + 视图 + 入口 HTML
function collectChars() {
  const set = new Set()
  const walk = dir => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name)
      if (f.isDirectory()) {
        if (p.includes('fonts')) continue
        walk(p)
      } else if (/\.(js|vue|css|html|json)$/.test(f.name)) {
        for (const ch of fs.readFileSync(p, 'utf8')) set.add(ch)
      }
    }
  }
  walk(path.resolve('src'))
  for (const ch of fs.readFileSync(path.resolve('index.html'), 'utf8')) set.add(ch)
  return set
}

const chars = [...collectChars()].filter(c => c.charCodeAt(0) >= 32).join('')
console.log('收集到字符数:', chars.length)

const input = fs.readFileSync(TTF)
const output = await subsetFont(input, chars, { targetFormat: 'woff2' })
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, output)
console.log('子集字体大小:', (output.length / 1024 / 1024).toFixed(2), 'MB')
