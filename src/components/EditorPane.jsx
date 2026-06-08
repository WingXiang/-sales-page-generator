import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings, Layers, LayoutTemplate, ShieldCheck, Images } from 'lucide-react';

import CoreTab from './editor/CoreTab';
import AdvancedTab from './editor/AdvancedTab';
import LayoutTab from './editor/LayoutTab';
import ComplianceTab from './editor/ComplianceTab';
import ImageBlocksTab from './editor/ImageBlocksTab';

const TABS = [
  {
    id: 'core', label: '核心版塊', icon: <Settings size={14} />,
    tip: '設定品牌、主視覺、痛點、優勢、定價等最關鍵的內容。這是訪客最先看到、決定要不要繼續看下去的核心，直接影響轉換率。'
  },
  {
    id: 'advanced', label: '加分區塊', icon: <Layers size={14} />,
    tip: '加入感同身受、學員見證、常見問答、承諾保證等說服元素，強化信任、消除購買疑慮，進一步提高成交率。'
  },
  {
    id: 'imageBlocks', label: '圖文版塊', icon: <Images size={14} />,
    tip: '插入圖片或「圖＋文」並排區塊，讓銷售頁更視覺化、好閱讀，延長停留時間並提升說服力。'
  },
  {
    id: 'layout', label: '佈局排序', icon: <LayoutTemplate size={14} />,
    tip: '拖曳調整各區塊在頁面的順序、顯示或隱藏，打造最順暢的閱讀與說服動線。'
  },
  {
    id: 'compliance', label: '金流申請用', icon: <ShieldCheck size={14} />,
    tip: '填寫商家資訊與隱私權、退費等政策，讓成品符合金流（綠界／藍新）審核標準，可直接上線收款。'
  },
];

export default function EditorPane() {
  const { activeTab, setActiveTab } = useStore();
  const [tip, setTip] = useState(null); // { text, x, y }

  return (
    <div className="flex flex-col h-full bg-white relative z-10 w-full overflow-hidden border-r border-slate-200">

      {/* Tabs（5 個功能） */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto custom-scrollbar shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={(e) => setTip({ text: tab.tip, label: tab.label, x: e.clientX, y: e.clientY })}
            onMouseMove={(e) => setTip(t => t ? { ...t, x: e.clientX, y: e.clientY } : t)}
            onMouseLeave={() => setTip(null)}
            className={`tab-bar-btn flex-1 py-3 px-3 flex items-center justify-center gap-1.5 text-xs font-black transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50 relative">
        {activeTab === 'core' && <CoreTab />}
        {activeTab === 'advanced' && <AdvancedTab />}
        {activeTab === 'imageBlocks' && <ImageBlocksTab />}
        {activeTab === 'layout' && <LayoutTab />}
        {activeTab === 'compliance' && <ComplianceTab />}
        {/* 其餘分頁（核心未涵蓋者）導回核心，避免外部殘留狀態造成空白 */}
        {!['core', 'advanced', 'imageBlocks', 'layout', 'compliance'].includes(activeTab) && <CoreTab />}
      </div>

      {/* 滑鼠旁浮動說明 */}
      {tip && (
        <div
          className="fixed z-[60] pointer-events-none max-w-[260px] bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl px-3 py-2"
          style={{ left: Math.min(tip.x + 16, (typeof window !== 'undefined' ? window.innerWidth : 9999) - 280), top: tip.y + 18 }}
        >
          <div className="font-black text-[11px] mb-0.5 text-amber-300">{tip.label}</div>
          {tip.text}
        </div>
      )}
    </div>
  );
}
