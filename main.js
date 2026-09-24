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
            ${m.topic ? `<p class="topic">研究興趣：${esc(m.topic)}</p>` : ""}
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
  $("meetingList").innerHTML = SITE.meetings.length
    ? SITE.meetings
        .map(
          (m) => `<article class="card meeting"><h3>${esc(m.title)}</h3><p class="meeting-time">${esc(m.schedule)}</p>${
            m.location ? `<p class="meeting-location">${esc(m.location)}</p>` : ""
          }</article>`
        )
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
