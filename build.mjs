// 靜態頁面產生器：node build.mjs
// 讀取 src/data.js 與 src/ui.js，輸出 index.html（中文）與 en/index.html（英文）。
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["src/data.js", "src/ui.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx);
const { CV, CV_UI: UI } = ctx.window;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const titleCaseDate = (d, lang) => {
  const s = d.replace(/\s*~\s*/g, " – ");
  return lang === "en" ? s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase()) : s;
};
// 「標題： 內文」拆成粗體標題 + 內文；只在標題夠短、不像句子時才拆
function lead(text, lang) {
  const m = text.match(new RegExp("^([^：:，,。.;；]{1," + (lang === "en" ? 28 : 12) + "})(：|:)\\s*(.*)$", "s"));
  return m ? `<strong>${esc(m[1])}</strong> ${esc(m[3])}` : esc(text);
}
const paras = (text, lang) => text.split("\n").filter(Boolean).map((p) => `<p>${lead(p, lang)}</p>`).join("");

function build(lang) {
  const t = UI[lang], d = CV[lang], c = CV.contact, other = lang === "zh" ? "en" : "zh";
  const url = UI.site + t.path;
  const up = lang === "zh" ? "" : "../"; // 相對路徑，讓檔案直接開啟也能預覽
  const otherHref = lang === "zh" ? "en/index.html" : "../index.html";
  const chev = `<svg class="chev" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const gallery = (i) => {
    const im = UI.projectImages[i] || [];
    if (!im.length) return "";
    return `<div class="gallery${im.length === 1 ? " one" : ""}">${im.map((m) => `<button class="shot" type="button" data-lightbox data-group="p${i}" data-src="${up}assets/img/${m.f}" data-cap="${esc(m[lang])}" aria-label="${esc(m[lang])}, ${esc(t.zoom)}"><img src="${up}assets/img/${m.f}" alt="" loading="lazy" decoding="async"><span class="shot-cap">${esc(m[lang])}</span></button>`).join("")}</div>`;
  };

  // AI 答案示意
  const answer = t.ai.answer.map((p) => (typeof p === "string" ? esc(p) : (() => {
    const s = t.ai.sources.find((x) => x.n === p.c);
    return `<sup><a class="cite" href="${s.href}" data-n="${p.c}" aria-label="${esc(s.label)}">${p.c}</a></sup>`;
  })())).join("");
  const sources = t.ai.sources.map((s) => `<li><a href="${s.href}" data-n="${s.n}"><span class="n">${s.n}</span><span>${esc(s.label)}</span></a></li>`).join("");

  const metrics = t.metrics.map((m) => `<li><a class="metric" href="#project-${m.idx}"><b class="num" data-to="${m.to}" data-suffix="${m.suffix}">${m.to.toLocaleString("en-US")}${m.suffix}</b><span>${esc(m.label)}</span></a></li>`).join("");

  // 核心職能分頁
  const comps = d.competencies;
  const tabs = comps.map((x, i) => `<button role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" type="button">${esc(x.title)}</button>`).join("");
  const panels = comps.map((x, i) => `<div role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}"><dl>${x.items.map((it) => {
    const k = it.indexOf(": "); const term = k > 0 ? it.slice(0, k) : ""; const rest = k > 0 ? it.slice(k + 2) : it;
    return `<div><dt>${esc(term)}</dt><dd>${esc(rest)}</dd></div>`;
  }).join("")}</dl></div>`).join("");

  // 工作經歷
  const jobs = d.experience.map((j, i) => {
    const body = [
      j.desc ? `<p>${esc(j.desc)}</p>` : "",
      j.bullets && j.bullets.length ? `<ul>${j.bullets.map((b) => `<li>${lead(b, lang)}</li>`).join("")}</ul>` : "",
      j.talks ? `<ul class="talks">${j.talks.map((k) => `<li><a href="${esc(k.url)}" target="_blank" rel="noopener">${esc(k.title)}</a><p>${esc(k.text)}</p></li>`).join("")}</ul>` : ""
    ].join("");
    return `<li class="job" id="job-${i}"><h3><button class="acc-btn" type="button" aria-expanded="true" aria-controls="job-panel-${i}"><span class="job-date">${esc(titleCaseDate(j.date, lang))}</span><span class="job-main"><span class="job-role">${esc(j.role)}</span><span class="job-org">${esc(j.org)}</span><span class="crawl" aria-hidden="true"><b class="cs" data-s="${esc(t.crawl.s.join("|"))}"></b><b class="ci">[${i + 1}] ${esc(t.crawl.cited)}</b></span></span>${chev}</button></h3><div class="acc-panel" id="job-panel-${i}"><div class="acc-inner">${body}</div></div></li>`;
  }).join("");

  // 專案
  const usedTags = [...new Set(UI.projectMeta.map((m) => m.tag))];
  const chips = [`<button class="chip" type="button" data-filter="all" aria-pressed="true">${esc(t.filterAll)}</button>`].concat(usedTags.map((g) => `<button class="chip" type="button" data-filter="${g}" aria-pressed="false">${esc(t.tags[g])}</button>`)).join("");
  const projects = d.projects.map((p, i) => {
    const meta = UI.projectMeta[i], [mv, ml] = meta[lang];
    const imgs = UI.projectImages[i] || [];
    return `<li class="proj" id="project-${i}" data-tag="${meta.tag}"${imgs.length ? ` data-peek="${up}assets/img/${imgs[0].f}"` : ""}><h3><button class="acc-btn" type="button" aria-expanded="true" aria-controls="proj-panel-${i}"><span class="proj-main"><span class="proj-title">${esc(p.title)}</span><span class="proj-tag">${esc(t.tags[meta.tag])}</span></span><span class="proj-metric"><b>${esc(mv)}</b><small>${esc(ml)}</small></span>${chev}</button></h3><div class="acc-panel" id="proj-panel-${i}"><div class="acc-inner">${paras(p.intro, lang)}<ul>${p.points.map((x) => `<li>${lead(x, lang)}</li>`).join("")}</ul>${gallery(i)}</div></div></li>`;
  }).join("");

  const life = d.life.map((x, i) => {
    const im = UI.lifeImages[i], r = [-3.2, 2.4, -1.6, 3.1, -2.4][i % 5];
    return `<li class="pol" style="--r:${r}deg" data-pol><div class="pol-in"><div class="pol-face pol-front">${im ? `<img src="${up}assets/img/${im.f}" alt="${esc(im[lang])}" loading="lazy" decoding="async" draggable="false"${im.fit ? ` class="fit-${im.fit}"` : ""}>` : ""}<span class="pol-title">${esc(x.title)}</span><button class="pol-flip" type="button" aria-label="${esc(t.wall.flip)}: ${esc(x.title)}" aria-pressed="false"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 10a6 6 0 0 1 10.2-4.3L16 4v4.5h-4.5l1.7-1.7A4 4 0 1 0 14 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="pol-face pol-back"><h3>${esc(x.title)}</h3><p class="org">${esc(x.org)}</p><p>${esc(x.text)}</p><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(t.wall.open)}<span class="sr"> (${esc(x.title)})</span></a><button class="pol-flip pol-unflip" type="button" aria-label="${esc(t.wall.back)}: ${esc(x.title)}"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 10a6 6 0 0 1 10.2-4.3L16 4v4.5h-4.5l1.7-1.7A4 4 0 1 0 14 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div></li>`;
  }).join("");
  const lifeSub = [...t.lifeSub].map((ch) => (ch === " " ? " " : `<span class="lc">${esc(ch)}</span>`)).join("");

  const ld = {
    "@context": "https://schema.org", "@type": "Person", name: "Ted Kuo", alternateName: "郭泰宏",
    jobTitle: "GEO & AI SEO Strategist", url, email: "mailto:" + c.email,
    address: { "@type": "PostalAddress", addressLocality: "Taipei", addressCountry: "TW" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "National Central University" },
    worksFor: { "@type": "Organization", name: "EchoWave", url: c.echowave },
    knowsAbout: ["Generative Engine Optimization", "AI SEO", "Technical SEO", "Schema markup", "International SEO", "GA4", "Google Search Console"],
    sameAs: [c.linkedin, c.echowave], image: UI.site + "/assets/portrait.jpg"
  };

  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="zh-Hant" href="${UI.site}/">
<link rel="alternate" hreflang="en" href="${UI.site}/en/">
<link rel="alternate" hreflang="x-default" href="${UI.site}/">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:image" content="${UI.site}/assets/portrait.jpg">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#15181b">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600&family=Source+Serif+4:opsz,wght@8..60,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${up}style.css">
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="nav">
  <div class="nav-in">
    <a class="brand" href="#top"><span class="brand-name">Ted Kuo</span><span class="brand-role">${esc(t.role)}</span></a>
    <nav aria-label="${esc(t.navLabel)}">
      <a href="#competencies">${esc(t.nav.competencies)}</a>
      <a href="#experience">${esc(t.nav.experience)}</a>
      <a href="#projects">${esc(t.nav.projects)}</a>
      <a href="#life">${esc(t.nav.life)}</a>
      <a href="#connect">${esc(t.nav.connect)}</a>
    </nav>
    <div class="tools">
      <a class="lang-link" href="${otherHref}" hreflang="${t.other.hreflang}" lang="${t.other.hreflang}">${esc(t.other.label)}</a>
      <button class="btn" type="button" data-print>${esc(t.pdf)}</button>
    </div>
  </div>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>

<main id="main">
<section class="hero" id="top">
  <div class="hero-in">
    <div class="hero-copy">
      <div class="ident">
        <span class="avatar"><span class="initials" aria-hidden="true">TK</span><img src="${up}assets/portrait.jpg" alt="Ted Kuo" width="160" height="200" onerror="this.remove()"></span>
        <div><h1>Ted Kuo</h1><p class="subtitle">${esc(t.subtitle)}</p></div>
      </div>
      <p class="summary">${esc(d.summary)}</p>
      <dl class="facts">
        <div><dt>${esc(t.focusLabel)}</dt><dd>${esc(d.focus)}</dd></div>
        <div><dt>${esc(t.frameworkLabel)}</dt><dd>${esc(d.framework)}</dd></div>
      </dl>
      <ul class="contact">
        <li><button class="linklike" type="button" data-copy="${esc(c.email)}" data-copied="${esc(t.copied)}" title="${esc(t.copyEmail)}">${esc(c.email)}</button></li>
        <li><a href="tel:${c.phone.replace(/\s/g, "")}"><span class="sr">${esc(t.phoneLabel)} </span>${esc(c.phone)}</a></li>
        <li><a href="${c.linkedin}" target="_blank" rel="noopener">${esc(t.linkedin)}</a></li>
        <li><a href="${c.echowave}" target="_blank" rel="noopener">${esc(t.echowave)}</a></li>
      </ul>
    </div>
    <aside class="ai" data-ai aria-label="${esc(t.ai.label)}">
      <div class="ai-head"><span class="ai-dot" aria-hidden="true"></span><span class="ai-name">${esc(t.ai.name)}</span><span class="ai-badge">${esc(t.ai.badge)}</span></div>
      <p class="ai-q">${esc(t.ai.query)}</p>
      <p class="ai-a" data-answer>${answer}</p>
      <ol class="ai-src">${sources}</ol>
      <div class="ai-foot"><span>${esc(t.ai.note)}</span><button class="linklike" type="button" data-replay>${esc(t.ai.replay)}</button></div>
    </aside>
  </div>
  <div class="metrics-wrap">
    <h2 class="sr">${esc(t.metricsTitle)}</h2>
    <ul class="metrics">${metrics}</ul>
  </div>
</section>

<section class="sec" id="competencies">
  <div class="sec-in"><h2>${esc(t.sections.competencies)}</h2>
    <div class="tabs" data-tabs>
      <div class="tablist" role="tablist" aria-orientation="vertical" aria-label="${esc(t.sections.competencies)}">${tabs}</div>
      <div class="tabpanels">${panels}</div>
    </div>
  </div>
</section>

<section class="sec alt" id="experience">
  <div class="sec-in">
    <div class="sec-head"><h2>${esc(t.sections.experience)}</h2><button class="linklike" type="button" data-toggle-all="#experience" data-expand="${esc(t.expandAll)}" data-collapse="${esc(t.collapseAll)}">${esc(t.collapseAll)}</button></div>
    <p class="crawl-legend"><b>${esc(t.crawl.bot)}</b>${esc(t.crawl.legend)}</p>
    <ol class="jobs">${jobs}<li class="bot" aria-hidden="true"><i></i><em>${esc(t.crawl.bot)}</em></li></ol>
    <div class="edu">
      <div><h3>${esc(t.education)}</h3><p><strong>${esc(t.educationItem.school)}</strong></p><p>${esc(t.educationItem.detail)}</p></div>
      <div><h3>${esc(t.languages)}</h3>${t.languageItems.map((x) => `<p><strong>${esc(x[0])}</strong> ${esc(x[1])}</p>`).join("")}</div>
    </div>
  </div>
</section>

<section class="sec" id="projects">
  <div class="sec-in">
    <div class="sec-head"><h2>${esc(t.sections.projects)}</h2><button class="linklike" type="button" data-toggle-all="#projects" data-expand="${esc(t.expandAll)}" data-collapse="${esc(t.collapseAll)}">${esc(t.collapseAll)}</button></div>
    <div class="chips" role="group" aria-label="${esc(t.filterLabel)}">${chips}</div>
    <ul class="plist">${projects}</ul>
  </div>
</section>

<section class="sec alt" id="life">
  <div class="sec-in"><h2>${esc(t.sections.life)}</h2><p class="life-sub" data-lit aria-label="${esc(t.lifeSub)}"><span aria-hidden="true">${lifeSub}</span></p><p class="wall-hint" data-fine="${esc(t.wall.hintFine)}" data-touch="${esc(t.wall.hintTouch)}">${esc(t.wall.hintFine)}</p><ul class="life wall" data-wall>${life}</ul></div>
</section>

<section class="sec connect" id="connect">
  <div class="sec-in">
    <h2>${esc(d.connect.title)}</h2>
    <p class="lead">${esc(d.connect.text)}</p>
    <div class="actions">
      <button class="btn primary" type="button" data-copy="${esc(c.email)}" data-copied="${esc(t.copied)}">${esc(t.copyEmail)}</button>
      <a class="btn" href="mailto:${c.email}">${esc(t.email)}</a>
      <a class="btn" href="${c.linkedin}" target="_blank" rel="noopener">${esc(t.linkedin)}</a>
      <a class="btn" href="${c.echowave}" target="_blank" rel="noopener">${esc(t.echowave)}</a>
    </div>
  </div>
</section>
</main>
<footer class="foot"><div class="sec-in"><span>© <span data-year>2026</span> ${esc(t.footer)}</span><a href="#top">${esc(t.back)}</a></div></footer>
<button class="totop" type="button" aria-label="${esc(t.backTop)}"><svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><circle class="ring-bg" cx="24" cy="24" r="21"/><circle class="ring" cx="24" cy="24" r="21"/><path d="M17 27l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
<dialog class="lightbox" aria-label="${esc(t.lb.label)}">
  <button class="lb-close" type="button" aria-label="${esc(t.lb.close)}">&times;</button>
  <button class="lb-nav prev" type="button" aria-label="${esc(t.lb.prev)}">&#8249;</button>
  <figure><img alt=""><figcaption><span class="lb-cap"></span><span class="lb-count"></span></figcaption></figure>
  <button class="lb-nav next" type="button" aria-label="${esc(t.lb.next)}">&#8250;</button>
</dialog>
<div class="peek" aria-hidden="true"><img alt=""></div>
<div class="toast" role="status" aria-live="polite"></div>
<script src="${up}app.js" defer></script>
</body>
</html>
`;
}

fs.writeFileSync(path.join(root, "index.html"), build("zh"));
fs.mkdirSync(path.join(root, "en"), { recursive: true });
fs.writeFileSync(path.join(root, "en/index.html"), build("en"));
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${UI.site}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[["/", "zh-Hant"], ["/en/", "en"]].map(([p]) => `  <url><loc>${UI.site}${p}</loc><lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="${UI.site}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${UI.site}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${UI.site}/"/>
  </url>`).join("\n")}
</urlset>
`);
console.log("built: index.html, en/index.html, robots.txt, sitemap.xml");
