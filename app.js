/* 漸進增強：沒有 JavaScript 時，內容仍然全部展開、可閱讀。 */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var behavior = reduce ? "auto" : "smooth";

  var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();

  /* ---- 捲動進度與目前章節 ---- */
  var bar = $(".progress i");
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (bar) bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var links = $$(".nav nav a");
  if ("IntersectionObserver" in window) {
    var secs = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ---- 首屏游標光暈（僅滑鼠、未要求減少動態時） ---- */
  var hero = $(".hero");
  if (hero && fine && !reduce) {
    var raf = 0;
    hero.addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
        hero.style.setProperty("--my", (e.clientY - r.top) + "px");
        raf = 0;
      });
    });
  }

  /* ---- 複製 Email 與提示 ---- */
  var toast = $(".toast"), tt;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var text = b.getAttribute("data-copy"), msg = b.getAttribute("data-copied");
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (x) {} t.remove(); say(msg);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { say(msg); }, fallback);
    else fallback();
  });

  /* ---- 核心職能分頁 ---- */
  $$("[data-tabs]").forEach(function (root) {
    var tabs = $$('[role="tab"]', root), panels = $$('[role="tabpanel"]', root);
    function select(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
        if (on) { panels[k].classList.remove("swap"); void panels[k].offsetWidth; if (!reduce) panels[k].classList.add("swap"); }
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select((i + k + tabs.length) % tabs.length, true); }
        else if (e.key === "Home") { e.preventDefault(); select(0, true); }
        else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    root._select = select; select(0);
  });

  /* ---- 手風琴（工作經歷、專案） ---- */
  function setOpen(item, open) {
    item.classList.toggle("is-closed", !open);
    var b = $(".acc-btn", item); if (b) b.setAttribute("aria-expanded", open);
  }
  function isOpen(item) { return !item.classList.contains("is-closed"); }
  $$(".job, .proj").forEach(function (item) {
    var b = $(".acc-btn", item);
    b.addEventListener("click", function () { setOpen(item, !isOpen(item)); syncToggle(item.closest(".sec")); });
  });
  function syncToggle(sec) {
    var t = sec && $("[data-toggle-all]", sec); if (!t) return;
    var items = $$(".job, .proj", sec).filter(function (i) { return !i.hidden; });
    var allOpen = items.length && items.every(isOpen);
    t.textContent = allOpen ? t.getAttribute("data-collapse") : t.getAttribute("data-expand");
  }
  $$("[data-toggle-all]").forEach(function (t) {
    t.addEventListener("click", function () {
      var sec = t.closest(".sec");
      var items = $$(".job, .proj", sec).filter(function (i) { return !i.hidden; });
      var open = !items.every(isOpen);
      items.forEach(function (i) { setOpen(i, open); }); syncToggle(sec);
    });
  });
  // 預設只展開第一筆，其餘收合
  ["#experience .job", "#projects .proj"].forEach(function (s) {
    $$(s).forEach(function (it, i) { setOpen(it, i === 0); });
    syncToggle($(s.split(" ")[0]).closest(".sec") || $(s.split(" ")[0]));
  });

  /* ---- 專案篩選 ---- */
  var chips = $$(".chip");
  function filter(tag) {
    chips.forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-filter") === tag); });
    $$(".proj").forEach(function (p) {
      var show = tag === "all" || p.getAttribute("data-tag") === tag;
      p.hidden = !show;
      p.classList.remove("swap");
      if (show && !reduce) { void p.offsetWidth; p.classList.add("swap"); }
    });
    syncToggle($("#projects"));
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { filter(c.getAttribute("data-filter")); }); });

  /* ---- 站內連結：先展開對應內容，再閃一下提示位置 ---- */
  function reveal(hash, animate) {
    if (!hash || hash.length < 2) return;
    var el = document.getElementById(hash.slice(1)); if (!el) return;
    var target = el;
    if (el.classList.contains("proj")) {
      if (el.hidden) filter("all");
      setOpen(el, true); syncToggle($("#projects"));
    } else if (el.classList.contains("job")) {
      setOpen(el, true); syncToggle($("#experience"));
    } else if (el.id === "competencies") {
      var tabs = $("[data-tabs]"); if (tabs && tabs._select) tabs._select(0);
      target = $("h2", el) || el;
    } else if (el.tagName === "SECTION") {
      target = $("h2", el) || el;
    }
    if (animate && !reduce) {
      setTimeout(function () { target.classList.remove("flash"); void target.offsetWidth; target.classList.add("flash"); }, 450);
    }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var h = a.getAttribute("href"); if (h.length < 2) return;
    var el = document.getElementById(h.slice(1)); if (!el) return;
    e.preventDefault();
    reveal(h, true);
    history.pushState(null, "", h);
    el.scrollIntoView({ behavior: behavior, block: "start" });
  });
  window.addEventListener("hashchange", function () { reveal(location.hash, true); });
  if (location.hash) reveal(location.hash, false);

  /* ---- 數字計數 ---- */
  var nums = $$(".num[data-to]");
  function fmt(n, s) { return Math.round(n).toLocaleString("en-US") + s; }
  function countUp(el) {
    var to = +el.getAttribute("data-to"), s = el.getAttribute("data-suffix") || "", t0 = null, d = 1200;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / d), k = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * k, s);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (nums.length && !reduce && "IntersectionObserver" in window) {
    nums.forEach(function (n) { n.textContent = fmt(0, n.getAttribute("data-suffix") || ""); });
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { cio.observe(n); });
  }

  /* ---- AI 答案示意：逐字出現，引用編號與來源互相連動 ---- */
  var ai = $("[data-ai]");
  if (ai) {
    var ans = $("[data-answer]", ai), original = ans.cloneNode(true), run = 0;
    var zh = document.documentElement.lang.indexOf("zh") === 0, speed = zh ? 28 : 15;
    var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    async function play() {
      var id = ++run;
      ai.classList.remove("done");
      ans.textContent = "";
      var caret = document.createElement("span"); caret.className = "caret"; caret.setAttribute("aria-hidden", "true");
      ans.appendChild(caret);
      ans.setAttribute("aria-busy", "true");
      await sleep(500);
      var kids = Array.prototype.slice.call(original.childNodes);
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (id !== run) return;
        if (n.nodeType === 3) {
          var tn = document.createTextNode(""); ans.insertBefore(tn, caret);
          var str = n.nodeValue;
          for (var k = 0; k < str.length; k++) { if (id !== run) return; tn.nodeValue += str[k]; await sleep(speed); }
        } else {
          ans.insertBefore(n.cloneNode(true), caret); await sleep(260);
        }
      }
      if (id !== run) return;
      caret.remove(); ans.removeAttribute("aria-busy"); ai.classList.add("done");
    }
    if (reduce) { ai.classList.add("done"); }
    else play();
    var rep = $("[data-replay]", ai);
    if (rep) rep.addEventListener("click", function () { if (reduce) return; play(); });

    function hot(n, on) { $$('[data-n="' + n + '"]', ai).forEach(function (x) { x.classList.toggle("hot", on); }); }
    ["mouseover", "focusin"].forEach(function (ev) {
      ai.addEventListener(ev, function (e) { var a = e.target.closest("[data-n]"); if (a) hot(a.getAttribute("data-n"), true); });
    });
    ["mouseout", "focusout"].forEach(function (ev) {
      ai.addEventListener(ev, function (e) { var a = e.target.closest("[data-n]"); if (a) hot(a.getAttribute("data-n"), false); });
    });
  }

  /* ---- 列印／另存 PDF：先展開全部，結束後還原 ---- */
  var snap = null;
  function beforePrint() {
    snap = $$(".job, .proj").map(function (i) { return [i, isOpen(i), i.hidden]; });
    $$(".job, .proj").forEach(function (i) { i.hidden = false; setOpen(i, true); });
    $$('[role="tabpanel"]').forEach(function (p) { p.hidden = false; });
  }
  function afterPrint() {
    if (!snap) return;
    snap.forEach(function (s) { s[0].hidden = s[2]; setOpen(s[0], s[1]); });
    var t = $("[data-tabs]"); if (t && t._select) t._select(+(($('[role="tab"][aria-selected="true"]', t) || {}).id || "tab-0").replace("tab-", "") || 0);
    snap = null; syncToggle($("#experience")); syncToggle($("#projects"));
  }
  window.addEventListener("beforeprint", beforePrint);
  window.addEventListener("afterprint", afterPrint);
  $$("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });

  /* ================= v2 ================= */
  /* ---- 捲動顯現 ---- */
  if (!reduce && "IntersectionObserver" in window) {
    var targets = $$(".sec h2, .tabs, .chips, .job, .proj, .life li, .edu > div, .connect .lead, .actions");
    targets.forEach(function (el) { el.setAttribute("data-reveal", ""); });
    document.documentElement.classList.add("rv");
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (el) { rio.observe(el); });
    // 安全網：若數秒後仍未顯現（例如被快速跳轉略過），直接顯示
    setTimeout(function () { targets.forEach(function (el) { if (!el.classList.contains("in")) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add("in"); } }); }, 2500);
  }

  /* ---- 經歷時間軸、回到頂端（共用捲動） ---- */
  var jobsEl = $(".jobs"), jobEls = $$(".job"), topBtn = $(".totop"), ring = $(".totop .ring");
  var C = 131.95, tk = false;
  function frame() {
    tk = false;
    var h = document.documentElement, sc = h.scrollTop, max = Math.max(1, h.scrollHeight - h.clientHeight);
    if (topBtn) {
      topBtn.classList.toggle("show", sc > 520);
      if (ring) ring.style.strokeDashoffset = String(C * (1 - Math.min(1, sc / max)));
    }
    if (jobsEl) {
      var r = jobsEl.getBoundingClientRect(), mid = innerHeight * 0.55;
      var p = Math.min(1, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
      jobsEl.style.setProperty("--p", p.toFixed(4));
      jobEls.forEach(function (j) { j.classList.toggle("seen", j.getBoundingClientRect().top < mid); });
    }
  }
  window.addEventListener("scroll", function () { if (!tk) { tk = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", frame); frame();
  if (topBtn) topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: behavior });
    history.replaceState(null, "", location.pathname + location.search);
    var t = $("#top"); if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
  });

  /* ---- AI 卡片傾斜與反光 ---- */
  var card = $(".ai");
  if (card && fine && !reduce) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", ((x - 0.5) * 7).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg");
      card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      card.classList.add("tilting");
    });
    card.addEventListener("pointerleave", function () {
      card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); card.classList.remove("tilting");
    });
  }

  /* ---- 按鈕磁吸 ---- */
  if (fine && !reduce) {
    $$(".tools .btn, .actions .btn, .chip").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---- 專案列：滑鼠停留預覽 ---- */
  var peek = $(".peek"), peekImg = peek && $("img", peek);
  if (peek && fine) {
    $$(".proj").forEach(function (li) {
      var src = li.getAttribute("data-peek"); if (!src) return;
      var btn = $(".acc-btn", li);
      btn.addEventListener("pointerenter", function () { if (!isOpen(li)) { peekImg.src = src; peek.classList.add("show"); } });
      btn.addEventListener("pointerleave", function () { peek.classList.remove("show"); });
      btn.addEventListener("click", function () { peek.classList.remove("show"); });
      btn.addEventListener("pointermove", function (e) {
        var x = e.clientX + 28, y = e.clientY - 90;
        if (x + 320 > innerWidth) x = e.clientX - 330;
        y = Math.max(12, Math.min(innerHeight - 200, y));
        peek.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      });
    });
  }

  /* ---- 圖片燈箱 ---- */
  var lb = $(".lightbox");
  if (lb && lb.showModal) {
    var lbImg = $("img", lb), lbCap = $(".lb-cap", lb), lbCount = $(".lb-count", lb), group = [], gi = 0;
    function show(i, quick) {
      gi = (i + group.length) % group.length;
      var b = group[gi];
      function set() {
        lbImg.src = b.getAttribute("data-src"); lbImg.alt = b.getAttribute("data-cap");
        lbCap.textContent = b.getAttribute("data-cap");
        lbCount.textContent = group.length > 1 ? (gi + 1) + " / " + group.length : "";
        lbImg.classList.remove("swap");
      }
      if (quick || reduce) set(); else { lbImg.classList.add("swap"); setTimeout(set, 120); }
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lightbox]"); if (!b) return;
      var g = b.getAttribute("data-group");
      group = $$('[data-lightbox][data-group="' + g + '"]');
      lb.classList.toggle("single", group.length < 2);
      lb.showModal(); show(group.indexOf(b), true);
    });
    $(".lb-close", lb).addEventListener("click", function () { lb.close(); });
    $(".lb-nav.prev", lb).addEventListener("click", function () { show(gi - 1); });
    $(".lb-nav.next", lb).addEventListener("click", function () { show(gi + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (group.length < 2) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); show(gi - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(gi + 1); }
    });
  }
})();
