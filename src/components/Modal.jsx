import { X } from 'lucide-react';

export default function Modal({ title, icon, onClose, children, maxWidth = 'max-w-2xl' }) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-slate-50 rounded-2xl shadow-2xl w-full ${maxWidth} my-8 relative animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200 bg-white rounded-t-2xl sticky top-0 z-10">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            {icon} {title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1" aria-label="關閉">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 md:p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
