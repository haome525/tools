/* tools.js — Core framework for haome525 Tools */
(function() {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const debounce = (fn, ms = 300) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* ===== Theme Manager ===== */
  const Theme = {
    themes: ['ink', 'space', 'graphite'],
    init() {
      const t = localStorage.getItem('hao-theme') || 'ink';
      let m = localStorage.getItem('hao-mode');
      if (!m) m = window.matchMedia?.('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
      this.apply(t, m);
    },
    apply(theme, mode) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-mode', mode);
      localStorage.setItem('hao-theme', theme);
      localStorage.setItem('hao-mode', mode);
    },
    getTheme() { return document.documentElement.getAttribute('data-theme') || 'ink'; },
    getMode() { return document.documentElement.getAttribute('data-mode') || 'light'; },
    toggleMode() {
      const next = this.getMode() === 'light' ? 'dark' : 'light';
      this.apply(this.getTheme(), next);
    },
    setTheme(t) { this.apply(t, this.getMode()); }
  };

  /* ===== Router ===== */
  const Router = {
    current: null,
    routes: {},
    register(name, handler) { this.routes[name] = handler; },
    resolve() {
      const hash = location.hash.slice(2) || 'home';
      if (this.current === hash) return;
      this.current = hash;
      this.render(hash);
    },
    navigate(path) { location.hash = '/' + path; },
    render(hash) {
      const content = $('#tool-content');
      if (!content) return;
      if (hash === 'home' || !hash) {
        this.renderHome(content);
        return;
      }
      const handler = this.routes[hash];
      if (handler) {
        handler(content);
      } else {
        // 查找工具信息
        const tool = TOOLS_DATA.tools.find(t => t.id === hash);
        if (tool) {
          content.innerHTML = `
            <div class="tool-page">
              <div class="tool-header">
                <a class="tool-back" href="#/home">← 返回</a>
                <h1 class="tool-title">${tool.name}</h1>
                <span class="tool-desc">${tool.desc}</span>
              </div>
              <div class="tool-body" style="text-align:center;padding:64px 24px;color:var(--text-muted)">
                <div style="font-size:48px;margin-bottom:16px">🚧</div>
                <p style="font-size:16px;margin-bottom:8px">功能开发中</p>
                <p style="font-size:14px">该工具正在开发完善中，敬请期待</p>
                <a href="#/home" class="tool-btn" style="margin-top:24px;display:inline-flex">返回工具箱</a>
              </div>
            </div>`;
        } else {
          content.innerHTML = '<div class="tool-empty"><div class="tool-empty-icon">🔍</div><p>工具未找到</p><a href="#/home" class="tool-btn" style="margin-top:16px">返回首页</a></div>';
        }
      }
      window.scrollTo(0, 0);
    },
    renderHome(container) {
      let html = `
        <div class="tool-home">
          <div class="tool-home-header">
            <h1>🧰 在线工具箱</h1>
            <p>开发者和设计师的效率工具集合 — 隐私优先，浏览器本地处理</p>
          </div>
          <div class="tool-search">
            <span class="tool-search-icon">🔍</span>
            <input type="text" id="toolSearchInput" placeholder="搜索工具名称、描述或标签…" autocomplete="off">
          </div>
          <div class="tool-cat-bar" id="toolCatBar">
            <button class="tool-cat-btn active" data-cat="all">全部</button>`;
      TOOLS_DATA.categories.forEach(c => {
        if (c.id === 'all') return;
        html += `<button class="tool-cat-btn" data-cat="${c.id}">${c.icon} ${c.name}</button>`;
      });
      html += `</div>
          <div class="tool-grid" id="toolGrid"></div>
          <div class="tool-empty" id="toolEmpty" style="display:none">
            <div class="tool-empty-icon">🔍</div>
            <p>没有找到匹配的工具</p>
          </div>
        </div>`;
      container.innerHTML = html;
      this.renderGrid('all', '');
      this.bindHomeEvents();
    },
    renderGrid(cat, query) {
      let tools = TOOLS_DATA.tools;
      if (cat !== 'all') tools = tools.filter(t => t.category === cat);
      if (query) {
        const q = query.toLowerCase();
        tools = tools.filter(t =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q))
        );
      }
      const grid = $('#toolGrid');
      const empty = $('#toolEmpty');
      if (!grid) return;
      if (tools.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';
      grid.innerHTML = tools.map((t, i) => `
        <a class="tool-card" href="#/${t.id}" style="animation-delay:${i * 30}ms">
          <div class="tool-card-icon">${t.icon}</div>
          <div class="tool-card-name">${t.name}</div>
          <div class="tool-card-desc">${t.desc}</div>
          <div class="tool-card-tags">${t.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}</div>
        </a>`).join('');
    },
    bindHomeEvents() {
      const catBar = $('#toolCatBar');
      const searchInput = $('#toolSearchInput');
      if (catBar) {
        catBar.addEventListener('click', e => {
          const btn = e.target.closest('.tool-cat-btn');
          if (!btn) return;
          $$('.tool-cat-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderGrid(btn.dataset.cat, searchInput?.value || '');
        });
      }
      if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
          const activeCat = $('.tool-cat-btn.active')?.dataset.cat || 'all';
          this.renderGrid(activeCat, searchInput.value);
        }, 200));
        document.addEventListener('keydown', e => {
          if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
          }
        });
      }
    }
  };

  /* ===== Toast ===== */
  function showToast(msg, type = 'success') {
    let toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'toast ' + type;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  /* ===== Copy to Clipboard ===== */
  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('已复制到剪贴板');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ 已复制';
        btn.classList.add('success');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('success'); }, 1500);
      }
    } catch { showToast('复制失败', 'error'); }
  }

  /* ===== Download File ===== */
  function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  /* ===== Library Loader ===== */
  const loadedLibs = new Set();
  async function loadLib(name) {
    if (loadedLibs.has(name)) return true;
    const cdnMap = {
      'marked': 'https://cdn.jsdelivr.net/npm/marked@12/marked.min.js',
      'highlight': 'https://cdn.jsdelivr.net/npm/highlight.js@11/highlight.min.js',
      'crypto-js': 'https://cdn.jsdelivr.net/npm/crypto-js@4/crypto-js.min.js',
      'qrcode': 'https://cdn.jsdelivr.net/npm/qrcode@1/build/qrcode.min.js',
      'papaparse': 'https://cdn.jsdelivr.net/npm/papaparse@5/papaparse.min.js',
      'html2canvas': 'https://cdn.jsdelivr.net/npm/html2canvas@1/html2canvas.min.js'
    };
    const url = cdnMap[name];
    if (!url) return false;
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => { loadedLibs.add(name); resolve(true); };
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  /* ===== Tool Page Helpers ===== */
  function renderToolPage(container, title, desc, renderFn) {
    container.innerHTML = `
      <div class="tool-page">
        <div class="tool-header">
          <a class="tool-back" href="#/home">← 返回</a>
          <h1 class="tool-title">${title}</h1>
          <span class="tool-desc">${desc}</span>
        </div>
        <div id="toolBody"></div>
      </div>`;
    renderFn($('#toolBody'));
  }

  /* ===== Init ===== */
  function init() {
    Theme.init();
    Router.resolve();
    window.addEventListener('hashchange', () => Router.resolve());

    /* Theme toggle button */
    const themeBtn = $('#themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        Theme.toggleMode();
        themeBtn.textContent = Theme.getMode() === 'dark' ? '☀️' : '🌙';
      });
      themeBtn.textContent = Theme.getMode() === 'dark' ? '☀️' : '🌙';
    }
  }

  /* ===== Expose API ===== */
  window.ToolsApp = { Router, Theme, showToast, copyText, downloadFile, loadLib, renderToolPage, debounce };

  document.addEventListener('DOMContentLoaded', init);
})();
