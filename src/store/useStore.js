import { create } from 'zustand'
import {
  DEFAULT_DISCLAIMER,
  DEFAULT_COPYRIGHT,
  DEFAULT_PRIVACY_POLICY,
  DEFAULT_TERMS,
  DEFAULT_REFUND_POLICY,
} from './complianceDefaults'

const TEMPLATE_COURSE = {
  name: '📚 數位顧問培訓班銷售頁',
  theme: { bgColor: '#f8fafc', textColor: '#0f172a', primaryColor: '#2a4189', accentColor: '#fbbf24' },
  meta: {
    audience: '',
    style: '',
    courseName: '',
    transformation: '',
    painTitleMain: '您是否也正面臨這些一人公司的營運瓶頸？',
    currTitleMain: '系統化的數位顧問實戰課程大綱',
    qualTitleMain: '本培訓班是否適合目前的您？',
    testTitleMain: '來自一人公司創辦人的真實好評推薦',
    priceTitleMain: '限時加入！數位顧問學員方案',
    faqTitleMain: '解答您加入前的所有疑問'
  },
  brandInfo: {
    brandName: '數位顧問培訓學堂',
    aboutTitle: '關於培訓團隊',
    aboutText: '我們專為一人公司經營者提供實戰型的數位顧問培訓。我們的使命是協助您打造自動化運營系統，省下繁瑣的瑣碎時間，讓您能100%專心發展核心事業。',
    contactEmail: 'support@finjapanlife.com',
    contactLine: '@digital_consultant',
    contactHours: '週一至週五 09:00 - 18:00'
  },
  hero: {
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: '省下80%繁瑣行政！\n專為一人公司設計的數位顧問培訓班',
    bullets: [
      { text: '建立自動化客源與服務系統，節省寶貴時間' },
      { text: '擺脫雜務糾纏，重新專心發展您的核心事業' },
      { text: '無痛導入數位工具，一人也能發揮團隊級影響力' }
    ]
  },
  painPoints: [
    { title: '終日被雜務綁架', desc: '每天花費大量時間在手動處理客戶諮詢、排程與行政庶務，根本沒有時間思考事業的長遠發展。' },
    { title: '數位工具導入困難', desc: '知道要數位轉型，但面對繁雜的工具不知道如何選擇與整合，花大錢買軟體卻無法落地使用。' },
    { title: '缺乏自動化思維', desc: '所有服務都需要親力親為，一旦停止工作就沒有收入，無法建立可以規模化擴展的商業模式。' }
  ],
  empathy: {
    quote: '「經營一人公司，\n你應該是創辦人，而不是全職雜工。」',
    text: '我也曾和您一樣，每天工作14小時，卻有一半以上的時間在回Email、串接流程與手動記帳。直到我建立了一套自動化的數位諮詢顧問系統，才真正把時間釋放出來，專注在策略規劃與事業成長上。'
  },
  transition: {
    title: '思維翻轉：從全職雜工到真正的企業家',
    cards: [
      { title: '傳統親力親為模式', desc: '手動處理客戶資料、排程與服務交付。每天精疲力竭，時間高度碎片化，事業難以擴張。' },
      { title: '數位自動化系統', desc: '引進顧問級自動化工具，建立24小時自動流轉的營運閉環，節省時間，專心發展事業。' }
    ]
  },
  promise: {
    title: '加入培訓後您將獲得的具體改變',
    items: [
      { text: '每週釋放至少 15 小時的繁雜行政時間' },
      { text: '擁有一套全自動的線上客戶預約與諮詢交付系統' },
      { text: '學會如何用數位工具自動化過濾高價值客戶' }
    ]
  },
  services: {
    title: '三大核心數位顧問培訓模組',
    items: [
      { name: '自動化營運系統建立', desc: '從預約、接單到交付，串接全自動流程，讓系統幫您做日常瑣事。' },
      { name: '高效數位工具箱', desc: '精選最適合一人公司的無代碼工具，開箱即用，避免多餘軟體開銷。' },
      { name: '數位顧問變現實戰', desc: '教您如何將自身專業包裝成高價值的數位顧問服務，實現規模化增長。' }
    ]
  },
  curriculum: [
    { title: '第一階段：一人公司的數位自動化底層邏輯', content: '分析營運痛點與時間分配\n規劃個人專屬的自動化運營藍圖' },
    { title: '第二階段：無代碼數位工具實戰串接', content: '手把手教您串接預約、Email通知與客戶管理系統\n實現24小時無人值守自動運作' },
    { title: '第三階段：高價值顧問服務包裝與規模化', content: '顧問收費模式與定價策略\n利用自動化系統高效獲客與交付' }
  ],
  courseInfo: {
    title: '課程資訊',
    courseName: '數位顧問培訓班',
    lessonCount: '12 堂（共 3 階段）',
    totalHours: '約 8 小時',
    accessPeriod: '購買後一年內，不限次數重複觀看',
    platform: '線上影音隨選，支援電腦／手機／平板（如為直播課程則使用 Zoom）'
  },
  authority: {
    image: 'https://i.ibb.co/NgG55zqk/portrait-1771585005753.png',
    name: '陳相銘 ( Wing )',
    bio: '資深一人公司數位轉型專家，曾協助超過 300 位自由創作者與一人創辦人搭建自動化運作系統。精通多款無代碼工具串接，致力於幫經營者「節省時間，專心發展事業」。',
    stats: [
      { label: '學員平均省時/週', value: '15+ 小時' },
      { label: '學員滿意推薦率', value: '98.5%' }
    ]
  },
  qualification: {
    fit: [
      { text: '希望省下繁雜行政時間、專注於事業成長的一人創辦人' },
      { text: '渴望用數位工具自動化流程，不願雇用多餘員工的創業者' },
      { text: '想將自身專業轉化為高獲利數位顧問服務的自由職業人士' }
    ],
    unfit: [
      { text: '期待不勞而獲、不願意花時間親自設定系統的人' },
      { text: '排斥數位工具，堅持所有客戶流程都必須人工手動處理者' }
    ]
  },
  testimonials: [
    { name: '張小姐', role: '行銷一人公司創辦人', content: '以前每天被客戶的預約排程 and 信件轟炸，加入培訓班後，我架設了自己的自動化預約系統。現在每週多出整整兩天時間，可以專心服務付費客戶，業績提升了 40%！' },
    { name: '陳先生', role: '獨立軟體開發者', content: '陳相銘 ( Wing ) 的無代碼工具課非常實用！我不需要寫任何一行代碼，就把客服跟訂單通知全部自動化了。終於有時間可以專心寫核心產品！' }
  ],
  pricingPlans: [
    { 
      title: '專業實戰班', originalPrice: '24,000', currentPrice: '12,800', urgency: '🔥 早鳥優惠倒數 5 席', 
      features: '12 堂數位自動化實戰影音課程\n專屬無代碼工具整合包與設定範本\n終身加入學員專屬 Discord 交流群', ctaText: '立即加入專業班', ctaLink: '#', guarantee: '保障：14 天內不滿意保證全額退費' 
    },
    { 
      title: '1對1 顧問直通班', originalPrice: '60,000', currentPrice: '36,000', urgency: '💎 每月限量 3 名經營者', 
      features: '包含專業實戰班所有內容與資源\n陳相銘 ( Wing ) 親自 1對1 協助搭建專屬自動化系統\n3 個月每週視訊排查與策略調整指導', ctaText: '申請 1對1 直通班', ctaLink: '#', guarantee: '保障：保證系統搭建完成並運作' 
    }
  ],
  faq: [
    { q: '這門課程可以觀看多久？有觀看次數限制嗎？', a: '購買後您可以永久、無限次重複觀看，沒有任何時間與次數限制。' },
    { q: '完全沒有程式或技術背景，也可以學得會嗎？', a: '沒問題！我們使用的都是無代碼 (No-Code) 數位工具，操作介面全部是視覺化的拖拉點選。' },
    { q: '請問有提供課程講義或實作模板嗎？', a: '有的，所有單元皆附有詳細的精美講義與設定範本，您可以直接複製套用。' },
    { q: '如果遇到卡關或不懂的地方，該如何發問？', a: '您可以加入專屬的學員 Discord 社群，助教與講師每天都會線上協助解答您的問題。' },
    { q: '請問這門課程是一次性付費還是訂閱制？', a: '本課程是一次性買斷付費，未來所有的內容更新與新增章節都不需要額外付費。' },
    { q: '課程可以使用手機或平板觀看嗎？', a: '可以的，我們的系統支援電腦、手機、平板等各種載具，隨時隨地都可以登入學習。' },
    { q: '如果我覺得不適合，有退費保障嗎？', a: '有的，我們提供 14 天內無條件全額退費保障，讓您零風險體驗課程。' },
    { q: '請問課程可以開立三聯式發票報帳嗎？', a: '可以的，請在結帳付款頁面填寫您的公司抬頭與統一編號，系統會自動開立電子發票。' },
    { q: '這門課程會定期更新內容嗎？', a: '會的，我們會根據最新的數位工具版本與業界實務案例，定期優化並免費升級課程內容。' },
    { q: '團購有優惠嗎？如何跟朋友一起合購？', a: '我們有提供三人團購優惠方案，您可以點選定價區塊的團購專區，或聯絡客服小幫手取得代碼。' }
  ],
  close: { text: '別再把時間浪費在重複的庶務上。現在就加入，建立您的數位自動化系統，奪回時間主導權！' },
  compliance: {
    merchant: {
      // ⚠️ 以下為「範例資料」，申請金流前請務必改成真實商家資訊
      brandName: '好學品牌',                    // 範例·待更換（品牌名，會帶入版權與政策）
      companyName: '好學數位顧問有限公司',      // 範例·待更換（公司全名，帶入版權）
      taxId: '00000000',                       // 範例·待更換（8 碼統編，帶入版權）
      phone: '02-2700-0000',                   // 範例·待更換（顯示於頁尾）
      email: 'support@example.com',            // 範例·待更換（客服信箱，帶入全政策）
      lineId: '@example',                       // 範例·待更換（官方 LINE，帶入退費政策）
      jurisdiction: '臺北市',                   // 範例·待更換（管轄／仲裁地，帶入條款）
      serviceHours: '週一至週五 09:00 - 18:00'  // 顯示於頁尾，可沿用或自行調整
    },
    // 以下政策內文的 {{品牌名}} {{公司名}} {{統一編號}} {{客服信箱}} {{Line}} {{管轄地}}
    // 會在渲染時自動以上方 merchant 欄位帶入替換
    disclaimer: DEFAULT_DISCLAIMER,
    privacyPolicy: DEFAULT_PRIVACY_POLICY,
    refundPolicy: DEFAULT_REFUND_POLICY,
    terms: DEFAULT_TERMS,
    copyright: DEFAULT_COPYRIGHT
  },
  cta1: { text: '👉 立即報名', link: '#', fontSize: '16px', bgColor: '#c67e13', paddingX: '32px', paddingY: '16px', borderRadius: '16px', widthMode: 'auto', customWidth: '300px', heightMode: 'auto', customHeight: '50px' }, 
  cta2: { text: '立即加入，開啟自動化營運', link: '#', fontSize: '16px', bgColor: '#c67e13', paddingX: '32px', paddingY: '16px', borderRadius: '16px', widthMode: 'auto', customWidth: '300px', heightMode: 'auto', customHeight: '50px' }, 
  cta3: { text: '現在加入，專注發展核心事業', link: '#', fontSize: '16px', bgColor: '#c67e13', paddingX: '32px', paddingY: '16px', borderRadius: '16px', widthMode: 'auto', customWidth: '300px', heightMode: 'auto', customHeight: '50px' }, 
  layout: ['hero', 'cta1', 'painPoints', 'empathy', 'transition', 'promise', 'services', 'cta2', 'curriculum', 'courseInfo', 'about', 'authority', 'qualification', 'testimonials', 'pricingPlans', 'faq', 'close', 'cta3', 'complianceFooter'],
  customStyles: {},
  elementStyles: { desktop: {}, tablet: {}, mobile: {} }
};

export const useStore = create((set) => ({
  state: JSON.parse(JSON.stringify(TEMPLATE_COURSE)),
  activeTab: 'core',
  deviceMode: 'desktop',
  activeExpandedSection: null,
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setDeviceMode: (mode) => set({ deviceMode: mode }),
  setActiveExpandedSection: (section) => set({ activeExpandedSection: section }),
  
  updateField: (section, field, value) => set((store) => ({
    state: {
      ...store.state,
      [section]: {
        ...store.state[section],
        [field]: value
      }
    }
  })),

  updateMeta: (field, value) => set((store) => ({
    state: {
      ...store.state,
      meta: {
        ...store.state.meta,
        [field]: value
      }
    }
  })),
  
  updateNestedField: (section, arrayField, index, field, value) => set((store) => {
    const newArray = [...store.state[section][arrayField]];
    newArray[index] = { ...newArray[index], [field]: value };
    return {
      state: {
        ...store.state,
        [section]: {
          ...store.state[section],
          [arrayField]: newArray
        }
      }
    };
  }),

  updateArrayField: (section, index, field, value) => set((store) => {
    const newArray = [...store.state[section]];
    newArray[index] = { ...newArray[index], [field]: value };
    return {
      state: {
        ...store.state,
        [section]: newArray
      }
    };
  }),

  addArrayItem: (section, defaultObj) => set((store) => ({
    state: {
      ...store.state,
      [section]: [...store.state[section], defaultObj]
    }
  })),

  removeArrayItem: (section, index) => set((store) => {
    const newArray = [...store.state[section]];
    newArray.splice(index, 1);
    return {
      state: {
        ...store.state,
        [section]: newArray
      }
    };
  }),

  addNestedArrayItem: (section, arrayField, defaultObj) => set((store) => ({
    state: {
      ...store.state,
      [section]: {
        ...store.state[section],
        [arrayField]: [...(store.state[section][arrayField] || []), defaultObj]
      }
    }
  })),

  removeNestedArrayItem: (section, arrayField, index) => set((store) => {
    const newArray = [...(store.state[section][arrayField] || [])];
    newArray.splice(index, 1);
    return {
      state: {
        ...store.state,
        [section]: {
          ...store.state[section],
          [arrayField]: newArray
        }
      }
    };
  }),
  
  updateStateByPath: (path, value) => set((store) => {
    const keys = path.split('.');
    const newState = JSON.parse(JSON.stringify(store.state));
    let current = newState;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!isNaN(keys[i])) {
            current = current[parseInt(keys[i], 10)];
        } else {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
    }
    const lastKey = keys[keys.length - 1];
    if (!isNaN(lastKey)) {
        current[parseInt(lastKey, 10)] = value;
    } else {
        current[lastKey] = value;
    }
    return { state: newState };
  }),

  reorderLayout: (startIndex, endIndex) => set((store) => {
    const newLayout = [...store.state.layout];
    const [removed] = newLayout.splice(startIndex, 1);
    newLayout.splice(endIndex, 0, removed);
    return {
      state: {
        ...store.state,
        layout: newLayout
      }
    };
  }),

  toggleBlock: (blockKey, hide) => set((store) => {
    let newLayout = [...store.state.layout];
    if (hide) {
      newLayout = newLayout.filter(b => b !== blockKey);
    } else {
      newLayout.push(blockKey);
    }
    return {
      state: {
        ...store.state,
        layout: newLayout
      }
    };
  }),

  applyTheme: (themeObj) => set((store) => ({
    state: {
      ...store.state,
      theme: { ...themeObj }
    }
  })),

  updateElementStyle: (mode, path, key, value) => set((store) => {
    const currentDeviceStyles = store.state.elementStyles[mode] || {};
    const currentElementStyles = currentDeviceStyles[path] || {};
    
    return {
      state: {
        ...store.state,
        elementStyles: {
          ...store.state.elementStyles,
          [mode]: {
            ...currentDeviceStyles,
            [path]: {
              ...currentElementStyles,
              [key]: value
            }
          }
        }
      }
    };
  }),

  loadState: (newState) => set(() => {
    const merged = { ...newState };
    const hadCompliance = !!merged.compliance;
    const dc = TEMPLATE_COURSE.compliance;
    // Deep-merge compliance defaults so older drafts gain new fields
    // (disclaimer/copyright/brandName…) while keeping the user's own edits.
    merged.compliance = {
      ...JSON.parse(JSON.stringify(dc)),
      ...(merged.compliance || {}),
      merchant: { ...dc.merchant, ...((merged.compliance || {}).merchant || {}) },
    };
    // Only auto-add the footer block for pre-feature drafts; afterwards respect
    // the user's own show/hide choice in 佈局排序.
    if (!hadCompliance && Array.isArray(merged.layout) && !merged.layout.includes('complianceFooter')) {
      merged.layout = [...merged.layout, 'complianceFooter'];
    }
    // Backfill 課程資訊 for drafts saved before it existed.
    const hadCourseInfo = !!merged.courseInfo;
    if (!merged.courseInfo) merged.courseInfo = JSON.parse(JSON.stringify(TEMPLATE_COURSE.courseInfo));
    if (!hadCourseInfo && Array.isArray(merged.layout) && !merged.layout.includes('courseInfo')) {
      const idx = merged.layout.indexOf('pricingPlans');
      if (idx >= 0) merged.layout.splice(idx, 0, 'courseInfo');
      else merged.layout.push('courseInfo');
    }
    return { state: merged };
  }),
  
  resetState: () => set({ state: JSON.parse(JSON.stringify(TEMPLATE_COURSE)) })
}));
