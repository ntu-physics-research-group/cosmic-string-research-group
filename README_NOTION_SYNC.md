# Notion 同步至宇宙弦研究小組網站指南

本文件供開發者或 GPT 檢查與維護此專案的 Notion 自動同步機制。

---

## 1. 架構說明
* **資料來源**：Notion 宇宙弦研究小組管理頁面
  * **Notion 根頁面**：https://app.notion.com/p/3ea28413d5c08005931cc960a843d24b
  * **內嵌資料庫 ID 清單**：
    1. **最新消息**：`3ea28413-d5c0-81df-8330-cb08aafcd5d1`（欄位：`消息內容`、`發布日期`）
    2. **成員名單**：`3ea28413-d5c0-814a-95f3-fd4b9def1ddd`（欄位：`姓名`、`身分分組`、`職稱`、`研究主題`、`研究室`、`Email`、`排序`）
    3. **例行會議**：`3ea28413-d5c0-8107-9549-d64b7031b281`（欄位：`會議名稱`、`固定時間`、`地點`、`排序`）
    4. **論文發表**：`3ea28413-d5c0-81e4-b7d9-e7d0bb3175e8`（欄位：`論文標題`、`發表年份`、`作者群`、`期刊或會議`、`論文連結`）
* **同步腳本**：`scripts/sync_cosmic_data.py`
  * 讀取 Notion 四個資料庫資料並轉譯為 `data.js` 中的 `SITE` 物件。
  * **排序規則**：
    * **成員名單**：網站前端由左至右卡片對應 Notion「排序」欄位（純整數 1, 2, 3, 4 遞增）。腳本強制依 `排序` 升冪輸出，消除 Notion API 預設倒序問題。
    * **最新消息**：依 `發布日期` 倒序輸出（最新在最前）。
    * **例行會議**：依 `排序` 欄位升冪輸出。
    * **論文發表**：依 `發表年份` 倒序輸出。
* **輸出目標**：`/data.js`（靜態網頁前端直接載入渲染）。

---

## 2. GitHub Secrets 設定需求
若要在 GitHub Actions 自動排程同步，需至儲存庫 **Settings > Secrets and variables > Actions** 新增以下機密：
* `NOTION_TOKEN`：Notion 整合授權權杖
* `NOTION_NEWS_DB`：`3ea28413-d5c0-81df-8330-cb08aafcd5d1`
* `NOTION_MEMBER_DB`：`3ea28413-d5c0-814a-95f3-fd4b9def1ddd`
* `NOTION_MEETING_DB`：`3ea28413-d5c0-8107-9549-d64b7031b281`
* `NOTION_PUB_DB`：`3ea28413-d5c0-81e4-b7d9-e7d0bb3175e8`

---

## 3. GitHub Action 啟用方式
* 工作流程範本位於 `scripts/sync_notion.yml`。
* 若要啟用自動排程，請將該檔案移動或複製到 `.github/workflows/sync_notion.yml`（需確認 GitHub PAT 具備 `workflow` 權限）。

---

## 4. 學習資源 PDF

網站已預留「學習資源」區塊，預定使用原稿 PDF，不改動文件正文。四份檔案：
- `notes/CS.pdf` — Massless Spectra from Cosmic String Cusps（5 頁，2026-08-07）
- `notes/cosmo.pdf` — Cosmology（22 頁，2026-09-04）
- `notes/GW.pdf` — Gravitational Waves（7 頁，2026-08-04）
- `notes/LQG.pdf` — Loop Quantum Gravity（8 頁，2026-08-31）

在四份原稿 PDF 實際放入 `notes/` 後，網站才會顯示相應講義及下載連結（瀏覽器先以 HEAD 驗證）。未上傳的檔案不會出現 404 連結。文件署名依原稿「Edited by Yan Qian-Bo」，本站標示為「整理：晏千博」。

注意：`scripts/sync_notion.yml` 尚為 workflow 範本，並未設在 `.github/workflows/`，所以日常資料更新不會自動同步。同步腳本已支援「成員名單」資料庫新增的「指導教授」欄位，並會保留 `notes` 資源清單。

2026-09-24 及 2026-10-08 的 Meeting 改期為**單次異動**，刊登在最新消息，不應覆寫例行會議的每週固定時間。
