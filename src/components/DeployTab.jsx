import React from 'react';
import { Info, ExternalLink, Download } from 'lucide-react';
import { exportHTML } from '../utils/exportHtml';
import { useStore } from '../store/useStore';

export default function DeployTab() {
  const { state } = useStore();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm text-slate-800 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base md:text-lg font-black tracking-wider text-slate-900 flex items-center gap-2">
            <Info className="text-indigo-600 animate-bounce" size={20} /> Google Sites 免費發布教學
          </h3>
        </div>
        
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/pcmon0M8FxE"
            title="Google Sites 免費發布教學"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <button onClick={() => exportHTML(state)} className="py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-center shadow-md transition-all text-sm flex items-center justify-center gap-2">
            <Download size={18} /> ① 立即匯出 HTML 並下載
          </button>
          <a href="https://sites.google.com/new" target="_blank" rel="noreferrer" className="py-3.5 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-black rounded-xl text-center shadow-sm transition-all text-sm flex items-center justify-center gap-2">
            <ExternalLink size={18} /> ② 前往 Google Sites 🔗
          </a>
        </div>
      </div>
    </div>
  );
}
