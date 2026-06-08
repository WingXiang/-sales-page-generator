import { useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { ShieldCheck, Store, FileText, RotateCcw, Lock, Info, Sparkles, Loader2, AlertTriangle, Scale, Copyright } from 'lucide-react';

const ExampleBadge = () => (
  <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
    <AlertTriangle size={9} /> 範例·待更換
  </span>
);

export default function ComplianceTab() {
  const { state, updateStateByPath } = useStore();
  const compliance = state.compliance || {};
  const merchant = compliance.merchant || {};
  const [genLoading, setGenLoading] = useState(false);

  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs placeholder-slate-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold shadow-sm";
  const labelClass = "text-[11px] font-extrabold text-slate-500 uppercase tracking-wider";

  const handleFocus = (path) => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path }, '*');
    }
  };

  const handleBlur = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path: null }, '*');
    }
  };

  const scrollToFooter = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'SCROLL_TO', sectionId: 'section-complianceFooter' }, '*');
    }
  };

  // mustEdit: 申請金流前必須改成真實資料的範例欄位
  const merchantFields = [
    { key: 'brandName', label: '品牌名稱', placeholder: '例如：好學品牌', mustEdit: true },
    { key: 'companyName', label: '公司全名', placeholder: '例如：好學數位有限公司', mustEdit: true },
    { key: 'taxId', label: '統一編號', placeholder: '8 碼數字', mustEdit: true },
    { key: 'responsiblePerson', label: '負責人', placeholder: '例如：陳相銘', mustEdit: true },
    { key: 'phone', label: '客服電話', placeholder: '例如：02-1234-5678', mustEdit: true },
    { key: 'email', label: '客服信箱', placeholder: 'support@example.com', mustEdit: true },
    { key: 'lineId', label: '官方 LINE', placeholder: '例如：@yourbrand', mustEdit: true },
    { key: 'jurisdiction', label: '管轄／仲裁地', placeholder: '例如：臺北市', mustEdit: true },
    { key: 'serviceHours', label: '客服時間', placeholder: '例如：週一至週五 09:00-18:00', mustEdit: false },
  ];

  const policyDocs = [
    { key: 'terms', title: '使用者條款', icon: <FileText size={16} className="text-primary" />, h: 'h-56', placeholder: '交易幣別、帳號責任、智慧財產權、準據法與管轄…' },
    { key: 'privacyPolicy', title: '隱私權政策', icon: <Lock size={16} className="text-primary" />, h: 'h-56', placeholder: '個資定義、蒐集與使用、機密與安全、政策修訂…' },
    { key: 'refundPolicy', title: '退費／退貨政策', icon: <RotateCcw size={16} className="text-primary" />, h: 'h-72', placeholder: '線上課程、視訊諮詢、實體課程退費規則…' },
    { key: 'disclaimer', title: '免責聲明（中／英）', icon: <Scale size={16} className="text-primary" />, h: 'h-72', placeholder: '平台關係聲明、學習效果免責、English disclaimer…' },
  ];

  const generatePolicies = async () => {
    setGenLoading(true);
    const AI_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || '/api/generate';

    const brand = merchant.brandName || state.brandInfo?.brandName || '本商家';
    const product = state.meta?.courseName || state.services?.title || '線上課程／數位內容';
    const email = merchant.email || state.brandInfo?.contactEmail || '';

    const prompt = `你是台灣電商法務專員。請依以下商家資訊，撰寫三份適用於台灣金流（綠界、藍新）申請審核的政策文字，語氣正式、條列清楚，並符合《個人資料保護法》與《消費者保護法》。
商號名稱：${brand}
主要商品／服務：${product}
客服信箱：${email}

請只輸出純 JSON（不要有任何 markdown 標記如 \`\`\`json 或說明文字），格式如下：
{
  "privacyPolicy": "隱私權政策全文",
  "terms": "使用者條款全文，含交易幣別(新台幣)、帳號責任、智慧財產權、準據法與管轄",
  "refundPolicy": "退費／退貨政策全文，含線上課程依通訊交易解除權合理例外準則排除七日鑑賞期之條款"
}
每份政策請用 \\n 換行分段。`;

    try {
      const res = await fetch(AI_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('AI 無回應內容');

      let jsonText = text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      const parsed = JSON.parse(jsonText);

      if (parsed.privacyPolicy) updateStateByPath('compliance.privacyPolicy', parsed.privacyPolicy);
      if (parsed.terms) updateStateByPath('compliance.terms', parsed.terms);
      if (parsed.refundPolicy) updateStateByPath('compliance.refundPolicy', parsed.refundPolicy);

      toast.success('✨ AI 已重新生成使用者條款、隱私權與退費政策！');
      scrollToFooter();
    } catch (err) {
      console.warn('AI 政策生成失敗：', err);
      toast.error('⚠️ AI 生成失敗，已保留現有政策文字，可手動編輯。');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 md:p-5 rounded-2xl border border-emerald-100 space-y-3">
        <h3 className="text-sm font-black text-emerald-900 flex items-center gap-2">
          <ShieldCheck size={16} /> 金流申請用資訊
        </h3>
        <p className="text-xs text-emerald-700 leading-relaxed">
          綠界、藍新等台灣金流商家審核，通常要求頁面具備「商家聯絡資訊、使用者條款、隱私權政策、退費政策、免責聲明」。
          填寫下方欄位後，會自動帶入頁尾與各政策內文；頁尾僅顯示簡潔連結，點擊後於新分頁開啟政策全頁。
        </p>
        <button onClick={scrollToFooter} className="text-[11px] font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
          ↓ 跳到右側預覽的頁尾
        </button>
      </div>

      {/* 變數自動帶入說明 */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
        <h4 className="text-xs font-black text-blue-900 flex items-center gap-1.5"><Info size={13} /> 變數自動帶入</h4>
        <p className="text-[11px] text-blue-700 leading-relaxed">
          政策內文中的 <code className="bg-white px-1 rounded border border-blue-200 font-bold">{'{{品牌名}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold mx-0.5">{'{{公司名}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold">{'{{統一編號}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold mx-0.5">{'{{客服信箱}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold">{'{{Line}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold mx-0.5">{'{{管轄地}}'}</code>
          會自動以下方商家欄位的內容替換，輸入一次即同步到所有政策與版權列。
        </p>
      </div>

      {/* 一鍵 AI 生成政策 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-5 rounded-2xl border border-indigo-100 space-y-3">
        <h3 className="text-sm font-black text-indigo-900 flex items-center gap-2">
          <Sparkles size={16} /> 一鍵 AI 生成政策文案
        </h3>
        <p className="text-xs text-indigo-700 leading-relaxed">
          依商號與商品資訊，重新生成「使用者條款、隱私權政策、退費政策」並覆寫下方欄位（免責聲明與版權聲明維持不變）。
        </p>
        <button
          onClick={generatePolicies}
          disabled={genLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-center shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {genLoading ? (<><Loader2 size={16} className="animate-spin" /> AI 撰寫中…</>) : (<><Sparkles size={16} /> 一鍵帶入 AI 生成政策文案</>)}
        </button>
      </div>

      {/* 商家資訊 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Store size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">商家資訊</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {merchantFields.map((f) => (
            <div key={f.key}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className={labelClass}>{f.label}</label>
                {f.mustEdit && <ExampleBadge />}
              </div>
              <input
                type="text"
                value={merchant[f.key] || ''}
                onChange={(e) => updateStateByPath(`compliance.merchant.${f.key}`, e.target.value)}
                onFocus={() => handleFocus(`compliance.merchant.${f.key}`)}
                onBlur={handleBlur}
                className={inputClass}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className={labelClass}>營業地址</label>
            <ExampleBadge />
          </div>
          <input
            type="text"
            value={merchant.address || ''}
            onChange={(e) => updateStateByPath('compliance.merchant.address', e.target.value)}
            onFocus={() => handleFocus('compliance.merchant.address')}
            onBlur={handleBlur}
            className={inputClass}
            placeholder="例如：台北市中正區忠孝東路一段 1 號 5 樓"
          />
        </div>
        <p className="text-[10px] text-amber-700 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-lg p-2.5 leading-relaxed">
          <Info size={12} className="shrink-0 mt-0.5" />
          標示 <span className="font-black">「範例·待更換」</span> 的欄位目前為虛擬示範資料。統一編號、客服電話、營業地址等為金流審核必填項，送審前請務必改成真實資料。
        </p>
      </div>

      {/* 版權聲明（單行，顯示於頁尾底部） */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Copyright size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">版權聲明（頁尾底部）</h3>
        </div>
        <input
          type="text"
          value={compliance.copyright || ''}
          onChange={(e) => updateStateByPath('compliance.copyright', e.target.value)}
          onFocus={() => handleFocus('compliance.copyright')}
          onBlur={handleBlur}
          className={inputClass}
          placeholder="COPYRIGHT© {{品牌名}} All rights reserved {{公司名}}．統一編號: {{統一編號}}"
        />
      </div>

      {/* 各政策全文 */}
      {policyDocs.map((doc) => (
        <div key={doc.key} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            {doc.icon}
            <h3 className="font-black text-sm text-slate-800">{doc.title}</h3>
          </div>
          <textarea
            value={compliance[doc.key] || ''}
            onChange={(e) => updateStateByPath(`compliance.${doc.key}`, e.target.value)}
            onFocus={() => handleFocus(`compliance.${doc.key}`)}
            onBlur={handleBlur}
            className={`${inputClass} ${doc.h} font-normal leading-relaxed`}
            placeholder={doc.placeholder}
          />
        </div>
      ))}

      <p className="text-[10px] text-slate-400 leading-relaxed px-1">
        提醒：依《通訊交易解除權合理例外情事適用準則》，線上課程／數位內容若要排除七日鑑賞期，
        須於消費者購買前明確告知並取得同意，請保留退費政策內相關條文。各政策內容請依您實際營運情況調整。
      </p>
    </div>
  );
}
