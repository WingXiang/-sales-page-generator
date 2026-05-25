import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUploadField({ label, value, onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const labelClass = "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      
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
      
      {value && (
        <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-xs bg-slate-50 p-1 inline-block">
          <img src={value} alt="Preview" className="max-h-24 rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
