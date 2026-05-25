import React from 'react';
import { Info, ExternalLink, Download } from 'lucide-react';
import { exportHTML } from '../utils/exportHtml';
import { useStore } from '../store/useStore';

export default function DeployTab() {
  const { state } = useStore();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm text-slate-800 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base md:text-lg font-black tracking-wider text-slate-900 flex items-center gap-2">
            <Info className="text-indigo-600 animate-bounce" size={20} /> 🍼 保母級 Google Sites 免費架站教學
          </h3>
        </div>
        
        <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-600">
          <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-800 font-bold">
            🚀 本銷售網頁格式完美支援「Google 協作平台 (Google Sites)」，終身免主機費、免流量費，完全 100% 免費上線發布！
          </div>

          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">1</div>
            <div>
              <p className="font-bold text-slate-800">第一步：取得專屬網頁檔案</p>
              <p>點選本教學視窗下方的「① 立即匯出 HTML 並下載」按鈕，即可獲得一個包含精美文案與樣式的純網頁原始碼檔案（檔案名稱為 您的品牌_高轉換銷售頁.html）。</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">2</div>
            <div>
              <p className="font-bold text-slate-800">第二步：開啟並建立一個空白協作平台</p>
              <p>點選下方「② 前往 Google Sites」或直接前往 <a href="https://sites.google.com/new" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-bold">Google Sites 官網</a>。點選左上角巨大的的「空白 (+)」建立一個全新的網站專案。</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">3</div>
            <div>
              <p className="font-bold text-slate-800">第三步：清理不必要的預設標題</p>
              <p>Google Sites 建立後，畫面上會預設出現一個「頁面標題」黑色大橫幅。請將滑鼠移到它上面，點擊出現的 🗑️ <strong className="text-red-500">垃圾桶</strong> 把它刪除，維持整個工作區是純淨、全白的版面。</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">4</div>
            <div>
              <p className="font-bold text-slate-800">第四步：內嵌剛下載的網頁原始碼</p>
              <p>在 Google Sites 網頁右側工具列中點擊「<strong>內嵌 (Embed)</strong>」。</p>
              <p>在彈出的內嵌視窗中，點選切換至「<strong>內嵌程式碼 (Embed Code)</strong>」分頁。</p>
              <p>用電腦上的「記事本 (Notepad)」或文字編輯器打開您第一步下載的 .html 檔案，按鍵盤鍵 <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">Ctrl + A</kbd> (全選) 並複製它，然後將所有原始代碼一字不漏貼進 Google Sites，點選「下一步」，預覽無誤後按「插入」。</p>
            </div>
          </div>

          <div className="flex gap-4 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
            <div className="w-6 h-6 rounded-full bg-yellow-200 text-yellow-700 font-black flex items-center justify-center shrink-0">5</div>
            <div>
              <p className="font-bold text-yellow-800">⚠️ 第五步：向外拉伸至最滿版（新手常遺漏，必看！）</p>
              <p>滑鼠點選一下剛插入的銷售頁區塊，此時四周會出現數個<strong className="text-blue-600">藍色調整小圓點</strong>。</p>
              <p>請按住左右側的小藍圓點，<strong>向最左與最右用力拉滿</strong>，使其頂到 Google Sites 的最左與最右側外框；</p>
              <p>同時，請按住下方的小藍圓點，慢工細活地<strong>向下連續拉伸</strong>，直到整個銷售網頁完全拉直呈現，且右側不再出現重複的內嵌區塊滾動條為止（這樣能保證最完美的滑動體驗）。</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">6</div>
            <div>
              <p className="font-bold text-slate-800">第六步：點擊發布，完美上線</p>
              <p>確認預覽畫面與本產生器一致後，點擊 Google Sites 右上角的藍色按鈕「<strong>發布 (Publish)</strong>」。</p>
              <p>設定您的專屬網址後，恭喜您！您的超高轉換銷售頁正式上線，可以直接將網址貼到 IG 或 FB 開始接單！</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <button onClick={() => exportHTML(state)} className="py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-center shadow-md transition-all text-sm flex items-center justify-center gap-2">
            <Download size={18} /> ① 立即匯出 HTML 並下載
          </button>
          <a href="https://sites.google.com/new" target="_blank" rel="noreferrer" className="py-3.5 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-black rounded-xl text-center shadow-sm transition-all text-sm flex items-center justify-center gap-2">
            <ExternalLink size={18} /> ② 前往 Google Sites 🔗
          </a>
        </div>
      </div>
    </div>
  );
}
