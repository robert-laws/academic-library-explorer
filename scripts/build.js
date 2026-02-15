const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const config = require(path.join(root, 'site.config.js'));
const templatesDir = path.join(root, 'templates');

const contentDir = path.join(root, 'content');
const topicsDir = path.join(contentDir, 'topics');
const briefsDir = path.join(contentDir, 'briefs');
const outputDir = path.join(root, 'dist');
const outAssets = path.join(outputDir, 'assets');
const strictMode = process.argv.includes('--strict');

const requiredFields = [
  'title',
  'slug',
  'summary',
  'topics',
  'audience',
  'status',
  'published',
  'last_updated',
  'references'
];

const layoutTemplate = fs.readFileSync(path.join(templatesDir, 'layout.html'), 'utf8');
const topicCardTemplate = fs.readFileSync(path.join(templatesDir, 'topic-card.html'), 'utf8');
const briefCardTemplate = fs.readFileSync(path.join(templatesDir, 'brief-card.html'), 'utf8');
const referencesTemplate = fs.readFileSync(path.join(templatesDir, 'reference-list.html'), 'utf8');

const siteCss = `:root {
  --bg: #f4f6fb;
  --surface: #ffffff;
  --ink: #0f172a;
  --ink-soft: #5b6678;
  --line: #d8e0ea;
  --accent: #0f766e;
  --accent-2: #0b7285;
  --radius: 18px;
  --radius-sm: 12px;
  --focus: #0ea5e9;
  --shadow-soft: 0 12px 30px -20px rgba(2, 8, 23, 0.5);
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  font-family: "Inter", "Manrope", "Avenir Next", "Segoe UI", Arial, sans-serif;
  color: var(--ink);
  background:
    radial-gradient(1200px 260px at 15% -15%, #e4fbff 0%, transparent 60%),
    radial-gradient(900px 240px at 85% 15%, #e9f4ff 0%, transparent 60%),
    var(--bg);
  line-height: 1.6;
}
a {
  color: #155e75;
  transition: color 180ms ease;
}
a:hover,
a:focus-visible {
  color: #0f766e;
}
.container {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
}
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  padding: 0.6rem 0.9rem;
  background: #111827;
  color: #ffffff;
  border-radius: 999px;
  z-index: 100;
}
.site-header {
  background: rgba(15, 23, 42, 0.84);
  color: #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
}
.site-header .container {
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.brand {
  color: #ecfeff;
  text-decoration: none;
  letter-spacing: 0.04em;
  font-weight: 700;
  font-size: 1.04rem;
}
.menu-toggle {
  display: none;
  border: 1px solid rgba(226, 232, 240, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 0.45rem 0.85rem;
}
.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.site-nav a {
  color: #dbeafe;
  text-decoration: none;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  transition: background 180ms ease, transform 180ms ease;
}
.site-nav a:hover,
.site-nav a:focus-visible {
  background: rgba(255, 255, 255, 0.18);
  outline: none;
  transform: translateY(-1px);
}
.site-nav a.active {
  background: #0f766e;
  color: #ecfeff;
  box-shadow: 0 8px 18px -12px rgba(15, 118, 110, 0.8);
}
.hero {
  padding: 3.3rem 0 2.4rem;
}
.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  line-height: 1.15;
  max-width: 22ch;
  letter-spacing: -0.02em;
  color: #0b2545;
}
.hero p {
  max-width: 72ch;
  color: #334155;
  margin-bottom: 0;
}
.page-content {
  padding: 0 0 3.2rem;
}
.page-content section + section {
  margin-top: 2rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}
.card {
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid rgba(203, 213, 225, 0.6);
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
  padding: 1rem 1rem 1.05rem;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}
.card:hover,
.card:focus-within {
  transform: translateY(-4px);
  border-color: rgba(15, 118, 110, 0.35);
  box-shadow: 0 20px 40px -22px rgba(15, 118, 110, 0.6);
}
.card h2 {
  margin-top: 0;
}
.card h2 a {
  text-decoration: none;
}
.card p {
  margin: 0.4rem 0;
}
.meta {
  color: var(--ink-soft);
  font-size: 0.93rem;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.8rem;
}
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.62rem;
  border-radius: 999px;
  font-size: 0.82rem;
  background: #ecfeff;
  border: 1px solid #cffafe;
  color: #0e7490;
}
.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin: 1rem 0 1.4rem;
}
.controls input[type='search'] {
  padding: 0.62rem 0.75rem;
  border: 1px solid var(--line);
  border-radius: 10px;
  min-width: min(430px, 100%);
  background: #ffffffcc;
}
button#clear-filters,
.topic-filters button,
button {
  border: 1px solid rgba(15, 118, 110, 0.2);
  background: #e6fffb;
  color: #0f766e;
  border-radius: 8px;
  padding: 0.45rem 0.78rem;
  font-weight: 600;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.filters label {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #dbeafe;
  font-size: 0.86rem;
}
button:focus-visible,
input[type='search']:focus-visible,
.site-nav a:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}
.site-footer {
  background: #0f172a;
  color: #d1d5db;
  padding: 1.7rem 0;
  margin-top: 3rem;
}
.site-footer p {
  margin: 0;
  font-size: 0.95rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.references ul {
  padding-left: 1.2rem;
}
.references li {
  margin-bottom: 0.45rem;
}
.related {
  margin-top: 1.8rem;
}

.reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 560ms ease, transform 560ms ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

[data-reveal='card'] {
  transition-duration: 640ms;
}

.hero,
.card {
  position: relative;
  overflow: hidden;
}

.hero::after,
.card::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.hero::after {
  inset: auto -12% -72% auto;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(15, 118, 110, 0.12), transparent 72%);
  border-radius: 999px;
}

@media (max-width: 980px) {
  .hero h1 {
    font-size: clamp(1.85rem, 5.5vw, 2.4rem);
  }
}

@media (max-width: 860px) {
  .menu-toggle {
    display: inline-block;
  }
  .site-nav {
    position: fixed;
    inset: 4.75rem 0 auto 0;
    z-index: 30;
    background: rgba(15, 23, 42, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
    padding: 0.9rem;
    transform: translateY(-180%);
    transition: transform 240ms ease;
    flex-direction: column;
    text-align: left;
  }
  .site-nav.open {
    transform: translateY(0);
  }
  .site-nav[aria-expanded='true'] {
    transform: translateY(0);
  }
}
`

const siteJs = `;(function () {
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const open = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      if (!open) {
        nav.style.transform = 'translateY(0)';
      } else {
        nav.style.transform = 'translateY(-180%)';
      }
    });
  }

  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((node) => {
      node.classList.add('reveal');
      observer.observe(node);
      const revealType = node.getAttribute('data-reveal');
      if (revealType === 'card') {
        const idx = Array.from(revealTargets).indexOf(node);
        if (idx > -1) {
          node.style.transitionDelay = `${(idx % 6) * 55}ms`;
        }
      }
    });
  } else {
    revealTargets.forEach((node) => {
      node.classList.add('reveal', 'is-visible');
    });
  }

  const config = window.__ACADEMIC_LIBRARY__ || null;
  if (!config || !config.mode) return;

  const searchInput = document.querySelector('[data-search]');
  const cards = document.querySelectorAll('[data-card]');
  if (!searchInput || cards.length === 0) return;

  const topicFilterWrap = document.getElementById('topic-filters');
  const clearButton = document.getElementById('clear-filters');
  const summary = document.getElementById('filter-summary');

  function applyFilters() {
    const q = (searchInput.value || '').toLowerCase().trim();
    const selected = new Set(
      Array.from(topicFilterWrap?.querySelectorAll('input[type="checkbox"]:checked') || []).map(
        (node) => node.value
      )
    );

    let visible = 0;
    cards.forEach((card) => {
      const topics = (card.dataset.topics || '').toLowerCase().split(',');
      const text = (card.dataset.search || '').toLowerCase();
      const qMatch = !q || text.includes(q);
      const tagMatch =
        selected.size === 0 || Array.from(selected).some((topic) => topics.includes(topic.toLowerCase()));
      const isVisible = qMatch && tagMatch;
      card.style.display = isVisible ? '' : 'none';
      if (isVisible) visible++;
    });

    if (summary) {
      summary.textContent = visible + ' result' + (visible === 1 ? '' : 's') + ' shown';
    }
  }

  searchInput.addEventListener('input', applyFilters);
  if (topicFilterWrap) {
    topicFilterWrap.addEventListener('change', applyFilters);
  }
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      if (topicFilterWrap) {
        topicFilterWrap.querySelectorAll('input[type="checkbox"]').forEach((node) => {
          node.checked = false;
        });
      }
      applyFilters();
    });
  }
  applyFilters();
})();
`

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanDist() {
  if (!fs.existsSync(outputDir)) {
    ensureDir(outputDir);
    return;
  }
  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Content file must start with front matter block: --- ... ---');
  }
  const fm = match[1];
  const body = match[2] || '';
  const lines = fm.split(/\r?\n/);
  const data = {};
  let currentList = null;

  lines.forEach((line) => {
    if (!line.trim()) {
      return;
    }

    const item = line.match(/^\s*-\s*(.+)$/);
    if (item && currentList) {
      data[currentList].push(parseListItem(item[1]));
      return;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) return;

    const key = pair[1];
    const value = pair[2].trim();
    currentList = null;

    if (value === '') {
      data[key] = [];
      currentList = key;
      return;
    }

    if (key === 'references') {
      const ref = parseListItem(value);
      data[key] = Array.isArray(ref) ? [ref] : [];
      currentList = ref ? key : null;
      return;
    }

    data[key] = normalizeField(key, value);
  });

  return { ...data, __rawBody: body.trim() };
}

function parseListItem(raw) {
  const refMatch = raw.match(/^\[(.+?)\]\((https?:\/\/[^)]+)\)\s*$/);
  if (refMatch) {
    return {
      title: refMatch[1].trim(),
      url: refMatch[2].trim()
    };
  }

  const pipeMatch = raw.split('|').map((x) => x.trim());
  if (pipeMatch.length === 2) {
    return {
      title: pipeMatch[0],
      url: pipeMatch[1]
    };
  }

  return raw;
}

function normalizeField(key, value) {
  if (key === 'topics' || key === 'audience') {
    return value.split(',').map((x) => x.trim()).filter(Boolean);
  }

  return value;
}

function parseMarkdown(content) {
  const lines = content.split(/\r?\n/);
  const html = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  lines.forEach((line) => {
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const text = applyInline(heading[2].trim());
      html.push(`<h${level}>${text}</h${level}>`);
      return;
    }

    if (line.match(/^\s*-\s+/)) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${applyInline(line.replace(/^\s*-\s+/, ''))}</li>`);
      return;
    }

    if (!line.trim()) {
      flushList();
      html.push('');
      return;
    }

    flushList();
    html.push(`<p>${applyInline(line.trim())}</p>`);
  });

  flushList();
  return html.join('\n');
}

function applyInline(text) {
  let output = text;
  output = output.replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  output = output.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return output;
}

function validateRecord(item, kind) {
  requiredFields.forEach((field) => {
    if (!(field in item) || (Array.isArray(item[field]) ? item[field].length === 0 : !item[field])) {
      throw new Error(`${kind} entry invalid: missing '${field}'`);
    }
  });

  if (!Array.isArray(item.topics) || !Array.isArray(item.audience)) {
    throw new Error(`${kind} entry '${item.slug}' must have topics and audience arrays.`);
  }

  if (item.status !== 'published' && item.status !== 'draft' && item.status !== 'archived') {
    throw new Error(`${kind} entry '${item.slug}' has invalid status '${item.status}'.`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.published) || !/^\d{4}-\d{2}-\d{2}$/.test(item.last_updated)) {
    throw new Error(`${kind} entry '${item.slug}' requires published and last_updated as YYYY-MM-DD.`);
  }

  if (!Array.isArray(item.references) || item.references.length < 2) {
    throw new Error(`${kind} entry '${item.slug}' must include at least 2 references.`);
  }

  if (strictMode) {
    const bad = item.references.filter((ref) => !ref || !ref.url || !/^https?:\/\//.test(ref.url));
    if (bad.length) {
      throw new Error(`${kind} entry '${item.slug}' contains invalid references (must include absolute URLs).`);
    }
  }
}

function assertUniqueSlugs(items, kind) {
  const seen = new Map();
  items.forEach((item) => {
    if (!item.slug) return;
    const key = String(item.slug).trim().toLowerCase();
    if (seen.has(key)) {
      throw new Error(`${kind} entry slug collision: duplicate slug '${item.slug}' in ${item.__filename} and ${seen.get(key)}`);
    }
    seen.set(key, item.__filename);
  });
}

function buildSitemap(topics, briefs) {
  const pageEntries = [
    'index.html',
    'about.html',
    'topics.html',
    'briefs.html',
    'resources.html',
    'contribute.html',
    ...topics.map((item) => `topic-${item.slug}.html`),
    ...briefs.map((item) => `brief-${item.slug}.html`)
  ];

  const base = config.siteUrl || '';
  const siteUrls = pageEntries.map((page) => base ? `${base.replace(/\/$/, '')}/${page}` : `/${page}`);
  const now = new Date().toISOString();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...siteUrls.map((entry, index) => {
      const priority = index <= 5 ? '0.9' : '0.7';
      return `  <url><loc>${entry}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
    }),
    '</urlset>'
  ].join('\\n');

  fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), xml);
}

function readContentFiles(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs
    .readdirSync(folder)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const raw = fs.readFileSync(path.join(folder, name), 'utf8');
      const parsed = parseFrontMatter(raw);
      return { ...parsed, __filename: name };
    });
}

function sortByDate(a, b) {
  return new Date(b.last_updated) - new Date(a.last_updated);
}

function renderTemplate(template, context) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return context[key] !== undefined ? context[key] : '';
  });
}

function tagSpans(tags = []) {
  return tags
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildTopicCard(topic) {
  const searchText = [topic.title, topic.summary, topic.__rawBody, topic.topics.join(' ')].join(' ');
  return renderTemplate(topicCardTemplate, {
    title: escapeHtml(topic.title),
    slug: escapeHtml(topic.slug),
    summary: escapeHtml(topic.summary),
    updated: `Updated ${topic.last_updated}`,
    topics: topic.topics.join(',').toLowerCase(),
    topicTags: tagSpans(topic.topics),
    searchText: escapeHtml(searchText)
  });
}

function buildBriefCard(brief) {
  const searchText = [brief.title, brief.summary, brief.__rawBody, brief.topics.join(' ')].join(' ');
  return renderTemplate(briefCardTemplate, {
    title: escapeHtml(brief.title),
    slug: escapeHtml(brief.slug),
    summary: escapeHtml(brief.summary),
    status: escapeHtml(brief.status),
    updated: brief.last_updated,
    topics: brief.topics.join(',').toLowerCase(),
    topicTags: tagSpans(brief.topics),
    searchText: escapeHtml(searchText)
  });
}

function buildReferenceList(item) {
  const refs = item.references
    .map((ref) => `<li><a href="${ref.url}" target="_blank" rel="noreferrer">${escapeHtml(ref.title || ref.url)}</a></li>`)
    .join('\n');
  return renderTemplate(referencesTemplate, { references: refs });
}

function buildPage({ title, content, heroHtml = '', active = '', inlineScripts = '' }) {
  const nav = config.nav
    .map((link) => {
      const isActive = link.href === active ? ' active' : '';
      return `<a class="${isActive.trim()}" href="${link.href}">${link.label}</a>`;
    })
    .join('');

  return renderTemplate(layoutTemplate, {
    title: escapeHtml(title),
    description: `${title} · ${config.description}`,
    nav,
    hero: heroHtml,
    content,
    inlineScripts,
    buildDate: new Date().toISOString().slice(0, 10)
  });
}

function relatedFor(current, allTopics) {
  const scores = allTopics
    .filter((item) => item.slug !== current.slug)
    .map((item) => {
      const score = item.topics.reduce((acc, tag) => {
        return acc + (current.topics.includes(tag) ? 1 : 0);
      }, 0);
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);

  if (scores.length === 0) {
    return '';
  }

  const html = scores.map((topic) => `<li><a href="topic-${topic.slug}.html">${escapeHtml(topic.title)}</a></li>`).join('\n');
  return `<section class="related"><h3>Related topics</h3><ul>${html}</ul></section>`;
}

function featuredSelection(items, maxItems = 3, seed = 0) {
  if (!items.length) {
    return [];
  }

  if (items.length <= maxItems) {
    return items;
  }

  const offset = Math.abs(seed) % items.length;
  const selected = [];
  for (let i = 0; i < maxItems; i += 1) {
    selected.push(items[(offset + i) % items.length]);
  }
  return selected;
}

function daySeed() {
  const now = new Date();
  const start = new Date(now.getUTCFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneDay);
}

function renderHome(topics, briefs) {
  const hero = `
    <div class="container hero">
      <h1>${escapeHtml(config.title)}</h1>
      <p>${escapeHtml(config.tagline)}</p>
    </div>
  `;
  const day = daySeed();
  const featuredTopics = featuredSelection(topics, 3, topics.length ? day : 0);
  const featuredBriefs = featuredSelection(briefs, 3, briefs.length ? day + 2 : 0);
  const latestTopics = featuredTopics.map(buildTopicCard).join('\n');
  const latestBriefs = featuredBriefs.map(buildBriefCard).join('\n');
  const content = `
    <section>
      <h2>Research portal: contemporary academic library issues</h2>
      <p>Read issue briefs, issue maps, and policy-oriented reading for teams working in academic libraries, consortia, and campus information services.</p>
      <div class="grid">${latestTopics}</div>
    </section>
    <section>
      <h2>Latest issue briefs</h2>
      <div class="grid">${latestBriefs}</div>
    </section>
  `;
  return buildPage({ title: 'Home', content, heroHtml: hero, active: 'index.html' });
}

function renderStatic(topicPages, briefPages, title, intro) {
  const content = `<article><p>${escapeHtml(intro)}</p></article>`;
  return buildPage({ title, content, heroHtml: defaultHero(title), active: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html` });
}

function defaultHero(title) {
  return `<div class="container hero"><h1>${escapeHtml(title)}</h1></div>`;
}

function renderTopicsIndex(topics) {
  const cards = topics.map(buildTopicCard).join('\n');
  const controls = config.taxonomy.filters
    .map(
      (filter) => `
      <label>
        <input type="checkbox" value="${filter}" />
        <span>${filter}</span>
      </label>
    `
    )
    .join('');

  const hero = `
    <div class="container hero">
      <h1>Library Futures</h1>
      <p>Explore detailed topic pages covering contemporary policy and practice in academic libraries.</p>
    </div>
  `;

  const content = `
    <div class="controls">
      <label class="sr-only" for="topic-search">Search topics</label>
      <input id="topic-search" data-search type="search" placeholder="Search by title, issue, or reference" />
      <div class="filters" id="topic-filters">${controls}</div>
      <button id="clear-filters" type="button">Clear filters</button>
    </div>
    <p id="filter-summary"></p>
    <div class="grid">${cards}</div>
  `;

  const inlineScripts = `<script>window.__ACADEMIC_LIBRARY__={mode:'topics'}</script>`;
  return buildPage({
    title: 'Library Futures',
    heroHtml: hero,
    content,
    active: 'topics.html',
    inlineScripts
  });
}

function renderBriefsIndex(briefs) {
  const cards = briefs.map(buildBriefCard).join('\n');
  const hero = `
    <div class="container hero">
      <h1>Issue Briefs</h1>
      <p>Short, timely notes on current developments and operational implications for library teams.</p>
    </div>
  `;

  const filters = config.taxonomy.filters
    .map(
      (filter) => `
      <label>
        <input type="checkbox" value="${filter}" />
        <span>${filter}</span>
      </label>
    `
    ).join('');

  const content = `
    <div class="controls">
      <label class="sr-only" for="brief-search">Search briefs</label>
      <input id="brief-search" data-search type="search" placeholder="Search by title, summary, or term" />
      <div class="filters" id="topic-filters">${filters}</div>
      <button id="clear-filters" type="button">Clear filters</button>
    </div>
    <p id="filter-summary"></p>
    <div class="grid">${cards}</div>
  `;

  const inlineScripts = `<script>window.__ACADEMIC_LIBRARY__={mode:'briefs'}</script>`;
  return buildPage({
    title: 'Issue Briefs',
    heroHtml: hero,
    content,
    active: 'briefs.html',
    inlineScripts
  });
}

function renderTopicPage(topic, allTopics) {
  const body = parseMarkdown(topic.__rawBody);
  const refs = buildReferenceList(topic);
  const related = relatedFor(topic, allTopics);
  const content = `
    <article>
      <p class="meta">Published ${topic.published} · Last updated ${topic.last_updated}</p>
      ${tagSpans(topic.topics)}
      <h1>${escapeHtml(topic.title)}</h1>
      <p>${escapeHtml(topic.summary)}</p>
      ${body}
      ${refs}
      ${related}
    </article>
  `;
  return buildPage({
    title: topic.title,
    heroHtml: defaultHero(topic.title),
    content,
    active: 'topics.html'
  });
}

function renderBriefPage(brief) {
  const body = parseMarkdown(brief.__rawBody);
  const refs = buildReferenceList(brief);
  const content = `
    <article>
      <p class="meta">Status: ${escapeHtml(brief.status)} · Published ${brief.published} · Last updated ${brief.last_updated}</p>
      ${tagSpans(brief.topics)}
      <h1>${escapeHtml(brief.title)}</h1>
      <p>${escapeHtml(brief.summary)}</p>
      ${body}
      ${refs}
    </article>
  `;
  return buildPage({
    title: brief.title,
    heroHtml: defaultHero(brief.title),
    content,
    active: 'briefs.html'
  });
}

function renderAbout() {
  const hero = `<div class="container hero"><h1>About / Editorial scope</h1><p>Audience-specific and operationally focused commentary on modern academic libraries.</p></div>`;
  const content = `
    <section>
      <h2>What this site covers</h2>
      <p>This site maps cross-cutting issues shaping academic libraries: access models, discovery, metadata quality, repository futures, infrastructure cost, inclusivity, and policy compliance.</p>
      <ul>
        <li>Each topic page combines background context, stakeholder impacts, and next-step guidance.</li>
        <li>Issue briefs summarize fast-moving developments with practical recommendations.</li>
        <li>References include publicly available and stable sources, with clear attributions.</li>
      </ul>
    </section>
    <section>
      <h2>Who it is for</h2>
      <p>The primary audience is academic librarians and information professionals, with content useful to repository managers, collection strategists, systems staff, and policy teams.</p>
    </section>
  `;
  return buildPage({ title: 'About / Editorial Scope', heroHtml: hero, content, active: 'about.html' });
}

function renderResources() {
  const standards = config.resources.standards
    .map((item) => `<li><a href="${item.href}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></li>`)
    .join('\n');
  const policies = config.resources.policies
    .map((item) => `<li><a href="${item.href}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></li>`)
    .join('\n');

  const hero = `<div class="container hero"><h1>Resources</h1><p>Reference points and policy materials used across topic pages.</p></div>`;
  const content = `
    <section>
      <h2>Standards and reports</h2>
      <ul>${standards}</ul>
    </section>
    <section>
      <h2>Policy and guidance</h2>
      <ul>${policies}</ul>
    </section>
  `;
  return buildPage({ title: 'Resources', heroHtml: hero, content, active: 'resources.html' });
}

function renderContribute() {
  const hero = `<div class="container hero"><h1>Contribute</h1><p>Contribute a topic suggestion, request a correction, or propose a brief.</p></div>`;
  const content = `
    <section>
      <h2>How to contribute</h2>
      <p>Use GitHub Issues for topic suggestions and source updates. Include:</p>
      <ul>
        <li>Title and scope of the issue</li>
        <li>Why it matters operationally</li>
        <li>Suggested references or policy anchors</li>
        <li>Proposed practical recommendations</li>
      </ul>
      <p>For direct edits, use pull requests with clearly scoped changes and references in markdown front matter.</p>
    </section>
    <section>
      <h2>Contact</h2>
      <p>Email: editor@academic-library-explorer.org · GitHub Issues: open from the repository page.</p>
    </section>
  `;
  return buildPage({ title: 'Contribute', heroHtml: hero, content, active: 'contribute.html' });
}

function writePage(filename, html) {
  fs.writeFileSync(path.join(outputDir, filename), html);
}

function copyAssets() {
  ensureDir(outAssets);
  fs.writeFileSync(path.join(outAssets, 'css', 'site.css'), siteCss);
  ensureDir(path.join(outAssets, 'js'));
  fs.writeFileSync(path.join(outAssets, 'js', 'site.js'), siteJs);
}

function writeData(topics, briefs) {
  ensureDir(path.join(outAssets, 'data'));
  fs.writeFileSync(
    path.join(outAssets, 'data', 'topics.json'),
    JSON.stringify(
      {
        topics: topics.map((topic) => ({
          title: topic.title,
          slug: topic.slug,
          summary: topic.summary,
          tags: topic.topics,
          updated: topic.last_updated
        })),
        briefs: briefs.map((brief) => ({
          title: brief.title,
          slug: brief.slug,
          summary: brief.summary,
          tags: brief.topics,
          updated: brief.last_updated,
          status: brief.status
        }))
      },
      null,
      2
    )
  );
}

function validateLinks() {
  const allHref = new Set([
    'index.html',
    'about.html',
    'topics.html',
    'briefs.html',
    'resources.html',
    'contribute.html'
  ]);
  const htmlPages = fs
    .readdirSync(outputDir)
    .filter((name) => name.endsWith('.html'));

  htmlPages.forEach((page) => allHref.add(page));

  const html = htmlPages
    .flatMap((file) => fs.readFileSync(path.join(outputDir, file), 'utf8').match(/href="([^"]+)"/g) || [])
    .map((token) => {
      const raw = token.replace(/^href="|"$/g, '').replace(/href="/, '').replace(/"$/, '');
      return raw;
    });

  const local = html.filter((h) => !/^https?:\/\//.test(h) && !h.startsWith('mailto:') && h !== '#');
  local.forEach((h) => {
    const candidate = h.split('#')[0];
    if (!candidate) return;
    if (!allHref.has(candidate) && !candidate.startsWith('assets/')) {
      throw new Error(`Broken internal link in generated site: ${candidate}`);
    }
  });
}

function main() {
  cleanDist();
  ensureDir(path.join(outAssets, 'css'));

  const topicFiles = readContentFiles(topicsDir).map((item) => {
    validateRecord(item, 'topic');
    return item;
  });
  assertUniqueSlugs(topicFiles, 'topic');
  const topics = topicFiles.sort(sortByDate);

  const briefFiles = readContentFiles(briefsDir).map((item) => {
    validateRecord(item, 'brief');
    return item;
  });
  assertUniqueSlugs(briefFiles, 'brief');
  const briefs = briefFiles.sort(sortByDate);

  copyAssets();
  writeData(topics, briefs);

  writePage('index.html', renderHome(topics, briefs));
  writePage('topics.html', renderTopicsIndex(topics));
  writePage('briefs.html', renderBriefsIndex(briefs));
  writePage('about.html', renderAbout());
  writePage('resources.html', renderResources());
  writePage('contribute.html', renderContribute());

  topics.forEach((topic) => {
    writePage(`topic-${topic.slug}.html`, renderTopicPage(topic, topics));
  });

  briefs.forEach((brief) => {
    writePage(`brief-${brief.slug}.html`, renderBriefPage(brief));
  });

  buildSitemap(topics, briefs);

  validateLinks();
}

main();
