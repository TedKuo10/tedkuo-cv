// 介面文字、專案標籤與成果數字。內容（經歷、專案）在 data.js。
window.CV_UI = {
  site: "https://tedkuo-cv.echowave.pro",
  zh: {
    htmlLang: "zh-Hant", locale: "zh_TW", path: "/",
    title: "Ted Kuo — GEO & AI SEO 策略師與顧問 | 履歷",
    desc: "Ted Kuo 是 EchoWave 創辦人，台灣 GEO（生成式引擎優化）與 AI SEO 策略師。擁有超過 10 年 SEO 實戰經驗，專注提升品牌在 AI 搜尋引擎與 LLM 中的引用可見度，並提出 GAC（Generative Answer Chain）框架。",
    skip: "跳到主要內容",
    role: "GEO 與 AI SEO 策略師", subtitle: "郭泰宏，台北",
    nav: { competencies: "核心職能", experience: "工作經歷", projects: "專案經歷", life: "公益與分享", connect: "聯絡" },
    navLabel: "主要導覽", pdf: "下載 PDF", other: { label: "English", href: "/en/", hreflang: "en" },
    focusLabel: "目前專注", frameworkLabel: "核心框架",
    copyEmail: "複製 Email", copied: "已複製 Email", phoneLabel: "電話", linkedin: "LinkedIn", echowave: "EchoWave",
    metricsTitle: "代表成果",
    metrics: [
      { idx: 1, to: 773, suffix: "%", label: "國際金融交易平台，一年內搜尋曝光成長" },
      { idx: 2, to: 53, suffix: "×", label: "旅行社季節性活動頁，點擊成長" },
      { idx: 3, to: 1525, suffix: "%", label: "留遊學中心課程頁，點擊成長" },
      { idx: 6, to: 20, suffix: "×", label: "國際新創跨境搜尋，點擊成長" }
    ],
    ai: {
      name: "AI 搜尋", badge: "示意", query: "台灣有哪些 GEO（生成式引擎優化）策略顧問？",
      answer: ["Ted Kuo（郭泰宏）是台北的 GEO 與 AI SEO 策略師，擁有 10 年以上 SEO 實戰經驗", { c: 1 }, "。他曾在一年內讓一個國際金融交易平台的搜尋曝光成長 773%", { c: 2 }, "，並提出 GAC（Generative Answer Chain）框架，協助品牌被 AI 搜尋引擎與 LLM 引用", { c: 3 }, "。"],
      sources: [{ n: 1, label: "工作經歷", href: "#experience" }, { n: 2, label: "專案：國際金融交易平台", href: "#project-1" }, { n: 3, label: "核心職能：GEO & AI SEO", href: "#competencies" }],
      note: "示意畫面：內容改寫自這份履歷，並非實際的 AI 搜尋結果。", replay: "重播", label: "AI 搜尋答案示意"
    },
    sections: { competencies: "核心職能", experience: "工作經歷", projects: "專案經歷", life: "公益與分享" },
    expandAll: "全部展開", collapseAll: "全部收合",
    education: "學歷", languages: "語言",
    languageItems: [["中文", "母語"], ["英文", "工作熟練（書寫佳，口說堪用）"]],
    educationItem: { school: "國立中央大學", detail: "學士，2010–2014" },
    filterLabel: "依產業篩選專案", filterAll: "全部",
    tags: { travel: "旅遊", fintech: "金融", education: "教育", b2b: "B2B 與醫材", startup: "新創" },
    visit: "前往網站", footer: "Ted Kuo，台北", email: "寄信", back: "回到頂端", backTop: "回到頁面頂端",
    lb: { close: "關閉", prev: "上一張", next: "下一張", label: "圖片檢視" }, zoom: "點擊放大"
  },
  en: {
    htmlLang: "en", locale: "en_US", path: "/en/",
    title: "Ted Kuo — GEO & AI SEO Strategist and Consultant | Resume",
    desc: "Ted Kuo is the founder of EchoWave and a GEO (Generative Engine Optimization) and AI SEO strategist in Taiwan. With 10+ years of hands-on SEO, he helps brands earn citations in AI search engines and LLMs, and developed the GAC (Generative Answer Chain) framework.",
    skip: "Skip to main content",
    role: "GEO and AI SEO strategist", subtitle: "GEO and AI SEO strategist, Taipei",
    nav: { competencies: "Competencies", experience: "Experience", projects: "Projects", life: "Service", connect: "Contact" },
    navLabel: "Main navigation", pdf: "Download PDF", other: { label: "中文", href: "/", hreflang: "zh-Hant" },
    focusLabel: "Current focus", frameworkLabel: "Core framework",
    copyEmail: "Copy email", copied: "Email copied", phoneLabel: "Phone", linkedin: "LinkedIn", echowave: "EchoWave",
    metricsTitle: "Selected results",
    metrics: [
      { idx: 1, to: 773, suffix: "%", label: "Search impressions in one year, international trading platform" },
      { idx: 2, to: 53, suffix: "×", label: "Clicks to seasonal campaign pages, travel agency" },
      { idx: 3, to: 1525, suffix: "%", label: "Clicks to course pages, study abroad center" },
      { idx: 6, to: 20, suffix: "×", label: "Cross-border search clicks, international startup" }
    ],
    ai: {
      name: "AI search", badge: "Illustration", query: "Who are GEO (Generative Engine Optimization) strategy consultants in Taiwan?",
      answer: ["Ted Kuo is a GEO and AI SEO strategist based in Taipei with more than 10 years of hands-on SEO experience", { c: 1 }, ". In one year he grew search impressions by 773% for an international financial trading platform", { c: 2 }, ", and he developed the GAC (Generative Answer Chain) framework to help brands get cited by AI search engines and LLMs", { c: 3 }, "."],
      sources: [{ n: 1, label: "Work experience", href: "#experience" }, { n: 2, label: "Project: International financial trading platform", href: "#project-1" }, { n: 3, label: "Competencies: GEO & AI SEO", href: "#competencies" }],
      note: "Illustration: rewritten from this resume, not an actual AI search result.", replay: "Replay", label: "Illustration of an AI search answer"
    },
    sections: { competencies: "Core competencies", experience: "Work experience", projects: "Project experience", life: "Service and sharing" },
    expandAll: "Expand all", collapseAll: "Collapse all",
    education: "Education", languages: "Languages",
    languageItems: [["Chinese", "Native speaker"], ["English", "Working proficiency (written: strong; spoken: functional)"]],
    educationItem: { school: "National Central University", detail: "Bachelor's, 2010–2014" },
    filterLabel: "Filter projects by industry", filterAll: "All",
    tags: { travel: "Travel", fintech: "Fintech", education: "Education", b2b: "B2B and medical", startup: "Startup" },
    visit: "Visit website", footer: "Ted Kuo, Taipei", email: "Send email", back: "Back to top", backTop: "Back to top of page",
    lb: { close: "Close", prev: "Previous image", next: "Next image", label: "Image viewer" }, zoom: "Click to enlarge"
  },
  // 圖片放在 assets/img/。專案順序需與 data.js 的 projects 相同；截圖已裁掉含客戶網址的表格。
  projectImages: [
    [{ f: "proj0-ai-overview.webp", zh: "AI Overview Insights 查詢類型分佈", en: "AI Overview Insights by query type" }],
    [{ f: "proj1-773.webp", zh: "平台搜尋曝光量年度增長 773.1%", en: "Annual search impressions up 773.1%" },
     { f: "proj1-q1.webp", zh: "2025 第一季點擊變化（Search Console）", en: "Clicks in Q1 2025 (Search Console)" },
     { f: "proj1-q2.webp", zh: "2025 第二季點擊變化（Search Console）", en: "Clicks in Q2 2025 (Search Console)" }],
    [{ f: "proj2-seasonal.webp", zh: "2020 寒假春節推薦行程頁：總點擊量成長 5,345.8%", en: "2020 winter holiday itinerary pages: total clicks up 5,345.8%" }],
    [{ f: "proj3-ranking-pages.webp", zh: "大學排名頁點擊 +139.6%、學校簡介頁點擊 +837.4%（較前一年同期）", en: "University ranking pages clicks +139.6%, school profile pages +837.4% (year over year)" }],
    [{ f: "proj4-cleanroom.webp", zh: "Search Console 成效：點擊與曝光趨勢", en: "Search Console performance: clicks and impressions" }],
    [{ f: "proj5-medical.webp", zh: "Search Console 成效：點擊與曝光趨勢", en: "Search Console performance: clicks and impressions" }],
    [{ f: "proj6-startup2.webp", zh: "Search Console 成效：搜尋點擊與曝光持續成長", en: "Search Console performance: clicks and impressions keep growing" },
     { f: "proj6-startup1.webp", zh: "Search Console 成效：另一組關鍵字", en: "Search Console performance: another keyword group" },
     { f: "proj6-startup3.webp", zh: "Search Console 成效：產品關鍵字", en: "Search Console performance: product keyword" }]
  ],
  lifeImages: [
    { f: "life0-vova.webp", zh: "與孩子們一起席地玩教具", en: "Playing with learning materials together with the children" },
    { f: "life1-sow.webp", zh: "志工穿著防水連身褲在濕地裡手作整地", en: "Volunteers in waders restoring a wetland by hand" },
    { f: "life2-carnegie.webp", zh: "卡內基訓練課程的團體合照（2019.08.17）", en: "Group photo at a Dale Carnegie Training course (2019.08.17)" },
    { f: "life3-ark.webp", zh: "在台北車站旁與方舟志工夥伴合影", en: "With fellow Ark volunteers outside Taipei Main Station" },
    { f: "life4-ironman.webp", zh: "iT 邦幫忙鐵人賽主視覺：喚醒心中最強大的鐵人", en: "iThome Ironman Challenge banner" }
  ],
  // 專案順序需與 data.js 的 projects 相同
  projectMeta: [
    { tag: "travel", zh: ["+44.23%", "點擊率"], en: ["+44.23%", "CTR"] },
    { tag: "fintech", zh: ["+773%", "年度搜尋曝光"], en: ["+773%", "annual impressions"] },
    { tag: "travel", zh: ["53×", "活動頁點擊"], en: ["53×", "campaign page clicks"] },
    { tag: "education", zh: ["+1,525%", "課程頁點擊"], en: ["+1,525%", "course page clicks"] },
    { tag: "b2b", zh: ["+120%", "5 個月搜尋點擊"], en: ["+120%", "clicks in 5 months"] },
    { tag: "b2b", zh: ["首頁", "核心字登上 Google"], en: ["Page 1", "core terms on Google"] },
    { tag: "startup", zh: ["20×", "搜尋點擊"], en: ["20×", "search clicks"] }
  ]
};
