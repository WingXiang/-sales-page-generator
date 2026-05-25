import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Building, Image as ImageIcon, Frown, Cuboid, Tags, Plus, Trash2, GripVertical, MousePointer } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AiGenerator from './AiGenerator';
import ImageUploadField from './ImageUploadField';

const coreMenuItems = [
  { id: 'brand', label: '1. 品牌故事與聯絡', icon: <Building size={20} /> },
  { id: 'hero', label: '2. 最上方招牌大圖', icon: <ImageIcon size={20} /> },
  { id: 'painPoints', label: '3. 戳中客人痛點', icon: <Frown size={20} /> },
  { id: 'services', label: '4. 產品三大優勢', icon: <Cuboid size={20} /> },
  { id: 'pricingPlans', label: '5. 誘想定價方案', icon: <Tags size={20} /> },
  { id: 'ctas', label: '6. 行動呼籲按鈕設定', icon: <MousePointer size={20} /> }
];

export default function CoreTab() {
  const { state, updateField, updateMeta, updateStateByPath } = useStore();
  const [activeExpanded, setActiveExpanded] = useState(null);

  const getLayoutId = (itemId) => {
    return itemId === 'brand' ? 'about' : itemId;
  };

  const activeCoreItems = coreMenuItems;

  const onCardDragEnd = (result) => {
    if (!result.destination) return;
    const gridItems = activeCoreItems.map(item => getLayoutId(item.id));
    const [reordered] = gridItems.splice(result.source.index, 1);
    gridItems.splice(result.destination.index, 0, reordered);
    
    const currentLayout = state.layout || [];
    const newLayout = [...currentLayout].sort((a, b) => {
      const idxA = gridItems.indexOf(a);
      const idxB = gridItems.indexOf(b);
      if (idxA === -1 || idxB === -1) return 0;
      return idxA - idxB;
    });
    updateStateByPath('layout', newLayout);
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs placeholder-slate-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold shadow-sm";
  const labelClass = "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider";



  const handleFocus = (path) => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path }, '*');
    }
  };

  const handleBlur = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'FOCUS_ELEMENT', path: null }, '*');
    }
  };

  const handleArrayChange = (path, index, field, value) => {
    updateStateByPath(`${path}.${index}.${field}`, value);
  };

  const addArrayItem = (path, newItem) => {
    const arr = path.split('.').reduce((obj, key) => obj[key], state) || [];
    updateStateByPath(path, [...arr, newItem]);
  };

  const removeArrayItem = (path, index) => {
    const arr = path.split('.').reduce((obj, key) => obj[key], state) || [];
    const newArr = [...arr];
    newArr.splice(index, 1);
    updateStateByPath(path, newArr);
  };

  const onDragEnd = (result, path) => {
    if (!result.destination) return;
    const arr = path.split('.').reduce((obj, key) => obj[key], state) || [];
    const items = Array.from(arr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateStateByPath(path, items);
  };

  const handleExpand = (id) => {
    const newId = activeExpanded === id ? null : id;
    setActiveExpanded(newId);
    if (newId) {
      const iframe = document.getElementById('preview-iframe');
      if (iframe && iframe.contentWindow) {
        const sectionId = newId === 'brand' ? 'about' : newId === 'ctas' ? 'cta1' : newId;
        iframe.contentWindow.postMessage({ type: 'SCROLL_TO', sectionId: `section-${sectionId}` }, '*');
      }
    }
  };

  const renderContent = () => {
    switch(activeExpanded) {
        case 'brand': return (
            <>
              <div>
                <label className={labelClass}>品牌名稱</label>
                <input type="text" value={state.brandInfo?.brandName || ''} onChange={(e) => updateField('brandInfo', 'brandName', e.target.value)} onFocus={() => handleFocus('brandInfo.brandName')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>關於我們 (支援換行)</label>
                <textarea value={state.brandInfo?.aboutText || ''} onChange={(e) => updateField('brandInfo', 'aboutText', e.target.value)} onFocus={() => handleFocus('brandInfo.aboutText')} onBlur={handleBlur} className={`${inputClass} h-24`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>客服 Email</label>
                  <input type="text" value={state.brandInfo?.contactEmail || ''} onChange={(e) => updateField('brandInfo', 'contactEmail', e.target.value)} onFocus={() => handleFocus('brandInfo.contactEmail')} onBlur={handleBlur} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>官方 LINE ID</label>
                  <input type="text" value={state.brandInfo?.contactLine || ''} onChange={(e) => updateField('brandInfo', 'contactLine', e.target.value)} onFocus={() => handleFocus('brandInfo.contactLine')} onBlur={handleBlur} className={inputClass} />
                </div>
              </div>
            </>
        );
        case 'hero': return (
            <>
              <div>
                <ImageUploadField 
                  label="主視覺圖片"
                  value={state.hero?.image || ''} 
                  onChange={(val) => updateField('hero', 'image', val)} 
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={labelClass}>主標題 (支援換行)</label>
                <textarea value={state.hero?.title || ''} onChange={(e) => updateField('hero', 'title', e.target.value)} onFocus={() => handleFocus('hero.title')} onBlur={handleBlur} className={`${inputClass} h-20 resize-none`} placeholder="例如：不用等命運發落！\n為您量身打造高轉換系統" />
              </div>
              <div>
                <label className={labelClass}>副標重點條列</label>
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'hero.bullets')}>
                  <Droppable droppableId="hero-bullets">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {state.hero?.bullets?.map((b, idx) => (
                          <Draggable key={`hero-bullet-${idx}`} draggableId={`hero-bullet-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="flex gap-2">
                                <span {...provided.dragHandleProps} className="mt-2 text-slate-400 cursor-grab"><GripVertical size={16}/></span>
                                <input type="text" value={b.text || ''} onChange={(e) => handleArrayChange('hero.bullets', idx, 'text', e.target.value)} onFocus={() => handleFocus(`hero.bullets.${idx}.text`)} onBlur={handleBlur} className={inputClass} />
                                <button onClick={() => removeArrayItem('hero.bullets', idx)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('hero.bullets', {text: '新增特點'})} className="mt-2 w-full py-2 border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:bg-indigo-100 transition-colors"><Plus size={14}/> 新增特點</button>
              </div>
            </>
        );
        case 'painPoints': return (
            <>
              <div>
                <label className={labelClass}>痛點區塊大標題</label>
                <input type="text" value={state.meta?.painTitleMain || ''} onChange={(e) => updateMeta('painTitleMain', e.target.value)} onFocus={() => handleFocus('meta.painTitleMain')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="space-y-4">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'painPoints')}>
                  <Droppable droppableId="painPoints">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {state.painPoints?.map((p, idx) => (
                          <Draggable key={`pain-${idx}`} draggableId={`pain-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span {...provided.dragHandleProps} className="text-slate-400 cursor-grab flex items-center gap-1 text-xs font-bold"><GripVertical size={14}/> 痛點 #{idx+1}</span>
                                  <button onClick={() => removeArrayItem('painPoints', idx)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                                <input type="text" value={p.title || ''} onChange={(e) => handleArrayChange('painPoints', idx, 'title', e.target.value)} onFocus={() => handleFocus(`painPoints.${idx}.title`)} onBlur={handleBlur} className={inputClass} placeholder="痛點標題" />
                                <textarea value={p.desc || ''} onChange={(e) => handleArrayChange('painPoints', idx, 'desc', e.target.value)} onFocus={() => handleFocus(`painPoints.${idx}.desc`)} onBlur={handleBlur} className={`${inputClass} h-16`} placeholder="痛點描述" />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('painPoints', {title: '新痛點', desc: ''})} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:text-indigo-600 transition-colors"><Plus size={14}/> 新增痛點</button>
              </div>
            </>
        );
        case 'services': return (
            <>
              <div>
                <label className={labelClass}>優勢區塊大標題</label>
                <input type="text" value={state.services?.title || ''} onChange={(e) => updateField('services', 'title', e.target.value)} onFocus={() => handleFocus('services.title')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="space-y-4">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'services.items')}>
                  <Droppable droppableId="services">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {state.services?.items?.map((s, idx) => (
                          <Draggable key={`service-${idx}`} draggableId={`service-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span {...provided.dragHandleProps} className="text-slate-400 cursor-grab flex items-center gap-1 text-xs font-bold"><GripVertical size={14}/> 優勢 #{idx+1}</span>
                                  <button onClick={() => removeArrayItem('services.items', idx)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                                <input type="text" value={s.name || ''} onChange={(e) => handleArrayChange('services.items', idx, 'name', e.target.value)} onFocus={() => handleFocus(`services.items.${idx}.name`)} onBlur={handleBlur} className={inputClass} placeholder="優勢標題" />
                                <textarea value={s.desc || ''} onChange={(e) => handleArrayChange('services.items', idx, 'desc', e.target.value)} onFocus={() => handleFocus(`services.items.${idx}.desc`)} onBlur={handleBlur} className={`${inputClass} h-16`} placeholder="優勢描述" />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('services.items', {name: '新優勢', desc: ''})} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:text-indigo-600 transition-colors"><Plus size={14}/> 新增優勢</button>
              </div>
            </>
        );
        case 'pricingPlans': return (
            <>
              <div>
                <label className={labelClass}>定價區塊大標題</label>
                <input type="text" value={state.meta?.priceTitleMain || ''} onChange={(e) => updateMeta('priceTitleMain', e.target.value)} onFocus={() => handleFocus('meta.priceTitleMain')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="space-y-4">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'pricingPlans')}>
                  <Droppable droppableId="pricingPlans">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {state.pricingPlans?.map((p, idx) => (
                          <Draggable key={`pricing-${idx}`} draggableId={`pricing-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span {...provided.dragHandleProps} className="text-slate-400 cursor-grab flex items-center gap-1 text-xs font-bold"><GripVertical size={14}/> 方案 #{idx+1}</span>
                                  <button onClick={() => removeArrayItem('pricingPlans', idx)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" value={p.title || ''} onChange={(e) => handleArrayChange('pricingPlans', idx, 'title', e.target.value)} onFocus={() => handleFocus(`pricingPlans.${idx}.title`)} onBlur={handleBlur} className={inputClass} placeholder="方案名稱" />
                                    <input type="text" value={p.urgency || ''} onChange={(e) => handleArrayChange('pricingPlans', idx, 'urgency', e.target.value)} onFocus={() => handleFocus(`pricingPlans.${idx}.urgency`)} onBlur={handleBlur} className={inputClass} placeholder="急迫標籤 (選填)" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" value={p.originalPrice || ''} onChange={(e) => handleArrayChange('pricingPlans', idx, 'originalPrice', e.target.value)} onFocus={() => handleFocus(`pricingPlans.${idx}.originalPrice`)} onBlur={handleBlur} className={inputClass} placeholder="原價" />
                                    <input type="text" value={p.currentPrice || ''} onChange={(e) => handleArrayChange('pricingPlans', idx, 'currentPrice', e.target.value)} onFocus={() => handleFocus(`pricingPlans.${idx}.currentPrice`)} onBlur={handleBlur} className={inputClass} placeholder="特價" />
                                </div>
                                <textarea value={p.features || ''} onChange={(e) => handleArrayChange('pricingPlans', idx, 'features', e.target.value)} onFocus={handleBlur} onBlur={handleBlur} className={`${inputClass} h-20`} placeholder="包含內容 (換行分隔)" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" value={p.ctaText || ''} onChange={(e) => handleArrayChange('pricingPlans', idx, 'ctaText', e.target.value)} onFocus={() => handleFocus(`pricingPlans.${idx}.ctaText`)} onBlur={handleBlur} className={inputClass} placeholder="按鈕文字" />
                                    <input type="text" value={p.ctaLink || ''} onChange={(e) => handleArrayChange('pricingPlans', idx, 'ctaLink', e.target.value)} onBlur={handleBlur} className={inputClass} placeholder="按鈕連結" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('pricingPlans', {title: '新方案', features: '', currentPrice: '0'})} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:text-indigo-600 transition-colors"><Plus size={14}/> 新增方案</button>
              </div>
            </>
        );
        case 'ctas': return (
            <div className="space-y-6">
                <p className="text-xs text-slate-500">此處可統一自訂頁面上三個獨立行動呼籲 (CTA) 按鈕的文案、連結、背景顏色、字體大小與內距（按鈕大小）。您可以在「佈局排序」分頁任意調整這三個按鈕在頁面上的位置。</p>
                {['cta1', 'cta2', 'cta3'].map((key) => {
                    const cta = state[key] || {};
                    const label = key === 'cta1' ? 'CTA 1 (首頁主按鈕)' : key === 'cta2' ? 'CTA 2 (產品優勢下按鈕)' : 'CTA 3 (促單結尾按鈕)';
                    return (
                        <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                            <h4 className="text-xs font-black text-slate-700 border-b border-slate-200 pb-1.5">{label}</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>按鈕文字</label>
                                    <input type="text" value={cta.text || ''} onChange={(e) => updateField(key, 'text', e.target.value)} onFocus={() => handleFocus(`${key}.text`)} onBlur={handleBlur} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>按鈕連結</label>
                                    <input type="text" value={cta.link || ''} onChange={(e) => updateField(key, 'link', e.target.value)} onBlur={handleBlur} className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelClass}>文字大小 (px)</label>
                                    <input type="number" value={parseInt(cta.fontSize || '16')} onChange={(e) => updateField(key, 'fontSize', `${e.target.value || 16}px`)} onBlur={handleBlur} className={inputClass} min="10" max="60" />
                                </div>
                                <div>
                                    <label className={labelClass}>水平內距 (寬度 px)</label>
                                    <input type="number" value={parseInt(cta.paddingX || '32')} onChange={(e) => updateField(key, 'paddingX', `${e.target.value || 32}px`)} onBlur={handleBlur} className={inputClass} min="10" max="100" />
                                </div>
                                <div>
                                    <label className={labelClass}>垂直內距 (高度 px)</label>
                                    <input type="number" value={parseInt(cta.paddingY || '16')} onChange={(e) => updateField(key, 'paddingY', `${e.target.value || 16}px`)} onBlur={handleBlur} className={inputClass} min="5" max="50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelClass}>圓角大小 (px)</label>
                                    <input type="number" value={parseInt(cta.borderRadius || '16')} onChange={(e) => updateField(key, 'borderRadius', `${e.target.value || 16}px`)} onBlur={handleBlur} className={inputClass} min="0" max="100" />
                                </div>
                                <div>
                                    <label className={labelClass}>寬度模式</label>
                                    <select value={cta.widthMode || 'auto'} onChange={(e) => updateField(key, 'widthMode', e.target.value)} className={inputClass}>
                                        <option value="auto">自適應內容</option>
                                        <option value="full">滿版寬度</option>
                                        <option value="custom">自訂寬度</option>
                                    </select>
                                </div>
                                {cta.widthMode === 'custom' && (
                                    <div>
                                        <label className={labelClass}>自訂寬度 (px)</label>
                                        <input type="number" value={parseInt(cta.customWidth || '300')} onChange={(e) => updateField(key, 'customWidth', `${e.target.value || 300}px`)} onBlur={handleBlur} className={inputClass} min="50" max="800" />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className={labelClass}>高度/長度模式</label>
                                    <select value={cta.heightMode || 'auto'} onChange={(e) => updateField(key, 'heightMode', e.target.value)} className={inputClass}>
                                        <option value="auto">自適應內容</option>
                                        <option value="custom">自訂高度/長度</option>
                                    </select>
                                </div>
                                {cta.heightMode === 'custom' && (
                                    <div>
                                        <label className={labelClass}>自訂高度/長度 (px)</label>
                                        <input type="number" value={parseInt(cta.customHeight || '50')} onChange={(e) => updateField(key, 'customHeight', `${e.target.value || 50}px`)} onBlur={handleBlur} className={inputClass} min="20" max="200" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>按鈕背景顏色</label>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-lg shrink-0 overflow-hidden border border-slate-200 shadow-inner">
                                        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: cta.bgColor || '#c67e13' }}></div>
                                        <input type="color" value={cta.bgColor || '#c67e13'} onChange={(e) => updateField(key, 'bgColor', e.target.value)} className="absolute inset-[-10px] w-[150%] h-[150%] opacity-0 cursor-pointer z-10" />
                                    </div>
                                    <input type="text" value={cta.bgColor || '#c67e13'} onChange={(e) => updateField(key, 'bgColor', e.target.value)} className={inputClass} placeholder="#c67e13" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
        default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AiGenerator />

      <DragDropContext onDragEnd={onCardDragEnd}>
        <Droppable droppableId="core-cards-droppable" direction="horizontal">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="grid grid-cols-3 gap-3"
            >
              {activeCoreItems.map((item, index) => {
                const isActive = activeExpanded === item.id;
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative group"
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div 
                          {...provided.dragHandleProps}
                          onClick={() => handleExpand(item.id)}
                          className={`w-full flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all shadow-sm cursor-pointer select-none ${isActive ? 'border-primary bg-indigo-50/50 ring-1 ring-primary/20' : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'} ${snapshot.isDragging ? 'border-indigo-500 shadow-xl scale-95 ring-2 ring-indigo-500/20' : ''}`}
                        >
                          <div className={`mb-2 ${isActive ? 'text-primary' : 'text-slate-600'}`}>
                            {item.icon}
                          </div>
                          <span className={`text-[10px] sm:text-[11px] font-black text-center ${isActive ? 'text-primary' : 'text-slate-600'}`}>
                            {item.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {activeExpanded && activeCoreItems.some(i => i.id === activeExpanded) && (
          <div className="bg-white p-5 rounded-2xl border border-primary/30 shadow-sm animate-fade-in space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  {coreMenuItems.find(i => i.id === activeExpanded)?.icon}
                  <h3 className="font-black text-sm text-slate-800">
                      {coreMenuItems.find(i => i.id === activeExpanded)?.label}
                  </h3>
              </div>
              {renderContent()}
          </div>
      )}
    </div>
  );
}
