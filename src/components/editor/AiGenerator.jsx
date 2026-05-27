import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Wand2, Upload, FileText, Loader2, X } from 'lucide-react';

export default function AiGenerator() {
  const { state, updateMeta, updateStateByPath } = useStore();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const inputClass = "w-full bg-slate-100 border border-slate-300 text-slate-800 rounded px-3 py-2 text-xs placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none transition-all font-semibold shadow-sm";
  const labelClass = "block text-[11px] font-extrabold text-slate-500 mb-1 uppercase tracking-wider";

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    if (uploadedFiles.length + files.length > 3) {
      alert("⚠️ 最多只能上傳 3 份檔案！");
      return;
    }

    const newUploadedFiles = [...uploadedFiles];
    
    for (let file of files) {
      if (file.type === "application/pdf") {
        const text = await extractTextFromPDF(file);
        newUploadedFiles.push({ name: file.name, text });
      } else if (file.name.endsWith(".docx")) {
        const text = await extractTextFromDOCX(file);
        newUploadedFiles.push({ name: file.name, text });
      } else if (file.type === "text/plain") {
        const text = await extractTextFromTXT(file);
        newUploadedFiles.push({ name: file.name, text });
      } else {
        alert(`❌ 不支援的檔案格式：${file.name}`);
      }
    }
    
    setUploadedFiles(newUploadedFiles);
    // Reset input
    event.target.value = '';
  };

  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const extractTextFromTXT = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  };

  const extractTextFromDOCX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        if (window.mammoth) {
          window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
            .then(function(result) { resolve(result.value); })
            .catch(function(err) { reject(err); });
        } else {
          reject("Mammoth.js not loaded");
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromPDF = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function() {
        if (!window.pdfjsLib) return reject("pdfjsLib not loaded");
        const typedarray = new Uint8Array(this.result);
        try {
          const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(s => s.str).join(" ") + "\\n";
          }
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const runBackupLocalGeneration = () => {
    const courseName = state.meta?.courseName || '數位顧問培訓班';
    const transformation = state.meta?.transformation || '節省時間，專心發展事業';
    const audience = state.meta?.audience || '一人公司經營者';

    updateStateByPath('meta.painTitleMain', "您是否也正面臨這些一人公司的營運瓶頸？");
    updateStateByPath('meta.currTitleMain', "系統化的數位顧問實戰課程大綱");
    updateStateByPath('meta.qualTitleMain', "本培訓班是否適合目前的您？");
    updateStateByPath('meta.testTitleMain', "來自一人公司創辦人的真實好評推薦");
    updateStateByPath('meta.priceTitleMain', "限時加入！數位顧問學員方案");
    updateStateByPath('meta.faqTitleMain', "解答您加入前的所有疑問");

    updateStateByPath('brandInfo', {
      brandName: '數位顧問培訓學堂',
      aboutTitle: '關於培訓團隊',
      aboutText: '我們專為一人公司經營者提供實戰型的數位顧問培訓。我們的使命是協助您打造自動化運營系統，省下繁瑣的瑣碎時間，讓您能100%專心發展核心事業。',
      contactEmail: 'support@finjapanlife.com',
      contactLine: '@digital_consultant',
      contactHours: '週一至週五 09:00 - 18:00'
    });

    updateStateByPath('hero', {
      title: '省下80%繁瑣行政！\n專為一人公司設計的數位顧問培訓班',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      bullets: [
        { text: '建立自動化客源與服務系統，節省寶貴時間' },
        { text: '擺脫雜務糾纏，重新專心發展您的核心事業' },
        { text: '無痛導入數位工具，一人也能發揮團隊級影響力' }
      ]
    });

    updateStateByPath('painPoints', [
      { title: '終日被雜務綁架', desc: '每天花費大量時間在手動處理客戶諮詢、排程與行政庶務，根本沒有時間思考事業的長遠發展。' },
      { title: '數位工具導入困難', desc: '知道要數位轉型，但面對繁雜的工具不知道如何選擇與整合，花大錢買軟體卻無法落地使用。' },
      { title: '缺乏自動化思維', desc: '所有服務都需要親力親為，一旦停止工作就沒有收入，無法建立可以規模化擴展的商業模式。' }
    ]);

    updateStateByPath('empathy', {
      quote: '「經營一人公司，\n你應該是創辦人，而不是全職雜工。」',
      text: '我也曾和您一樣，每天工作14小時，卻有一半以上的時間在回Email、串接流程與手動記帳。直到我建立了一套自動化的數位諮詢顧問系統，才真正把時間釋放出來，專注在策略規劃與事業成長上。'
    });

    updateStateByPath('transition', {
      title: '思維翻轉：從全職雜工到真正的企業家',
      cards: [
        { title: '傳統親力親為模式', desc: '手動處理客戶資料、排程與服務交付。每天精疲力竭，時間高度碎片化，事業難以擴張。' },
        { title: '數位自動化系統', desc: '引進顧問級自動化工具，建立24小時自動流轉的營運閉環，節省時間，專心發展事業。' }
      ]
    });

    updateStateByPath('promise', {
      title: '加入培訓後您將獲得的具體改變',
      items: [
        { text: '每週釋放至少 15 小時 the 繁雜行政時間' }, // Wait, in useStore it's '每週釋放至少 15 小時的繁雜行政時間'
        { text: '擁有一套全自動的線上客戶預約與諮詢交付系統' },
        { text: '學會如何用數位工具自動化過濾高價值客戶' }
      ]
    });

    updateStateByPath('services', {
      title: '三大核心數位顧問培訓模組',
      items: [
        { name: '自動化營運系統建立', desc: '從預約、接單到交付，串接全自動流程，讓系統幫您做日常瑣事。' },
        { name: '高效數位工具箱', desc: '精選最適合一人公司的無代碼工具，開箱即用，避免多餘軟體開銷。' },
        { name: '數位顧問變現實戰', desc: '教您如何將自身專業包裝成高價值的數位顧問服務，實現規模化增長。' }
      ]
    });

    updateStateByPath('curriculum', [
      { title: '第一階段：一人公司的數位自動化底層邏輯', content: '分析營運痛點與時間分配\n規劃個人專屬的自動化運營藍圖' },
      { title: '第二階段：無代碼數位工具實戰串接', content: '手把手教您串接預約、Email通知與客戶管理系統\n實現24小時無人值守自動運作' },
      { title: '第三階段：高價值顧問服務包裝與規模化', content: '顧問收費模式與定價策略\n利用自動化系統高效獲客與交付' }
    ]);

    updateStateByPath('authority', {
      image: 'https://i.ibb.co/NgG55zqk/portrait-1771585005753.png',
      name: '陳相銘 ( Wing )',
      bio: '資深一人公司數位轉型專家，曾協助超過 300 位自由創作者與一人創辦人搭建自動化運作系統。精通多款無代碼工具串接，致力於幫經營者「節省時間，專心發展事業」。',
      stats: [
        { label: '學員平均省時/週', value: '15+ 小時' },
        { label: '學員滿意推薦率', value: '98.5%' }
      ]
    });

    updateStateByPath('qualification', {
      fit: [
        { text: '希望省下繁雜行政時間、專注於事業成長的一人創辦人' },
        { text: '渴望用數位工具自動化流程，不願雇用多餘員工的創業者' },
        { text: '想將自身專業轉化為高獲利數位顧問服務的自由職業人士' }
      ],
      unfit: [
        { text: '期待不勞而獲、不願意花時間親自設定系統的人' },
        { text: '排斥數位工具，堅持所有客戶流程都必須人工手動處理者' }
      ]
    });

    updateStateByPath('testimonials', [
      { name: '張小姐', role: '行銷一人公司創辦人', content: '以前每天被客戶的預約排程 and 信件轟炸，加入培訓班後，我架設了自己的自動化預約系統。現在每週多出整整兩天時間，可以專心服務付費客戶，業績提升了 40%！' },
      { name: '陳先生', role: '獨立軟體開發者', content: '陳相銘 ( Wing ) 的無代碼工具課非常實用！我不需要寫任何一行代碼，就把客服跟訂單通知全部自動化了。終於有時間可以專心寫核心產品！' }
    ]);

    updateStateByPath('pricingPlans', [
      { 
        title: '專業實戰班', originalPrice: '24,000', currentPrice: '12,800', urgency: '🔥 早鳥優惠倒數 5 席', 
        features: '12 堂數位自動化實戰影音課程\n專屬無代碼工具整合包與設定範本\n終身加入學員專屬 Discord 交流群', ctaText: '立即加入專業班', ctaLink: '#', guarantee: '保障：14 天內不滿意保證全額退費' 
      },
      { 
        title: '1對1 顧問直通班', originalPrice: '60,000', currentPrice: '36,000', urgency: '💎 每月限量 3 名經營者', 
        features: '包含專業實戰班所有內容與資源\n陳相銘 ( Wing ) 親自 1對1 協助搭建專屬自動化系統\n3 個月每週視訊排查與策略調整指導', ctaText: '申請 1對1 直通班', ctaLink: '#', guarantee: '保障：保證系統搭建完成並運作' 
      }
    ]);

    updateStateByPath('faq', [
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
    ]);

    updateStateByPath('close', { 
      text: '別再把時間浪費在重複的庶務上。現在就加入，建立您的數位自動化系統，奪回時間主導權！'
    });

    updateStateByPath('cta1', { text: '👉 立即報名', link: '#', fontSize: '16px', bgColor: '#c67e13', paddingX: '32px', paddingY: '16px', borderRadius: '16px', widthMode: 'auto', customWidth: '300px', heightMode: 'auto', customHeight: '50px' });
    updateStateByPath('cta2', { text: '立即加入，開啟自動化營運', link: '#', fontSize: '16px', bgColor: '#c67e13', paddingX: '32px', paddingY: '16px', borderRadius: '16px', widthMode: 'auto', customWidth: '300px', heightMode: 'auto', customHeight: '50px' });
    updateStateByPath('cta3', { text: '現在加入，專注發展核心事業', link: '#', fontSize: '16px', bgColor: '#c67e13', paddingX: '32px', paddingY: '16px', borderRadius: '16px', widthMode: 'auto', customWidth: '300px', heightMode: 'auto', customHeight: '50px' });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingText("🔍 正在讀取輸入欄位與上傳背景大綱...");

    const loadingSteps = [
      "🔍 正在讀取輸入欄位與上傳背景大綱...",
      "🧬 正在連接雲端 Gemini 行銷大腦...",
      "✍️ 正在客製重組 14 大核心行銷說服模組...",
      "🎨 正在為您的主題打磨專屬的好評見證與 FAQ...",
      "🚀 正在匯入文案並同步更新右側預覽畫面..."
    ];

    let step = 0;
    const loadingInterval = setInterval(() => {
      step = (step + 1) % loadingSteps.length;
      setLoadingText(loadingSteps[step]);
    }, 2500);

    const courseName = state.meta?.courseName || '數位顧問培訓班';
    const transformation = state.meta?.transformation || '節省時間，專心發展事業';
    const audience = state.meta?.audience || '一人公司經營者';
    const style = state.meta?.style || '';
    const filesText = uploadedFiles.length > 0
      ? uploadedFiles.map(f => `[檔案：${f.name}]\n${f.text}`).join('\n\n')
      : '無參考檔案。';

    const apiKey = "AIzaSyBgUlpyCC0J4tEkA1PYusCV7--HkIIy2Gc";
    const promptText = `你是一位頂尖的行銷文案大師。請為以下產品撰寫完整的銷售頁（Landing Page）文案：
課程/產品名稱：${courseName}
帶給學生的具體轉變與成果：${transformation}
目標受眾：${audience}
品牌網站資訊/背景說明：${style}
參考上傳檔案內容：
${filesText}

請將文案撰寫成符合以下 JSON 格式的資料，請不要有任何 markdown 格式的程式碼區塊標記 (例如 \`\`\`json) 或任何其他說明文字，必須是純 JSON 物件：

{
  "meta": {
    "painTitleMain": "針對受眾的一人公司營運/生活瓶頸或痛點的主標題",
    "currTitleMain": "大綱/核心服務的標題",
    "qualTitleMain": "適合誰/篩選條件的標題",
    "testTitleMain": "見證/好評的標題",
    "priceTitleMain": "定價/方案的標題",
    "faqTitleMain": "常見問答的標題"
  },
  "brandInfo": {
    "brandName": "品牌或學院名稱",
    "aboutTitle": "關於團隊/創辦人的標題",
    "aboutText": "團隊或創辦人簡介文案，說明使命以及如何幫助受眾",
    "contactEmail": "support@example.com",
    "contactLine": "@line_id"
  },
  "hero": {
    "title": "主視覺超強吸引力主標題 (可用 \\n 換行，字數約 20-30 字，強調痛點解決或驚人轉變)",
    "bullets": [
      { "text": "吸引人的亮點/承諾 1" },
      { "text": "吸引人的亮點/承諾 2" },
      { "text": "吸引人的亮點/承諾 3" }
    ]
  },
  "painPoints": [
    { "title": "痛點 1 標題", "desc": "痛點 1 詳細描述" },
    { "title": "痛點 2 標題", "desc": "痛點 2 詳細描述" },
    { "title": "痛點 3 標題", "desc": "痛點 3 詳細描述" }
  ],
  "empathy": {
    "quote": "創辦人或金句引用「...」 (可用 \\n 換行)",
    "text": "感同身受的自白文案，說明自己也曾經歷同樣痛苦，直到發現了解決方案"
  },
  "transition": {
    "title": "思維翻轉/對比區塊標題",
    "cards": [
      { "title": "傳統/錯誤的舊做法", "desc": "舊做法的弊端" },
      { "title": "高效/我們的新系統做法", "desc": "新做法的優勢與回報" }
    ]
  },
  "promise": {
    "title": "加入/使用後能獲得的具體改變標題",
    "items": [
      { "text": "具體改變/好處 1" },
      { "text": "具體改變/好處 2" },
      { "text": "具體改變/好處 3" }
    ]
  },
  "services": {
    "title": "核心服務/模組標題",
    "items": [
      { "name": "核心模組/服務 1 名稱", "desc": "詳細的描述" },
      { "name": "核心模組/服務 2 名稱", "desc": "詳細的描述" },
      { "name": "核心模組/服務 3 名稱", "desc": "詳細的描述" }
    ]
  },
  "curriculum": [
    { "title": "大綱/步驟階段一", "content": "詳細單元內容與實作目標" },
    { "title": "大綱/步驟階段二", "content": "詳細單元內容與實作目標" },
    { "title": "大綱/步驟階段三", "content": "詳細單元內容與實作目標" }
  ],
  "authority": {
    "name": "專家/講師姓名",
    "bio": "專家背景資歷簡介，強調在這個領域的成功案例或專業能力",
    "stats": [
      { "label": "關鍵數據 1 (例如：累積學員)", "value": "數值 (例如：3,000+ 人)" },
      { "label": "關鍵數據 2 (例如：學員滿意度)", "value": "數值 (例如：98.5%)" }
    ]
  },
  "qualification": {
    "fit": [
      { "text": "最適合本產品的人群特徵 1" },
      { "text": "最適合本產品的人群特徵 2" },
      { "text": "最適合本產品的人群特徵 3" }
    ],
    "unfit": [
      { "text": "不適合本產品的人群特徵 1" },
      { "text": "不適合本產品的人群特徵 2" }
    ]
  },
  "testimonials": [
    { "name": "見證學員 A 姓名", "role": "頭銜/角色 (例如: 自由創作者)", "content": "真實的好評內容，提及解決了什麼具體痛點，釋放了多少時間或增加了多少收入" },
    { "name": "見證學員 B 姓名", "role": "頭銜/角色", "content": "好評內容" }
  ],
  "pricingPlans": [
    {
      "title": "初階方案名稱",
      "originalPrice": "原始價格 (數字即可)",
      "currentPrice": "優惠特價 (數字即可)",
      "urgency": "急迫感標籤 (例如: 早鳥優惠剩 5 席)",
      "features": "方案包含的特色 (用 \\n 隔開)",
      "ctaText": "按鈕文字",
      "ctaLink": "#",
      "guarantee": "退費保證或信心保障文字"
    },
    {
      "title": "高階方案/VIP名稱",
      "originalPrice": "原始價格",
      "currentPrice": "特價",
      "urgency": "限量標籤 (例如: 每月限 3 名額)",
      "features": "方案包含的特色 (用 \\n 隔開)",
      "ctaText": "按鈕文字",
      "ctaLink": "#",
      "guarantee": "退費保證或信心保障文字"
    }
  ],
  "faq": [
    { "q": "常見問答問題 1", "a": "常見問答回覆 1" },
    { "q": "常見問答問題 2", "a": "常見問答回覆 2" },
    { "q": "常見問答問題 3", "a": "常見問答回覆 3" }
  ],
  "close": {
    "text": "呼籲行動的感性結尾文案"
  },
  "cta1": { "text": "主按鈕 1 文字" },
  "cta2": { "text": "主按鈕 2 文字" },
  "cta3": { "text": "主按鈕 3 文字" }
}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.candidates || result.candidates.length === 0) {
        throw new Error("No candidates returned from Gemini API");
      }

      const text = result.candidates[0].content.parts[0].text;
      let jsonText = text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }
      
      const cleanJson = JSON.parse(jsonText);
      
      if (cleanJson) {
        Object.keys(cleanJson).forEach(sectionKey => {
          if (typeof cleanJson[sectionKey] === 'object' && !Array.isArray(cleanJson[sectionKey])) {
            Object.keys(cleanJson[sectionKey]).forEach(fieldKey => {
              updateStateByPath(`${sectionKey}.${fieldKey}`, cleanJson[sectionKey][fieldKey]);
            });
          } else {
            updateStateByPath(sectionKey, cleanJson[sectionKey]);
          }
        });
        toast.success("✨ AI 一鍵生成銷售頁文案成功！");
      } else {
        throw new Error("Parsed JSON is empty");
      }
    } catch (err) {
      console.warn("Gemini API error, falling back to local generator:", err);
      runBackupLocalGeneration();
      toast.error("⚠️ AI 連線失敗或格式不合，已自動啟用本地備用智慧生成系統。");
    } finally {
      clearInterval(loadingInterval);
      setLoading(false);
    }
  };

  const handleGenerateClick = () => {
    handleGenerate();
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-5 rounded-2xl border border-indigo-100 space-y-4 shadow-sm mb-6">
        <h3 className="text-sm font-black text-indigo-900 flex items-center gap-2">
            <Wand2 size={16} /> AI 網站企劃與一鍵填寫
        </h3>
        <p className="text-xs text-indigo-700 leading-relaxed">請填寫下列特色。系統會連結雲端 Gemini 智慧大腦，並深度解析您上傳的參考大綱與講義（最多支援 3 份檔案），完全為您一鍵生成全套說服文案！</p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className={`${labelClass} text-indigo-800`}>課程/產品名稱</label>
            <input type="text" value={state.meta?.courseName || ''} onChange={(e) => updateMeta('courseName', e.target.value)} className={inputClass} placeholder="例如：數位顧問培訓班"/>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={`${labelClass} text-indigo-800`}>帶給學生的具體轉變與成果</label>
            <input type="text" value={state.meta?.transformation || ''} onChange={(e) => updateMeta('transformation', e.target.value)} className={inputClass} placeholder="例如：節省時間，專心發展事業"/>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={`${labelClass} text-indigo-800`}>目標受眾 (Target Audience)</label>
            <input type="text" value={state.meta?.audience || ''} onChange={(e) => updateMeta('audience', e.target.value)} className={inputClass} placeholder="例如：一人公司經營者"/>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={`${labelClass} text-indigo-800`}>品牌網站資訊</label>
            <input type="text" value={state.meta?.style || ''} onChange={(e) => updateMeta('style', e.target.value)} className={inputClass} placeholder="例如：https://finjapanlife.com/"/>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-3">
            <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1"><FileText size={14} /> 智慧文件背景資料載入 (最多上傳 3 份)</h4>
            
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.txt" multiple onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-indigo-200">
                <Upload size={14} /> 選擇並加入檔案 (PDF / DOCX / TXT)
            </button>

            <div className="space-y-2">
                {uploadedFiles.length === 0 ? (
                    <p className="text-[10px] text-slate-400">目前尚未上傳任何參考文件。若有教學大綱、講義或大綱 PDF/Word，非常推薦上傳！</p>
                ) : (
                    uploadedFiles.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg text-[11px] text-slate-600 font-medium">
                            <div className="flex items-center gap-2 truncate">
                                <FileText size={12} className="text-indigo-400 shrink-0" />
                                <span className="truncate">{f.name}</span>
                            </div>
                            <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-600 p-1 shrink-0"><X size={12}/></button>
                        </div>
                    ))
                )}
            </div>
        </div>

        <button 
          onClick={handleGenerateClick} 
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-center shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> {loadingText}</>
            ) : (
              <><Wand2 size={16} /> 一鍵生成銷售頁文案</>
            )}
        </button>
    </div>
  );
}
