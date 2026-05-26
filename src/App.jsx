import React, { useEffect, useRef } from 'react';
import { useStore } from './store/useStore';
import Header from './components/Header';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

function App() {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const dragHandleRef = useRef(null);
  
  const { state, loadState } = useStore();
  const isFirstLoad = useRef(true);

  // Load auto-saved draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('sales_page_autosave_v2');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object' && parsed.hero) {
          loadState(parsed);
          toast.success('已自動載入您上次編輯的最新紀錄！');
        }
      }
    } catch (e) {
      console.error('Failed to load auto-saved draft:', e);
    }
  }, [loadState]);

  // Auto-save draft on state change
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (state) {
      localStorage.setItem('sales_page_autosave_v2', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    const handle = dragHandleRef.current;
    const editor = editorRef.current;
    const container = containerRef.current;
    
    if (!handle || !editor || !container) return;
    
    let isDragging = false;

    const onMouseDown = () => {
      isDragging = true;
      document.body.style.cursor = 'col-resize';
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const containerRect = container.getBoundingClientRect();
      let percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (percentage < 30) percentage = 30;
      if (percentage > 70) percentage = 70;
      editor.style.width = percentage + '%';
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
      }
    };

    handle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Header />
      
      <div ref={containerRef} className="flex-1 flex relative overflow-hidden bg-slate-50" id="main-container">
        
        {/* Left Pane: Editor */}
        <div ref={editorRef} id="editor-pane" className="h-full flex-shrink-0 flex flex-col bg-white border-r border-slate-200 relative z-10 transition-all" style={{ width: '48%' }}>
          <EditorPane />
        </div>

        {/* Drag Handle */}
        <div ref={dragHandleRef} id="drag-handle" className="w-2 cursor-col-resize flex items-center justify-center bg-slate-200 border-r border-l border-slate-300 hover:bg-primary transition-colors z-30 flex-shrink-0 group hidden lg:flex">
          <div className="w-0.5 h-8 bg-slate-400 rounded group-hover:bg-white transition-colors"></div>
        </div>

        {/* Right Pane: Preview */}
        <div id="preview-pane" className="flex-1 h-full flex flex-col relative bg-slate-100 hidden lg:flex">
          <PreviewPane />
        </div>

      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
