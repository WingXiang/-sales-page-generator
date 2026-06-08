import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { generateInnerHTMLContent } from '../utils/templateGenerator';
import FloatingToolbar from './editor/FloatingToolbar';

export default function PreviewPane() {
  const { state, deviceMode, setDeviceMode, updateStateByPath, applyTheme } = useStore();
  const iframeRef = useRef(null);
  const [activeElement, setActiveElement] = useState(null);
  const ignoreNextUpdateRef = useRef(false);

  // This function mirrors the `generateInnerHTMLContent` from the original script
  // Due to length, we will inject a simplified version first and expand it.
  const getIframeContent = () => {
    // We will use postMessage to send the state to the iframe, and the iframe will render it
    // Or we can just render the HTML string here and pass it to the iframe using srcDoc
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            primary: 'var(--primary-color)',
                            accent: 'var(--accent-color)'
                        }
                    }
                }
            }
          </script>
          <style id="dynamic-styles"></style>
          <style>
              /* Styles for live editing */
              [data-live-path] {
                  outline: 1px dashed transparent;
                  transition: outline 0.15s ease-in-out, background 0.15s;
                  cursor: text !important;
              }
              [data-live-path]:hover {
                  outline: 1px dashed #6366f1 !important;
                  background: rgba(99, 102, 241, 0.05) !important;
              }
              [data-live-path]:focus {
                  outline: 2px solid #6366f1 !important;
                  background: rgba(99, 102, 241, 0.02) !important;
                  caret-color: #6366f1 !important;
              }
              
              /* Custom theme vars */
              :root {
                  --bg-color: ${state.theme.bgColor};
                  --text-color: ${state.theme.textColor};
                  --primary-color: ${state.theme.primaryColor};
                  --accent-color: ${state.theme.accentColor};
              }
              body, html { 
                  background-color: var(--bg-color) !important; 
                  color: var(--text-color) !important; 
                  font-family: "Microsoft JhengHei", "Segoe UI", sans-serif !important; 
                  word-break: break-word; 
                  overflow-x: hidden;
                  transition: background-color 0.2s ease-in-out;
              }
              .text-primary { color: var(--primary-color) !important; }
              .bg-primary { background-color: var(--primary-color) !important; }
              .text-accent { color: var(--accent-color) !important; }
              .bg-accent { background-color: var(--accent-color) !important; }
              
              /* Global button styles override */
              a.bg-primary:not(.cta-btn-custom), 
              a.bg-accent:not(.cta-btn-custom), 
              a.text-primary-btn:not(.cta-btn-custom),
              button:not(.cta-btn-custom) {
                  background-color: #c67e13 !important;
                  color: #ffffff !important;
                  border-color: #c67e13 !important;
                  background-image: none !important;
              }
              a.bg-primary:not(.cta-btn-custom):hover, 
              a.bg-accent:not(.cta-btn-custom):hover, 
              a.text-primary-btn:not(.cta-btn-custom):hover,
              button:not(.cta-btn-custom):hover,
              .cta-btn-custom:hover {
                  background-color: #000000 !important;
                  color: #ffffff !important;
                  border-color: #000000 !important;
                  background-image: none !important;
              }
              
              main > #section-cta1 {
                  margin-top: 2.5rem !important;
              }
              main > #section-cta1 + * {
                  margin-top: 2.5rem !important;
              }
              #section-cta1 {
                  margin-top: 1.5rem !important;
              }
              #section-cta2, 
              #section-cta3 {
                  margin-top: 2.5rem !important;
              }
              #section-cta2 + *, 
              #section-cta3 + * {
                  margin-top: 2.5rem !important;
              }
          </style>
      </head>
      <body class="device-${deviceMode} antialiased min-h-screen transition-colors duration-200">
          <main id="capture-area" class="w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 space-y-32">
              ${generateInnerHTMLContent(state, deviceMode, true)}
          </main>
          <script>
            // Allow clicking to edit
            document.querySelectorAll('[data-live-path]').forEach(el => {
                el.setAttribute('contenteditable', 'true');
            });

            document.addEventListener('input', (e) => {
                const target = e.target;
                const path = target.getAttribute('data-live-path');
                if (path) {
                    window.parent.postMessage({
                        type: 'LIVE_EDIT',
                        path: path,
                        value: target.innerText
                    }, '*');
                }
            });

            // Show/hide a legal-doc full-page overlay (preview equivalent of the
            // exported page's #hash navigation, which can't run via injected scripts)
            function showLegalDoc(id) {
                document.querySelectorAll('.legal-doc').forEach(function (d) {
                    d.style.display = (d.id === id) ? 'block' : 'none';
                });
                document.body.style.overflow = id ? 'hidden' : '';
                if (id) {
                    window.scrollTo(0, 0);
                    var doc = document.getElementById(id);
                    if (doc) doc.scrollTop = 0;
                }
            }

            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link) {
                    e.preventDefault();
                    // 返回銷售頁
                    if (link.classList.contains('legal-back')) {
                        showLegalDoc(null);
                        return;
                    }
                    // 開啟政策全頁
                    const href = link.getAttribute('href') || '';
                    if (href.indexOf('#doc-') === 0) {
                        showLegalDoc(href.slice(1));
                        return;
                    }
                }
                const target = e.target.closest('[data-live-path]');
                if (target) {
                    const rect = target.getBoundingClientRect();
                    const computed = window.getComputedStyle(target);
                    window.parent.postMessage({
                        type: 'ELEMENT_CLICKED',
                        path: target.getAttribute('data-live-path'),
                        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                        currentStyle: {
                            fontSize: computed.fontSize,
                            color: computed.color,
                            textAlign: computed.textAlign
                        }
                    }, '*');
                } else {
                    window.parent.postMessage({ type: 'ELEMENT_CLICKED', path: null }, '*');
                }
            });

            window.addEventListener('scroll', () => {
                window.parent.postMessage({ type: 'ELEMENT_CLICKED', path: null }, '*');
            });

            // Listen for HTML updates to prevent flicker
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'UPDATE_HTML') {
                    if (event.data.theme) {
                        document.documentElement.style.setProperty('--bg-color', event.data.theme.bgColor);
                        document.documentElement.style.setProperty('--text-color', event.data.theme.textColor);
                        document.documentElement.style.setProperty('--primary-color', event.data.theme.primaryColor);
                        document.documentElement.style.setProperty('--accent-color', event.data.theme.accentColor);
                    }
                    if (event.data.deviceMode) {
                        document.body.className = 'device-' + event.data.deviceMode + ' antialiased min-h-screen transition-colors duration-200';
                    }

                    // If the user is currently editing inside the iframe, skip innerHTML update to prevent focus loss
                    const activeEl = document.activeElement;
                    if (activeEl && activeEl.hasAttribute('contenteditable')) {
                        return;
                    }

                    const captureArea = document.getElementById('capture-area');
                    if (captureArea) {
                        captureArea.innerHTML = event.data.html;
                        // Re-bind contenteditable after replacing innerHTML
                        document.querySelectorAll('[data-live-path]').forEach(el => {
                            el.setAttribute('contenteditable', 'true');
                        });
                    }
                } else if (event.data && event.data.type === 'SCROLL_TO') {
                    const el = document.getElementById(event.data.sectionId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
          </script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data) return;
      if (e.data.type === 'LIVE_EDIT') {
        const { path, value } = e.data;
        ignoreNextUpdateRef.current = true;
        updateStateByPath(path, value);
      } else if (e.data.type === 'ELEMENT_CLICKED') {
        if (e.data.path) {
            const iframe = iframeRef.current;
            if (iframe) {
               const iframeRect = iframe.getBoundingClientRect();
               setActiveElement({
                  path: e.data.path,
                  rect: e.data.rect,
                  currentStyle: e.data.currentStyle,
                  iframeRect: { top: iframeRect.top, left: iframeRect.left }
               });
            }
        } else {
            setActiveElement(null);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [updateStateByPath]);

  useEffect(() => {
    if (iframeRef.current) {
      if (!iframeRef.current.hasAttribute('data-initialized')) {
        iframeRef.current.srcdoc = getIframeContent();
        iframeRef.current.setAttribute('data-initialized', 'true');
      } else if (iframeRef.current.contentWindow) {
        if (ignoreNextUpdateRef.current) {
          ignoreNextUpdateRef.current = false;
          return;
        }
        iframeRef.current.contentWindow.postMessage({
            type: 'UPDATE_HTML',
            html: generateInnerHTMLContent(state, deviceMode, true),
            theme: state.theme,
            deviceMode: deviceMode
        }, '*');
      }
    }
  }, [state, deviceMode]);

  const getWidth = () => {
    if (deviceMode === 'mobile') return '375px';
    if (deviceMode === 'tablet') return '768px';
    return '100%';
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border-b border-slate-200 w-full z-20 shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600">💡 指引：在右側直接「點選文字」即可編輯！</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-end sm:self-auto">
          <button 
            onClick={() => setDeviceMode('mobile')}
            className={`tab-bar-btn p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${deviceMode === 'mobile' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Smartphone size={14} /> 手機
          </button>
          <button 
            onClick={() => setDeviceMode('tablet')}
            className={`tab-bar-btn p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${deviceMode === 'tablet' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Tablet size={14} /> 平板
          </button>
          <button 
            onClick={() => setDeviceMode('desktop')}
            className={`tab-bar-btn p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${deviceMode === 'desktop' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Monitor size={14} /> 電腦
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex justify-center p-4 md:p-6 bg-slate-100 relative">
        <FloatingToolbar activeElement={activeElement} onClose={() => setActiveElement(null)} />
        <div className="transition-all duration-300 h-full relative" style={{ width: getWidth(), minWidth: deviceMode === 'desktop' ? '100%' : 'auto' }}>
          <iframe 
            id="preview-iframe"
            ref={iframeRef} 
            className="w-full h-full border border-slate-200 shadow-xl rounded-2xl bg-white transition-all duration-300" 
            title="WYSIWYG Live Sandbox"
          />
        </div>
      </div>
    </>
  );
}
