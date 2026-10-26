/*
 * ================================================================
 *  網站內容設定檔 —— 想改網站文字，只要改這個檔案就好
 *  空白（""）或空清單（[]）的欄位，網站上會自動隱藏或顯示「尚待更新」
 * ================================================================
 */
const SITE = {
  // ---- 基本資料 ----
  groupName: "宇宙弦研究小組",
  groupNameEn: "Cosmic String Research Group",
  affiliation: "國立臺灣大學 物理學系",
  tagline: "從早期宇宙的相變，追尋時空中留下的線狀遺跡。",
  intro:
    "宇宙弦是早期宇宙在對稱性破缺的相變過程中，可能形成的一維拓樸缺陷。" +
    "它們若存在，會透過重力波、宇宙微波背景等觀測留下線索。" +
    "本小組關注宇宙弦的形成機制、網路演化，以及如何利用各種觀測資料尋找或限制宇宙弦的存在。",

  // ---- 聯絡資訊（空白的欄位不會顯示）----
  contact: {
    email: "",
    address: "106319 臺北市羅斯福路四段一號 國立臺灣大學 物理學系 天文數學館 8 樓研究室",
    phone: "",
    github: "",
  },

  // ---- 研究方向 ----
  research: [
    {
      icon: "◆",
      title: "宇宙弦的形成與拓樸缺陷",
      text: "研究早期宇宙相變中線狀拓樸缺陷的產生機制，以及弦論中的宇宙超弦（cosmic superstrings）。",
    },
    {
      icon: "◇",
      title: "弦網路演化與數值模擬",
      text: "以數值模擬探討宇宙弦網路隨宇宙膨脹的演化、迴圈的產生與衰變。",
    },
    {
      icon: "○",
      title: "重力波訊號",
      text: "分析宇宙弦迴圈產生的重力波爆發與隨機重力波背景，對應地面干涉儀與脈衝星計時陣列的觀測。",
    },
    {
      icon: "△",
      title: "宇宙微波背景觀測限制",
      text: "利用宇宙微波背景（CMB）的溫度與偏振資料，限制宇宙弦張力 Gμ 等參數。",
    },
  ],

  // ---- 成員 ----
  // 每一組的 people 清單可自由增減；清單為空時會顯示「尚待更新」
  // 每位成員可填：name（姓名）、role（職稱）、topic（研究主題）、office（研究室）、email
  members: [
    {
      group: "指導教授",
      people: [
        { name: "林奕安", role: "", topic: "", office: "天文數學館 820 室", email: "" },
        { name: "晏千博", role: "", topic: "", office: "天文數學館 819 室", email: "justin910912@gmail.com" },
        { name: "劉雨恩", role: "", topic: "", email: "" },
        { name: "張凱甯", role: "合聘研究員", topic: "電波天文學", office: "天文數學館 827 室", email: "" },
      ],
    },
    { group: "博士生", people: [
      { name: "林宥崴", role: "", topic: "宇宙拓樸", advisor: "晏千博", office: "", email: "" },
    ] },
    { group: "碩士生", people: [] },
    { group: "大學部", people: [] },
  ],

  // ---- 例行 Meeting ----
  meetings: [
    { title: "跨研究小組 Meeting", schedule: "上學期：每週四 19:00\n下學期：每週二 19:00", course: "理論物理專題", location: "天文數學館 818 會議室" },
    { title: "研究小組 Meeting", schedule: "每學期：每週五 13:30", course: "高等理論物理專題", location: "" },
  ],

  // ---- 論文發表（依年份自動分組）----
  // 已發表論文填入年份；尚在準備中的研究標為 status: "in preparation"，year 留空。
  publications: [
    {
      year: null,
      authors: "林奕安",
      title: "Lensing of Gravitational Waves by Cosmic Strings from Scattering Amplitudes",
      venue: "",
      link: "",
      status: "in preparation",
    },
  ],

  // ---- 最新消息 ----
  // 範例：{ date: "2026-09-24", text: "消息內容" }
  news: [
    { date: "2026.10.23", text: "10 月 29 日（四）的跨研究小組 Meeting 因期中考週暫停一次。原訂 10 月 30 日（五）的研究小組 Meeting 改於 10 月 29 日（四）17:00 舉行。" },
    { date: "2026.10.23", text: "受薔琵颱風影響，原訂 10 月 23 日（五）的研究小組 Meeting 調整至 10 月 22 日（四）跨研究小組 Meeting 結束後舉行。" },
    { date: "2026.10.08", text: "配合國慶連假，原訂 10 月 9 日（五）的研究小組 Meeting 調整至 10 月 8 日（四）跨研究小組 Meeting 結束後舉行。" },
    { date: "2026.10.04", text: "歡迎博士生林宥崴加入研究小組。" },
    { date: "2026.09.24", text: "歡迎合聘研究員張凱甯加入研究小組。" },
    { date: "2026.09.23", text: "配合中秋節連假，原訂 9 月 25 日（五）的研究小組 Meeting 調整至 9 月 24 日（四）10:30 舉行。" },
    { date: "2026.09.17", text: "研究小組成立。" },
  ],

  // ---- 學習資源：PDF 存在時才會顯示在網站上 ----
  notes: [
    {"title":"Massless Spectra from Cosmic String Cusps","category":"宇宙弦","date":"2026.08.07","pages":5,"file":"notes/CS.pdf","credit":"整理：晏千博"},
    {"title":"Cosmology","category":"宇宙學","date":"2026.09.04","pages":22,"file":"notes/cosmo.pdf","credit":"整理：晏千博"},
    {"title":"Gravitational Waves","category":"重力波","date":"2026.08.04","pages":7,"file":"notes/GW.pdf","credit":"整理：晏千博"},
    {"title":"Loop Quantum Gravity","category":"迴圈量子重力","date":"2026.08.31","pages":8,"file":"notes/LQG.pdf","credit":"整理：晏千博"}
  ],

  // ---- 招生 ----
  join:
    "歡迎對宇宙學、重力波或高能物理有興趣的同學與我們聯繫。" +
    "無論是想做理論推導、數值模擬或觀測資料分析，都可以一起討論適合的題目。",
};
