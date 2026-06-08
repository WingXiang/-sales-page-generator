import React from 'react';
import { useStore } from '../../store/useStore';
import { ShieldCheck, Store, FileText, RotateCcw, Lock, Info } from 'lucide-react';

export default function ComplianceTab() {
  const { state, updateStateByPath } = useStore();
  const compliance = state.compliance || {};
  const merchant = compliance.merchant || {};

  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs placeholder-slate-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold shadow-sm";
  const labelClass = "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider";

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

  const merchantFields = [
    { key: 'companyName', label: '商號／公司名稱', placeholder: '例如：好學數位有限公司' },
    { key: 'taxId', label: '統一編號', placeholder: '8 碼數字（公司戶必填）' },
    { key: 'responsiblePerson', label: '負責人', placeholder: '例如：陳相銘' },
    { key: 'phone', label: '客服電話', placeholder: '例如：02-1234-5678' },
    { key: 'email', label: '客服信箱', placeholder: 'support@example.com' },
    { key: 'serviceHours', label: '客服時間', placeholder: '例如：週一至週五 09:00-18:00' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 md:p-5 rounded-2xl border border-emerald-100 space-y-2">
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

      {/* 商家資訊 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Store size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">商家資訊</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {merchantFields.map((f) => (
            <div key={f.key}>
              <label className={labelClass}>{f.label}</label>
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
          <label className={labelClass}>營業地址</label>
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
        <p className="text-[10px] text-amber-600 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-lg p-2">
          <Info size={12} className="shrink-0 mt-0.5" />
          統一編號、客服電話與營業地址為金流審核常見必填項，請務必填寫真實資料。
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
