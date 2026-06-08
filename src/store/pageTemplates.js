// 三套完整銷售頁範本：以原始預設頁（TEMPLATE_COURSE）為基礎改寫內容。
// 圖片皆使用 Pexels 圖庫（已驗證可載入）。套用後使用者可自行編輯任何內容。
import { TEMPLATE_COURSE } from './useStore';

const clone = () => JSON.parse(JSON.stringify(TEMPLATE_COURSE));
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

/* ───────────── 範本 1：線上課程 / 知識付費（沿用預設、改用圖庫圖） ───────────── */
const t1 = clone();
t1.name = '線上課程 / 知識付費';
t1.hero.image = px(3184465);
t1.authority.image = px(220453);

/* ───────────── 範本 2：身心靈療癒工作坊 ───────────── */
const t2 = clone();
t2.name = '身心靈療癒工作坊';
t2.theme = { bgColor: '#fbf7f2', textColor: '#3f3a36', primaryColor: '#b45309', accentColor: '#f59e0b' };
t2.meta = {
  ...t2.meta,
  painTitleMain: '你是不是，已經很久沒有好好喘口氣了？',
  currTitleMain: '8 週，一步步把平靜找回來',
  qualTitleMain: '這個工作坊，適合現在的你嗎？',
  testTitleMain: '學員們的真實轉變',
  priceTitleMain: '現在加入，給自己一個重新呼吸的機會',
  faqTitleMain: '報名前，你可能想知道的事'
};
t2.brandInfo = {
  ...t2.brandInfo,
  brandName: '靜心療癒工作坊',
  aboutTitle: '關於帶領者',
  aboutText: '我們相信，照顧好自己不是自私，而是一切的起點。靜心療癒工作坊陪你用溫柔而具體的方法，重新與自己連結、找回內在的安定。',
  contactEmail: 'hello@calmspace.example',
  contactLine: '@calmspace'
};
t2.hero = {
  image: px(3822622),
  title: '給累壞的你，\n一個重新呼吸的空間',
  bullets: [
    { text: '學會在日常中自我照顧的具體方法' },
    { text: '釋放長期累積的壓力、焦慮與緊繃' },
    { text: '重新找回平靜，與生活的主導權' }
  ]
};
t2.painPoints = [
  { title: '夜裡總是睡不好', desc: '腦袋停不下來，明明很累卻翻來覆去，白天又昏昏沉沉提不起勁。' },
  { title: '情緒一來就被淹沒', desc: '小事也容易煩躁或低落，事後又懊惱，覺得自己怎麼又這樣。' },
  { title: '知道要放鬆，卻不知怎麼做', desc: '看了很多方法卻不持久，放鬆變成另一件「該做卻做不到」的事。' }
];
t2.empathy = {
  quote: '「照顧好自己，\n才有力氣照顧你在乎的一切。」',
  text: '我也曾經把自己逼到喘不過氣，直到我開始練習一套簡單、可以天天做的身心方法，才慢慢把平靜找回來。這個工作坊，就是把這條路整理成你也能走的步驟。'
};
t2.transition = {
  title: '從硬撐，到真正的安定',
  cards: [
    { title: '過去：靠意志力硬撐', desc: '累了也不敢停，用忙碌麻痺情緒，身體與心都長期透支。' },
    { title: '現在：用方法照顧自己', desc: '有一套可以隨時拿出來用的工具，壓力來時知道怎麼安頓自己。' }
  ]
};
t2.promise = {
  title: '8 週後，你會帶走這些改變',
  items: [
    { text: '一套每天 10 分鐘就能做的身心練習' },
    { text: '面對焦慮與情緒時的具體應對工具' },
    { text: '更穩定的睡眠與更清晰的生活步調' }
  ]
};
t2.services = {
  title: '三大療癒核心',
  items: [
    { name: '呼吸與冥想練習', desc: '用最容易上手的引導，讓緊繃的神經慢慢鬆開。' },
    { name: '身體覺察與舒展', desc: '透過溫和的伸展與覺察，重新感受並善待自己的身體。' },
    { name: '情緒調節工具箱', desc: '把抽象的「放鬆」變成可操作的步驟，隨時都能使用。' }
  ]
};
t2.curriculum = [
  { title: '第一階段：認識壓力與身體的訊號', content: '了解壓力如何影響身心\n練習辨識自己的情緒與緊繃訊號' },
  { title: '第二階段：呼吸、冥想與身體舒展實作', content: '每週帶領式練習，建立屬於你的日常節奏\n釋放長期累積的緊張' },
  { title: '第三階段：把療癒帶回日常生活', content: '設計可長期維持的自我照顧計畫\n面對未來壓力的應對策略' }
];
t2.courseInfo = {
  title: '工作坊資訊',
  courseName: '8 週身心療癒工作坊',
  lessonCount: '8 堂（每週一次）',
  totalHours: '約 12 小時',
  accessPeriod: '報名後 6 個月內可無限次回看錄影',
  platform: '線上直播（Zoom）＋ 課後錄影回放'
};
t2.authority = {
  image: px(774909),
  name: '林靜 ( Serena )',
  bio: '正念與身心療癒帶領者，累積超過 1,000 小時帶領經驗，陪伴數百位學員從焦慮緊繃走向安定。擅長把專業的身心方法，轉化成人人都能在生活中實踐的簡單練習。',
  stats: [
    { label: '帶領時數', value: '1,000+ 小時' },
    { label: '學員推薦率', value: '97%' }
  ]
};
t2.qualification = {
  fit: [
    { text: '長期感到壓力大、容易焦慮或睡不好的你' },
    { text: '想學會一套能長期使用的自我照顧方法' },
    { text: '願意每週給自己一點時間，慢慢練習' }
  ],
  unfit: [
    { text: '期待上一堂課就立刻「痊癒」、不願練習的人' },
    { text: '目前需要的是專業醫療診斷與治療（本工作坊非醫療行為）' }
  ]
};
t2.testimonials = [
  { name: '怡君', role: '行銷企劃', content: '以前晚上腦袋停不下來，跟著做呼吸練習後，我終於能比較好睡了，白天的情緒也穩定很多。' },
  { name: 'Wei', role: '工程師', content: '原本覺得冥想很玄，沒想到方法這麼具體。現在壓力大的時候，我知道怎麼讓自己冷靜下來。' }
];
t2.pricingPlans = [
  { title: '一般班', originalPrice: '12,800', currentPrice: '8,800', urgency: '🌿 早鳥優惠倒數', features: '8 週完整線上直播課程\n全程錄影回放 6 個月\n專屬練習音檔下載', ctaText: '立即報名一般班', ctaLink: '#', guarantee: '保障：首堂課後不滿意，全額退費' },
  { title: '小班深度陪伴', originalPrice: '24,000', currentPrice: '16,800', urgency: '💛 每期限額 8 位', features: '包含一般班所有內容\n每週小班互動與個別回饋\n一對一 30 分鐘諮詢一次', ctaText: '申請小班名額', ctaLink: '#', guarantee: '保障：保留名額，開課前可全額退' }
];
t2.faq = [
  { q: '完全沒有冥想或瑜伽經驗，也能參加嗎？', a: '當然可以。課程從最基礎開始，一步步帶領，零經驗也能輕鬆跟上。' },
  { q: '如果某一週無法參加直播怎麼辦？', a: '每堂課都有錄影回放，報名後 6 個月內都能無限次觀看與複習。' },
  { q: '這個工作坊可以取代心理治療嗎？', a: '不行。本工作坊是自我照顧與身心練習，並非醫療行為，若有需要請諮詢專業醫療人員。' },
  { q: '需要準備什麼器材或空間嗎？', a: '只需要一個能安靜獨處的小角落、一張瑜伽墊或軟墊即可。' },
  { q: '有提供退費保障嗎？', a: '有的，首堂課後若覺得不適合，可申請全額退費。' }
];
t2.close = { text: '你已經為別人付出很多了，現在，把這段時間留給自己吧。' };
t2.cta1 = { ...t2.cta1, text: '👉 我要重新呼吸', bgColor: '#b45309' };
t2.cta2 = { ...t2.cta2, text: '了解工作坊內容', bgColor: '#b45309' };
t2.cta3 = { ...t2.cta3, text: '現在加入，給自己一個機會', bgColor: '#b45309' };
t2.compliance = { ...t2.compliance, merchant: { ...t2.compliance.merchant, brandName: '靜心療癒工作坊' } };

/* ───────────── 範本 3：個人品牌 / 商業顧問 ───────────── */
const t3 = clone();
t3.name = '個人品牌 / 商業顧問';
t3.theme = { bgColor: '#f8fafc', textColor: '#0f172a', primaryColor: '#6d28d9', accentColor: '#f59e0b' };
t3.meta = {
  ...t3.meta,
  painTitleMain: '你的專業很強，但收入卡關了嗎？',
  currTitleMain: '從接案者到高價顧問的成長地圖',
  qualTitleMain: '這套方法適合現在的你嗎？',
  testTitleMain: '合作夥伴與學員的真實回饋',
  priceTitleMain: '選擇最適合你的成長方案',
  faqTitleMain: '合作前，你可能想釐清的事'
};
t3.brandInfo = {
  ...t3.brandInfo,
  brandName: '品牌增長顧問',
  aboutTitle: '關於顧問',
  aboutText: '我們專注協助專業工作者與一人公司，把專業轉化為清晰的高價定位與可複製的營收系統，讓你不再用時間換錢，而是用價值放大收入。',
  contactEmail: 'hi@growthbrand.example',
  contactLine: '@growthbrand'
};
t3.hero = {
  image: px(3184291),
  title: '停止瞎忙，\n讓專業變成可複製的營收',
  bullets: [
    { text: '找到讓客戶願意付高價的精準定位' },
    { text: '打造自動吸引客戶的內容與成交系統' },
    { text: '用顧問模式放大收入，擺脫時間換錢' }
  ]
};
t3.painPoints = [
  { title: '接案接到累，卻賺不多', desc: '每天被工作追著跑，收入卻始終卡在一個天花板，看不到突破。' },
  { title: '不知道怎麼定價與包裝', desc: '報價時心虛、不敢開高價，專業價值無法被客戶看見與認同。' },
  { title: '有流量卻無法變現', desc: '貼文有人看、有人讚，但就是很難轉換成實際的成交與營收。' }
];
t3.empathy = {
  quote: '「你不缺專業，\n缺的是把專業變成生意的系統。」',
  text: '我曾經也是埋頭接案、什麼都自己來，忙到沒有生活、收入卻不成正比。直到我把定位、內容與成交拆解成一套系統，才真正把專業變成可規模化的事業。'
};
t3.transition = {
  title: '從用時間換錢，到用價值賺錢',
  cards: [
    { title: '過去：什麼案子都接', desc: '低價競爭、客戶難搞、做越多越累，永遠在補破洞。' },
    { title: '現在：用系統篩選高價客戶', desc: '清楚定位吸引對的人，內容自動養客、成交流程一氣呵成。' }
  ]
};
t3.promise = {
  title: '合作後，你將建立起',
  items: [
    { text: '一個讓人記得住、願意付高價的個人品牌定位' },
    { text: '一套能持續帶來名單與信任的內容系統' },
    { text: '一條清晰、可複製的高價成交流程' }
  ]
};
t3.services = {
  title: '三大成長核心',
  items: [
    { name: '定位與商業模式', desc: '釐清你的獨特價值與客群，設計能賺錢的商業模式。' },
    { name: '內容與漏斗系統', desc: '建立自動吸引、培養信任的內容與名單系統。' },
    { name: '高價成交流程', desc: '從諮詢到成交的標準化腳本，自信開高價也能成交。' }
  ]
};
t3.curriculum = [
  { title: '第一階段：精準定位與高價商業模式', content: '找出你的獨特定位與目標客群\n設計高價值的服務與定價結構' },
  { title: '第二階段：內容系統與名單漏斗', content: '規劃能自動養客的內容主軸\n建立名單收集與培養的漏斗' },
  { title: '第三階段：顧問式高價成交', content: '掌握諮詢與成交的對話腳本\n建立可複製、可放大的成交流程' }
];
t3.courseInfo = {
  title: '方案資訊',
  courseName: '個人品牌商業顧問計畫',
  lessonCount: '12 堂（線上課程）＋ 顧問方案另計',
  totalHours: '約 10 小時影音 ＋ 顧問時段',
  accessPeriod: '購買後一年內不限次數觀看',
  platform: '線上影音隨選；顧問時段以 Google Meet 進行'
};
t3.authority = {
  image: px(936094),
  name: '陳柏宇 ( Alex )',
  bio: '資深品牌增長顧問，曾協助超過 200 位專業工作者與一人公司建立高價定位與營收系統，平均協助學員客單價提升 2 倍以上。',
  stats: [
    { label: '輔導品牌數', value: '200+' },
    { label: '學員客單價提升', value: '2 倍以上' }
  ]
};
t3.qualification = {
  fit: [
    { text: '已有專業能力、想突破收入天花板的自由工作者' },
    { text: '想建立個人品牌、用高價服務取代低價接案的人' },
    { text: '願意投入執行、把專業系統化的創業者' }
  ],
  unfit: [
    { text: '只想找快速暴富捷徑、不願意執行的人' },
    { text: '還沒有任何專業基礎、想從零摸索的初學者' }
  ]
};
t3.testimonials = [
  { name: '雅婷', role: '設計接案者', content: '以前報價都心虛，學完定位後我把服務重新包裝，客單價直接翻倍，客戶還更尊重我的專業。' },
  { name: 'Jason', role: '行銷顧問', content: '最有價值的是那套成交腳本，現在諮詢的成交率穩定很多，終於不用靠低價搶案。' }
];
t3.pricingPlans = [
  { title: '線上課程', originalPrice: '18,000', currentPrice: '9,800', urgency: '🔥 早鳥限時優惠', features: '12 堂系統化線上課程\n定位、內容、成交全套範本\n學員專屬社群', ctaText: '立即加入課程', ctaLink: '#', guarantee: '保障：14 天不滿意全額退費' },
  { title: '1 對 1 顧問', originalPrice: '80,000', currentPrice: '58,000', urgency: '💎 每月限收 3 位', features: '包含線上課程所有內容\n3 個月一對一顧問陪跑\n客製化定位與成交流程設計', ctaText: '申請顧問名額', ctaLink: '#', guarantee: '保障：首次諮詢不滿意可全額退' }
];
t3.faq = [
  { q: '我還在接案階段，適合上這套課嗎？', a: '適合。課程正是幫你從接案者升級為高價顧問，只要你已有專業基礎即可。' },
  { q: '課程可以看多久？', a: '購買後一年內不限次數重複觀看，方便你邊做邊複習。' },
  { q: '1 對 1 顧問和線上課程差在哪？', a: '線上課程是系統化自學；顧問方案則是針對你的狀況客製策略並陪跑執行。' },
  { q: '需要先有很多粉絲或流量嗎？', a: '不需要。課程會教你從定位開始建立內容與名單，流量是結果而非前提。' },
  { q: '有退費保障嗎？', a: '線上課程提供 14 天不滿意全額退費；顧問方案首次諮詢不滿意亦可全額退。' }
];
t3.close = { text: '你的專業值得更好的回報。現在就開始，把它變成可以放大的事業。' };
t3.cta1 = { ...t3.cta1, text: '👉 開始打造高價品牌', bgColor: '#6d28d9' };
t3.cta2 = { ...t3.cta2, text: '了解完整方案', bgColor: '#6d28d9' };
t3.cta3 = { ...t3.cta3, text: '立即申請，放大你的收入', bgColor: '#6d28d9' };
t3.compliance = { ...t3.compliance, merchant: { ...t3.compliance.merchant, brandName: '品牌增長顧問' } };

export const PAGE_TEMPLATES = [
  { id: 'course', name: '線上課程 / 知識付費', desc: '適合數位課程、培訓班、知識付費', thumb: px(3184465), state: t1 },
  { id: 'wellness', name: '身心靈療癒工作坊', desc: '適合療癒、瑜伽、心靈成長、手作工作坊', thumb: px(3822622), state: t2 },
  { id: 'consulting', name: '個人品牌 / 商業顧問', desc: '適合顧問、教練、自由工作者高價服務', thumb: px(3184291), state: t3 },
];
