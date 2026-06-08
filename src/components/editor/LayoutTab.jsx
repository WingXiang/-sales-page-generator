import React from 'react';
import { useStore } from '../../store/useStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const BLOCK_METADATA = {
    hero: { label: '主視覺與承諾', desc: '大圖與核心賣點' },
    cta1: { label: '行動呼籲 1 (按鈕)', desc: '首頁主視覺下方按鈕' },
    painPoints: { label: '痛點共鳴', desc: '點出客戶困擾' },
    empathy: { label: '感同身受', desc: '理解與情緒共鳴' },
    transition: { label: '觀念翻轉', desc: '舊方法 vs 新觀念' },
    promise: { label: '核心承諾', desc: '轉變與保證' },
    services: { label: '優勢好處', desc: '產品核心特色' },
    cta2: { label: '行動呼籲 2 (按鈕)', desc: '優勢特色下方按鈕' },
    curriculum: { label: '單元大綱', desc: '課程或服務細節' },
    courseInfo: { label: '課程資訊', desc: '時數、堂數、履約期間、收看方式' },
    about: { label: '品牌故事', desc: '創辦人與理念' },
    authority: { label: '專家權威', desc: '數據與信任感' },
    qualification: { label: '客群篩選', desc: '適合與不適合' },
    testimonials: { label: '學員見證', desc: '口碑與評價' },
    pricingPlans: { label: '定價方案', desc: '價格與行動呼籲' },
    faq: { label: '常見問答', desc: '消除最後疑慮' },
    close: { label: '感性結尾', desc: '最後促單' },
    cta3: { label: '行動呼籲 3 (按鈕)', desc: '促單結尾下方按鈕' },
    complianceFooter: { label: '金流申請用頁尾', desc: '聯絡資訊、政策連結與版權' }
};

export default function LayoutTab() {
  const { state, updateStateByPath } = useStore();
  const activeLayout = state.layout || [];

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(activeLayout);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateStateByPath('layout', items);
  };

  const inactiveLayout = Object.keys(BLOCK_METADATA).filter(k => !activeLayout.includes(k));

  const toggleBlock = (blockId, hide) => {
    if (hide) {
      updateStateByPath('layout', activeLayout.filter(id => id !== blockId));
    } else {
      updateStateByPath('layout', [...activeLayout, blockId]);
    }
  };

  const handleBlockClick = (blockId) => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'SCROLL_TO', sectionId: `section-${blockId}` }, '*');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-800">在前台顯示的區塊 (拖曳排序 / 點擊跳轉)</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="active-blocks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {activeLayout.map((blockId, index) => (
                  <Draggable key={blockId} draggableId={blockId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleBlockClick(blockId)}
                        className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 cursor-pointer transition-all hover:bg-slate-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 cursor-grab">☰</span>
                          <div>
                            <div className="text-xs font-black text-slate-700">{BLOCK_METADATA[blockId]?.label || blockId}</div>
                            <div className="text-[10px] text-slate-400">{BLOCK_METADATA[blockId]?.desc}</div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBlock(blockId, true);
                          }}
                          className="text-red-500 text-xs px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg font-bold border border-red-100 transition-colors"
                        >
                          隱藏
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-black text-slate-600">已隱藏的區塊</h3>
        <div className="space-y-2">
          {inactiveLayout.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">所有區塊皆已顯示</p>
          ) : (
            inactiveLayout.map(blockId => (
              <div key={blockId} className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-500">{BLOCK_METADATA[blockId]?.label}</div>
                  <div className="text-[10px] text-slate-400">{BLOCK_METADATA[blockId]?.desc}</div>
                </div>
                <button
                  onClick={() => toggleBlock(blockId, false)}
                  className="text-indigo-600 text-xs px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold border border-indigo-100 transition-colors"
                >
                  啟用
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
