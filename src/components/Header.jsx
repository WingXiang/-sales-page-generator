import React from 'react';
import { Sparkles, Edit, Eye, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateInnerHTMLContent } from '../utils/templateGenerator';

export default function Header() {
  const { state, deviceMode } = useStore();

  const handleExport = () => {
      const htmlContent = generateInnerHTMLContent(state, deviceMode);
      const fullHtml = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.meta?.courseName || '銷售頁'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --bg-color: ${state.theme?.bgColor || '#ffffff'};
            --text-color: ${state.theme?.textColor || '#000000'};
            --primary-color: ${state.theme?.primaryColor || '#2563eb'};
            --accent-color: ${state.theme?.accentColor || '#f97316'};
        }
        body, html { 
            background-color: var(--bg-color) !important; 
            color: var(--text-color) !important; 
            font-family: "Microsoft JhengHei", "Segoe UI", sans-serif !important; 
            word-break: break-word; 
            overflow-x: hidden;
            margin: 0;
            padding: 0;
        }
        .text-primary { color: var(--primary-color) !important; }
        .bg-primary { background-color: var(--primary-color) !important; }
        .text-accent { color: var(--accent-color) !important; }
        .bg-accent { background-color: var(--accent-color) !important; }
    </style>
</head>
<body class="antialiased min-h-screen">
    <main class="w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 space-y-32">
        ${htmlContent}
    </main>
</body>
</html>`;
      
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales-page.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-primary animate-bounce text-xl"><Sparkles size={24} /></span>
        <div>
          <span className="font-black text-base md:text-lg tracking-wider text-slate-800">銷售頁產生器 PRO</span>
          <span className="ml-2 bg-indigo-50 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 hidden sm:inline-block">
            AI 旗艦智慧版
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
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
