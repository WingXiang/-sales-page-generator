import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Settings, 
  Layers, 
  LayoutTemplate, 
  Palette, 
  Download,
  CloudUpload,
  History
} from 'lucide-react';

import CoreTab from './editor/CoreTab';
import AdvancedTab from './editor/AdvancedTab';
import LayoutTab from './editor/LayoutTab';
import ThemeTab from './editor/ThemeTab';
import HistoryTab from './editor/HistoryTab';
import DeployTab from './DeployTab';
import { exportHTML } from '../utils/exportHtml';

export default function EditorPane() {
  const { activeTab, setActiveTab, state } = useStore();

  const tabs = [
    { id: 'core', label: '核心版塊', icon: <Settings size={14} /> },
    { id: 'advanced', label: '加分區塊', icon: <Layers size={14} /> },
    { id: 'layout', label: '佈局排序', icon: <LayoutTemplate size={14} /> },
    { id: 'theme', label: '自訂配色', icon: <Palette size={14} /> },
    { id: 'history', label: '版本紀錄', icon: <History size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative z-10 w-full overflow-hidden border-r border-slate-200">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
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
        {activeTab === 'layout' && <LayoutTab />}
        {activeTab === 'theme' && <ThemeTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'deploy' && <DeployTab />}
      </div>
    </div>
  );
}
