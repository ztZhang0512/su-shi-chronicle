// 诗词编年库：精系年名篇（学界通行编年；《蝶恋花》等存疑者在注中说明）
// paragraphs 内每一元素为一"句"或上下阕的一个层次，渲染时逐行成诗行。

export const poems = [
  {
    id: 'he-zi-you-mianchi',
    title: '和子由渑池怀旧',
    type: '诗',
    year: 1061,
    dateLabel: '嘉祐六年冬',
    place: '赴凤翔途中，经渑池',
    placeId: null,
    phase: 'jingshi',
    firstLine: '人生到处知何似，应似飞鸿踏雪泥',
    paragraphs: [
      '人生到处知何似，应似飞鸿踏雪泥。',
      '泥上偶然留指爪，鸿飞那复计东西。',
      '老僧已死成新塔，坏壁无由见旧题。',
      '往日崎岖还记否，路长人困蹇驴嘶。'
    ],
    note: '嘉祐六年冬赴凤翔签判任，途经渑池，和苏辙《怀渑池寄子瞻兄》。当年兄弟同宿僧舍题诗壁上，如今老僧已逝、旧题无存，遂有"雪泥鸿爪"之叹。'
  },
  {
    id: 'you-jinshan-si',
    title: '游金山寺',
    type: '诗',
    year: 1071,
    dateLabel: '熙宁四年冬',
    place: '金山寺（镇江）',
    placeId: null,
    phase: 'zhuanzhan',
    firstLine: '我家江水初发源，宦游直送江入海',
    paragraphs: [
      '我家江水初发源，宦游直送江入海。',
      '闻道潮头一丈高，天寒尚有沙痕在。',
      '中泠南畔石盘陀，古来出没随涛波。',
      '试登绝顶望乡国，江南江北青山多。',
      '羁愁畏晚寻归楫，山僧苦留看落日。',
      '微风万顷靴文细，断霞半空鱼尾赤。',
      '是时江月初生魄，二更月落天深黑。',
      '江心似有炬火明，飞焰照山栖乌惊。',
      '怅然归卧心莫识，非鬼非人竟何物？',
      '江山如此不归山，江神见怪惊我顽。',
      '我谢江神岂得已，有田不归如江水。'
    ],
    note: '熙宁四年冬赴杭州通判任，途经镇江金山寺。由江水起兴，登高望乡不见；夜见江心炬火之异，结句以江水为誓：有田不归，有如此水。'
  },
  {
    id: 'liu-yue-er-shi-qi-wanghu-lou',
    title: '六月二十七日望湖楼醉书',
    type: '诗',
    year: 1072,
    dateLabel: '熙宁五年',
    place: '杭州',
    placeId: 'hangzhou',
    phase: 'zhuanzhan',
    firstLine: '黑云翻墨未遮山，白雨跳珠乱入船',
    paragraphs: [
      '黑云翻墨未遮山，白雨跳珠乱入船。',
      '卷地风来忽吹散，望湖楼下水如天。'
    ],
    note: '熙宁五年六月二十七日，醉书于西湖望湖楼。四句写夏日骤雨倏来倏去，云如翻墨，雨如跳珠，收于一片水天。'
  },
  {
    id: 'yin-hu-shang-chu-qing-hou-yu',
    title: '饮湖上初晴后雨',
    type: '诗',
    year: 1073,
    dateLabel: '熙宁六年',
    place: '杭州',
    placeId: 'hangzhou',
    phase: 'zhuanzhan',
    firstLine: '水光潋滟晴方好，山色空蒙雨亦奇',
    paragraphs: [
      '水光潋滟晴方好，山色空蒙雨亦奇。',
      '欲把西湖比西子，淡妆浓抹总相宜。'
    ],
    note: '熙宁六年，与客饮于西湖。以西子喻西湖，从此西湖又名西子湖，可谓一诗定一湖。'
  },
  {
    id: 'you-mei-tang-baoyu',
    title: '有美堂暴雨',
    type: '诗',
    year: 1073,
    dateLabel: '熙宁六年',
    place: '杭州',
    placeId: 'hangzhou',
    phase: 'zhuanzhan',
    firstLine: '游人脚底一声雷，满座顽云拨不开',
    paragraphs: [
      '游人脚底一声雷，满座顽云拨不开。',
      '天外黑风吹海立，浙东飞雨过江来。',
      '十分潋滟金樽凸，千杖敲铿羯鼓催。',
      '唤起谪仙泉洒面，倒倾鲛室泻琼瑰。'
    ],
    note: '熙宁六年，在吴山有美堂遇暴雨。黑风立海、羯鼓催雨，以"倒倾鲛室"写雨之奇，想落天外。'
  },
  {
    id: 'qinyuanchun-fu-mizhou',
    title: '沁园春·赴密州早行马上寄子由',
    type: '词',
    year: 1074,
    dateLabel: '熙宁七年',
    place: '赴密州途中',
    placeId: null,
    phase: 'zhuanzhan',
    firstLine: '孤馆灯青，野店鸡号，旅枕梦残',
    paragraphs: [
      '孤馆灯青，野店鸡号，旅枕梦残。渐月华收练，晨霜耿耿，云山摛锦，朝露漙漙。世路无穷，劳生有限，似此区区长鲜欢。微吟罢，凭征鞍无语，往事千端。',
      '当时共客长安，似二陆初来俱少年。有笔头千字，胸中万卷，致君尧舜，此事何难。用舍由时，行藏在我，袖手何妨闲处看。身长健，但优游卒岁，且斗尊前。'
    ],
    note: '熙宁七年赴密州任，马上怀子由而作。忆当年并辔入京之少年豪气，"用舍由时，行藏在我"，是失意中的自持。'
  },
  {
    id: 'jiangchengzi-yimao-jimeng',
    title: '江城子·乙卯正月二十日夜记梦',
    type: '词',
    year: 1075,
    dateLabel: '熙宁八年正月',
    place: '密州',
    placeId: 'mizhou',
    phase: 'zhuanzhan',
    firstLine: '十年生死两茫茫，不思量，自难忘',
    paragraphs: [
      '十年生死两茫茫，不思量，自难忘。千里孤坟，无处话凄凉。纵使相逢应不识，尘满面，鬓如霜。',
      '夜来幽梦忽还乡，小轩窗，正梳妆。相顾无言，惟有泪千行。料得年年肠断处，明月夜，短松冈。'
    ],
    note: '熙宁八年正月二十日夜，梦见亡妻王弗（十年前卒于京师），醒而记之。以词悼亡，自此成绝调。'
  },
  {
    id: 'jiangchengzi-mizhou-chulie',
    title: '江城子·密州出猎',
    type: '词',
    year: 1075,
    dateLabel: '熙宁八年冬',
    place: '密州',
    placeId: 'mizhou',
    phase: 'zhuanzhan',
    firstLine: '老夫聊发少年狂，左牵黄，右擎苍',
    paragraphs: [
      '老夫聊发少年狂，左牵黄，右擎苍。锦帽貂裘，千骑卷平冈。为报倾城随太守，亲射虎，看孙郎。',
      '酒酣胸胆尚开张，鬓微霜，又何妨！持节云中，何日遣冯唐？会挽雕弓如满月，西北望，射天狼。'
    ],
    note: '熙宁八年冬，与同僚出城会猎。苏轼自言"虽无柳七郎风味，亦自是一家"，此词为豪放词自张一军之始。'
  },
  {
    id: 'wangjiangnan-chaoran-tai',
    title: '望江南·超然台作',
    type: '词',
    year: 1076,
    dateLabel: '熙宁九年寒食后',
    place: '密州',
    placeId: 'mizhou',
    phase: 'zhuanzhan',
    firstLine: '春未老，风细柳斜斜',
    paragraphs: [
      '春未老，风细柳斜斜。试上超然台上看，半壕春水一城花，烟雨暗千家。',
      '寒食后，酒醒却咨嗟。休对故人思故国，且将新火试新茶，诗酒趁年华。'
    ],
    note: '熙宁九年寒食后，登超然台（弟苏辙命名，取"超然物外"之意）。故国难归，且以新火新茶、"诗酒趁年华"自遣。'
  },
  {
    id: 'shui-diao-ge-tou',
    title: '水调歌头·明月几时有',
    type: '词',
    year: 1076,
    dateLabel: '熙宁九年中秋',
    place: '密州',
    placeId: 'mizhou',
    phase: 'zhuanzhan',
    firstLine: '明月几时有？把酒问青天',
    paragraphs: [
      '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。',
      '转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。'
    ],
    note: '熙宁九年中秋，欢饮达旦，大醉，作此篇兼怀子由。胡仔评："中秋词自东坡《水调歌头》一出，余词尽废。"'
  },
  {
    id: 'huanxisha-xumen-shitan',
    title: '浣溪沙·徐门石潭谢雨道上作',
    type: '词',
    year: 1078,
    dateLabel: '元丰元年春',
    place: '徐州',
    placeId: 'xuzhou',
    phase: 'zhuanzhan',
    firstLine: '簌簌衣巾落枣花，村南村北响缫车',
    paragraphs: [
      '簌簌衣巾落枣花，村南村北响缫车，牛衣古柳卖黄瓜。',
      '酒困路长惟欲睡，日高人渴漫思茶。敲门试问野人家。'
    ],
    note: '元丰元年春，徐州久旱得雨，赴石潭谢雨，道上作五首，此其四。枣花、缫车、卖瓜人，久旱得雨后的村野生气，与民同喜。'
  },
  {
    id: 'yu-zhong-ji-zi-you',
    title: '狱中寄子由',
    type: '诗',
    year: 1079,
    dateLabel: '元丰二年冬',
    place: '御史台狱（汴京）',
    placeId: 'bianjing',
    phase: 'wutai',
    firstLine: '圣主如天万物春，小臣愚暗自亡身',
    paragraphs: [
      '圣主如天万物春，小臣愚暗自亡身。',
      '百年未满先偿债，十口无归更累人。',
      '是处青山可埋骨，他年夜雨独伤神。',
      '与君世世为兄弟，更结来生未了因。'
    ],
    note: '元丰二年系御史台狱（乌台诗案），自度不免，狱中寄弟苏辙诀别。"与君世世为兄弟"，狱吏怜之不敢焚，遂得传世。'
  },
  {
    id: 'busuanzi-huangzhou-dinghui',
    title: '卜算子·黄州定慧院寓居作',
    type: '词',
    year: 1080,
    dateLabel: '元丰三年',
    place: '黄州',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '缺月挂疏桐，漏断人初静',
    paragraphs: [
      '缺月挂疏桐，漏断人初静。谁见幽人独往来，缥缈孤鸿影。',
      '惊起却回头，有恨无人省。拣尽寒枝不肯栖，寂寞沙洲冷。'
    ],
    note: '元丰三年初到黄州，寓居定慧院。以孤鸿自况：惊魂未定，而寒枝拣尽、不肯俯就，是劫后犹存的风骨。'
  },
  {
    id: 'ding-fengbo',
    title: '定风波·莫听穿林打叶声',
    type: '词',
    year: 1082,
    dateLabel: '元丰五年三月七日',
    place: '黄州',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '莫听穿林打叶声，何妨吟啸且徐行',
    paragraphs: [
      '莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
      '料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。'
    ],
    note: '元丰五年三月七日，沙湖道中遇雨，雨具先去，同行皆狼狈，余独不觉，已而遂晴，故作此词。本站站名"一蓑烟雨"即出于此。'
  },
  {
    id: 'niannu-jiao-chibi',
    title: '念奴娇·赤壁怀古',
    type: '词',
    year: 1082,
    dateLabel: '元丰五年七月',
    place: '黄州',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '大江东去，浪淘尽，千古风流人物',
    paragraphs: [
      '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。',
      '遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。'
    ],
    note: '元丰五年七月，游赤鼻矶。周郎年少立功业与自己华发无成相对照，终以"一尊还酹江月"收束千古之慨。'
  },
  {
    id: 'qian-chibi-fu',
    title: '赤壁赋（前赤壁赋）',
    type: '文',
    year: 1082,
    dateLabel: '元丰五年七月既望',
    place: '黄州',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '壬戌之秋，七月既望',
    paragraphs: [
      '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。少焉，月出于东山之上，徘徊于斗牛之间。白露横江，水光接天。纵一苇之所如，凌万顷之茫然。浩浩乎如冯虚御风，而不知其所止；飘飘乎如遗世独立，羽化而登仙。',
      '于是饮酒乐甚，扣舷而歌之。歌曰："桂棹兮兰桨，击空明兮溯流光。渺渺兮予怀，望美人兮天一方。"客有吹洞箫者，倚歌而和之。其声呜呜然，如怨如慕，如泣如诉，余音袅袅，不绝如缕。舞幽壑之潜蛟，泣孤舟之嫠妇。',
      '苏子愀然，正襟危坐而问客曰："何为其然也？"客曰："月明星稀，乌鹊南飞，此非曹孟德之诗乎？西望夏口，东望武昌，山川相缪，郁乎苍苍，此非孟德之困于周郎者乎？方其破荆州，下江陵，顺流而东也，舳舻千里，旌旗蔽空，酾酒临江，横槊赋诗，固一世之雄也，而今安在哉？况吾与子渔樵于江渚之上，侣鱼虾而友麋鹿，驾一叶之扁舟，举匏樽以相属。寄蜉蝣于天地，渺沧海之一粟。哀吾生之须臾，羡长江之无穷。挟飞仙以遨游，抱明月而长终。知不可乎骤得，托遗响于悲风。"',
      '苏子曰："客亦知夫水与月乎？逝者如斯，而未尝往也；盈虚者如彼，而卒莫消长也。盖将自其变者而观之，则天地曾不能以一瞬；自其不变者而观之，则物与我皆无尽也，而又何羡乎！且夫天地之间，物各有主，苟非吾之所有，虽一毫而莫取。惟江上之清风，与山间之明月，耳得之而为声，目遇之而成色，取之无禁，用之不竭。是造物者之无尽藏也，而吾与子之所共适。"',
      '客喜而笑，洗盏更酌。肴核既尽，杯盘狼籍。相与枕藉乎舟中，不知东方之既白。'
    ],
    note: '元丰五年七月既望，与客泛舟于赤壁之下。借水与月论"变与不变"，化解"哀吾生之须臾"之悲，是黄州思想突围的代表作。'
  },
  {
    id: 'huanxisha-qishui',
    title: '浣溪沙·游蕲水清泉寺',
    type: '词',
    year: 1082,
    dateLabel: '元丰五年三月',
    place: '蕲水清泉寺',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '山下兰芽短浸溪，松间沙路净无泥',
    paragraphs: [
      '山下兰芽短浸溪，松间沙路净无泥，萧萧暮雨子规啼。',
      '谁道人生无再少？门前流水尚能西！休将白发唱黄鸡。'
    ],
    note: '元丰五年三月，与医家庞安常同游蕲水清泉寺，寺临兰溪，溪水西流。见水西流而翻人生不再少之案。'
  },
  {
    id: 'hanshi-yu',
    title: '寒食雨二首',
    type: '诗',
    year: 1082,
    dateLabel: '元丰五年寒食',
    place: '黄州',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '自我来黄州，已过三寒食',
    paragraphs: [
      '自我来黄州，已过三寒食。明年又苦雨，两月秋萧瑟。',
      '卧闻海棠花，泥污燕支雪。暗中偷负去，夜半真有力。',
      '何殊病少年，病起头已白。',
      '春江欲入户，雨势来不已。小屋如渔舟，濛濛水云里。',
      '空庖煮寒菜，破灶烧湿苇。那知是寒食，但见乌衔纸。',
      '君门深九重，坟墓在万里。也拟哭途穷，死灰吹不起。'
    ],
    note: '元丰五年寒食，苦雨中作。此诗手稿即"天下第三行书"《黄州寒食帖》，今藏台北故宫博物院。'
  },
  {
    id: 'ji-chengtian-si-yeyou',
    title: '记承天寺夜游',
    type: '文',
    year: 1083,
    dateLabel: '元丰六年十月十二日',
    place: '黄州',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '元丰六年十月十二日夜，解衣欲睡',
    paragraphs: [
      '元丰六年十月十二日夜，解衣欲睡，月色入户，欣然起行。',
      '念无与为乐者，遂至承天寺寻张怀民。怀民亦未寝，相与步于中庭。',
      '庭下如积水空明，水中藻、荇交横，盖竹柏影也。',
      '何夜无月？何处无竹柏？但少闲人如吾两人者耳。'
    ],
    note: '与同贬黄州的张怀民月下中庭同游。八十五字，庭下积水空明，写尽月色，也写尽"闲人"心境。'
  },
  {
    id: 'xier-xizuo',
    title: '洗儿戏作',
    type: '诗',
    year: 1083,
    dateLabel: '元丰六年九月',
    place: '黄州',
    placeId: 'huangzhou',
    phase: 'huangzhou',
    firstLine: '人皆养子望聪明，我被聪明误一生',
    paragraphs: [
      '人皆养子望聪明，我被聪明误一生。',
      '惟愿孩儿愚且鲁，无灾无难到公卿。'
    ],
    note: '元丰六年九月，朝云生子遁儿，满月洗儿时戏作。愤语反说，"我被聪明误一生"是乌台诗案后的自嘲。'
  },
  {
    id: 'ti-xilin-bi',
    title: '题西林壁',
    type: '诗',
    year: 1084,
    dateLabel: '元丰七年',
    place: '庐山',
    placeId: null,
    phase: 'huangzhou',
    firstLine: '横看成岭侧成峰，远近高低各不同',
    paragraphs: [
      '横看成岭侧成峰，远近高低各不同。',
      '不识庐山真面目，只缘身在此山中。'
    ],
    note: '元丰七年量移汝州，途中畅游庐山，题诗西林寺壁。身在山中不见山，景与理俱化，遂成理趣诗绝唱。'
  },
  {
    id: 'huanxisha-sizhou',
    title: '浣溪沙·细雨斜风作晓寒',
    type: '词',
    year: 1084,
    dateLabel: '元丰七年十二月二十四日',
    place: '泗州南山',
    placeId: null,
    phase: 'zaiqi',
    firstLine: '细雨斜风作晓寒，淡烟疏柳媚晴滩',
    paragraphs: [
      '细雨斜风作晓寒，淡烟疏柳媚晴滩。入淮清洛渐漫漫。',
      '雪沫乳花浮午盏，蓼茸蒿笋试春盘。人间有味是清欢。'
    ],
    note: '元丰七年岁末，由黄州赴汝州，道经泗州，与刘倩叔同游南山。清茶春蔬，"人间有味是清欢"。'
  },
  {
    id: 'hui-chong-chunjiang',
    title: '惠崇春江晚景',
    type: '诗',
    year: 1085,
    dateLabel: '元丰八年',
    place: '汴京',
    placeId: 'bianjing',
    phase: 'zaiqi',
    firstLine: '竹外桃花三两枝，春江水暖鸭先知',
    paragraphs: [
      '竹外桃花三两枝，春江水暖鸭先知。',
      '蒌蒿满地芦芽短，正是河豚欲上时。'
    ],
    note: '元丰八年，为僧惠崇《春江晚景》图所题。画出画外：鸭知水暖、河豚欲上，皆是画笔不到而诗心到。'
  },
  {
    id: 'shuilong-yin-yanghua',
    title: '水龙吟·次韵章质夫杨花词',
    type: '词',
    year: 1087,
    dateLabel: '元祐二年',
    place: '汴京',
    placeId: 'bianjing',
    phase: 'zaiqi',
    firstLine: '似花还似非花，也无人惜从教坠',
    paragraphs: [
      '似花还似非花，也无人惜从教坠。抛家傍路，思量却是，无情有思。萦损柔肠，困酣娇眼，欲开还闭。梦随风万里，寻郎去处，又还被、莺呼起。',
      '不恨此花飞尽，恨西园、落红难缀。晓来雨过，遗踪何在？一池萍碎。春色三分，二分尘土，一分流水。细看来，不是杨花，点点是离人泪。'
    ],
    note: '元祐二年居汴京，次韵章楶（质夫）咏杨花。王国维评：东坡《水龙吟》咏杨花，和韵而似元唱。'
  },
  {
    id: 'zeng-liu-jingwen',
    title: '赠刘景文',
    type: '诗',
    year: 1090,
    dateLabel: '元祐五年',
    place: '杭州',
    placeId: 'hangzhou',
    phase: 'zaiqi',
    firstLine: '荷尽已无擎雨盖，菊残犹有傲霜枝',
    paragraphs: [
      '荷尽已无擎雨盖，菊残犹有傲霜枝。',
      '一年好景君须记，最是橙黄橘绿时。'
    ],
    note: '元祐五年知杭州时，赠年逾五十八的老友刘景文。咏初冬而无一字衰飒：傲霜之枝、橙黄橘绿，正是晚节与时局互勉。'
  },
  {
    id: 'basheng-ganzhou-shenliaozi',
    title: '八声甘州·寄参寥子',
    type: '词',
    year: 1091,
    dateLabel: '元祐六年',
    place: '杭州',
    placeId: 'hangzhou',
    phase: 'zaiqi',
    firstLine: '有情风万里卷潮来，无情送潮归',
    paragraphs: [
      '有情风万里卷潮来，无情送潮归。问钱塘江上，西兴浦口，几度斜晖？不用思量今古，俯仰昔人非。谁似东坡老，白首忘机。',
      '记取西湖西畔，正暮山好处，空翠烟霏。算诗人相得，如我与君稀。约他年、东还海道，愿谢公、雅志莫相违。西州路，不应回首，为我沾衣。'
    ],
    note: '元祐六年离杭任前，寄僧道潜（参寥）。以潮来潮去观荣辱俯仰，与方外之友约他年东还海道。'
  },
  {
    id: 'shi-yue-er-ri-dao-huizhou',
    title: '十月二日初到惠州',
    type: '诗',
    year: 1094,
    dateLabel: '绍圣元年十月二日',
    place: '惠州',
    placeId: 'huizhou',
    phase: 'nanhuang',
    firstLine: '仿佛曾游岂梦中，欣然鸡犬识新丰',
    paragraphs: [
      '仿佛曾游岂梦中，欣然鸡犬识新丰。',
      '吏民惊怪坐何事，父老相携迎此翁。',
      '苏武岂知还漠北，管宁自欲老辽东。',
      '岭南万户皆春色，会有幽人客寓公。'
    ],
    note: '绍圣元年十月二日初到惠州。再贬至岭南而笔下无愁苦，反道"岭南万户皆春色"，是东坡本色。'
  },
  {
    id: 'dian-lian-hua-chunjing',
    title: '蝶恋花·春景',
    type: '词',
    year: 1095,
    dateLabel: '约绍圣年间（系年存疑）',
    place: '惠州（一说）',
    placeId: 'huizhou',
    phase: 'nanhuang',
    firstLine: '花褪残红青杏小，燕子飞时，绿水人家绕',
    paragraphs: [
      '花褪残红青杏小。燕子飞时，绿水人家绕。枝上柳绵吹又少，天涯何处无芳草！',
      '墙里秋千墙外道。墙外行人，墙里佳人笑。笑渐不闻声渐悄，多情却被无情恼。'
    ],
    note: '系年有争议，通行系于绍圣年间惠州。"枝上柳绵吹又少"二句，侍妾朝云最所善唱，每歌辄泪。'
  },
  {
    id: 'huizhou-yijue',
    title: '惠州一绝（食荔枝）',
    type: '诗',
    year: 1096,
    dateLabel: '绍圣三年',
    place: '惠州',
    placeId: 'huizhou',
    phase: 'nanhuang',
    firstLine: '罗浮山下四时春，卢橘杨梅次第新',
    paragraphs: [
      '罗浮山下四时春，卢橘杨梅次第新。',
      '日啖荔枝三百颗，不辞长作岭南人。'
    ],
    note: '绍圣三年作于惠州。贬地风物入诗，苦中自有生趣——"不辞长作岭南人"，把流放地过成了家乡。'
  },
  {
    id: 'xijiang-yue-meihua',
    title: '西江月·梅花',
    type: '词',
    year: 1096,
    dateLabel: '绍圣三年',
    place: '惠州',
    placeId: 'huizhou',
    phase: 'nanhuang',
    firstLine: '玉骨那愁瘴雾，冰姿自有仙风',
    paragraphs: [
      '玉骨那愁瘴雾，冰姿自有仙风。海仙时遣探芳丛，倒挂绿毛么凤。',
      '素面翻嫌粉涴，洗妆不褪唇红。高情已逐晓云空，不与梨花同梦。'
    ],
    note: '绍圣三年，悼侍妾朝云。以岭外梅花写朝云冰姿玉骨，"高情已逐晓云空"，哀而不伤。'
  },
  {
    id: 'zongbi',
    title: '纵笔三首（其一）',
    type: '诗',
    year: 1099,
    dateLabel: '元符二年',
    place: '儋州',
    placeId: 'danzhou',
    phase: 'nanhuang',
    firstLine: '寂寞东坡一病翁，白须萧散满霜风',
    paragraphs: [
      '寂寞东坡一病翁，白须萧散满霜风。',
      '小儿误喜朱颜在，一笑那知是酒红。'
    ],
    note: '元符二年作于儋州。白发病翁酒后面赤，被小儿误认作少年，自嘲之中见旷达。'
  },
  {
    id: 'chengmai-yi-tongchaoge',
    title: '澄迈驿通潮阁',
    type: '诗',
    year: 1100,
    dateLabel: '元符三年',
    place: '澄迈驿',
    placeId: null,
    phase: 'beigui',
    firstLine: '余生欲老海南村，帝遣巫阳招我魂',
    paragraphs: [
      '余生欲老海南村，帝遣巫阳招我魂。',
      '杳杳天低鹘没处，青山一发是中原。'
    ],
    note: '元符三年遇赦北还，登澄迈驿通潮阁北望。天低鹘没之处，一线青山，便是回望中原的目光。'
  },
  {
    id: 'liu-yue-er-shi-ye-duhai',
    title: '六月二十日夜渡海',
    type: '诗',
    year: 1100,
    dateLabel: '元符三年六月二十日',
    place: '渡海（琼州海峡）',
    placeId: null,
    phase: 'beigui',
    firstLine: '参横斗转欲三更，苦雨终风也解晴',
    paragraphs: [
      '参横斗转欲三更，苦雨终风也解晴。',
      '云散月明谁点缀？天容海色本澄清。',
      '空余鲁叟乘桴意，粗识轩辕奏乐声。',
      '九死南荒吾不恨，兹游奇绝冠平生。'
    ],
    note: '元符三年六月二十日，自儋州渡海北还。半生贬谪，结以"九死南荒吾不恨"，是一生旷达的总结。'
  },
  {
    id: 'ziti-jinshan-huaxiang',
    title: '自题金山画像',
    type: '诗',
    year: 1101,
    dateLabel: '建中靖国元年五月',
    place: '金山寺（镇江）',
    placeId: null,
    phase: 'beigui',
    firstLine: '心似已灰之木，身如不系之舟',
    paragraphs: [
      '心似已灰之木，身如不系之舟。',
      '问汝平生功业，黄州惠州儋州。'
    ],
    note: '北归途中过金山寺，见李公麟昔日所绘己像，自题其上。以三处贬地为"平生功业"，是绝笔前最后的自嘲与自定。'
  }
]

// ---- 查询辅助 ----

export const poemsSorted = [...poems].sort((a, b) => a.year - b.year)

export const poemById = Object.fromEntries(poems.map(p => [p.id, p]))

export const poemsByPlace = placeId =>
  poemsSorted.filter(p => p.placeId === placeId)

export const poemsByPhase = phaseKey =>
  poemsSorted.filter(p => p.phase === phaseKey)

export const countByType = type =>
  poemsSorted.filter(p => p.type === type).length

export const countByPhase = phaseKey => poemsByPhase(phaseKey).length
