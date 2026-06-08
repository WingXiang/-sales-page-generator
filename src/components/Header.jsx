import { Edit, Eye, History, CloudUpload, LayoutGrid } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header({ currentUser, onLogout }) {
  const { setActiveModal } = useStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0">
          <img src="https://i.ibb.co/qYHbR1VS/LOG.png" alt="Logo" className="h-7 w-auto object-contain" />
        </span>
        <div>
          <span className="font-black text-base md:text-lg tracking-wider text-slate-800">銷售頁產生器</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('templates')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-[0.98] flex items-center gap-1.5"
          >
            <LayoutGrid size={14} /> 範本
          </button>
          <button
            onClick={() => setActiveModal('history')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-[0.98] flex items-center gap-1.5"
          >
            <History size={14} /> 版本紀錄
          </button>
          <button
            onClick={() => setActiveModal('deploy')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-[0.98] flex items-center gap-1.5"
          >
            <CloudUpload size={14} /> 公開部署
          </button>
        </div>

        {currentUser && (
          <div className="flex items-center gap-3 border-r border-slate-200 pr-3">
            <span className="text-xs font-bold text-slate-600 hidden md:inline">
              登入者：<span className="text-primary font-black">{currentUser.name}</span> ({currentUser.email})
            </span>
            <span className="text-xs font-bold text-slate-600 inline md:hidden">
              👤 <span className="text-primary font-black">{currentUser.name}</span>
            </span>
            <button 
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              登出
            </button>
          </div>
        )}

        <div className="flex lg:hidden items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
          <button className="px-3 py-1.5 rounded-lg bg-primary text-white transition-all flex items-center gap-1">
            <Edit size={14} /> 編輯
          </button>
          <button className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1">
            <Eye size={14} /> 預覽
          </button>
        </div>
      </div>
    </header>
  );
}
