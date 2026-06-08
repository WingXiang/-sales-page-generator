import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ShieldCheck, Store, FileText, RotateCcw, Lock, Info, AlertTriangle, CheckCircle2, Scale, Copyright, Pencil, Eye } from 'lucide-react';

// 與 useStore 預設一致的範例值，用來判斷使用者是否已更換
const EXAMPLE = {
  brandName: '好學品牌',
  companyName: '好學數位顧問有限公司',
  taxId: '00000000',
  phone: '02-2700-0000',
  email: 'support@example.com',
  lineId: '@example',
  jurisdiction: '臺北市',
};

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function ComplianceTab() {
  const { state, updateStateByPath } = useStore();
  const compliance = state.compliance || {};
  const merchant = compliance.merchant || {};
  const [editMode, setEditMode] = useState({});

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

  // 變數對應表（套用後預覽用的即時替換）
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

  // 版權聲明直接由商家欄位即時組出（與頁面渲染邏輯一致，保證同步）
  const mark = (val) => val
    ? `<mark style="background:#fde68a;color:#1e293b;border-radius:3px;padding:0 3px;font-weight:600;">${escapeHtml(val)}</mark>`
    : `<mark style="background:#fecaca;color:#991b1b;border-radius:3px;padding:0 3px;">（未填）</mark>`;
  const copyrightHtml = `COPYRIGHT© ${mark(merchant.brandName || state.brandInfo?.brandName)} All rights reserved ${mark(merchant.companyName)}．統一編號: ${mark(merchant.taxId)}`;

  // 只保留「修改後真的會影響輸出」的欄位
  const merchantFields = [
    { key: 'brandName', label: '品牌名稱', placeholder: '例如：好學品牌', hint: '帶入版權與隱私權政策' },
    { key: 'companyName', label: '公司全名', placeholder: '例如：好學數位有限公司', hint: '帶入版權聲明' },
    { key: 'taxId', label: '統一編號', placeholder: '8 碼數字', hint: '帶入版權聲明' },
    { key: 'email', label: '客服信箱', placeholder: 'support@example.com', hint: '帶入全部政策與頁尾' },
    { key: 'phone', label: '客服電話', placeholder: '例如：02-1234-5678', hint: '顯示於頁尾' },
    { key: 'lineId', label: '官方 LINE', placeholder: '例如：@yourbrand', hint: '帶入退費政策' },
    { key: 'jurisdiction', label: '管轄／仲裁地', placeholder: '例如：臺北市', hint: '帶入使用者條款與退費政策' },
    { key: 'serviceHours', label: '客服時間', placeholder: '例如：週一至週五 09:00-18:00', hint: '顯示於頁尾' },
  ];

  const StatusBadge = ({ value, fkey }) => {
    const isExample = !value || value === EXAMPLE[fkey];
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
          填寫下方商家資訊後，會自動帶入頁尾與各政策內文。各政策預設顯示「套用後」的實際內容，
          <mark style={{ background: '#fde68a', padding: '0 3px', borderRadius: 3 }}>黃底</mark>處即為自動帶入的商家資料，修改商家資訊會即時更新。
        </p>
        <button onClick={scrollToFooter} className="text-[11px] font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
          ↓ 跳到右側預覽的頁尾
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
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <label className={labelClass}>{f.label}</label>
                <StatusBadge value={merchant[f.key]} fkey={f.key} />
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
              <p className="text-[10px] text-blue-500 mt-1 font-bold">↳ {f.hint}</p>
            </div>
          ))}
        </div>
        <div className="text-sm text-amber-800 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 leading-relaxed font-medium">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p>標示 <span className="font-black">「範例·待更換」</span> 的欄位目前為虛擬示範資料；改成你的真實內容後會變為 <span className="font-black text-emerald-700">「已修改」</span>。統一編號、客服電話等為金流審核必填項，送審前請務必全部改成真實資料。</p>
        </div>
      </div>

      {/* 版權聲明（不需填寫，依商家資訊自動產生） */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Copyright size={16} className="text-primary" />
          <h3 className="font-black text-sm text-slate-800">版權聲明</h3>
          <span className="text-[10px] text-slate-400 font-bold">依商家資訊自動產生・顯示於頁尾底部</span>
        </div>
        <div
          className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: copyrightHtml }}
        />
      </div>

      {/* 各政策：預設顯示套用後內容，可切換編輯原文 */}
      {policyDocs.map((doc) => {
        const isEdit = !!editMode[doc.key];
        return (
          <div key={doc.key} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {doc.icon}
                <h3 className="font-black text-sm text-slate-800">{doc.title}</h3>
              </div>
              <button
                onClick={() => setEditMode((p) => ({ ...p, [doc.key]: !p[doc.key] }))}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
              >
                {isEdit ? <><Eye size={13} /> 檢視套用後</> : <><Pencil size={13} /> 編輯原文</>}
              </button>
            </div>

            {isEdit ? (
              <>
                <textarea
                  value={compliance[doc.key] || ''}
                  onChange={(e) => updateStateByPath(`compliance.${doc.key}`, e.target.value)}
                  className={`${inputClass} ${doc.h} font-normal leading-relaxed`}
                  placeholder={doc.placeholder}
                />
                <p className="text-[10px] text-slate-400">編輯時請保留 <code className="bg-slate-100 px-1 rounded">{'{{變數}}'}</code>，它們會在「檢視套用後」與實際頁面自動帶入商家資料。</p>
              </>
            ) : (
              <div
                className={`${doc.h} overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] leading-relaxed text-slate-700 whitespace-pre-line`}
                dangerouslySetInnerHTML={{ __html: applied(compliance[doc.key]) }}
              />
            )}
          </div>
        );
      })}

      <p className="text-xs text-slate-500 leading-relaxed px-1 flex items-start gap-1.5">
        <Info size={13} className="shrink-0 mt-0.5" />
        提醒：依《通訊交易解除權合理例外情事適用準則》，線上課程／數位內容若要排除七日鑑賞期，須於消費者購買前明確告知並取得同意，請保留退費政策內相關條文。各政策內容請依您實際營運情況調整。
      </p>
    </div>
  );
}
