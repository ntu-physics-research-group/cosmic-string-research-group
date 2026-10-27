// 依 data.js 的內容產生網頁，一般不需要修改這個檔案
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.title = `${SITE.groupName}｜${SITE.affiliation}`;
  $("brand").textContent = SITE.groupName;
  $("affiliation").textContent = SITE.affiliation;
  $("groupName").textContent = SITE.groupName;
  $("groupNameEn").textContent = SITE.groupNameEn;
  $("tagline").textContent = SITE.tagline;
  $("intro").textContent = SITE.intro;

  // 研究方向
  $("researchList").innerHTML = SITE.research
    .map((r) => `<article class="card"><span class="icon">${esc(r.icon)}</span><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></article>`)
    .join("");

  const empty = '<p class="empty">尚待更新</p>';

  // 成員（依組別）
  $("memberList").innerHTML = SITE.members
    .map(
      (g) => `<h3 class="group-title">${esc(g.group)}</h3>${
        g.people.length
          ? `<div class="grid members">${g.people
              .map(
                (m) => `<article class="member">
            <div class="avatar" aria-hidden="true">${esc(m.name.slice(-2))}</div>
            <div><h4>${esc(m.name)}</h4>
            ${m.role ? `<p class="role">${esc(m.role)}</p>` : ""}
            ${m.topic ? `<p class="topic">${esc(m.topicLabel || "研究興趣")}：${m.topicLabel === "近期研究課題" ? `<em class="research-topic-title">${esc(m.topic)}</em>` : esc(m.topic)}</p>` : ""}
            ${m.advisor ? `<p class="advisor">指導教授：${esc(m.advisor)}</p>` : ""}
            ${m.office ? `<p class="office">研究室：${esc(m.office)}</p>` : ""}
            ${m.email ? `<a href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ""}</div>
          </article>`
              )
              .join("")}</div>`
          : empty
      }`
    )
    .join("");

  // 例行 Meeting
  const meetingSchedule = (schedule) =>
    String(schedule ?? "")
      .split(/\n|；/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const match = item.match(/^(上學期|下學期|每學期)[：:]\s*(.+)$/);
        return match
          ? `<div class="meeting-schedule-item"><span class="meeting-semester">${esc(match[1])}</span><span class="meeting-time">${esc(match[2])}</span></div>`
          : `<div class="meeting-schedule-item"><span class="meeting-time">${esc(item)}</span></div>`;
      })
      .join("");

  $("meetingList").innerHTML = SITE.meetings.length
    ? SITE.meetings
        .map((m) => `<article class="card meeting">
          <h3>${esc(m.title)}</h3>
          <div class="meeting-schedule">${meetingSchedule(m.schedule)}</div>
          ${m.course || m.location ? `<div class="meeting-details">
            ${m.course ? `<p class="meeting-course">${esc(m.course)}</p>` : ""}
            ${m.location ? `<p class="meeting-location">${esc(m.location)}</p>` : ""}
          </div>` : ""}
        </article>`)
        .join("")
    : empty;

  // 論文：已發表按年份排列，準備中的研究獨立列出。
  const publications = SITE.publications || [];
  const published = publications.filter((p) => p.status !== "in preparation" && Number.isInteger(p.year));
  const preparing = publications.filter((p) => p.status === "in preparation" || !Number.isInteger(p.year));
  const renderPublication = (p) => {
    const title = p.link
      ? `<a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a>`
      : esc(p.title);
    const status = p.status === "in preparation" ? ' <span class="pub-status">(in preparation)</span>' : "";
    const meta = [
      p.authors ? esc(p.authors) : "",
      p.venue ? `<em>${esc(p.venue)}</em>` : "",
    ].filter(Boolean).join("．");
    return `<li><span class="pub-title">${title}${status}</span>${meta ? `<span class="pub-meta">${meta}</span>` : ""}</li>`;
  };
  const years = [...new Set(published.map((p) => p.year))].sort((a, b) => b - a);
  const pubGroups = years.map(
    (y) => `<div class="pub-year"><h3>${y}</h3><ol>${published
      .filter((p) => p.year === y)
      .map(renderPublication)
      .join("")}</ol></div>`
  );
  if (preparing.length) {
    pubGroups.push(`<div class="pub-year pub-pending"><ol>${preparing.map(renderPublication).join("")}</ol></div>`);
  }
  $("pubList").innerHTML = pubGroups.length ? pubGroups.join("") : empty;

  // 學習資源：檔案確實部署成功才公開連結；避免 404
  const notes = SITE.notes || [];
  $("noteList").innerHTML = empty;
  Promise.all(notes.map(async (note) => {
    try {
      const response = await fetch(note.file, { method: "HEAD" });
      return response.ok ? note : null;
    } catch (_) { return null; }
  })).then((available) => {
    const published = available.filter(Boolean);
    published.sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
    $("noteList").innerHTML = published.length ? published.map(n => `<article class="card note-card">
      <p class="note-category">${esc(n.category)}</p>
      <h3><a href="${esc(n.file)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(n.title)}（開啟 PDF）">${esc(n.title)}</a></h3>
      <p class="note-meta">${esc(n.credit)}・${esc(n.date)}・${esc(n.pages)} 頁</p>
    </article>`).join("") : empty;
  });

  // 學習資源：首頁僅切換分類，不展開所有外部資源。
  // 外部資源獨立於 data.js，避免 Notion 同步覆寫。
  const resourceGroups = {
      "tools": [
          {
              "title": "Ned Wright's Cosmology Calculator",
              "description": "計算紅移、宇宙學距離、宇宙年齡與回望時間",
              "url": "https://www.astro.ucla.edu/~wright/CosmoCalc.html"
          },
          {
              "title": "CAMB Online",
              "description": "在瀏覽器計算 CMB 功率譜與宇宙學模型",
              "url": "https://lambda.gsfc.nasa.gov/toolbox/camb_online.html"
          },
          {
              "title": "Colossus",
              "description": "線上計算宇宙學量與大尺度結構相關量",
              "url": "https://colossus.astro.umd.edu/"
          },
          {
              "title": "CosmoSlider",
              "description": "互動比較宇宙學參數對 CMB 頻譜的影響",
              "url": "https://aarhuscosmology.github.io/CosmoSliderWeb/"
          }
      ],
      "software": [
          {
              "title": "Astropy Cosmology",
              "description": "Python 宇宙學距離、時間及單位計算",
              "url": "https://docs.astropy.org/en/latest/cosmology/index.html"
          },
          {
              "title": "Bilby",
              "description": "貝氏參數推論與重力波資料分析",
              "url": "https://bilby-dev.github.io/bilby/"
          },
          {
              "title": "CAMB",
              "description": "CMB、物質功率譜與轉移函數計算",
              "url": "https://camb.readthedocs.io/"
          },
          {
              "title": "CLASS",
              "description": "線性宇宙學微擾、CMB 與大尺度結構預測",
              "url": "https://class-code.net/"
          },
          {
              "title": "Cobaya",
              "description": "宇宙學 likelihood、MCMC 與貝氏推論",
              "url": "https://cobaya.readthedocs.io/en/latest/"
          },
          {
              "title": "GetDist",
              "description": "MCMC chains 分析與參數後驗分布繪圖",
              "url": "https://getdist.readthedocs.io/"
          },
          {
              "title": "healpy",
              "description": "HEALPix 全天圖、球諧轉換與功率譜處理",
              "url": "https://healpy.readthedocs.io/"
          },
          {
              "title": "NaMaster",
              "description": "遮罩天空的角功率譜估計及 E/B mode 處理",
              "url": "https://namaster.readthedocs.io/en/latest/"
          }
      ],
      "observations": [
          {
              "title": "ACT DR6",
              "description": "ACT CMB 溫度、偏振、beam 與功率譜資料產品",
              "url": "https://lambda.gsfc.nasa.gov/product/act/act_dr6.02/index.html"
          },
          {
              "title": "DESI Data",
              "description": "DESI 光譜巡天、星系及 BAO 相關資料",
              "url": "https://data.desi.lbl.gov/doc/releases/"
          },
          {
              "title": "GWOSC",
              "description": "LIGO、Virgo、KAGRA 的重力波事件及 strain data",
              "url": "https://gwosc.org/"
          },
          {
              "title": "IPTA Data",
              "description": "國際脈衝星計時陣列公開資料",
              "url": "https://www.ipta4gw.org/data-release/"
          },
          {
              "title": "NASA LAMBDA",
              "description": "CMB 與相關宇宙學觀測資料庫",
              "url": "https://lambda.gsfc.nasa.gov/"
          },
          {
              "title": "NANOGrav Data",
              "description": "脈衝星計時陣列資料與重力波背景分析產品",
              "url": "https://nanograv.org/science/data"
          },
          {
              "title": "Planck Legacy Archive",
              "description": "Planck 全天圖、頻譜及任務資料產品",
              "url": "https://pla.esac.esa.int/"
          },
          {
              "title": "VizieR",
              "description": "查詢已發表的天文星表與資料表",
              "url": "https://vizier.cds.unistra.fr/vizier/"
          }
      ],
      "sky": [
          {
              "title": "Aladin Lite",
              "description": "互動式天空圖集、巡天影像與星表疊圖",
              "url": "https://aladin.cds.unistra.fr/AladinLite/"
          },
          {
              "title": "ESASky",
              "description": "多波段天文觀測與任務資料視覺化",
              "url": "https://sky.esa.int/"
          },
          {
              "title": "Legacy Survey Sky Viewer",
              "description": "互動瀏覽 DESI Legacy Surveys 天空影像",
              "url": "https://www.legacysurvey.org/viewer"
          },
          {
              "title": "WorldWide Telescope",
              "description": "互動式天空、天體與巡天資料探索",
              "url": "https://worldwidetelescope.org/home/"
          }
      ],
      "literature": [
          {
              "title": "arXiv",
              "description": "搜尋與閱讀宇宙學、重力及高能物理預印本",
              "url": "https://arxiv.org/"
          },
          {
              "title": "INSPIRE-HEP",
              "description": "高能物理、重力與相關理論文獻檢索",
              "url": "https://inspirehep.net/literature"
          },
          {
              "title": "NASA ADS",
              "description": "天文物理論文、引用與書目資料檢索",
              "url": "https://ui.adsabs.harvard.edu/"
          }
      ]
  };
  const resourceLimit = 6;
  Object.entries(resourceGroups).forEach(([group, items]) => {
    items.sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
    const list = $("resourceList-" + group);
    const more = $("resourceMore-" + group);
    let expanded = false;
    const render = () => {
      list.innerHTML = items.slice(0, expanded ? items.length : resourceLimit)
        .map((item) => '<a class="resource-item" href="' + esc(item.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="resource-title">' + esc(item.title) + '</span>' +
          '<span class="resource-description">' + esc(item.description) + '</span></a>')
        .join("");
      more.hidden = items.length <= resourceLimit;
      if (!more.hidden) {
        more.textContent = expanded ? "收起" : "顯示更多（" + (items.length - resourceLimit) + "）";
        more.setAttribute("aria-expanded", String(expanded));
      }
    };
    more.addEventListener("click", () => { expanded = !expanded; render(); });
    render();
  });

  const resourceTabs = Array.from(document.querySelectorAll("#notes .resource-tab"));
  const activateResourceTab = (active, focus = false) => {
    resourceTabs.forEach((tab) => {
      const selected = tab === active;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      $(tab.getAttribute("aria-controls")).hidden = !selected;
    });
    if (focus) active.focus();
  };
  resourceTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateResourceTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % resourceTabs.length;
      else if (event.key === "ArrowLeft") next = (index + resourceTabs.length - 1) % resourceTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = resourceTabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activateResourceTab(resourceTabs[next], true);
      }
    });
  });

  // 最新消息
  $("newsList").innerHTML = SITE.news.length
    ? SITE.news.map((n) => `<li><time>${esc(n.date)}</time><span>${esc(n.text)}</span></li>`).join("")
    : `<li class="empty">尚待更新</li>`;

  // 加入我們、聯絡
  $("joinText").textContent = SITE.join;
  const c = SITE.contact;
  if (c.email) $("joinMail").href = `mailto:${c.email}`;
  else $("joinMail").remove();
  $("contactList").innerHTML = [
    c.email ? ["Email", `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`] : null,
    c.address ? ["地址", esc(c.address)] : null,
    c.phone ? ["電話", esc(c.phone)] : null,
    c.github ? ["GitHub", `<a href="${esc(c.github)}" target="_blank" rel="noopener">${esc(c.github)}</a>`] : null,
  ]
    .filter(Boolean)
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");

  $("footer").textContent = `© ${new Date().getFullYear()} ${SITE.groupName}・${SITE.affiliation}`;

  // 手機選單
  const btn = $("menuBtn"), nav = $("nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
  });
})();
