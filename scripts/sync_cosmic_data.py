import os
import json
import requests
from typing import Dict, Any, List

NOTION_API_VERSION = "2022-06-28"
NOTION_API_URL = "https://api.notion.com/v1"

NOTE_RESOURCES = [
    {
        "title": "Massless Spectra from Cosmic String Cusps",
        "category": "宇宙弦",
        "date": "2026.08.07",
        "pages": 5,
        "file": "notes/CS.pdf",
        "credit": "整理：晏千博"
    },
    {
        "title": "Cosmology",
        "category": "宇宙學",
        "date": "2026.09.04",
        "pages": 22,
        "file": "notes/cosmo.pdf",
        "credit": "整理：晏千博"
    },
    {
        "title": "Gravitational Waves",
        "category": "重力波",
        "date": "2026.08.04",
        "pages": 7,
        "file": "notes/GW.pdf",
        "credit": "整理：晏千博"
    },
    {
        "title": "Loop Quantum Gravity",
        "category": "迴圈量子重力",
        "date": "2026.08.31",
        "pages": 8,
        "file": "notes/LQG.pdf",
        "credit": "整理：晏千博"
    }
]

def query_notion_db(token: str, db_id: str) -> List[Dict[str, Any]]:
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json"
    }
    url = f"{NOTION_API_URL}/databases/{db_id}/query"
    items = []
    has_more = True
    start_cursor = None
    while has_more:
        payload = {"page_size": 100}
        if start_cursor:
            payload["start_cursor"] = start_cursor
        res = requests.post(url, headers=headers, json=payload, timeout=30)
        res.raise_for_status()
        data = res.json()
        items.extend(data.get("results", []))
        has_more = data.get("has_more", False)
        start_cursor = data.get("next_cursor")
    return items

def extract_prop(page: dict, name: str, ptype: str) -> Any:
    props = page.get("properties", {})
    p = props.get(name, {})
    if ptype == "title":
        return "".join([x.get("plain_text", "") for x in p.get("title", [])]).strip()
    elif ptype == "rich_text":
        return "".join([x.get("plain_text", "") for x in p.get("rich_text", [])]).strip()
    elif ptype == "number":
        return p.get("number")
    elif ptype == "select":
        sel = p.get("select")
        return sel.get("name") if sel else None
    elif ptype == "email":
        return p.get("email") or ""
    elif ptype == "url":
        return p.get("url") or ""
    return ""

def sync_cosmic_data_js(
    notion_token: str,
    news_db_id: str,
    member_db_id: str,
    meeting_db_id: str,
    pub_db_id: str,
    data_js_path: str
):
    # 1. Fetch News (Sort by date descending: newest on top)
    raw_news = query_notion_db(notion_token, news_db_id)
    news_list = []
    for item in raw_news:
        text = extract_prop(item, "消息內容", "title")
        date = extract_prop(item, "發布日期", "rich_text")
        if text:
            news_list.append({"date": date, "text": text})
    news_list.sort(key=lambda x: x["date"], reverse=True)
    
    # 2. Fetch Members (Sort strictly by "排序" ascending: 1 -> 2 -> 3 -> 4, maps to Left -> Right)
    raw_members = query_notion_db(notion_token, member_db_id)
    group_order = ["指導教授", "博士生", "碩士生", "大學部", "研究人員"]
    grouped_members = {g: [] for g in group_order}
    
    for item in raw_members:
        name = extract_prop(item, "姓名", "title")
        if not name:
            continue
        group = extract_prop(item, "身分分組", "select") or "指導教授"
        role = extract_prop(item, "職稱", "rich_text")
        topic = extract_prop(item, "研究主題", "rich_text")
        topic_label = extract_prop(item, "研究顯示標籤", "rich_text")
        advisor = extract_prop(item, "指導教授", "rich_text")
        office = extract_prop(item, "研究室", "rich_text")
        email = extract_prop(item, "Email", "email")
        sort_num = extract_prop(item, "排序", "number")
        if sort_num is None:
            sort_num = 9999
            
        person_obj = {
            "name": name,
            "role": role,
            "topic": topic,
            "topicLabel": topic_label,
            "advisor": advisor,
            "office": office,
            "email": email,
            "_sort": sort_num
        }
        if group not in grouped_members:
            grouped_members[group] = []
        grouped_members[group].append(person_obj)
        
    final_members_structure = []
    for g in group_order:
        people = grouped_members.get(g, [])
        # Sort by explicit "排序" ascending
        people.sort(key=lambda p: p["_sort"])
        # Remove internal sort key before writing to data.js
        cleaned_people = [
            {k: v for k, v in p.items() if k != "_sort"}
            for p in people
        ]
        final_members_structure.append({
            "group": g,
            "people": cleaned_people
        })
        
    # 3. Fetch Meetings (Sort strictly by "排序" ascending)
    raw_meetings = query_notion_db(notion_token, meeting_db_id)
    meeting_list = []
    for item in raw_meetings:
        title = extract_prop(item, "會議名稱", "title")
        schedule = extract_prop(item, "固定時間", "rich_text").replace("；", "\n")
        course = extract_prop(item, "課程名稱", "rich_text")
        location = extract_prop(item, "地點", "rich_text")
        sort_num = extract_prop(item, "排序", "number")
        if sort_num is None:
            sort_num = 9999
        if title:
            meeting_list.append({
                "title": title,
                "schedule": schedule,
                "course": course,
                "location": location,
                "_sort": sort_num
            })
    meeting_list.sort(key=lambda m: m["_sort"])
    cleaned_meetings = [
        {k: v for k, v in m.items() if k != "_sort"}
        for m in meeting_list
    ]
            
    # 4. Fetch Publications (Sort by year descending)
    raw_pubs = query_notion_db(notion_token, pub_db_id)
    pub_list = []
    for item in raw_pubs:
        title = extract_prop(item, "論文標題", "title")
        year = extract_prop(item, "發表年份", "number")
        authors = extract_prop(item, "作者群", "rich_text")
        venue = extract_prop(item, "期刊或會議", "rich_text")
        link = extract_prop(item, "論文連結", "url")
        if title:
            pub_list.append({
                "year": year or 2026,
                "authors": authors,
                "title": title,
                "venue": venue,
                "link": link
            })
    pub_list.sort(key=lambda x: x["year"], reverse=True)
    
    # 5. Output cleanly formatted data.js
    new_code = f"""/*
 * ================================================================
 *  網站內容設定檔 —— 自動由 Notion 同步產生
 * ================================================================
 */
const SITE = {{
  // ---- 基本資料 ----
  groupName: "宇宙弦研究小組",
  groupNameEn: "Cosmic String Research Group",
  affiliation: "國立臺灣大學 物理學系",
  tagline: "從早期宇宙的相變，追尋時空中留下的線狀遺跡。",
  intro:
    "宇宙弦是早期宇宙在對稱性破缺的相變過程中，可能形成的一維拓樸缺陷。" +
    "它們若存在，會透過重力波、宇宙微波背景等觀測留下線索。" +
    "本小組關注宇宙弦的形成機制、網路演化，以及如何利用各種觀測資料尋找或限制宇宙弦的存在。",

  // ---- 聯絡資訊 ----
  contact: {{
    email: "",
    address: "106319 臺北市羅斯福路四段一號 國立臺灣大學 物理學系 天文數學館 8 樓研究室",
    phone: "",
    github: "",
  }},

  // ---- 研究方向 ----
  research: [
    {{
      icon: "◆",
      title: "宇宙弦的形成與拓樸缺陷",
      text: "研究早期宇宙相變中線狀拓樸缺陷的產生機制，以及弦論中的宇宙超弦（cosmic superstrings）。",
    }},
    {{
      icon: "◇",
      title: "弦網路演化與數值模擬",
      text: "以數值模擬探討宇宙弦網路隨宇宙膨脹的演化、迴圈的產生與衰變。",
    }},
    {{
      icon: "○",
      title: "重力波訊號",
      text: "分析宇宙弦迴圈產生的重力波爆發與隨機重力波背景，對應地面干涉儀與脈衝星計時陣列的觀測。",
    }},
    {{
      icon: "△",
      title: "宇宙微波背景觀測限制",
      text: "利用宇宙微波背景（CMB）的溫度與偏振資料，限制宇宙弦張力 Gμ 等參數。",
    }},
  ],

  // ---- 成員 ----
  members: {json.dumps(final_members_structure, ensure_ascii=False, indent=4)},

  // ---- 例行 Meeting ----
  meetings: {json.dumps(cleaned_meetings, ensure_ascii=False, indent=4)},

  // ---- 論文發表 ----
  publications: {json.dumps(pub_list, ensure_ascii=False, indent=4)},

  // ---- 最新消息 ----
  news: {json.dumps(news_list, ensure_ascii=False, indent=4)},

  // ---- 學習資源：PDF 位於 notes/，僅上傳成功後才會顯示 ----
  notes: {json.dumps(NOTE_RESOURCES, ensure_ascii=False, indent=4)},

  // ---- 招生 ----
  join:
    "歡迎對宇宙學、重力波或高能物理有興趣的同學與我們聯繫。" +
    "無論是想做理論推導、數值模擬或觀測資料分析，都可以一起討論適合的題目。",
}};
"""
    with open(data_js_path, "w", encoding="utf-8") as f:
        f.write(new_code)
    print(f"Successfully synced Notion to {data_js_path}")

if __name__ == "__main__":
    token = os.getenv("NOTION_TOKEN")
    news_db = os.getenv("NOTION_NEWS_DB")
    member_db = os.getenv("NOTION_MEMBER_DB")
    meeting_db = os.getenv("NOTION_MEETING_DB")
    pub_db = os.getenv("NOTION_PUB_DB")
    path = os.getenv("DATA_JS_PATH", "data.js")
    
    if not token or not news_db:
        print("Error: Missing required Notion environment variables.")
        exit(1)
        
    sync_cosmic_data_js(token, news_db, member_db, meeting_db, pub_db, path)
