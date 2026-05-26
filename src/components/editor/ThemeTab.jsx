import React from 'react';
import { useStore } from '../../store/useStore';
import { Palette, Sparkles } from 'lucide-react';

export default function ThemeTab() {
  const { state, updateField } = useStore();
  const theme = state.theme || {};

  const presets = [
    {
      name: '極致科技藍',
      desc: '科技感、數位產品與商業服務',
      primaryColor: '#2563eb',
      accentColor: '#06b6d4',
      bgColor: '#f8fafc',
      textColor: '#0f172a'
    },
    {
      name: '溫暖心靈橘',
      desc: '心靈成長、療癒與溫度手作',
      primaryColor: '#b45309',
      accentColor: '#f97316',
      bgColor: '#fffbeb',
      textColor: '#451a03'
    },
    {
      name: '優雅質感紫',
      desc: '設計美學、高端精緻課程與品牌',
      primaryColor: '#6d28d9',
      accentColor: '#db2777',
      bgColor: '#faf5ff',
      textColor: '#1e1b4b'
    },
    {
      name: '森林療癒綠',
      desc: '健康保健、自然生活與永續品牌',
      primaryColor: '#0f766e',
      accentColor: '#84cc16',
      bgColor: '#f0fdf4',
      textColor: '#062f25'
    }
  ];

  const handleColorChange = (key, value) => {
    updateField('theme', key, value);
  };

  const applyPreset = (preset) => {
    updateField('theme', 'primaryColor', preset.primaryColor);
    updateField('theme', 'accentColor', preset.accentColor);
    updateField('theme', 'bgColor', preset.bgColor);
    updateField('theme', 'textColor', preset.textColor);
  };

  const renderColorField = (label, key, defaultColor, description) => {
    const value = theme[key] || defaultColor;
    const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);
    return (
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg shrink-0 overflow-hidden border border-slate-200 shadow-inner">
             <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: value }}></div>
             <input type="color" value={isValidHex ? value : '#000000'} onChange={(e) => handleColorChange(key, e.target.value)} className="absolute inset-[-10px] w-[150%] h-[150%] opacity-0 cursor-pointer z-10" />
          </div>
          <input type="text" value={value} onChange={(e) => handleColorChange(key, e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:border-indigo-500 outline-none transition-all font-semibold" placeholder="例: #2a4189 或 rgb(0,0,0)" />
        </div>
        <p className="text-[10px] text-slate-400 font-bold leading-normal">{description}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Presets */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <span className="text-indigo-600"><Sparkles size={16} /></span> 推薦配色風格集
        </h3>
        <p className="text-xs text-slate-500">點擊即可快速套用精心配製的風格色彩配置，兼顧閱讀體驗與說服質感。</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="preset-btn flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all hover:scale-[1.02] shadow-sm text-left group"
            >
              <div className="space-y-1">
                <div className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{preset.name}</div>
                <div className="text-[10px] text-slate-400 font-bold">{preset.desc}</div>
              </div>
              <div className="flex gap-1 shrink-0 ml-2">
                <span className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: preset.primaryColor }} title="主色"></span>
                <span className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: preset.accentColor }} title="輔助色"></span>
                <span className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: preset.bgColor }} title="背景色"></span>
                <span className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: preset.textColor }} title="文字色"></span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Colors */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <span className="text-indigo-600"><Palette size={16} /></span> 全站色彩配置
        </h3>
        <p className="text-xs text-slate-500">點擊色塊即可開啟調色盤，系統會即時更新右側預覽畫面。支援手動輸入 HEX 或 RGB 色碼。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2">
          {renderColorField('主色調 (Primary)', 'primaryColor', '#2a4189', '影響範圍：全站大標題字體顏色、特點清單的勾選圖示、卡片與單元標題色彩。')}
          {renderColorField('輔助色 (Accent)', 'accentColor', '#fbbf24', '影響範圍：部分承諾區塊的勾選圖示、強調節點、方案搶眼標籤。')}
          {renderColorField('背景色 (Background)', 'bgColor', '#f8fafc', '影響範圍：整個銷售網頁的最底層背景色彩。')}
          {renderColorField('文字色 (Text)', 'textColor', '#0f172a', '影響範圍：全站段落文字、清單描述、卡片內文等主要閱讀文字。')}
        </div>
      </div>
    </div>
  );
}
