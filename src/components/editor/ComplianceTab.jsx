import { useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { ShieldCheck, Store, FileText, RotateCcw, Lock, Info, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

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
    { key: 'companyName', label: '商號／公司名稱', placeholder: '例如：好學數位有限公司', mustEdit: true },
    { key: 'taxId', label: '統一編號', placeholder: '8 碼數字（公司戶必填）', mustEdit: true },
    { key: 'responsiblePerson', label: '負責人', placeholder: '例如：陳相銘', mustEdit: true },
    { key: 'phone', label: '客服電話', placeholder: '例如：02-1234-5678', mustEdit: true },
    { key: 'email', label: '客服信箱', placeholder: 'support@example.com', mustEdit: true },
    { key: 'serviceHours', label: '客服時間', placeholder: '例如：週一至週五 09:00-18:00', mustEdit: false },
  ];

  const generatePolicies = async () => {
    setGenLoading(true);
    const AI_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || '/api/generate';

    const brand = merchant.companyName || state.brandInfo?.brandName || '本商家';
    const product = state.meta?.courseName || state.services?.title || '線上課程／數位內容';
    const email = merchant.email || state.brandInfo?.contactEmail || '';

    const prompt = `你是台灣電商法務專員。請依以下商家資訊，撰寫三份適用於台灣金流（綠界、藍新）申請審核的政策文字，語氣正式、條列清楚，並符合《個人資料保護法》與《消費者保護法》。
商號名稱：${brand}
主要商品／服務：${product}
客服信箱：${email}

請只輸出純 JSON（不要有任何 markdown 標記如 \`\`\`json 或說明文字），格式如下：
{
  "privacyPolicy": "隱私權政策全文，說明蒐集目的與項目、利用範圍、資料安全、使用者權利、Cookie",
  "terms": "服務條款全文，說明交易幣別(新台幣)、訂購與付款、發票、智慧財產權、服務變更",
  "refundPolicy": "退換貨與退費政策全文，須包含實體商品依消保法享七日猶豫期，以及數位內容／線上課程依通訊交易解除權合理例外情事適用準則，經消費者購買前同意後排除七日猶豫期之條款，並說明退費方式與工作天數"
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

      toast.success('✨ AI 已為您生成三份合規政策文案！');
      scrollToFooter();
    } catch (err) {
      console.warn('AI 政策生成失敗：', err);
      toast.error('⚠️ AI 生成失敗，已保留現有預設政策文字，可手動編輯。');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 md:p-5 rounded-2xl border border-emerald-100 space-y-3">
        <h3 className="text-sm font-black text-emerald-900 flex items-center gap-2">
          <ShieldCheck size={16} /> 金流申請合規資訊
        </h3>
        <p className="text-xs text-emerald-700 leading-relaxed">
          綠界、藍新等台灣金流商家審核，通常要求頁面具備「商家聯絡資訊、隱私權政策、服務條款、退換貨政策」。
          填寫以下欄位後，會自動出現在頁面最底部的合規頁尾，成品可直接送審。
        </p>
        <button onClick={scrollToFooter} className="text-[11px] font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
          ↓ 跳到右側預覽的合規頁尾
        </button>
      </div>

      {/* 一鍵 AI 生成政策 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-5 rounded-2xl border border-indigo-100 space-y-3">
        <h3 className="text-sm font-black text-indigo-900 flex items-center gap-2">
          <Sparkles size={16} /> 一鍵 AI 生成政策文案
        </h3>
        <p className="text-xs text-indigo-700 leading-relaxed">
          依您的商號與商品資訊，自動生成符合台灣法規的隱私權政策、服務條款與退換貨政策，並覆寫下方欄位。
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

      {/* 隱私權政策 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lock size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">隱私權政策</h3>
        </div>
        <textarea
          value={compliance.privacyPolicy || ''}
          onChange={(e) => updateStateByPath('compliance.privacyPolicy', e.target.value)}
          onFocus={() => handleFocus('compliance.privacyPolicy')}
          onBlur={handleBlur}
          className={`${inputClass} h-48 font-normal leading-relaxed`}
          placeholder="說明蒐集目的、利用範圍、資料安全與使用者權利…"
        />
      </div>

      {/* 服務條款 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">服務條款 / 購買須知</h3>
        </div>
        <textarea
          value={compliance.terms || ''}
          onChange={(e) => updateStateByPath('compliance.terms', e.target.value)}
          onFocus={() => handleFocus('compliance.terms')}
          onBlur={handleBlur}
          className={`${inputClass} h-40 font-normal leading-relaxed`}
          placeholder="交易幣別、訂購付款、發票、智慧財產權等條款…"
        />
      </div>

      {/* 退換貨/退費政策 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <RotateCcw size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">退換貨與退費政策</h3>
        </div>
        <textarea
          value={compliance.refundPolicy || ''}
          onChange={(e) => updateStateByPath('compliance.refundPolicy', e.target.value)}
          onFocus={() => handleFocus('compliance.refundPolicy')}
          onBlur={handleBlur}
          className={`${inputClass} h-40 font-normal leading-relaxed`}
          placeholder="七日鑑賞期、數位內容例外、退費方式與工作天數…"
        />
        <p className="text-[10px] text-slate-400 leading-relaxed">
          提醒：依《通訊交易解除權合理例外情事適用準則》，線上課程／數位內容若要排除七日鑑賞期，
          須於消費者購買前明確告知並取得同意，建議保留上方相關條文。
        </p>
      </div>
    </div>
  );
}
