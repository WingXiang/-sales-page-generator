import React, { useEffect, useRef, useState } from 'react';
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

  // User Verification State
  const [isVerified, setIsVerified] = useState(() => {
    return localStorage.getItem('sales_page_user_verified') === 'true';
  });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();

    // 1. Validate Name
    if (!name) {
      alert("請輸入您的姓名或暱稱！");
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("信箱格式不正確！請輸入包含「@」與「.」的完整 E-mail 格式");
      if (emailInputRef.current) {
        emailInputRef.current.focus();
        emailInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 3. Mark as verified locally
    try {
      localStorage.setItem('sales_page_user_verified', 'true');
    } catch (err) {
      console.warn("Failed to save verified state to localStorage:", err);
    }
    setIsVerified(true);
    toast.success("驗證成功！已解鎖銷售頁生成器所有功能。");

    // 4. Send verification data to Google Sheets via GAS Web App
    // Note: Please replace this placeholder URL with your actual deployed Web App URL from Apps Script.
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxoq6Vq27t1XlHptUo1S5K43F24_Z9ny9NiKVkAdoc/exec";
    
    if (GAS_WEB_APP_URL && !GAS_WEB_APP_URL.includes("exec")) {
      try {
        fetch(GAS_WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors', // Avoids CORS errors; Apps Script will still receive the data successfully
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email })
        });
      } catch (err) {
        console.error("Failed to send data to Google Apps Script:", err);
      }
    }
  };

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
      try {
        localStorage.setItem('sales_page_autosave_v2', JSON.stringify(state));
      } catch (e) {
        console.warn('Auto-save to localStorage failed (quota exceeded):', e);
      }
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

      {/* 驗證表單區塊 */}
      {!isVerified && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-[#2a4189]/10 text-[#2a4189] rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-slate-800">歡迎使用銷售頁生成器</h2>
              <p className="text-xs text-slate-500">
                請輸入您的基本資料完成驗證以開始使用本工具。
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-gray-700 font-bold text-sm">
                  姓名或暱稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  ref={nameInputRef}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：Wing"
                  className="w-full shadow-sm rounded-lg py-3 px-4 text-gray-700 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#048BBA] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-bold text-sm">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  ref={emailInputRef}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="例如：zxc1425638@gmail.com"
                  className="w-full shadow-sm rounded-lg py-3 px-4 text-gray-700 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#048BBA] focus:border-transparent transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2a4189] hover:bg-[#2a4189]/90 text-white font-bold rounded-lg transition-all shadow-md text-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                立即驗證並開始使用
              </button>
            </form>

            <div className="text-[10px] text-slate-400 text-center leading-relaxed">
              驗證通過後資料將自動記錄至 Google 試算表。<br />
              （若已完成 Apps Script 部署，可更換 <code>App.jsx</code> 中的 <code>GAS_WEB_APP_URL</code>）
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
