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

## 🤖 靜態部署至 GitHub Pages

本專案已內建自動化部署的 GitHub Actions 腳本。每當您推送更新至 `main` 分支時，系統會自動編譯並部署至 GitHub Pages。

### 🔧 部署前置設定

1. **啟用 Action 寫入權限**：
   - 進入 GitHub 專案倉庫 (Repository) 頁面。
   - 點選右上角的 **Settings** ⚙️。
   - 在左側選單點選 **Actions** -> **General**。
   - 滾動至下方 **Workflow permissions**，勾選 🔘 **Read and write permissions**，並點選 **Save** 保存。
2. **設定 GitHub Secrets (選用)**：
   - 如果您需要自訂 `VITE_BASE_PATH`，請至專案 Settings -> **Secrets and variables** -> **Actions**。
   - 點選 **New repository secret**，新增名稱為 `VITE_BASE_PATH` 的變數，並填入您的子路徑網址（例如 `/<your-repo-name>/`）。
   - *提示：如果未設定，GitHub Actions 預設會使用 `./` 相對路徑編譯，即可完美相容並正確載入所有樣式。*

### 🚀 部署操作流程

1. **提交代碼並推送到 GitHub**：
   - 在本地終端執行提交（已為您在 master/main 初始化並提交）：
     ```bash
     git add .
     git commit -m "feat: setup env template, workflows and release configuration"
     ```
   - 關聯您的 GitHub 遠端倉庫並推送：
     ```bash
     git remote add origin https://github.com/您的帳號/您的專案名稱.git
     git push -u origin main
     ```
2. **追蹤部署狀態**：
   - 推送成功後，前往您的 GitHub 專案頁面，點選頂部選單的 **Actions** 標籤。
   - 您會看到名為 **Deploy to GitHub Pages** 的工作流程正在執行。
   - 綠色勾勾出現後，代表已自動部署至 `gh-pages` 分支。
3. **查看您的線上網頁**：
   - 部署完成後，您可以在 GitHub 專案 Settings -> **Pages** 標籤中找到您的專屬線上 URL，網址通常為：
     `https://<您的GitHub帳號>.github.io/<您的專案名稱>/`
