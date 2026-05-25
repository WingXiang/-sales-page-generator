import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Save, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Download, 
  Upload, 
  FileJson, 
  Check, 
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryTab() {
  const { state, loadState, resetState } = useStore();
  const [versionName, setVersionName] = useState('');
  const [versions, setVersions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Load versions from localStorage
  const loadVersionsFromStorage = () => {
    try {
      const saved = localStorage.getItem('sales_page_versions');
      if (saved) {
        setVersions(JSON.parse(saved));
      } else {
        setVersions([]);
      }
    } catch (e) {
      console.error('Failed to load versions:', e);
      setVersions([]);
    }
  };

  useEffect(() => {
    loadVersionsFromStorage();
  }, []);

  // Save current state as a new named version
  const handleSaveVersion = (e) => {
    e.preventDefault();
    const name = versionName.trim() || `手動存檔 - ${new Date().toLocaleString()}`;
    const newVersion = {
      id: Date.now().toString(),
      name,
      timestamp: new Date().toLocaleString(),
      state: JSON.parse(JSON.stringify(state))
    };

    try {
      const updatedVersions = [newVersion, ...versions];
      localStorage.setItem('sales_page_versions', JSON.stringify(updatedVersions));
      setVersions(updatedVersions);
      setVersionName('');
      toast.success(`成功儲存版本：${name}`);
    } catch (err) {
      toast.error('儲存失敗，可能是瀏覽器儲存空間已滿');
    }
  };

  // Restore/Load a version
  const handleRestoreVersion = (version) => {
    if (window.confirm(`確定要載入「${version.name}」並覆蓋目前正在編輯的內容嗎？\n系統會自動將目前的內容暫存，以便您隨時找回。`)) {
      // Auto-save current state as a backup before overriding
      localStorage.setItem('sales_page_autosave', JSON.stringify(state));
      loadState(version.state);
      toast.success(`已載入版本：${version.name}`);
    }
  };

  // Delete a version
  const handleDeleteVersion = (id, name) => {
    if (window.confirm(`確定要刪除版本「${name}」嗎？此操作無法復原。`)) {
      const updatedVersions = versions.filter(v => v.id !== id);
      localStorage.setItem('sales_page_versions', JSON.stringify(updatedVersions));
      setVersions(updatedVersions);
      toast.success(`已刪除版本：${name}`);
    }
  };

  // Start renaming a version
  const startRename = (version) => {
    setEditingId(version.id);
    setEditingName(version.name);
  };

  // Save rename
  const handleSaveRename = (id) => {
    if (!editingName.trim()) {
      toast.error('版本名稱不可為空');
      return;
    }
    const updatedVersions = versions.map(v => {
      if (v.id === id) {
        return { ...v, name: editingName.trim() };
      }
      return v;
    });
    localStorage.setItem('sales_page_versions', JSON.stringify(updatedVersions));
    setVersions(updatedVersions);
    setEditingId(null);
    toast.success('版本重新命名成功');
  };

  // Reset to default template
  const handleResetToDefault = () => {
    if (window.confirm('確定要將編輯內容重設為預設範本嗎？目前編輯的內容將會被覆蓋！')) {
      // Auto-save current state as backup before resetting
      localStorage.setItem('sales_page_autosave', JSON.stringify(state));
      resetState();
      toast.success('已重設為預設範本！');
    }
  };

  // Export a version state as a JSON file
  const handleExportVersionJson = (version) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(version.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `銷售頁備份_${version.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
    toast.success('匯出 JSON 備份成功！');
  };

  // Import JSON file as a new version
  const handleImportJson = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsedState = JSON.parse(event.target.result);
        if (parsedState && parsedState.hero && parsedState.layout) {
          const name = `匯入 - ${file.name.replace('.json', '')}`;
          const newVersion = {
            id: Date.now().toString(),
            name,
            timestamp: new Date().toLocaleString(),
            state: parsedState
          };
          const updatedVersions = [newVersion, ...versions];
          localStorage.setItem('sales_page_versions', JSON.stringify(updatedVersions));
          setVersions(updatedVersions);
          toast.success('成功匯入 JSON 版本備份！');
          loadState(parsedState);
        } else {
          toast.error('匯入失敗：無效的銷售頁 JSON 備份檔案格式');
        }
      } catch (err) {
        toast.error('讀取檔案失敗，請確保這是正確的 JSON 格式檔案');
      }
    };
    fileReader.readAsText(file);
    e.target.value = null;
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs placeholder-slate-400 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold shadow-sm";
  const labelClass = "block text-[11px] font-extrabold text-slate-500 mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Save Current Version */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Save className="text-primary" size={18} />
          <h3 className="font-black text-sm text-slate-800">儲存目前編輯紀錄</h3>
        </div>
        <form onSubmit={handleSaveVersion} className="space-y-3">
          <div>
            <label className={labelClass}>自訂版本名稱</label>
            <input 
              type="text" 
              value={versionName} 
              onChange={(e) => setVersionName(e.target.value)} 
              placeholder="例如：2026年五月早鳥優惠版" 
              className={inputClass} 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 bg-primary hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Save size={14} /> 儲存為手動命名版本
          </button>
        </form>
      </div>



      {/* 4. Past Saved Versions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="text-slate-600" size={18} />
            <h3 className="font-black text-sm text-slate-800">歷史編輯紀錄與版本</h3>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            共 {versions.length} 個版本
          </span>
        </div>

        {versions.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <Clock className="mx-auto text-slate-300" size={32} />
            <p className="text-xs text-slate-400 font-bold">尚無手動儲存的版本紀錄</p>
            <p className="text-[10px] text-slate-400">您可以在上方為目前的編輯進度命名並儲存</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((v) => (
              <div key={v.id} className="p-3.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl space-y-3 transition-colors relative group">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    {editingId === v.id ? (
                      <div className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={editingName} 
                          onChange={(e) => setEditingName(e.target.value)} 
                          className={`${inputClass} !py-1`} 
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveRename(v.id)} 
                          className="p-1 text-green-600 bg-green-50 rounded border border-green-200 hover:bg-green-100"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-xs font-black text-slate-700 break-all">{v.name}</h4>
                    )}
                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Clock size={10} /> {v.timestamp}
                    </p>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteVersion(v.id, v.name)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors shrink-0"
                    title="刪除此版本"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-200/60 justify-end">
                  <button 
                    onClick={() => startRename(v)} 
                    className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-all"
                  >
                    重新命名
                  </button>
                  <button 
                    onClick={() => handleExportVersionJson(v)} 
                    className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-all flex items-center gap-0.5"
                    title="下載此版本 JSON 備份檔"
                  >
                    <FileJson size={10} /> 匯出 JSON
                  </button>
                  <button 
                    onClick={() => handleRestoreVersion(v)} 
                    className="px-2.5 py-1 text-[10px] font-black text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    載入此版本
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
