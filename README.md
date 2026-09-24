# 研究小組網站

純 HTML／CSS／JavaScript，不需要安裝或編譯，直接放上 GitHub Pages 就能用。

## 檔案說明

| 檔案 | 用途 |
|---|---|
| `data.js` | **網站所有文字內容**（小組名稱、研究方向、成員、論文、消息、聯絡方式）。要改內容只改這個檔。 |
| `index.html` | 頁面骨架 |
| `style.css` | 外觀樣式（主色在最上方 `--accent`） |
| `main.js` | 把 `data.js` 內容填進網頁，一般不用動 |
| `.nojekyll` | 告訴 GitHub Pages 直接發布檔案 |

## 放上 GitHub Pages（網頁操作，不需指令）

1. 登入 GitHub，右上角「+」→ **New repository**。
2. Repository name 例如填 `research-group`，選 **Public**，按 **Create repository**。
3. 在新 repo 頁面點 **uploading an existing file**，把這個資料夾裡的所有檔案拖進去（包含 `.nojekyll`），按 **Commit changes**。
4. 進入 repo 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾 `/ (root)`，按 **Save**。
5. 等約一兩分鐘，網址會是 `https://<你的帳號>.github.io/research-group/`。

> 如果 repo 名稱取成 `<你的帳號>.github.io`，網址就會是 `https://<你的帳號>.github.io/`；但每個帳號只能有一個這種 repo，你的觀影清單已經用掉了，所以研究小組網站請用其他名稱。

## 之後修改內容

在 GitHub 上點開 `data.js` → 右上鉛筆圖示編輯 → **Commit changes**，網站一兩分鐘後自動更新。
