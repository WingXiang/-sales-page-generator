// 三套銷售頁範本：差異在「內容排版密度」（文字為主 / 圖文平衡 / 圖片較多），
// 而非產業領域。皆以原始預設頁（TEMPLATE_COURSE）內容為基礎，套用後可自行編輯。
// 圖片皆使用 Pexels 圖庫（已驗證可載入）。
import { TEMPLATE_COURSE } from './useStore';

const clone = () => JSON.parse(JSON.stringify(TEMPLATE_COURSE));
const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

// 在指定區塊之後插入圖文區塊鍵
function withInserts(layout, inserts) {
  const out = [];
  layout.forEach((k) => {
    out.push(k);
    if (inserts[k]) out.push(...inserts[k]);
  });
  return out;
}

/* ── 範本 1：文字為主版 ── 純內容、不額外加圖，閱讀聚焦、適合資訊量大的銷售頁 */
const t1 = clone();
t1.name = '文字為主版';
t1.authority.image = px(220453);
t1.imageBlocks = {};
// layout 維持預設（不插入圖文區塊）

/* ── 範本 2：圖文平衡版 ── 在重點段落穿插 2 個圖文左右區塊，圖文比例均衡 */
const t2 = clone();
t2.name = '圖文平衡版';
t2.hero.image = px(3184465);
t2.authority.image = px(220453);
t2.imageBlocks = {
  bal1: { type: 'imageText', image: px(4056723), caption: '', heading: '為什麼選擇我們？', text: '我們把複雜的流程拆解成可立即執行的步驟，讓你不必再自己摸索。\n✓ 系統化教學，跟著做就有成果\n✓ 範本與工具直接套用，省下大量時間', imagePosition: 'left' },
  bal2: { type: 'imageText', image: px(1181472), caption: '', heading: '看得見的真實成果', text: '已有數百位學員透過這套方法做出改變，平均每週省下 15 小時、八成在一個月內完成第一個成果。', imagePosition: 'right' },
};
t2.layout = withInserts(t2.layout, {
  empathy: ['imageBlock:bal1'],
  services: ['imageBlock:bal2'],
});

/* ── 範本 3：圖片較多版 ── 大量視覺穿插（全寬大圖＋圖文），適合視覺導向、強調情境的銷售頁 */
const t3 = clone();
t3.name = '圖片較多版';
t3.hero.image = px(3184465);
t3.authority.image = px(774909);
t3.imageBlocks = {
  im1: { type: 'image', image: px(3760790), caption: '真實課程／服務情境', heading: '', text: '', imagePosition: 'left' },
  im2: { type: 'imageText', image: px(4056723), caption: '', heading: '豐富的視覺化教材', text: '每個重點都搭配圖解與範例，讓你一看就懂、學了就能用。', imagePosition: 'left' },
  im3: { type: 'image', image: px(1181472), caption: '學員實作與成果展示', heading: '', text: '', imagePosition: 'left' },
  im4: { type: 'imageText', image: px(4498482), caption: '', heading: '完整的學習支援', text: '從入門到進階，搭配社群與工具包，陪你一路把成果做出來。', imagePosition: 'right' },
};
t3.layout = withInserts(t3.layout, {
  painPoints: ['imageBlock:im1'],
  services: ['imageBlock:im2'],
  curriculum: ['imageBlock:im3'],
  testimonials: ['imageBlock:im4'],
});

export const PAGE_TEMPLATES = [
  { id: 'textFocused', name: '文字為主版', desc: '純內容、閱讀聚焦，適合資訊量大的銷售頁', thumb: px(936094), state: t1 },
  { id: 'balanced', name: '圖文平衡版', desc: '重點段落穿插圖文，圖文比例均衡', thumb: px(3184465), state: t2 },
  { id: 'imageRich', name: '圖片較多版', desc: '大量視覺穿插，適合視覺導向、強調情境', thumb: px(3760790), state: t3 },
];
