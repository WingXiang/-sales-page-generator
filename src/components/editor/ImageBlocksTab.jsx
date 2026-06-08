import { useStore, IMAGE_BLOCK_TEMPLATES } from '../../store/useStore';
import ImageUploadField from './ImageUploadField';
import { Images, Plus, Trash2, LayoutTemplate, Pencil, ArrowLeftRight, Info, Image as ImageIcon, Columns2 } from 'lucide-react';

const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs placeholder-slate-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold shadow-sm";
const labelClass = "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider";

const TEMPLATE_ICON = {
  fullImage: <ImageIcon size={22} />,
  imageLeft: <Columns2 size={22} />,
  imageRight: <Columns2 size={22} className="-scale-x-100" />,
};

export default function ImageBlocksTab() {
  const { state, createImageBlock, removeImageBlock, updateStateByPath } = useStore();
  const imageBlocks = state.imageBlocks || {};
  const layout = state.layout || [];

  // 依 layout 順序列出已建立的圖文區塊
  const blockIds = layout
    .filter((k) => typeof k === 'string' && k.startsWith('imageBlock:'))
    .map((k) => k.slice('imageBlock:'.length))
    .filter((id) => imageBlocks[id]);

  const handleFocus = (path) => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path }, '*');
  };
  const handleBlur = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path: null }, '*');
  };
  const scrollTo = (id) => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'SCROLL_TO', sectionId: `section-imageBlock:${id}` }, '*');
  };

  const set = (id, field, value) => updateStateByPath(`imageBlocks.${id}.${field}`, value);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ① 選擇範本（套版） */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-5 rounded-2xl border border-indigo-100 space-y-3">
        <h3 className="text-sm font-black text-indigo-900 flex items-center gap-2">
          <LayoutTemplate size={16} /> ① 選擇範本快速新增
        </h3>
        <p className="text-xs text-indigo-700 leading-relaxed">
          點選範本即可在頁面新增一個圖文區塊（預設加在頁尾前）。新增後可在下方「② 我的圖文區塊」編輯內容，
          並到「佈局排序」分頁拖曳到任意位置。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {IMAGE_BLOCK_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => createImageBlock(tpl)}
              className="group flex flex-col items-center text-center gap-2 p-4 bg-white border-2 border-indigo-100 hover:border-indigo-400 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-indigo-500 group-hover:text-indigo-700 transition-colors">{TEMPLATE_ICON[tpl.id]}</div>
              <div className="text-xs font-black text-slate-700">{tpl.name}</div>
              <div className="text-[10px] text-slate-400 leading-snug">{tpl.desc}</div>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-black text-indigo-600"><Plus size={11} /> 套用</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-amber-600 flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-lg p-2">
          <Info size={12} className="shrink-0 mt-0.5" />
          圖片會壓縮後內嵌進頁面，圖片越多匯出的 HTML 檔案越大，建議單張 3MB 以內。
        </p>
      </div>

      {/* ② 我的圖文區塊（自行編輯） */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <Pencil size={15} /> ② 我的圖文區塊（{blockIds.length}）
        </h3>

        {blockIds.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-2">
            <Images size={28} className="text-slate-300" />
            尚未新增圖文區塊，請先從上方選擇範本套用。
          </div>
        ) : (
          blockIds.map((id, idx) => {
            const blk = imageBlocks[id];
            const isImageText = blk.type === 'imageText';
            return (
              <div key={id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <button onClick={() => scrollTo(id)} className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-primary">
                    <Images size={15} className="text-primary" /> 圖文區塊 #{idx + 1}
                    <span className="text-[10px] font-bold text-slate-400">{isImageText ? '圖文左右' : '全寬主圖'}</span>
                  </button>
                  <button
                    onClick={() => removeImageBlock(id)}
                    className="text-red-500 text-xs px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg font-bold border border-red-100 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={13} /> 刪除
                  </button>
                </div>

                {/* 版型切換 */}
                <div>
                  <label className={labelClass}>版型</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => set(id, 'type', 'image')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${!isImageText ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                    >全寬主圖</button>
                    <button
                      onClick={() => set(id, 'type', 'imageText')}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${isImageText ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                    >圖文左右</button>
                  </div>
                </div>

                <ImageUploadField label="區塊圖片" value={blk.image || ''} onChange={(val) => set(id, 'image', val)} />

                {isImageText ? (
                  <>
                    <div>
                      <label className={labelClass}>圖片位置</label>
                      <button
                        onClick={() => set(id, 'imagePosition', blk.imagePosition === 'right' ? 'left' : 'right')}
                        className="w-full py-2 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-2 transition-colors"
                      >
                        <ArrowLeftRight size={14} /> {blk.imagePosition === 'right' ? '圖片在右、文字在左' : '圖片在左、文字在右'}（點擊切換）
                      </button>
                    </div>
                    <div>
                      <label className={labelClass}>標題</label>
                      <input type="text" value={blk.heading || ''} onChange={(e) => set(id, 'heading', e.target.value)} onFocus={() => handleFocus(`imageBlocks.${id}.heading`)} onBlur={handleBlur} className={inputClass} placeholder="輸入標題" />
                    </div>
                    <div>
                      <label className={labelClass}>內文（支援換行）</label>
                      <textarea value={blk.text || ''} onChange={(e) => set(id, 'text', e.target.value)} onFocus={() => handleFocus(`imageBlocks.${id}.text`)} onBlur={handleBlur} className={`${inputClass} h-24`} placeholder="輸入內文說明" />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className={labelClass}>圖片說明（可留空）</label>
                    <input type="text" value={blk.caption || ''} onChange={(e) => set(id, 'caption', e.target.value)} onFocus={() => handleFocus(`imageBlocks.${id}.caption`)} onBlur={handleBlur} className={inputClass} placeholder="圖片下方的說明文字" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
