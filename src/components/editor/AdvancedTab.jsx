import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Heart, RefreshCw, ShieldCheck, BookOpen, GraduationCap, Users, Star, HelpCircle, ArrowRight, Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ImageUploadField from './ImageUploadField';

const advancedItems = [
  { id: 'empathy', label: '1. 同理暖心貼心話', icon: <Heart size={20} /> },
  { id: 'transition', label: '2. 新舊觀念大對決', icon: <RefreshCw size={20} /> },
  { id: 'promise', label: '3. 給予客群承諾', icon: <ShieldCheck size={20} /> },
  { id: 'curriculum', label: '4. 教學服務大綱', icon: <BookOpen size={20} /> },
  { id: 'authority', label: '5. 講師與數據介紹', icon: <GraduationCap size={20} /> },
  { id: 'qualification', label: '6. 適合哪些對象', icon: <Users size={20} /> },
  { id: 'testimonials', label: '7. 學員真實見證', icon: <Star size={20} /> },
  { id: 'faq', label: '8. 解除顧客疑惑', icon: <HelpCircle size={20} /> },
  { id: 'close', label: '9. 最後感性促單', icon: <ArrowRight size={20} /> }
];

export default function AdvancedTab() {
  const { state, updateField, updateMeta, updateStateByPath } = useStore();
  const [activeExpanded, setActiveExpanded] = useState(null);

  const activeAdvancedItems = advancedItems;

  const onCardDragEnd = (result) => {
    if (!result.destination) return;
    const gridItems = activeAdvancedItems.map(item => item.id);
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
        iframe.contentWindow.postMessage({ type: 'SCROLL_TO', sectionId: `section-${newId}` }, '*');
      }
    }
  };

  const renderContent = () => {
    switch(activeExpanded) {
        case 'empathy': return (
            <>
              <div>
                <label className={labelClass}>引言/金句 (支援換行)</label>
                <textarea value={state.empathy?.quote || ''} onChange={(e) => updateField('empathy', 'quote', e.target.value)} onFocus={() => handleFocus('empathy.quote')} onBlur={handleBlur} className={`${inputClass} h-20`} />
              </div>
              <div>
                <label className={labelClass}>感同身受文案 (支援換行)</label>
                <textarea value={state.empathy?.text || ''} onChange={(e) => updateField('empathy', 'text', e.target.value)} onFocus={() => handleFocus('empathy.text')} onBlur={handleBlur} className={`${inputClass} h-32`} />
              </div>
            </>
        );
        case 'transition': return (
            <>
              <div>
                <label className={labelClass}>區塊大標題</label>
                <input type="text" value={state.transition?.title || ''} onChange={(e) => updateField('transition', 'title', e.target.value)} onFocus={() => handleFocus('transition.title')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {state.transition?.cards?.map((c, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-500">{idx === 0 ? '💔 傳統現狀' : '✨ 高效未來'}</span>
                    <input type="text" value={c.title || ''} onChange={(e) => handleArrayChange('transition.cards', idx, 'title', e.target.value)} onFocus={() => handleFocus(`transition.cards.${idx}.title`)} onBlur={handleBlur} className={inputClass} />
                    <textarea value={c.desc || ''} onChange={(e) => handleArrayChange('transition.cards', idx, 'desc', e.target.value)} onFocus={() => handleFocus(`transition.cards.${idx}.desc`)} onBlur={handleBlur} className={`${inputClass} h-20`} />
                  </div>
                ))}
              </div>
            </>
        );
        case 'promise': return (
            <>
              <div>
                <label className={labelClass}>區塊大標題</label>
                <input type="text" value={state.promise?.title || ''} onChange={(e) => updateField('promise', 'title', e.target.value)} onFocus={() => handleFocus('promise.title')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="space-y-4">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'promise.items')}>
                  <Droppable droppableId="promise">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {state.promise?.items?.map((item, idx) => (
                          <Draggable key={`promise-${idx}`} draggableId={`promise-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="flex gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                <span {...provided.dragHandleProps} className="mt-2 text-slate-400 cursor-grab"><GripVertical size={16}/></span>
                                <input type="text" value={item.text || ''} onChange={(e) => handleArrayChange('promise.items', idx, 'text', e.target.value)} onFocus={() => handleFocus(`promise.items.${idx}.text`)} onBlur={handleBlur} className={inputClass} />
                                <button onClick={() => removeArrayItem('promise.items', idx)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('promise.items', {text: '新承諾'})} className="mt-2 w-full py-2 border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:bg-indigo-100 transition-colors"><Plus size={14}/> 新增承諾</button>
              </div>
            </>
        );
        case 'curriculum': return (
            <>
              <div>
                <label className={labelClass}>大綱區塊標題</label>
                <input type="text" value={state.meta?.currTitleMain || ''} onChange={(e) => updateMeta('currTitleMain', e.target.value)} onFocus={() => handleFocus('meta.currTitleMain')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="space-y-4">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'curriculum')}>
                  <Droppable droppableId="curriculum">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {state.curriculum?.map((c, idx) => (
                          <Draggable key={`curr-${idx}`} draggableId={`curr-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span {...provided.dragHandleProps} className="text-slate-400 cursor-grab flex items-center gap-1 text-xs font-bold"><GripVertical size={14}/> 單元 #{idx+1}</span>
                                  <button onClick={() => removeArrayItem('curriculum', idx)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                                <input type="text" value={c.title || ''} onChange={(e) => handleArrayChange('curriculum', idx, 'title', e.target.value)} onFocus={() => handleFocus(`curriculum.${idx}.title`)} onBlur={handleBlur} className={inputClass} placeholder="單元標題" />
                                <textarea value={c.content || ''} onChange={(e) => handleArrayChange('curriculum', idx, 'content', e.target.value)} onFocus={() => handleFocus(`curriculum.${idx}.content`)} onBlur={handleBlur} className={`${inputClass} h-16`} placeholder="單元內容" />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('curriculum', {title: '新單元', content: ''})} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:text-indigo-600 transition-colors"><Plus size={14}/> 新增單元</button>
              </div>
            </>
        );
        case 'authority': return (
            <>
              <div>
                <ImageUploadField 
                  label="講師照片/品牌 Logo"
                  value={state.authority?.image || ''} 
                  onChange={(val) => updateField('authority', 'image', val)} 
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={labelClass}>頭銜與姓名</label>
                <input type="text" value={state.authority?.name || ''} onChange={(e) => updateField('authority', 'name', e.target.value)} onFocus={() => handleFocus('authority.name')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>經歷介紹</label>
                <textarea value={state.authority?.bio || ''} onChange={(e) => updateField('authority', 'bio', e.target.value)} onFocus={() => handleFocus('authority.bio')} onBlur={handleBlur} className={`${inputClass} h-24`} />
              </div>
              <div>
                 <label className={labelClass}>數據指標 (例如: 學員好評率 99%)</label>
                 <div className="space-y-2">
                    {state.authority?.stats?.map((s, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <input type="text" value={s.label || ''} onChange={(e) => handleArrayChange('authority.stats', idx, 'label', e.target.value)} onFocus={() => handleFocus(`authority.stats.${idx}.label`)} onBlur={handleBlur} className={inputClass} placeholder="數據名稱" />
                                <input type="text" value={s.value || ''} onChange={(e) => handleArrayChange('authority.stats', idx, 'value', e.target.value)} onFocus={() => handleFocus(`authority.stats.${idx}.value`)} onBlur={handleBlur} className={inputClass} placeholder="具體數字" />
                            </div>
                            <button onClick={() => removeArrayItem('authority.stats', idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"><Trash2 size={16}/></button>
                        </div>
                    ))}
                    <button onClick={() => addArrayItem('authority.stats', {label: '新指標', value: '100%'})} className="mt-2 w-full py-2 border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:bg-indigo-100 transition-colors"><Plus size={14}/> 新增數據指標</button>
                 </div>
              </div>
            </>
        );
        case 'qualification': return (
            <>
              <div>
                <label className={labelClass}>篩選區塊大標題</label>
                <input type="text" value={state.meta?.qualTitleMain || ''} onChange={(e) => updateMeta('qualTitleMain', e.target.value)} onFocus={() => handleFocus('meta.qualTitleMain')} onBlur={handleBlur} className={inputClass} />
              </div>
              
              <div className="space-y-2 border-t border-slate-100 pt-4">
                 <label className={`${labelClass} text-green-600`}>適合對象</label>
                 {state.qualification?.fit?.map((f, idx) => (
                     <div key={`fit-${idx}`} className="flex gap-2">
                         <input type="text" value={f.text || ''} onChange={(e) => handleArrayChange('qualification.fit', idx, 'text', e.target.value)} onFocus={() => handleFocus(`qualification.fit.${idx}.text`)} onBlur={handleBlur} className={inputClass} />
                         <button onClick={() => removeArrayItem('qualification.fit', idx)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                     </div>
                 ))}
                 <button onClick={() => addArrayItem('qualification.fit', {text: '新條件'})} className="mt-2 w-full py-2 border-2 border-dashed border-green-200 bg-green-50 text-green-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:border-green-400 hover:bg-green-100 transition-colors"><Plus size={14}/> 新增條件</button>
              </div>
    
              <div className="space-y-2 border-t border-slate-100 pt-4">
                 <label className={`${labelClass} text-red-500`}>不適合對象</label>
                 {state.qualification?.unfit?.map((u, idx) => (
                     <div key={`unfit-${idx}`} className="flex gap-2">
                         <input type="text" value={u.text || ''} onChange={(e) => handleArrayChange('qualification.unfit', idx, 'text', e.target.value)} onFocus={() => handleFocus(`qualification.unfit.${idx}.text`)} onBlur={handleBlur} className={inputClass} />
                         <button onClick={() => removeArrayItem('qualification.unfit', idx)} className="text-red-500 p-2"><Trash2 size={16}/></button>
                     </div>
                 ))}
                 <button onClick={() => addArrayItem('qualification.unfit', {text: '新條件'})} className="mt-2 w-full py-2 border-2 border-dashed border-red-200 bg-red-50 text-red-500 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:border-red-400 hover:bg-red-100 transition-colors"><Plus size={14}/> 新增條件</button>
              </div>
            </>
        );
        case 'testimonials': return (
            <>
              <div>
                <label className={labelClass}>見證區塊大標題</label>
                <input type="text" value={state.meta?.testTitleMain || ''} onChange={(e) => updateMeta('testTitleMain', e.target.value)} onFocus={() => handleFocus('meta.testTitleMain')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="space-y-4">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'testimonials')}>
                  <Droppable droppableId="testimonials">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {state.testimonials?.map((t, idx) => (
                          <Draggable key={`test-${idx}`} draggableId={`test-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span {...provided.dragHandleProps} className="text-slate-400 cursor-grab flex items-center gap-1 text-xs font-bold"><GripVertical size={14}/> 見證 #{idx+1}</span>
                                  <button onClick={() => removeArrayItem('testimonials', idx)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" value={t.name || ''} onChange={(e) => handleArrayChange('testimonials', idx, 'name', e.target.value)} onFocus={() => handleFocus(`testimonials.${idx}.name`)} onBlur={handleBlur} className={inputClass} placeholder="姓名" />
                                    <input type="text" value={t.role || ''} onChange={(e) => handleArrayChange('testimonials', idx, 'role', e.target.value)} onFocus={() => handleFocus(`testimonials.${idx}.role`)} onBlur={handleBlur} className={inputClass} placeholder="身分/頭銜" />
                                </div>
                                <textarea value={t.content || ''} onChange={(e) => handleArrayChange('testimonials', idx, 'content', e.target.value)} onFocus={() => handleFocus(`testimonials.${idx}.content`)} onBlur={handleBlur} className={`${inputClass} h-16`} placeholder="見證內容" />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('testimonials', {name: '新學員', role: '', content: ''})} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:text-indigo-600 transition-colors"><Plus size={14}/> 新增見證</button>
              </div>
            </>
        );
        case 'faq': return (
            <>
              <div>
                <label className={labelClass}>FAQ 區塊大標題</label>
                <input type="text" value={state.meta?.faqTitleMain || ''} onChange={(e) => updateMeta('faqTitleMain', e.target.value)} onFocus={() => handleFocus('meta.faqTitleMain')} onBlur={handleBlur} className={inputClass} />
              </div>
              <div className="space-y-4">
                <DragDropContext onDragEnd={(result) => onDragEnd(result, 'faq')}>
                  <Droppable droppableId="faq">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {state.faq?.map((f, idx) => (
                          <Draggable key={`faq-${idx}`} draggableId={`faq-${idx}`} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span {...provided.dragHandleProps} className="text-slate-400 cursor-grab flex items-center gap-1 text-xs font-bold"><GripVertical size={14}/> Q&A #{idx+1}</span>
                                  <button onClick={() => removeArrayItem('faq', idx)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                                <input type="text" value={f.q || ''} onChange={(e) => handleArrayChange('faq', idx, 'q', e.target.value)} onFocus={() => handleFocus(`faq.${idx}.q`)} onBlur={handleBlur} className={inputClass} placeholder="問題 Q" />
                                <textarea value={f.a || ''} onChange={(e) => handleArrayChange('faq', idx, 'a', e.target.value)} onFocus={() => handleFocus(`faq.${idx}.a`)} onBlur={handleBlur} className={`${inputClass} h-16`} placeholder="答案 A" />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('faq', {q: '新問題', a: ''})} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs flex items-center justify-center gap-1 hover:border-indigo-400 hover:text-indigo-600 transition-colors"><Plus size={14}/> 新增 Q&A</button>
              </div>
            </>
        );
        case 'close': return (
            <>
              <div>
                <label className={labelClass}>感性喊話 (支援換行)</label>
                <textarea value={state.close?.text || ''} onChange={(e) => updateField('close', 'text', e.target.value)} onFocus={() => handleFocus('close.text')} onBlur={handleBlur} className={`${inputClass} h-24`} />
              </div>
            </>
        );
        default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DragDropContext onDragEnd={onCardDragEnd}>
        <Droppable droppableId="advanced-cards-droppable" direction="horizontal">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="grid grid-cols-3 gap-3"
            >
              {activeAdvancedItems.map((item, index) => {
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

      {activeExpanded && activeAdvancedItems.some(i => i.id === activeExpanded) && (
          <div className="bg-white p-5 rounded-2xl border border-primary/30 shadow-sm animate-fade-in space-y-4">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  {advancedItems.find(i => i.id === activeExpanded)?.icon}
                  <h3 className="font-black text-sm text-slate-800">
                      {advancedItems.find(i => i.id === activeExpanded)?.label}
                  </h3>
              </div>
              {renderContent()}
          </div>
      )}
    </div>
  );
}
