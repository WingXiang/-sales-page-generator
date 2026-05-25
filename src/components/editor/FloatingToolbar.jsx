import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

export default function FloatingToolbar({ activeElement, onClose }) {
  const { deviceMode, updateElementStyle } = useStore();
  const [localStyle, setLocalStyle] = useState({
    fontSize: '',
    color: '',
    textAlign: ''
  });

  useEffect(() => {
    if (activeElement && activeElement.currentStyle) {
        setLocalStyle({
            fontSize: activeElement.currentStyle.fontSize || '16px',
            color: activeElement.currentStyle.color || '#000000',
            textAlign: activeElement.currentStyle.textAlign || 'left'
        });
    }
  }, [activeElement]);

  if (!activeElement) return null;

  // Calculate position: absolute to the viewport.
  // activeElement.rect is relative to iframe viewport.
  // activeElement.iframeRect is relative to main viewport.
  // We want to position it above the element.
  const top = activeElement.iframeRect.top + activeElement.rect.top - 60; 
  const left = activeElement.iframeRect.left + activeElement.rect.left;

  const handleChange = (key, value) => {
    setLocalStyle(prev => ({ ...prev, [key]: value }));
    updateElementStyle(deviceMode, activeElement.path, key, value);
  };

  // Extract numeric value from fontSize (e.g. "16px" -> 16)
  const numericFontSize = parseInt(localStyle.fontSize) || 16;
  const isHex = /^#[0-9A-Fa-f]{6}$/.test(localStyle.color);

  return (
    <div 
      className="fixed z-[100] bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 flex items-center gap-3 animate-fade-in"
      style={{ top: `${Math.max(10, top)}px`, left: `${Math.max(10, left)}px` }}
    >
        <div className="flex items-center gap-2 pr-3 border-r border-slate-100">
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-widest">
                {deviceMode === 'desktop' ? '電腦版' : deviceMode === 'tablet' ? '平板' : '手機版'}
            </span>
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <Type size={14} className="text-slate-400 ml-1" />
            <input 
                type="number" 
                value={numericFontSize}
                onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
                className="w-12 bg-transparent text-xs font-bold text-slate-700 text-center outline-none"
            />
            <span className="text-xs text-slate-400 font-bold pr-1">px</span>
        </div>

        {/* Color */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <div className="relative w-6 h-6 rounded border border-slate-200 overflow-hidden shadow-inner">
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: localStyle.color }}></div>
                <input 
                    type="color" 
                    value={isHex ? localStyle.color : '#000000'} 
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="absolute inset-[-5px] w-[150%] h-[150%] opacity-0 cursor-pointer"
                />
            </div>
            <input 
                type="text" 
                value={localStyle.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-16 bg-transparent text-xs font-mono text-slate-600 outline-none"
                placeholder="#000000"
            />
        </div>

        {/* Text Align */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <button 
                onClick={() => handleChange('textAlign', 'left')}
                className={`p-1.5 rounded transition-colors ${localStyle.textAlign === 'left' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-700'}`}
            >
                <AlignLeft size={14} />
            </button>
            <button 
                onClick={() => handleChange('textAlign', 'center')}
                className={`p-1.5 rounded transition-colors ${localStyle.textAlign === 'center' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-700'}`}
            >
                <AlignCenter size={14} />
            </button>
            <button 
                onClick={() => handleChange('textAlign', 'right')}
                className={`p-1.5 rounded transition-colors ${localStyle.textAlign === 'right' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-700'}`}
            >
                <AlignRight size={14} />
            </button>
        </div>

        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-2 bg-slate-50 rounded-full hover:bg-red-50">
            <X size={14} strokeWidth={3} />
        </button>
    </div>
  );
}
