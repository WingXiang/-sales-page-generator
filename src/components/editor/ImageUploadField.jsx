import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUploadField({ label, value, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const limitInBytes = 3 * 1024 * 1024; // 3MB limit
    if (file.size > limitInBytes) {
      const confirmUpload = window.confirm(
        `⚠️ 您上傳的圖片檔案大小為 ${(file.size / (1024 * 1024)).toFixed(2)} MB，已超過建議上限 (3MB)。\n\n如果選擇繼續上傳，系統將會啟動自動保護機制，自動將圖片進行調整與壓縮（畫質可能略微降低），以防網頁崩潰。是否要繼續上傳？`
      );
      if (!confirmUpload) {
        e.target.value = '';
        return;
      }
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      // Automatic protection mechanism: limit image dimensions to prevent canvas/localStorage overflow
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width > height) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        } else {
          width = Math.round(width * (MAX_HEIGHT / height));
          height = MAX_HEIGHT;
        }
      }

      // Draw image on canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Get compressed data URL (jpeg format, 0.70 quality to keep size small)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.70);
        onChange(compressedDataUrl);
      } else {
        alert('❌ 處理圖片失敗，請更換其他圖片上傳。');
      }

      URL.revokeObjectURL(objectUrl);
      e.target.value = '';
    };

    img.onerror = () => {
      alert('❌ 載入圖片失敗，請確保此檔案為正確的圖片格式。');
      URL.revokeObjectURL(objectUrl);
      e.target.value = '';
    };

    img.src = objectUrl;
  };

  const labelClass = "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 px-4 border-2 border-dashed border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Upload size={14} /> 選擇電腦中的圖片上傳
          </button>

          {value && (
            <button 
              type="button"
              onClick={() => onChange('')}
              className="p-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
              title="移除圖片"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
          💡 規格限制：建議單張圖片在 3MB 以內，寬高 1200px 以內。<br />
          若上傳大於 3MB 的大圖，系統會自動啟動壓縮保護機制降低畫質，以避免網頁崩潰。
        </p>
      </div>
      
      {value && (
        <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-xs bg-slate-50 p-1 inline-block">
          <img src={value} alt="Preview" className="max-h-24 rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
