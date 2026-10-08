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

  // 論文（依年份新到舊）
  const years = [...new Set(SITE.publications.map((p) => p.year))].sort((a, b) => b - a);
  $("pubList").innerHTML = years.length ? "" : empty;
  if (years.length) $("pubList").innerHTML = years
    .map(
      (y) => `<div class="pub-year"><h3>${y}</h3><ol>${SITE.publications
        .filter((p) => p.year === y)
        .map(
          (p) => `<li><span class="pub-title">${
            p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title)
          }</span><span class="pub-meta">${esc(p.authors)}．<em>${esc(p.venue)}</em></span></li>`
        )
        .join("")}</ol></div>`
    )
    .join("");

  // 學習資源：檔案確實部署成功才公開連結；避免 404
  const notes = SITE.notes || [];
  Promise.all(notes.map(async (note) => {
    try {
      const response = await fetch(note.file, { method: "HEAD" });
      return response.ok ? note : null;
    } catch (_) { return null; }
  })).then((available) => {
    const published = available.filter(Boolean);
    if (!published.length) return;
    $("notes").hidden = false;
    $("notesNav").hidden = false;
    $("noteList").innerHTML = published.map(n => `<article class="card note-card">
      <p class="note-category">${esc(n.category)}</p>
      <h3><a href="${esc(n.file)}" target="_blank" rel="noopener noreferrer">${esc(n.title)}</a></h3>
      <p class="note-meta">${esc(n.credit)}・${esc(n.date)}・${esc(n.pages)} 頁</p>
      <p><a href="${esc(n.file)}" target="_blank" rel="noopener noreferrer">閱讀 PDF ↗</a></p>
    </article>`).join("");
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
