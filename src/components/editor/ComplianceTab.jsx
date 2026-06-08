import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ShieldCheck, Store, FileText, RotateCcw, Lock, Info, AlertTriangle, CheckCircle2, Scale, Copyright, Eye, EyeOff } from 'lucide-react';

// 與 useStore 預設一致的範例值，用來判斷使用者是否已更換
const EXAMPLE = {
  brandName: '好學品牌',
  companyName: '好學數位顧問有限公司',
  taxId: '00000000',
  responsiblePerson: '王小明',
  phone: '02-2700-0000',
  email: 'support@example.com',
  lineId: '@example',
  address: '台北市大安區範例路 1 號 5 樓',
  jurisdiction: '臺北市',
};

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function ComplianceTab() {
  const { state, updateStateByPath } = useStore();
  const compliance = state.compliance || {};
  const merchant = compliance.merchant || {};
  const [openPreview, setOpenPreview] = useState({});

  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs placeholder-slate-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold shadow-sm";
  const labelClass = "text-[11px] font-extrabold text-slate-500 uppercase tracking-wider";

  const handleFocus = (path) => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path }, '*');
  };
  const handleBlur = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path: null }, '*');
  };
  const scrollToFooter = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'SCROLL_TO', sectionId: 'section-complianceFooter' }, '*');
  };

  // 變數對應表（用於套用後預覽的即時替換）
  const tokenMap = {
    '{{品牌名}}': merchant.brandName || state.brandInfo?.brandName || '',
    '{{公司名}}': merchant.companyName || '',
    '{{統一編號}}': merchant.taxId || '',
    '{{客服信箱}}': merchant.email || '',
    '{{Line}}': merchant.lineId || '',
    '{{管轄地}}': merchant.jurisdiction || '',
  };
  const applied = (text) => {
    let html = escapeHtml(text || '');
    Object.entries(tokenMap).forEach(([tok, val]) => {
      const rep = val
        ? `<mark style="background:#fde68a;color:#1e293b;border-radius:3px;padding:0 3px;font-weight:600;">${escapeHtml(val)}</mark>`
        : `<mark style="background:#fecaca;color:#991b1b;border-radius:3px;padding:0 3px;">（未填）</mark>`;
      html = html.split(tok).join(rep);
    });
    return html;
  };

  // mustEdit: 申請金流前必須改成真實資料；token: 對應帶入政策的變數
  const merchantFields = [
    { key: 'brandName', label: '品牌名稱', placeholder: '例如：好學品牌', token: '{{品牌名}}' },
    { key: 'companyName', label: '公司全名', placeholder: '例如：好學數位有限公司', token: '{{公司名}}' },
    { key: 'taxId', label: '統一編號', placeholder: '8 碼數字', token: '{{統一編號}}' },
    { key: 'responsiblePerson', label: '負責人', placeholder: '例如：陳相銘', token: '' },
    { key: 'phone', label: '客服電話', placeholder: '例如：02-1234-5678', token: '' },
    { key: 'email', label: '客服信箱', placeholder: 'support@example.com', token: '{{客服信箱}}' },
    { key: 'lineId', label: '官方 LINE', placeholder: '例如：@yourbrand', token: '{{Line}}' },
    { key: 'jurisdiction', label: '管轄／仲裁地', placeholder: '例如：臺北市', token: '{{管轄地}}' },
    { key: 'address', label: '營業地址', placeholder: '例如：台北市中正區忠孝東路一段 1 號 5 樓', token: '' },
    { key: 'serviceHours', label: '客服時間', placeholder: '例如：週一至週五 09:00-18:00', token: '', optional: true },
  ];

  const StatusBadge = ({ value, key2 }) => {
    const isExample = !value || value === EXAMPLE[key2];
    return isExample ? (
      <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
        <AlertTriangle size={10} /> 範例·待更換
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-full">
        <CheckCircle2 size={10} /> 已修改
      </span>
    );
  };

  const policyDocs = [
    { key: 'terms', title: '使用者條款', icon: <FileText size={16} className="text-primary" />, h: 'h-56', placeholder: '交易幣別、帳號責任、智慧財產權、準據法與管轄…' },
    { key: 'privacyPolicy', title: '隱私權政策', icon: <Lock size={16} className="text-primary" />, h: 'h-56', placeholder: '個資定義、蒐集與使用、機密與安全、政策修訂…' },
    { key: 'refundPolicy', title: '退費／退貨政策', icon: <RotateCcw size={16} className="text-primary" />, h: 'h-72', placeholder: '線上課程、視訊諮詢、實體課程退費規則…' },
    { key: 'disclaimer', title: '免責聲明（中／英）', icon: <Scale size={16} className="text-primary" />, h: 'h-72', placeholder: '平台關係聲明、學習效果免責、English disclaimer…' },
  ];

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
        <h4 className="text-sm font-black text-blue-900 flex items-center gap-1.5"><Info size={15} /> 變數自動帶入</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          政策內文中的 <code className="bg-white px-1 rounded border border-blue-200 font-bold">{'{{品牌名}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold mx-0.5">{'{{公司名}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold">{'{{統一編號}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold mx-0.5">{'{{客服信箱}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold">{'{{Line}}'}</code>、
          <code className="bg-white px-1 rounded border border-blue-200 font-bold mx-0.5">{'{{管轄地}}'}</code>
          會自動以下方商家欄位內容替換。textarea 保留原始 <code className="bg-white px-1 rounded border border-blue-200 font-bold">{'{{變數}}'}</code> 方便修改，
          可點各政策的「<span className="font-bold">預覽套用後內容</span>」查看實際替換結果（替換處以<mark style={{ background: '#fde68a', padding: '0 3px', borderRadius: 3 }}>黃底</mark>標示）。
        </p>
      </div>

      {/* 商家資訊 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Store size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">商家資訊</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {merchantFields.map((f) => (
            <div key={f.key} className={f.key === 'address' ? 'sm:col-span-2' : ''}>
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <label className={labelClass}>{f.label}</label>
                {!f.optional && <StatusBadge value={merchant[f.key]} key2={f.key} />}
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
              {f.token && (
                <p className="text-[10px] text-blue-500 mt-1 font-bold">↳ 自動帶入政策變數 <code className="bg-blue-50 px-1 rounded">{f.token}</code></p>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-amber-800 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 leading-relaxed font-medium">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          標示 <span className="font-black">「範例·待更換」</span> 的欄位目前為虛擬示範資料；改成你的真實內容後會變為 <span className="font-black text-emerald-700">「已修改」</span>。統一編號、客服電話、營業地址等為金流審核必填項，送審前請務必全部改成真實資料。
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
          className={inputClass}
          placeholder="COPYRIGHT© {{品牌名}} All rights reserved {{公司名}}．統一編號: {{統一編號}}"
        />
        <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <span className="font-bold text-slate-400">套用後：</span>
          <span dangerouslySetInnerHTML={{ __html: applied(compliance.copyright) }} />
        </div>
      </div>

      {/* 各政策全文 */}
      {policyDocs.map((doc) => {
        const isOpen = !!openPreview[doc.key];
        return (
          <div key={doc.key} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {doc.icon}
                <h3 className="font-black text-sm text-slate-800">{doc.title}</h3>
              </div>
              <button
                onClick={() => setOpenPreview((p) => ({ ...p, [doc.key]: !p[doc.key] }))}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                {isOpen ? <><EyeOff size={13} /> 收合預覽</> : <><Eye size={13} /> 預覽套用後內容</>}
              </button>
            </div>
            <textarea
              value={compliance[doc.key] || ''}
              onChange={(e) => updateStateByPath(`compliance.${doc.key}`, e.target.value)}
              className={`${inputClass} ${doc.h} font-normal leading-relaxed`}
              placeholder={doc.placeholder}
            />
            {isOpen && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-72 overflow-y-auto">
                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">套用後預覽（黃底＝已帶入變數）</p>
                <div
                  className="text-[11px] leading-relaxed text-slate-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: applied(compliance[doc.key]) }}
                />
              </div>
            )}
          </div>
        );
      })}

      <p className="text-xs text-slate-500 leading-relaxed px-1">
        提醒：依《通訊交易解除權合理例外情事適用準則》，線上課程／數位內容若要排除七日鑑賞期，
        須於消費者購買前明確告知並取得同意，請保留退費政策內相關條文。各政策內容請依您實際營運情況調整。
      </p>
    </div>
  );
}
