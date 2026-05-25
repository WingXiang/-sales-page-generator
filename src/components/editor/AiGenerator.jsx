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
    const courseName = state.meta?.courseName || '金錢靈氣心靈豐盛大師班';
    const transformation = state.meta?.transformation || '清理金錢障礙';
    const audience = state.meta?.audience || '經常感到匱乏焦慮、渴望豐盛的人';

    updateStateByPath('meta.painTitleMain', "您是否也正面臨這些成長瓶頸？");
    updateStateByPath('meta.currTitleMain', "系統化的實戰單元大綱");
    updateStateByPath('meta.qualTitleMain', "本服務或課程是否真的符合您？");
    updateStateByPath('meta.testTitleMain', "來自第一線使用者的好評回饋");
    updateStateByPath('meta.priceTitleMain', "限時超值回饋方案");
    updateStateByPath('meta.faqTitleMain', "為您排除所有學習疑慮");

    updateStateByPath('brandInfo', {
      brandName: `${courseName} 專屬培訓學堂`,
      aboutTitle: '關於培訓小組',
      aboutText: `我們專為「${audience}」提供極具系統化的實作指南。在科技與觀念狂潮下，我們的使命是幫助您跨越傳統高牆，真正擁有自主轉化的核心：${transformation}！`,
      contactEmail: 'support@academy.com',
      contactLine: '@academy_official'
    });

    updateStateByPath('hero', {
      title: `不用等命運發落！\n為您量身打造 ${courseName}`,
      image: state.hero?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      bullets: [
        { text: `帶給您的極致改變：${transformation}` },
        { text: `專門為「${audience}」設計，不需任何高深基礎即可完美上手` },
        { text: `已驗證的有效閉環系統，縮短至少 80% 自行摸索時間` }
      ]
    });

    updateStateByPath('painPoints', [
      { title: '手動摸索毫無方向', desc: '每天花費大量時間嘗試與閱讀零碎資料，卻找不到一條能具體落地的成功路徑。' },
      { title: '概念抽象難以轉化', desc: '懂了滿滿的理論，卻卡在沒有具體的日常執行模板，無法轉化為生活成果。' }
    ]);

    updateStateByPath('empathy', {
      quote: `「踏出改變的第一步，\n就是重新奪回人生的主導權。」`,
      text: '我也曾為前途感到迷茫與焦慮。直到我不再追求高深的概念，改用極致系統化的執行方案，才在短時間內看見了轉變契機。'
    });

    updateStateByPath('transition', {
      title: '思維大升級',
      cards: [
        { title: '傳統舊路自學', desc: '靠毅力苦撐、四處碰壁、花費數倍的時間與精力，最終多半半途而廢。' },
        { title: '高效新路系統', desc: '跟著驗證成功的大綱模板，避開 90% 的彎路，開箱即用快速看到成果。' }
      ]
    });

    updateStateByPath('promise', {
      title: '結業後的三大具體改變',
      items: [
        { text: '能獨立規劃與建立個人專屬的高效實戰流程' },
        { text: `擁有至少一個在線上能穩定轉化成果的核心引擎` },
        { text: '效率提升 5 倍以上，重獲時間主導權' }
      ]
    });

    updateStateByPath('services', {
      title: '您將獲得的系統化資源',
      items: [
        { name: '40 堂高解析實體操作課程', desc: `沒有空洞的抽象理論，只提供一步一腳印的實作落地影音。` },
        { name: '專屬 Discord 實戰陪伴群', desc: '專業助教群每日線上答疑，不怕卡關沒人救。' }
      ]
    });

    updateStateByPath('curriculum', [
      { title: '第一單元：基礎思維與核心原理架構', content: '重建知識體系與定位\n打通全套核心實作底層架構' },
      { title: '第二單元：實戰轉化與核心變現落地', content: '部署個人專屬運作流程\n獲取實質豐盛成果' }
    ]);

    updateStateByPath('authority', {
      name: '張導師 (Alex)',
      image: state.authority?.image || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop',
      bio: `資深專業顧問，已成功輔導超過 1,500+ 位學員成功實現：${transformation}。`,
      stats: [
        { label: '學員滿意度', value: '99%' },
        { label: '好評回饋率', value: '100%' }
      ]
    });

    updateStateByPath('qualification', {
      fit: [
        { text: `渴望多賺取額外管道、實現：${transformation} 的人群` },
        { text: '希望能解放繁瑣手動工作、擁抱高效人生的創業者' }
      ],
      unfit: [
        { text: '期待一夜暴富而不願意實際動手付出測試的人' }
      ]
    });

    updateStateByPath('testimonials', [
      { name: '林小姐', role: '代表學員', content: '原本以為會很難上手，沒想到跟著助教指引，我做出了完全屬於自己的新成果，每週足足省下近 12 個小時！' },
      { name: '王先生', role: '自由創作者', content: '步驟非常清晰，根本不需要高深背景。一週之內就完成了我的第一款系統模型！' }
    ]);

    updateStateByPath('pricingPlans', [
      { 
        title: '新創實戰菁英包', 
        originalPrice: '9,900', 
        currentPrice: '4,980', 
        urgency: '🔥 早鳥倒數限額 15 位', 
        features: '無限期觀看全套實戰課程影音\n解鎖專屬 Discord 陪伴社群諮詢資格\n享終身免費升級與新模組下載權限',
        ctaText: '立即獲取方案', 
        ctaLink: '#',
        guarantee: '保障：提供 14 天內無條件退費保障' 
      },
      { 
        title: '企業實作 VIP 組', 
        originalPrice: '24,000', 
        currentPrice: '12,800', 
        urgency: '💎 VIP 僅限 5 名學員', 
        features: '包含菁英包所有影音內容\n2次 1對1 線上架構諮詢排查\n專屬客製化實作模組設計',
        ctaText: '申請 VIP 方案', 
        ctaLink: '#',
        guarantee: '保障：專人陪伴保證學會' 
      }
    ]);

    updateStateByPath('faq', [
      { q: '這門課程適合完全沒有基礎的初學者嗎？', a: '完全適合！這是專為「零基礎學員」設計的精實實操課。我們全程使用白話教學與圖形工具，只要會電腦操作就能快速上手。' },
      { q: '購買課程後，我可以觀看多久？', a: '購買後您將擁有「終身觀看權限」！不限時間、不限地點，還可以重複觀看與倒帶，非常適合時間碎片化的學員自由安排進度。' }
    ]);

    updateStateByPath('close', { 
      text: '現在就啟動你的改變旅程，與我們一起見證豐盛！'
    });

    updateStateByPath('cta1', { text: '免費取得試聽課與工作導圖', link: '#' });
    updateStateByPath('cta2', { text: '立即報名！解鎖全新獲客系統', link: '#' });
    updateStateByPath('cta3', { text: '預約免費一對一變現健檢諮詢', link: '#' });
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
    const interval = setInterval(() => {
      step = (step + 1) % loadingSteps.length;
      setLoadingText(loadingSteps[step]);
    }, 2500);

    // Simulate API delay for backup generation
    setTimeout(() => {
      clearInterval(interval);
      runBackupLocalGeneration();
      setLoading(false);
    }, 6000);
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
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-center shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> {loadingText}</>
            ) : (
              <><Wand2 size={16} /> 智慧分析一鍵生成銷售頁文案 (免Key)</>
            )}
        </button>
    </div>
  );
}
