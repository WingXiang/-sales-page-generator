import { useStore } from '../store/useStore';
import { Sparkles, Palette, ShieldCheck, CloudUpload, X, ArrowRight } from 'lucide-react';

const STEPS = [
  { n: 1, tab: 'core', icon: <Sparkles size={18} />, title: '生成或填寫核心內容', desc: '用「一鍵 AI 生成」快速產出整頁文案，或自行填寫品牌、主視覺、痛點、優勢與定價。', color: 'indigo' },
  { n: 2, tab: 'theme', icon: <Palette size={18} />, title: '挑選配色', desc: '選一組預設色票或自訂主色，整頁風格立即套用。', color: 'violet' },
  { n: 3, tab: 'compliance', icon: <ShieldCheck size={18} />, title: '填寫金流申請資訊', desc: '輸入商號、統編、客服聯絡方式，政策內容會自動帶入，可直接送審金流。', color: 'emerald' },
  { n: 4, tab: 'deploy', icon: <CloudUpload size={18} />, title: '匯出 / 公開部署', desc: '一鍵匯出 HTML，或依教學發布上線。', color: 'sky' },
];

const COLOR = {
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  sky: 'bg-sky-50 text-sky-600 border-sky-100',
};

export default function Onboarding() {
  const { onboardingOpen, setOnboardingOpen, setActiveTab, setEditorMode } = useStore();

  if (!onboardingOpen) return null;

  const goto = (tab) => {
    setEditorMode('simple'); // 4 個步驟皆在簡易模式可見
    setActiveTab(tab);
    setOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5 relative my-auto">
        <button onClick={() => setOnboardingOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1" aria-label="關閉">
          <X size={20} />
        </button>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-600" /> 歡迎使用！4 步驟做好銷售頁
          </h2>
          <p className="text-xs text-slate-500">不用從頭摸索，依下列順序進行即可。點任一步驟可直接前往。</p>
        </div>

        <div className="space-y-3">
          {STEPS.map((s) => (
            <button
              key={s.n}
              onClick={() => goto(s.tab)}
              className="w-full flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-left hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${COLOR[s.color]}`}>
                {s.icon}
                <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-black flex items-center justify-center">{s.n}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-slate-800">{s.title}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{s.desc}</div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 shrink-0 transition-colors" />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[10px] text-slate-400">想看更多區塊？右上角切換到「進階」模式。</p>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-black rounded-xl text-sm shadow-md transition-all shrink-0"
          >
            開始編輯
          </button>
        </div>
      </div>
    </div>
  );
}
