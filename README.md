# 🚀 高轉換銷售頁產生器 (Sales Page Generator)

本專案是一個專為一人公司經營者、顧問及數位創作者設計的 **高轉換銷售頁面產生器**。透過簡單直覺的左側編輯卡片與拖曳排序，搭配 AI 網站企劃助理，即可即時預覽並一鍵匯出符合 Google Sites 格式的銷售網頁。

---

## ✨ 核心特色

1. **視覺化即時編輯 (WYSIWYG)**：在右側預覽畫面直接「點選文字」即可編輯內容，直覺好上手。
2. **多載具即時響應**：支援一鍵切換「電腦」、「平板」、「手機」預覽版面。
3. **AI 智慧網站企劃**：整合 AI 結構式文案，提供一鍵分析與範例提示填寫功能（提示內容設為灰底）。
4. **全站色彩配置**：提供 4 款極致調和的風格配色集，並支援自訂 Primary/Accent/Background/Text 顏色。
5. **模組拖拉與顯示切換**：在「佈局排序」分頁，可隨時隱藏或啟用特定板塊，並支援順序拖曳排列。
6. **永久免費部署**：生成的網頁可一鍵匯出為純 HTML，完美支援內嵌至 Google Sites，終身免主機與流量費。

---

## 🛠️ 技術棧

- **核心框架**：React 19, Vite 8, Zustand 5 (狀態管理)
- **樣式管理**：Tailwind CSS v4 (極速編譯)
- **拖曳排列**：@hello-pangea/dnd (相容 React 19 的拖曳套件)
- **圖標庫**：Lucide React, FontAwesome v6
- **沙盒渲染**：HTML5 Iframe Sandboxing (保障 live-editing 獨立樣式)

---

## ⚙️ 環境變數設定

本專案提供 `.env.example` 作為環境設定範本。

### 環境變數說明

- `VITE_BASE_PATH`：設定專案編譯後的基礎路徑 (Base Path)。
  - 若設定為 `./`（預設值），將使用**相對路徑**編譯。此設定相容性最高，可隨意部署在任何子目錄下（例如 GitHub Pages 預設的 `https://<username>.github.io/<repo-name>/`），不會發生資產 404 載入錯誤。
  - 若設定為特定的絕對路徑（如 `/my-app/`），則資源會從該路徑根目錄加載。

### 本地設定步驟

1. 複製並命名環境變數檔：
   ```bash
   cp .env.example .env
   ```
2. 根據您的部署環境調整 `VITE_BASE_PATH`。

---

## 🚀 部署到 Vercel（推薦，AI 功能可正常運作）

GitHub Pages 為純靜態主機、無後端，AI 代理（`/api/generate`）無法執行，AI 生成會降級為本地範本。
若要讓線上 AI 真正運作，請部署到 **Vercel**（前端 + serverless 代理一站搞定）。專案已內含 [`vercel.json`](vercel.json) 與 [`api/generate.js`](api/generate.js)，開箱即用。

### 方式 A：Vercel 儀表板匯入（推薦，含自動 CI/CD）

1. 登入 [vercel.com](https://vercel.com/) → **Add New… → Project** → 匯入本 GitHub 倉庫。
2. Framework 會自動偵測為 **Vite**，建置設定無須更動，直接 **Deploy**。
3. 部署後到 **Settings → Environment Variables** 新增：
   - `GEMINI_API_KEY`：你的 Gemini API Key（必填）
   - `ALLOWED_ORIGIN`：允許呼叫代理的網域，例如 `https://你的專案.vercel.app`（選填，建議鎖定）
4. 回到 **Deployments** 點 **Redeploy** 讓環境變數生效。
5. 之後每次 `git push` 到 `main`，Vercel 會自動重新部署。

### 方式 B：Vercel CLI（一次性指令部署）

```bash
npm i -g vercel          # 安裝 CLI
vercel login             # 用瀏覽器登入你的帳號
vercel link              # 在專案根目錄連結 / 建立 Vercel 專案
vercel env add GEMINI_API_KEY production   # 貼上你的 Key
vercel --prod            # 正式部署
```

> 前端的 `VITE_AI_PROXY_URL` 留空即可（預設打同源 `/api/generate`）。
> 若代理未部署或連線失敗，AI 生成會自動降級為「本地備用智慧生成系統」，不影響其他功能。

> **註：** 本專案已改用 Vercel 部署，原 GitHub Pages 的 `.github/workflows/deploy.yml` 已移除。
> 若 GitHub 倉庫的 Pages 仍為啟用狀態，可至 **Settings → Pages** 一併停用。

---

## 💻 本地開發與編譯

請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (推薦版本 v20 以上)。

1. **安裝依賴套件**：
   ```bash
   npm install
   ```
2. **啟動本地開發伺服器**：
   ```bash
   npm run dev
   ```
   啟動後，在瀏覽器打開 `http://localhost:5173/` 即可進行即時開發與調整。
3. **編譯生產版本**：
   ```bash
   npm run build
   ```
   編譯產生的靜態資源將輸出至 `./dist` 目錄下。

---

## 🌐 線上部署

本專案使用 **Vercel** 部署（前端 + AI serverless 代理一站完成），詳見上方
[「🚀 部署到 Vercel」](#-部署到-vercelai-功能可正常運作) 章節。連結 GitHub 倉庫後，
每次 `git push` 到 `main` 即自動重新部署。
