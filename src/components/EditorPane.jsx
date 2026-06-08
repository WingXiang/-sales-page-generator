import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  Settings,
  Layers,
  LayoutTemplate,
  Palette,
  CloudUpload,
  History,
  ShieldCheck,
  Images,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

import CoreTab from './editor/CoreTab';
import AdvancedTab from './editor/AdvancedTab';
import LayoutTab from './editor/LayoutTab';
import ThemeTab from './editor/ThemeTab';
import HistoryTab from './editor/HistoryTab';
import ComplianceTab from './editor/ComplianceTab';
import ImageBlocksTab from './editor/ImageBlocksTab';
import DeployTab from './DeployTab';

export default function EditorPane() {
  const { activeTab, setActiveTab, editorMode, setEditorMode } = useStore();

  // simple: 簡易模式也顯示；其餘為進階模式才顯示
  const tabs = [
    { id: 'core', label: '核心版塊', icon: <Settings size={14} />, simple: true },
    { id: 'advanced', label: '加分區塊', icon: <Layers size={14} />, simple: false },
    { id: 'imageBlocks', label: '圖文版塊', icon: <Images size={14} />, simple: false },
    { id: 'layout', label: '佈局排序', icon: <LayoutTemplate size={14} />, simple: false },
    { id: 'theme', label: '自訂配色', icon: <Palette size={14} />, simple: true },
    { id: 'compliance', label: '金流申請用', icon: <ShieldCheck size={14} />, simple: true },
    { id: 'history', label: '版本紀錄', icon: <History size={14} />, simple: false },
  ];

  const visibleTabs = editorMode === 'simple' ? tabs.filter(t => t.simple) : tabs;

  // 切到簡易模式時，若目前停在被隱藏的分頁，導回核心版塊（避免空白面板）
  useEffect(() => {
    const visibleIds = visibleTabs.map(t => t.id);
    if (activeTab !== 'deploy' && !visibleIds.includes(activeTab)) {
      setActiveTab('core');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  return (
    <div className="flex flex-col h-full bg-white relative z-10 w-full overflow-hidden border-r border-slate-200">

      {/* 模式切換 */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 bg-white shrink-0">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
          <SlidersHorizontal size={12} /> 編輯模式
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setEditorMode('simple')}
            className={`px-3 py-1 rounded-md text-xs font-black transition-all ${editorMode === 'simple' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            簡易
          </button>
          <button
            onClick={() => setEditorMode('advanced')}
            className={`px-3 py-1 rounded-md text-xs font-black transition-all flex items-center gap-1 ${editorMode === 'advanced' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles size={11} /> 進階
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto custom-scrollbar shrink-0">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-bar-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-black transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
        <button
          onClick={() => setActiveTab('deploy')}
          className={`tab-bar-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-black transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'deploy'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
              : 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <CloudUpload size={14} /> 公開部署
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50 relative">
        {activeTab === 'core' && <CoreTab />}
        {activeTab === 'advanced' && <AdvancedTab />}
        {activeTab === 'imageBlocks' && <ImageBlocksTab />}
        {activeTab === 'layout' && <LayoutTab />}
        {activeTab === 'theme' && <ThemeTab />}
        {activeTab === 'compliance' && <ComplianceTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'deploy' && <DeployTab />}
      </div>
    </div>
  );
}
