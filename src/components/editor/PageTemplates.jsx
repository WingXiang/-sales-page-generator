import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { PAGE_TEMPLATES } from '../../store/pageTemplates';
import { Check } from 'lucide-react';

export default function PageTemplates() {
  const { loadState, setActiveModal } = useStore();

  const apply = (tpl) => {
    const ok = window.confirm(`套用「${tpl.name}」範本會覆蓋目前頁面的所有內容（圖片、文字、配色等），確定要套用嗎？\n\n（建議先到「版本紀錄」儲存目前版本再套用。）`);
    if (!ok) return;
    loadState(JSON.parse(JSON.stringify(tpl.state)));
    setActiveModal(null);
    toast.success(`已套用「${tpl.name}」範本，可直接編輯內容！`);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500 leading-relaxed">
        選擇一套完整的銷售頁範本快速開始，套用後所有文字、圖片、配色都可以再自行修改。
        圖片預設使用 Pexels 圖庫，建議換成你自己的實際照片。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PAGE_TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="flex flex-col border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-indigo-300 transition-all p-4">
            <h3 className="text-sm font-black text-slate-800">{tpl.name}</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug flex-1">{tpl.desc}</p>
            <button
              onClick={() => apply(tpl)}
              className="mt-3 w-full py-2 bg-primary hover:bg-primary/90 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Check size={14} /> 套用
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
