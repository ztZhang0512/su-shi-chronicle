// 苏轼行迹地点（ECharts 经纬度，GCJ-02）
export const places = [
  { id: 'meishan',  name: '眉山',  modern: '四川眉山',   lon: 103.85, lat: 30.06, years: '1037 – 1056', role: '出生地', desc: '景祐三年十二月十九（1037 年 1 月 8 日）生于眉州眉山纱縠行，青少年时代在此度过。' },
  { id: 'bianjing', name: '汴京',  modern: '河南开封',   lon: 114.31, lat: 34.80, years: '1056 / 1065 / 1085 – 1091', role: '科举与两度居朝', desc: '嘉祐元年随父进京应试；嘉祐二年进士及第，深得欧阳修激赏；元祐年间两度还朝，官至翰林学士。' },
  { id: 'fengxiang', name: '凤翔', modern: '陕西凤翔',   lon: 107.40, lat: 34.52, years: '1061 – 1065', role: '初入仕途', desc: '嘉祐六年制科入第三等（百年第一），签书凤翔府判官，从此踏入宦海。' },
  { id: 'hangzhou', name: '杭州',  modern: '浙江杭州',   lon: 120.16, lat: 30.27, years: '1071 – 1074 / 1089 – 1091', role: '两度倅守', desc: '熙宁年间任通判，遍游湖山；元祐年间以龙图阁学士知杭州，疏浚西湖、筑苏堤。' },
  { id: 'mizhou',   name: '密州',  modern: '山东诸城',   lon: 119.42, lat: 35.99, years: '1074 – 1077', role: '首任知州', desc: '知密州两年，捕蝗抗旱，修葺超然台；丙辰中秋怀子由，作《水调歌头》。' },
  { id: 'xuzhou',   name: '徐州',  modern: '江苏徐州',   lon: 117.19, lat: 34.26, years: '1077 – 1079', role: '抗洪守城', desc: '知徐州，黄河决口，率军民抢筑长堤守城七十余日，全城得保。' },
  { id: 'huzhou',   name: '湖州',  modern: '浙江湖州',   lon: 120.09, lat: 30.87, years: '1079', role: '乌台诗案', desc: '知湖州三月，因《湖州谢上表》获罪，解赴御史台狱，系狱一百三十日。' },
  { id: 'huangzhou', name: '黄州', modern: '湖北黄冈',   lon: 114.87, lat: 30.45, years: '1080 – 1084', role: '贬谪与突围', desc: '谪居黄州四年余，躬耕东坡、两赋一词，完成从苏轼到东坡居士的蜕变。' },
  { id: 'dengzhou', name: '登州',  modern: '山东蓬莱',   lon: 120.76, lat: 37.82, years: '1085', role: '五日太守', desc: '知登州五日即被召还，在任虽短，仍上《乞罢登莱榷盐状》为民请命。' },
  { id: 'yingzhou', name: '颍州',  modern: '安徽阜阳',   lon: 115.82, lat: 32.90, years: '1091 – 1092', role: '知州', desc: '元祐六年出知颍州，浚治颍州西湖，与欧阳修遗爱相接。' },
  { id: 'yangzhou', name: '扬州',  modern: '江苏扬州',   lon: 119.42, lat: 32.39, years: '1092 – 1093', role: '知州', desc: '知扬州半年，奏罢劳民伤财的万花会。' },
  { id: 'dingzhou', name: '定州',  modern: '河北定州',   lon: 115.00, lat: 38.51, years: '1093 – 1094', role: '北疆末任', desc: '知定州整饬军纪；未几，朝局翻覆，贬命接踵而至。' },
  { id: 'huizhou',  name: '惠州',  modern: '广东惠州',   lon: 114.42, lat: 23.11, years: '1094 – 1097', role: '再贬', desc: '以宁远军节度副使惠州安置，"日啖荔枝三百颗"，把苦难过成了生活。' },
  { id: 'danzhou',  name: '儋州',  modern: '海南儋州',   lon: 109.58, lat: 19.52, years: '1097 – 1100', role: '天涯海角', desc: '责授琼州别驾、昌化军安置，居儋三年，讲学明道，教化一方。' },
  { id: 'changzhou', name: '常州', modern: '江苏常州',   lon: 119.95, lat: 31.78, years: '1101', role: '终老之地', desc: '建中靖国元年七月二十八日卒于常州，年六十六。' }
]

// 迁徙路线（按时间顺序的地点 id 序列）
export const route = [
  'meishan', 'bianjing', 'fengxiang', 'bianjing', 'hangzhou',
  'mizhou', 'xuzhou', 'huzhou', 'huangzhou', 'dengzhou',
  'bianjing', 'hangzhou', 'bianjing', 'yingzhou', 'yangzhou',
  'dingzhou', 'huizhou', 'danzhou', 'changzhou'
]

// 分段行程（行迹演示用）：与 route 顺序一致；exile 标记贬谪之路
export const legs = [
  { from: 'meishan',   to: 'bianjing',  year: 1056, label: '随父进京' },
  { from: 'bianjing',  to: 'fengxiang', year: 1061, label: '赴凤翔签判' },
  { from: 'fengxiang', to: 'bianjing',  year: 1065, label: '还朝' },
  { from: 'bianjing',  to: 'hangzhou',  year: 1071, label: '通判杭州' },
  { from: 'hangzhou',  to: 'mizhou',    year: 1074, label: '移知密州' },
  { from: 'mizhou',    to: 'xuzhou',    year: 1077, label: '移知徐州' },
  { from: 'xuzhou',    to: 'huzhou',    year: 1079, label: '移知湖州' },
  { from: 'huzhou',    to: 'huangzhou', year: 1080, label: '乌台诗案贬黄州', exile: true },
  { from: 'huangzhou', to: 'dengzhou',  year: 1085, label: '量移汝州，旋知登州' },
  { from: 'dengzhou',  to: 'bianjing',  year: 1085, label: '五日召还' },
  { from: 'bianjing',  to: 'hangzhou',  year: 1089, label: '再守杭州' },
  { from: 'hangzhou',  to: 'bianjing',  year: 1091, label: '召还翰林' },
  { from: 'bianjing',  to: 'yingzhou',  year: 1091, label: '出知颍州' },
  { from: 'yingzhou',  to: 'yangzhou',  year: 1092, label: '移知扬州' },
  { from: 'yangzhou',  to: 'dingzhou',  year: 1093, label: '出知定州' },
  { from: 'dingzhou',  to: 'huizhou',   year: 1094, label: '贬惠州', exile: true },
  { from: 'huizhou',   to: 'danzhou',   year: 1097, label: '再贬儋州', exile: true },
  { from: 'danzhou',   to: 'changzhou', year: 1101, label: '北归常州' }
]

// 人生八段（生平长卷与筛选共用）
export const phases = [
  { key: 'meishan',   name: '眉山少年', range: '1037 – 1055', short: '生于眉山，蜀中山水养其根器' },
  { key: 'jingshi',   name: '名动京师', range: '1056 – 1068', short: '进士及第、制科百年第一，欧阳修激赏' },
  { key: 'zhuanzhan', name: '辗转四方', range: '1069 – 1078', short: '因论新法自请外放，杭密徐三任' },
  { key: 'wutai',     name: '乌台诗案', range: '1079',        short: '御史台狱一百三十日，几死' },
  { key: 'huangzhou', name: '黄州突围', range: '1080 – 1084', short: '躬耕东坡，两赋一词，自号东坡居士' },
  { key: 'zaiqi',     name: '东山再起', range: '1085 – 1093', short: '还朝为翰林，知杭州浚西湖' },
  { key: 'nanhuang',  name: '再贬南荒', range: '1094 – 1100', short: '惠州、儋州，愈贬愈远' },
  { key: 'beigui',    name: '北归常州', range: '1100 – 1101', short: '遇赦北还，卒于常州' }
]

export const placeById = Object.fromEntries(places.map(p => [p.id, p]))
export const phaseByKey = Object.fromEntries(phases.map(p => [p.key, p]))
