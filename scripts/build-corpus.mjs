// 从 chinese-poetry 数据集提取苏轼全量诗词，繁转简、去重，
// 并用确定性规则推断系年/人生阶段，输出 src/data/poems-full.json。
// 用法：node scripts/build-corpus.mjs <chinese-poetry 仓库目录>
import fs from 'node:fs'
import path from 'node:path'
import * as OpenCC from 'opencc-js'

const ROOT = path.resolve(process.argv[2] || '../skill-repos/chinese-poetry')
const OUT = path.resolve('src/data/poems-full.json')
const CURATED = path.resolve('src/data/poems.js')

const t2s = OpenCC.Converter({ from: 't', to: 'cn' })

// ---------- 1. 读取数据源 ----------
const shi = []
for (const f of fs.readdirSync(path.join(ROOT, 'json')).filter(f => /^poet\.song\.\d+\.json$/.test(f))) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'json', f), 'utf8'))
  for (const p of data) {
    if (p.author === '蘇軾') {
      shi.push({
        title: t2s(String(p.title || '').trim()),
        paragraphs: (p.paragraphs || []).map(l => t2s(String(l)))
      })
    }
  }
}

const ci = []
for (const f of fs.readdirSync(path.join(ROOT, '宋词')).filter(f => /^ci\.song\.\d+\.json$/.test(f))) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, '宋词', f), 'utf8'))
  for (const p of data) {
    if (p.author === '苏轼') {
      ci.push({
        title: String(p.title || p.rhythmic || '').trim(),
        paragraphs: (p.paragraphs || []).map(l => String(l))
      })
    }
  }
}

// ---------- 2. 与编年名篇去重 ----------
const curatedSrc = fs.readFileSync(CURATED, 'utf8')
const curatedTitles = [...curatedSrc.matchAll(/^\s{4}title: '(.+?)',$/gm)].map(m => m[1])
const curatedFirstLines = [...curatedSrc.matchAll(/^\s{4}firstLine: '(.+?)',$/gm)].map(m => m[1])
const norm = s => s.replace(/[，。！？、；：""''「」·\s]/g, '')

const curatedSet = new Set(curatedTitles)
const curatedFirstSet = new Set(curatedFirstLines.map(f => norm(f).slice(0, 6)))

function isDup(entry, type) {
  if (type === '诗' && curatedSet.has(entry.title)) return true
  if (type === '词') {
    const paizi = entry.title.split('·')[0]
    for (let i = 0; i < curatedTitles.length; i++) {
      const ct = curatedTitles[i]
      if ((ct === paizi || ct.split('·')[0] === paizi) &&
          curatedFirstSet.has(norm(entry.paragraphs[0] || '').slice(0, 6))) return true
    }
  }
  return false
}

// ---------- 3. 系年推断引擎（确定性规则，依据写进 evidence） ----------
const ERAS = [
  ['建中靖国', 1101, 1101], ['元符', 1098, 1100], ['绍圣', 1094, 1098],
  ['元祐', 1086, 1094], ['元丰', 1078, 1085], ['熙宁', 1068, 1077],
  ['治平', 1064, 1067], ['嘉祐', 1056, 1063], ['至和', 1054, 1056],
  ['皇祐', 1049, 1054], ['庆历', 1041, 1048], ['康定', 1040, 1041],
  ['宝元', 1038, 1040], ['景祐', 1034, 1038]
]
const CN_NUM = { 元: 1, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 }

const STEMS = '甲乙丙丁戊己庚辛壬癸'
const BRANCHES = '子丑寅卯辰巳午未申酉戌亥'
const GANZHI_YEAR = new Map()
for (let y = 1037; y <= 1101; y++) {
  const i = (y - 4) % 60
  const name = STEMS[i % 10] + BRANCHES[i % 12]
  if (!GANZHI_YEAR.has(name)) GANZHI_YEAR.set(name, [])
  GANZHI_YEAR.get(name).push(y)
}

// 地名 → [年起, 年止, 阶段]，顺序即优先级；未列出的地名不作断言
const PLACE_RULES = [
  [['超然台', '密州', '诸城'], 1074, 1077, 'zhuanzhan'],
  [['徐州', '黄楼', '燕子楼', '百步洪', '石潭'], 1077, 1079, 'zhuanzhan'],
  [['乌台', '御史台'], 1079, 1079, 'wutai'],
  [['湖州'], 1079, 1079, 'wutai'],
  [['黄州', '东坡', '雪堂', '赤壁', '定慧院', '临皋', '沙湖', '蕲水'], 1080, 1084, 'huangzhou'],
  [['庐山', '西林'], 1084, 1084, 'huangzhou'],
  [['登州', '蓬莱'], 1085, 1085, 'zaiqi'],
  [['颍州'], 1091, 1092, 'zaiqi'],
  [['扬州', '平山堂'], 1092, 1093, 'zaiqi'],
  [['定州'], 1093, 1094, 'zaiqi'],
  [['惠州', '罗浮'], 1094, 1097, 'nanhuang'],
  [['儋州', '儋耳', '昌化', '桄榔', '海南'], 1097, 1100, 'nanhuang'],
  [['凤翔'], 1061, 1065, 'jingshi'],
  [['望湖楼', '有美堂'], 1071, 1074, 'zhuanzhan']
]

function infer(title) {
  const head = title // 只依据题名（题序），正文不做断言
  let eraRange = null
  let eraEvidence = null
  for (const [era, start, end] of ERAS) {
    if (!head.includes(era)) continue
    const m = head.match(new RegExp(era + '([元一二三四五六七八九十]+)年'))
    if (m) {
      // 年号纪年数字解析：元=1，十=10，十一=11（苏轼享年内不会出现更大的数）
      let num
      if (m[1] === '元') num = 1
      else if (m[1].includes('十')) {
        const parts = m[1].split('十')
        num = (parts[0] ? CN_NUM[parts[0]] : 1) * 10 + (parts[1] ? CN_NUM[parts[1]] : 0)
      } else num = CN_NUM[m[1]]
      const year = start + num - 1
      if (year >= 1037 && year <= 1101) {
        return { year, yearApprox: false, yearStart: year, yearEnd: year, phase: null, evidence: `题序见「${era}${m[1]}年」，直接系年` }
      }
    }
    eraRange = [start, end]
    eraEvidence = `题序见年号「${era}」`
    break
  }

  // 和陶诗：题中干支是陶渊明原作年份，不可用于系年；苏轼晚年遍和陶诗，作于惠州、儋州
  if (/^和陶/.test(head)) {
    return { year: null, yearApprox: true, yearStart: 1096, yearEnd: 1100, phase: 'nanhuang', evidence: '和陶诗，作于惠州、儋州时期（1096–1100）' }
  }

  for (const gz of GANZHI_YEAR.keys()) {
    if (head.includes(gz)) {
      const ys = (GANZHI_YEAR.get(gz) || []).filter(y => y >= 1049) // 12 岁前排除，65 年内干支唯一
      if (ys.length === 1) {
        return { year: ys[0], yearApprox: false, yearStart: ys[0], yearEnd: ys[0], phase: null, evidence: `题见干支「${gz}」，苏轼一生中唯一，系于 ${ys[0]} 年` }
      }
    }
  }

  let placeRange = null
  let placeEvidence = null
  let phase = null
  for (const [keys, y1, y2, ph] of PLACE_RULES) {
    const hit = keys.find(k => head.includes(k))
    if (hit) {
      placeRange = [y1, y2]
      placeEvidence = `题见「${hit}」，${y1}–${y2} 年`
      phase = ph
      break
    }
  }

  // 年号区间与地名区间取交集
  let range = null
  const evidences = []
  if (eraRange && placeRange) {
    const lo = Math.max(eraRange[0], placeRange[0])
    const hi = Math.min(eraRange[1], placeRange[1])
    if (lo <= hi) {
      range = [lo, hi]
      evidences.push(eraEvidence, placeEvidence)
    } else {
      range = placeRange
      evidences.push(placeEvidence)
    }
  } else if (placeRange) {
    range = placeRange
    evidences.push(placeEvidence)
  } else if (eraRange) {
    range = eraRange
    evidences.push(eraEvidence)
  }

  if (range) {
    if (range[0] === range[1]) {
      return { year: range[0], yearApprox: true, yearStart: range[0], yearEnd: range[1], phase, evidence: evidences.join('，') + '，推断系年' }
    }
    return { year: null, yearApprox: true, yearStart: range[0], yearEnd: range[1], phase, evidence: evidences.join('，') }
  }
  return { year: null, yearApprox: false, yearStart: null, yearEnd: null, phase: null, evidence: null }
}

// ---------- 4. 组装输出 ----------
function pairLines(paragraphs, type) {
  // 诗数据为单句一行，按两句一行成联；词保持原分句
  if (type === '诗') {
    const lines = []
    for (let i = 0; i < paragraphs.length; i += 2) {
      lines.push(paragraphs.slice(i, i + 2).join(''))
    }
    return lines
  }
  return paragraphs
}

const result = []
let n = 0
let skipped = 0
for (const [type, list] of [['诗', shi], ['词', ci]]) {
  for (const p of list) {
    if (!p.title || !p.paragraphs.length) { skipped++; continue }
    if (isDup(p, type)) { skipped++; continue }
    const inf = infer(p.title)
    const lines = pairLines(p.paragraphs, type)
    let yearLabel = null
    if (inf.year != null) yearLabel = inf.yearApprox ? `约 ${inf.year}` : `${inf.year}`
    else if (inf.yearStart) yearLabel = `约 ${inf.yearStart}–${inf.yearEnd}`
    result.push({
      id: 'c' + (++n),
      title: p.title,
      type,
      year: inf.year,
      yearApprox: inf.yearApprox,
      yearLabel,
      phase: inf.phase,
      evidence: inf.evidence,
      firstLine: lines[0] || '',
      lines
    })
  }
}

result.sort((a, b) => (a.year ?? a.yearStart ?? 9999) - (b.year ?? b.yearStart ?? 9999))

const meta = {
  total: result.length,
  shi: result.filter(p => p.type === '诗').length,
  ci: result.filter(p => p.type === '词').length,
  withYear: result.filter(p => p.year != null).length,
  withPhase: result.filter(p => p.year == null && p.phase).length,
  undated: result.filter(p => p.year == null && !p.phase).length,
  skippedDupOrEmpty: skipped
}

fs.writeFileSync(OUT, JSON.stringify({ meta, poems: result }, null, 1), 'utf8')
console.log(JSON.stringify(meta))
