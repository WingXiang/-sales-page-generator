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
  
  const { state, loadState, resetState } = useStore();
  const isFirstLoad = useRef(true);

  // User Verification State
  const [isVerified, setIsVerified] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [verifying, setVerifying] = useState(false);
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

    setVerifying(true);
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx4Txf0H6UkPSgvIdqsSOG5y4Ois7cqqHf7E1QJEssRerrXd-PRL6xMTBM82LyR7mch/exec";

    try {
      // Fetch user list from spreadsheet via Apps Script GET (omit credentials to avoid Google multi-account login CORS conflicts)
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      if (!response.ok) {
        throw new Error("HTTP error connecting to sheet");
      }
      const users = await response.json();

      if (users && Array.isArray(users)) {
        const matched = users.find(
          u => u && u.name && u.email &&
               u.name.toString().trim().toLowerCase() === name.toLowerCase() &&
               u.email.toString().trim().toLowerCase() === email.toLowerCase()
        );

        if (matched) {
          setCurrentUser({ name: matched.name, email: matched.email });
          setIsVerified(true);
          toast.success(`驗證成功！歡迎 ${matched.name} 登入。`);
        } else {
          alert("驗證失敗，請重新輸入！");
        }
      } else {
        alert("驗證失敗，無法解析伺服器使用者資料。");
      }
    } catch (err) {
      console.error("Failed to verify user against spreadsheet:", err);
      alert("驗證失敗，請確認您輸入的內容正確，或是請 Wing 協助開通權限！");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsVerified(false);
    setCurrentUser(null);
    setFormData({ name: '', email: '' });
    toast.success("已成功登出系統。");
  };

  // Load user draft when user logs in/verifies
  useEffect(() => {
    if (isVerified && currentUser) {
      try {
        const userDraftKey = `sales_page_autosave_v2_${currentUser.email}`;
        const savedDraft = localStorage.getItem(userDraftKey);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === 'object' && parsed.hero) {
            loadState(parsed);
            toast.success(`已自動載入 ${currentUser.name} 的專屬編輯紀錄！`);
            return;
          }
        }
        // If no draft is saved under this user, load the default template
        resetState();
      } catch (e) {
        console.error('Failed to load user draft:', e);
      }
    }
  }, [isVerified, currentUser, loadState, resetState]);

  // Auto-save draft on state change, specifically for the logged-in user
  useEffect(() => {
    if (!isVerified || !currentUser) return;
    
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (state) {
      try {
        const userDraftKey = `sales_page_autosave_v2_${currentUser.email}`;
        localStorage.setItem(userDraftKey, JSON.stringify(state));
      } catch (e) {
        console.warn('Auto-save to localStorage failed:', e);
      }
    }
  }, [state, isVerified, currentUser]);

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
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
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
                請輸入您的基本資料進行登入以開始使用本工具。
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
                  placeholder=""
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
                  placeholder=""
                  className="w-full shadow-sm rounded-lg py-3 px-4 text-gray-700 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#048BBA] focus:border-transparent transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-3 bg-[#2a4189] hover:bg-[#2a4189]/90 text-white font-bold rounded-lg transition-all shadow-md text-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    正在驗證帳號...
                  </>
                ) : (
                  "立即登入並開始使用"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
