/* tools/index.js — Tool module loader and registration */
(function() {
  'use strict';
  const { Router, renderToolPage, loadLib, copyText, downloadFile, showToast, debounce } = window.ToolsApp;

  /* ===== JSON Formatter ===== */
  Router.register('json-formatter', (container) => {
    renderToolPage(container, 'JSON格式化', '格式化、压缩、校验、树形视图', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入 JSON</div>
            <textarea class="tool-textarea" id="jsonInput" placeholder='粘贴JSON数据，例如：\n{"name":"haome525","tools":["json","base64"]}'></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="jsonOutput">格式化结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._jsonFmt.format()">格式化</button>
          <button class="tool-btn" onclick="ToolsApp._jsonFmt.compress()">压缩</button>
          <button class="tool-btn" onclick="ToolsApp._jsonFmt.validate()">校验</button>
          <button class="tool-btn" onclick="ToolsApp._jsonFmt.copyResult()">复制</button>
          <button class="tool-btn" onclick="ToolsApp._jsonFmt.download()">下载</button>
          <button class="tool-btn" onclick="ToolsApp._jsonFmt.clear()">清空</button>
        </div>
        <div class="tool-settings">
          <div class="tool-settings-title">⚙️ 设置</div>
          <div class="tool-settings-body">
            <div class="tool-setting-group">
              <span class="tool-setting-label">缩进:</span>
              <select class="tool-setting-select" id="jsonIndent" onchange="ToolsApp._jsonFmt.format()">
                <option value="2" selected>2空格</option>
                <option value="4">4空格</option>
                <option value="tab">Tab</option>
              </select>
            </div>
            <div class="tool-setting-group">
              <span class="tool-setting-label">键排序:</span>
              <select class="tool-setting-select" id="jsonSort" onchange="ToolsApp._jsonFmt.format()">
                <option value="off">关闭</option>
                <option value="asc">升序</option>
                <option value="desc">降序</option>
              </select>
            </div>
          </div>
        </div>`;

      const input = document.getElementById('jsonInput');
      const output = document.getElementById('jsonOutput');
      let lastResult = '';

      const obj = {
        format() {
          const indent = document.getElementById('jsonIndent').value;
          const sort = document.getElementById('jsonSort').value;
          try {
            let parsed = JSON.parse(input.value);
            if (sort !== 'off') parsed = sortObj(parsed, sort);
            const space = indent === 'tab' ? '\t' : parseInt(indent);
            lastResult = JSON.stringify(parsed, null, space);
            output.textContent = lastResult;
            output.style.color = '';
          } catch (e) {
            output.innerHTML = `<div class="tool-error"><div class="tool-error-title">JSON解析错误</div>${e.message}</div>`;
            output.style.color = '';
          }
        },
        compress() {
          try {
            lastResult = JSON.stringify(JSON.parse(input.value));
            output.textContent = lastResult;
            output.style.color = '';
          } catch (e) {
            output.innerHTML = `<div class="tool-error"><div class="tool-error-title">JSON解析错误</div>${e.message}</div>`;
          }
        },
        validate() {
          try {
            JSON.parse(input.value);
            output.innerHTML = '<div style="color:var(--success);font-size:16px">✅ JSON格式有效</div>';
            const size = new Blob([input.value]).size;
            output.innerHTML += `<div style="margin-top:8px;color:var(--text-secondary)">大小: ${size} 字节</div>`;
          } catch (e) {
            output.innerHTML = `<div class="tool-error"><div class="tool-error-title">❌ JSON格式无效</div>${e.message}</div>`;
          }
        },
        copyResult() { copyText(lastResult); },
        download() { downloadFile(lastResult, 'formatted.json', 'application/json'); },
        clear() { input.value = ''; output.textContent = ''; lastResult = ''; }
      };

      function sortObj(obj, order) {
        if (Array.isArray(obj)) return obj.map(item => sortObj(item, order));
        if (obj !== null && typeof obj === 'object') {
          const keys = Object.keys(obj).sort((a, b) => order === 'desc' ? b.localeCompare(a) : a.localeCompare(b));
          const sorted = {};
          keys.forEach(k => { sorted[k] = sortObj(obj[k], order); });
          return sorted;
        }
        return obj;
      }

      input.addEventListener('input', debounce(() => obj.format(), 400));
      ToolsApp._jsonFmt = obj;
    });
  });

  /* ===== Base64 ===== */
  Router.register('base64', (container) => {
    renderToolPage(container, 'Base64编码/解码', '文本和图片的Base64编码与解码', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="b64Input" placeholder="输入要编码或解码的文本…"></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="b64Output">结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._base64.encode()">编码 →</button>
          <button class="tool-btn primary" onclick="ToolsApp._base64.decode()">← 解码</button>
          <button class="tool-btn" onclick="ToolsApp._b64copy()">复制结果</button>
          <button class="tool-btn" onclick="ToolsApp._b64clear()">清空</button>
        </div>`;

      const input = document.getElementById('b64Input');
      const output = document.getElementById('b64Output');
      let lastResult = '';

      ToolsApp._base64 = {
        encode() {
          try {
            lastResult = btoa(unescape(encodeURIComponent(input.value)));
            output.textContent = lastResult;
          } catch (e) { output.innerHTML = `<div class="tool-error">${e.message}</div>`; }
        },
        decode() {
          try {
            lastResult = decodeURIComponent(escape(atob(input.value.trim())));
            output.textContent = lastResult;
          } catch (e) { output.innerHTML = `<div class="tool-error">Base64解码失败: 请检查输入是否为有效的Base64字符串</div>`; }
        }
      };
      ToolsApp._b64copy = () => copyText(lastResult);
      ToolsApp._b64clear = () => { input.value = ''; output.textContent = ''; lastResult = ''; };
    });
  });

  /* ===== URL Encoder ===== */
  Router.register('url-encoder', (container) => {
    renderToolPage(container, 'URL编码/解码', 'URL编码、解码、查询参数解析', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本或URL</div>
            <textarea class="tool-textarea" id="urlInput" placeholder="输入URL或文本…\n例如: https://example.com/path?key=值&name=中文"></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="urlOutput">结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._urlEnc.encodeFull()">完全编码</button>
          <button class="tool-btn primary" onclick="ToolsApp._urlEnc.encodeComp()">组件编码</button>
          <button class="tool-btn" onclick="ToolsApp._urlEnc.decode()">解码</button>
          <button class="tool-btn" onclick="ToolsApp._urlEnc.parseParams()">解析参数</button>
          <button class="tool-btn" onclick="ToolsApp._urlCopy()">复制</button>
        </div>`;

      const input = document.getElementById('urlInput');
      const output = document.getElementById('urlOutput');
      let lastResult = '';

      ToolsApp._urlEnc = {
        encodeFull() { lastResult = encodeURIComponent(input.value); output.textContent = lastResult; },
        encodeComp() { lastResult = encodeURI(input.value); output.textContent = lastResult; },
        decode() { try { lastResult = decodeURIComponent(input.value); output.textContent = lastResult; } catch { output.innerHTML = '<div class="tool-error">解码失败</div>'; } },
        parseParams() {
          try {
            const url = new URL(input.value);
            const params = Object.fromEntries(url.searchParams);
            lastResult = JSON.stringify(params, null, 2);
            output.textContent = lastResult;
          } catch { output.innerHTML = '<div class="tool-error">URL格式无效</div>'; }
        }
      };
      ToolsApp._urlCopy = () => copyText(lastResult);
    });
  });

  /* ===== MD5/SHA Hash ===== */
  Router.register('md5', (container) => {
    loadLib('crypto-js').then(() => {
      renderToolPage(container, 'MD5/SHA哈希', 'MD5、SHA1、SHA256、SHA512哈希计算', (body) => {
        body.innerHTML = `
          <div class="tool-layout">
            <div class="tool-input-area">
              <div class="tool-section-label">输入文本</div>
              <textarea class="tool-textarea" id="hashInput" placeholder="输入要计算哈希的文本…"></textarea>
            </div>
            <div class="tool-output-area">
              <div class="tool-section-label">哈希结果</div>
              <div class="tool-output" id="hashOutput">计算结果将显示在这里</div>
            </div>
          </div>
          <div class="tool-actions">
            <button class="tool-btn primary" onclick="ToolsApp._hash.calc()">计算所有哈希</button>
            <button class="tool-btn" onclick="ToolsApp._hashCopy()">复制全部</button>
          </div>`;

        const input = document.getElementById('hashInput');
        const output = document.getElementById('hashOutput');
        let lastResult = '';

        ToolsApp._hash = {
          calc() {
            if (typeof CryptoJS === 'undefined') { output.innerHTML = '<div class="tool-error">加密库加载中，请稍后重试</div>'; return; }
            const text = input.value;
            const md5 = CryptoJS.MD5(text).toString();
            const sha1 = CryptoJS.SHA1(text).toString();
            const sha256 = CryptoJS.SHA256(text).toString();
            const sha512 = CryptoJS.SHA512(text).toString();
            lastResult = `MD5:    ${md5}\nSHA1:   ${sha1}\nSHA256: ${sha256}\nSHA512: ${sha512}`;
            output.textContent = lastResult;
          }
        };
        ToolsApp._hashCopy = () => copyText(lastResult);
      });
    });
  });

  /* ===== Regex Tester ===== */
  Router.register('regex', (container) => {
    renderToolPage(container, '正则表达式测试', '实时匹配、多引擎、代码生成', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md)">
          <div class="tool-section-label">正则表达式</div>
          <div style="display:flex;gap:var(--space-sm);align-items:center">
            <input type="text" id="regexPattern" placeholder="输入正则表达式，如: \\d+" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-family:var(--font-mono);font-size:14px;outline:none">
            <input type="text" id="regexFlags" value="g" placeholder="标志" style="width:60px;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-family:var(--font-mono);font-size:14px;outline:none;text-align:center">
          </div>
        </div>
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">测试文本</div>
            <textarea class="tool-textarea" id="regexTest" placeholder="输入要匹配的测试文本…">Hello World 123, test@email.com, 2026-06-30</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">匹配结果</div>
            <div class="tool-output" id="regexOutput" style="line-height:1.8">输入正则和文本后自动匹配</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn" onclick="ToolsApp._regex.copyPattern()">复制正则</button>
          <button class="tool-btn" onclick="ToolsApp._regex.genCode()">生成代码</button>
        </div>`;

      const pattern = document.getElementById('regexPattern');
      const flags = document.getElementById('regexFlags');
      const testText = document.getElementById('regexTest');
      const output = document.getElementById('regexOutput');

      function doMatch() {
        if (!pattern.value) { output.textContent = '输入正则和文本后自动匹配'; return; }
        try {
          const re = new RegExp(pattern.value, flags.value);
          let html = '<div style="margin-bottom:8px;color:var(--text-muted);font-size:12px">匹配高亮:</div>';
          const highlighted = testText.value.replace(re, m => `<mark style="background:var(--accent-bg);color:var(--accent);padding:1px 3px;border-radius:3px">${m}</mark>`);
          html += `<div style="white-space:pre-wrap">${highlighted}</div>`;
          const matches = testText.value.match(new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g'));
          if (matches) {
            html += `<div style="margin-top:12px;color:var(--success);font-size:13px">找到 ${matches.length} 个匹配:</div>`;
            html += '<div style="margin-top:4px">' + matches.map((m, i) => `<div style="font-family:var(--font-mono);font-size:13px;padding:2px 0">[${i}] "${m}"</div>`).join('') + '</div>';
          }
          output.innerHTML = html;
        } catch (e) {
          output.innerHTML = `<div class="tool-error">${e.message}</div>`;
        }
      }

      pattern.addEventListener('input', debounce(doMatch, 200));
      flags.addEventListener('input', debounce(doMatch, 200));
      testText.addEventListener('input', debounce(doMatch, 200));

      ToolsApp._regex = {
        copyPattern() { copyText('/' + pattern.value + '/' + flags.value); },
        genCode() {
          const p = pattern.value;
          const f = flags.value;
          const code = `// JavaScript\nconst regex = /${p}/${f};\nconst matches = text.match(regex);\n\n// Python\nimport re\npattern = re.compile(r'${p}')\nmatches = pattern.findall(text)`;
          output.textContent = code;
        }
      };
    });
  });

  /* ===== UUID Generator ===== */
  Router.register('uuid-generator', (container) => {
    renderToolPage(container, 'UUID生成器', 'UUID v4批量生成', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-md);align-items:center;flex-wrap:wrap">
          <div class="tool-setting-group">
            <span class="tool-setting-label">数量:</span>
            <input type="number" class="tool-setting-input" id="uuidCount" value="5" min="1" max="100">
          </div>
          <div class="tool-setting-group">
            <span class="tool-setting-label">格式:</span>
            <select class="tool-setting-select" id="uuidFormat">
              <option value="default">带连字符 (xxxxxxxx-xxxx-...)</option>
              <option value="nohyphen">无连字符 (xxxxxxxxxxxxxxxx...)</option>
              <option value="upper">大写</option>
            </select>
          </div>
          <button class="tool-btn primary" onclick="ToolsApp._uuid.gen()">生成</button>
          <button class="tool-btn" onclick="ToolsApp._uuidCopy()">复制全部</button>
        </div>
        <div class="tool-output" id="uuidOutput" style="min-height:300px">点击"生成"按钮创建UUID</div>`;

      const output = document.getElementById('uuidOutput');
      let lastResult = '';

      function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      }

      ToolsApp._uuid = {
        gen() {
          const count = Math.min(parseInt(document.getElementById('uuidCount').value) || 5, 100);
          const fmt = document.getElementById('uuidFormat').value;
          const uuids = Array.from({ length: count }, () => {
            let id = uuidv4();
            if (fmt === 'nohyphen') id = id.replace(/-/g, '');
            if (fmt === 'upper') id = id.toUpperCase();
            return id;
          });
          lastResult = uuids.join('\n');
          output.textContent = lastResult;
        }
      };
      ToolsApp._uuidCopy = () => copyText(lastResult);
      ToolsApp._uuid.gen();
    });
  });

  /* ===== Timestamp ===== */
  Router.register('timestamp', (container) => {
    renderToolPage(container, 'Unix时间戳', '时间戳与日期互转', (body) => {
      const now = Math.floor(Date.now() / 1000);
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="tool-section-label">当前时间戳</div>
            <div style="padding:var(--space-md);background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:20px;font-weight:700;color:var(--accent)" id="tsNow">${now}</div>
            <div style="margin-top:var(--space-sm);color:var(--text-secondary);font-size:13px" id="tsNowDate">${new Date().toLocaleString('zh-CN')}</div>
          </div>
          <div>
            <div class="tool-section-label">时间戳转日期</div>
            <div style="display:flex;gap:var(--space-sm)">
              <input type="text" id="tsInput" value="${now}" style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-family:var(--font-mono);font-size:14px;outline:none">
              <button class="tool-btn primary" onclick="ToolsApp._ts.toDate()">转换</button>
            </div>
            <div style="margin-top:var(--space-sm);font-family:var(--font-mono);font-size:14px" id="tsResult">${new Date().toLocaleString('zh-CN')}</div>
          </div>
          <div>
            <div class="tool-section-label">日期转时间戳</div>
            <input type="datetime-local" id="tsDateInput" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none">
            <div style="margin-top:var(--space-sm);display:flex;gap:var(--space-sm)">
              <button class="tool-btn" onclick="ToolsApp._ts.toStamp()">转换为秒</button>
              <button class="tool-btn" onclick="ToolsApp._ts.toStampMs()">转换为毫秒</button>
            </div>
            <div style="margin-top:var(--space-sm);font-family:var(--font-mono);font-size:14px" id="tsStampResult">—</div>
          </div>
        </div>`;

      ToolsApp._ts = {
        toDate() {
          const v = document.getElementById('tsInput').value.trim();
          const ts = v.length > 10 ? parseInt(v) : parseInt(v) * 1000;
          const d = new Date(ts);
          document.getElementById('tsResult').textContent = isNaN(d) ? '无效时间戳' : d.toLocaleString('zh-CN');
        },
        toStamp() {
          const v = document.getElementById('tsDateInput').value;
          if (!v) return;
          document.getElementById('tsStampResult').textContent = Math.floor(new Date(v).getTime() / 1000);
        },
        toStampMs() {
          const v = document.getElementById('tsDateInput').value;
          if (!v) return;
          document.getElementById('tsStampResult').textContent = new Date(v).getTime();
        }
      };
    });
  });

  /* ===== Password Generator ===== */
  Router.register('password-generator', (container) => {
    renderToolPage(container, '随机密码生成', '安全随机密码生成器', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-lg)">
          <div class="tool-section-label">密码长度</div>
          <div style="display:flex;gap:var(--space-md);align-items:center">
            <input type="range" id="pwdLen" min="8" max="64" value="16" style="flex:1" oninput="document.getElementById('pwdLenVal').textContent=this.value">
            <span id="pwdLenVal" style="font-family:var(--font-mono);font-size:16px;font-weight:600;min-width:30px">16</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-sm);margin-bottom:var(--space-lg)">
          <label style="display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer"><input type="checkbox" id="pwdUpper" checked> 大写字母 (A-Z)</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer"><input type="checkbox" id="pwdLower" checked> 小写字母 (a-z)</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer"><input type="checkbox" id="pwdDigit" checked> 数字 (0-9)</label>
          <label style="display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer"><input type="checkbox" id="pwdSymbol" checked> 符号 (!@#$...)</label>
        </div>
        <div style="margin-bottom:var(--space-md)">
          <button class="tool-btn primary" onclick="ToolsApp._pwd.gen()">生成密码</button>
          <button class="tool-btn" onclick="ToolsApp._pwdCopy()">复制</button>
        </div>
        <div class="tool-output" id="pwdOutput" style="font-size:20px;letter-spacing:2px;min-height:100px;display:flex;align-items:center">点击"生成"按钮</div>`;

      const output = document.getElementById('pwdOutput');
      let lastResult = '';

      ToolsApp._pwd = {
        gen() {
          const len = parseInt(document.getElementById('pwdLen').value);
          let chars = '';
          if (document.getElementById('pwdUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (document.getElementById('pwdLower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
          if (document.getElementById('pwdDigit').checked) chars += '0123456789';
          if (document.getElementById('pwdSymbol').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
          if (!chars) { output.textContent = '请至少选择一种字符类型'; return; }
          const arr = new Uint32Array(len);
          crypto.getRandomValues(arr);
          lastResult = Array.from(arr, x => chars[x % chars.length]).join('');
          output.textContent = lastResult;
        }
      };
      ToolsApp._pwdCopy = () => copyText(lastResult);
      ToolsApp._pwd.gen();
    });
  });

  /* ===== Unit Converter ===== */
  Router.register('unit-converter', (container) => {
    renderToolPage(container, '单位换算', '长度/重量/温度/面积/速度换算', (body) => {
      const units = {
        length: { name: '长度', units: { '毫米(mm)': 0.001, '厘米(cm)': 0.01, '米(m)': 1, '千米(km)': 1000, '英寸(in)': 0.0254, '英尺(ft)': 0.3048, '英里(mi)': 1609.344 } },
        weight: { name: '重量', units: { '毫克(mg)': 0.001, '克(g)': 1, '千克(kg)': 1000, '吨(t)': 1000000, '盎司(oz)': 28.3495, '磅(lb)': 453.592 } },
        temp: { name: '温度', units: { '摄氏度(°C)': 'C', '华氏度(°F)': 'F', '开尔文(K)': 'K' } },
        area: { name: '面积', units: { '平方毫米(mm²)': 0.000001, '平方厘米(cm²)': 0.0001, '平方米(m²)': 1, '平方千米(km²)': 1000000, '公顷(ha)': 10000, '英亩(ac)': 4046.86 } },
        speed: { name: '速度', units: { '米/秒(m/s)': 1, '千米/时(km/h)': 0.277778, '英里/时(mph)': 0.44704, '节(kn)': 0.514444 } }
      };
      let currentType = 'length';

      body.innerHTML = `
        <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-lg);flex-wrap:wrap">
          ${Object.entries(units).map(([k, v]) => `<button class="tool-cat-btn ${k === 'length' ? 'active' : ''}" data-type="${k}">${v.name}</button>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:var(--space-md);align-items:start">
          <div>
            <div class="tool-section-label">从</div>
            <select class="tool-setting-select" id="unitFrom" style="width:100%;margin-bottom:var(--space-sm);padding:8px"></select>
            <input type="number" id="unitValue" value="1" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-family:var(--font-mono);font-size:16px;outline:none" oninput="ToolsApp._unit.convert()">
          </div>
          <div style="padding-top:40px;font-size:24px;color:var(--text-muted)">→</div>
          <div>
            <div class="tool-section-label">到</div>
            <select class="tool-setting-select" id="unitTo" style="width:100%;margin-bottom:var(--space-sm);padding:8px"></select>
            <div style="padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-card);font-family:var(--font-mono);font-size:16px;min-height:42px" id="unitResult">—</div>
          </div>
        </div>`;

      function populateUnits(type) {
        const u = units[type].units;
        const from = document.getElementById('unitFrom');
        const to = document.getElementById('unitTo');
        const keys = Object.keys(u);
        from.innerHTML = keys.map((k, i) => `<option value="${i}" ${i === 0 ? 'selected' : ''}>${k}</option>`).join('');
        to.innerHTML = keys.map((k, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${k}</option>`).join('');
      }

      ToolsApp._unit = {
        convert() {
          const type = currentType;
          const u = units[type].units;
          const keys = Object.keys(u);
          const fromIdx = parseInt(document.getElementById('unitFrom').value);
          const toIdx = parseInt(document.getElementById('unitTo').value);
          const val = parseFloat(document.getElementById('unitValue').value);

          if (type === 'temp') {
            const fromUnit = u[keys[fromIdx]];
            const toUnit = u[keys[toIdx]];
            let celsius;
            if (fromUnit === 'C') celsius = val;
            else if (fromUnit === 'F') celsius = (val - 32) * 5 / 9;
            else celsius = val - 273.15;
            let result;
            if (toUnit === 'C') result = celsius;
            else if (toUnit === 'F') result = celsius * 9 / 5 + 32;
            else result = celsius + 273.15;
            document.getElementById('unitResult').textContent = result.toFixed(4) + ' ' + keys[toIdx];
          } else {
            const baseVal = val * u[keys[fromIdx]];
            const result = baseVal / u[keys[toIdx]];
            document.getElementById('unitResult').textContent = result.toFixed(6) + ' ' + keys[toIdx];
          }
        }
      };

      document.querySelectorAll('[data-type]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentType = btn.dataset.type;
          populateUnits(currentType);
          ToolsApp._unit.convert();
        });
      });
      document.getElementById('unitFrom').addEventListener('change', () => ToolsApp._unit.convert());
      document.getElementById('unitTo').addEventListener('change', () => ToolsApp._unit.convert());
      populateUnits('length');
      ToolsApp._unit.convert();
    });
  });

  /* ===== Base Converter ===== */
  Router.register('base-converter', (container) => {
    renderToolPage(container, '进制转换', '2/8/10/16/32/36进制互转', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md)">
          <div class="tool-section-label">输入数值</div>
          <div style="display:flex;gap:var(--space-sm)">
            <input type="text" id="baseInput" value="255" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-family:var(--font-mono);font-size:14px;outline:none" oninput="ToolsApp._base.convert()">
            <select class="tool-setting-select" id="baseFrom" onchange="ToolsApp._base.convert()" style="padding:8px">
              <option value="10" selected>十进制 (10)</option>
              <option value="2">二进制 (2)</option>
              <option value="8">八进制 (8)</option>
              <option value="16">十六进制 (16)</option>
              <option value="32">32进制</option>
              <option value="36">36进制</option>
            </select>
          </div>
        </div>
        <div class="tool-output" id="baseOutput" style="min-height:200px">转换结果将显示在这里</div>`;

      const input = document.getElementById('baseInput');
      const fromBase = document.getElementById('baseFrom');
      const output = document.getElementById('baseOutput');

      ToolsApp._base = {
        convert() {
          try {
            const val = input.value.trim();
            const base = parseInt(fromBase.value);
            const num = parseInt(val, base);
            if (isNaN(num)) { output.textContent = '无效输入'; return; }
            const bases = [
              { name: '二进制 (2)', base: 2 },
              { name: '八进制 (8)', base: 8 },
              { name: '十进制 (10)', base: 10 },
              { name: '十六进制 (16)', base: 16 },
              { name: '32进制', base: 32 },
              { name: '36进制', base: 36 }
            ];
            output.textContent = bases
              .filter(b => b.base !== base)
              .map(b => `${b.name}: ${num.toString(b.base).toUpperCase()}`)
              .join('\n');
          } catch { output.textContent = '转换失败，请检查输入'; }
        }
      };
      ToolsApp._base.convert();
    });
  });

  /* ===== Text Diff ===== */
  Router.register('text-diff', (container) => {
    renderToolPage(container, '文本对比', '并排对比文本差异', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">原始文本</div>
            <textarea class="tool-textarea" id="diffLeft" placeholder="输入原始文本…">Hello World
This is line 2
This is line 3
Line to delete</textarea>
          </div>
          <div class="tool-input-area">
            <div class="tool-section-label">修改后文本</div>
            <textarea class="tool-textarea" id="diffRight" placeholder="输入修改后文本…">Hello World
This is modified line 2
This is line 3
New line added</textarea>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._diff.compare()">对比</button>
        </div>
        <div class="tool-output" id="diffOutput" style="min-height:200px">点击"对比"查看差异</div>`;

      ToolsApp._diff = {
        compare() {
          const left = document.getElementById('diffLeft').value.split('\n');
          const right = document.getElementById('diffRight').value.split('\n');
          const output = document.getElementById('diffOutput');
          let html = '<div style="font-family:var(--font-mono);font-size:13px;line-height:1.8">';
          const maxLen = Math.max(left.length, right.length);
          for (let i = 0; i < maxLen; i++) {
            const l = left[i] ?? '';
            const r = right[i] ?? '';
            if (l === r) {
              html += `<div style="color:var(--text-muted)">${esc(i + 1)}  ${esc(l)}</div>`;
            } else {
              if (l) html += `<div style="background:rgba(220,38,38,0.1);color:var(--error);padding:0 4px;border-radius:3px">- ${esc(l)}</div>`;
              if (r) html += `<div style="background:rgba(22,163,74,0.1);color:var(--success);padding:0 4px;border-radius:3px">+ ${esc(r)}</div>`;
            }
          }
          html += '</div>';
          output.innerHTML = html;
        }
      };
      function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    });
  });

  /* ===== Color Picker ===== */
  Router.register('color-picker', (container) => {
    renderToolPage(container, '颜色选择器', 'HEX/RGB/HSL转换、调色板', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="color-preview" id="colorPreview" style="background:#C8341B"></div>
            <input type="color" id="colorPicker" value="#C8341B" style="width:100%;height:48px;border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;margin-bottom:var(--space-md)">
            <div class="color-inputs">
              <div class="color-input-group"><label>HEX</label><input type="text" id="colorHex" value="#C8341B" oninput="ToolsApp._color.fromHex()"></div>
              <div class="color-input-group"><label>R</label><input type="number" id="colorR" value="200" min="0" max="255" oninput="ToolsApp._color.fromRGB()"></div>
              <div class="color-input-group"><label>G</label><input type="number" id="colorG" value="52" min="0" max="255" oninput="ToolsApp._color.fromRGB()"></div>
              <div class="color-input-group"><label>B</label><input type="number" id="colorB" value="27" min="0" max="255" oninput="ToolsApp._color.fromRGB()"></div>
            </div>
          </div>
          <div>
            <div class="tool-section-label">CSS代码</div>
            <div class="tool-output" id="colorCode" style="min-height:150px;font-size:13px">HEX: #C8341B
RGB: rgb(200, 52, 27)
HSL: hsl(7, 76%, 45%)
RGBA: rgba(200, 52, 27, 1)</div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._colorCopy()">复制CSS</button>
          </div>
        </div>`;

      const picker = document.getElementById('colorPicker');
      const preview = document.getElementById('colorPreview');
      const hexInput = document.getElementById('colorHex');
      const rInput = document.getElementById('colorR');
      const gInput = document.getElementById('colorG');
      const bInput = document.getElementById('colorB');
      const codeOutput = document.getElementById('colorCode');

      function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
      }

      function update(hex) {
        preview.style.background = hex;
        picker.value = hex;
        hexInput.value = hex;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        rInput.value = r; gInput.value = g; bInput.value = b;
        const [h, s, l] = rgbToHsl(r, g, b);
        const css = `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${h}, ${s}%, ${l}%)\nRGBA: rgba(${r}, ${g}, ${b}, 1)`;
        codeOutput.textContent = css;
      }

      ToolsApp._color = {
        fromHex() {
          let v = hexInput.value.trim();
          if (!v.startsWith('#')) v = '#' + v;
          if (/^#[0-9a-fA-F]{6}$/.test(v)) update(v);
        },
        fromRGB() {
          const r = parseInt(rInput.value) || 0;
          const g = parseInt(gInput.value) || 0;
          const b = parseInt(bInput.value) || 0;
          const hex = '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');
          update(hex);
        }
      };
      ToolsApp._colorCopy = () => copyText(codeOutput.textContent);

      picker.addEventListener('input', () => update(picker.value));
    });
  });

  /* ===== Markdown Editor ===== */
  Router.register('markdown-editor', (container) => {
    Promise.all([loadLib('marked'), loadLib('highlight')]).then(() => {
      if (typeof marked !== 'undefined') {
        marked.setOptions({
          highlight: (code, lang) => {
            if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
              return hljs.highlight(code, { language: lang }).value;
            }
            return code;
          }
        });
      }
      renderToolPage(container, 'Markdown编辑器', '实时预览、语法高亮、导出HTML', (body) => {
        body.innerHTML = `
          <div class="tool-layout" style="min-height:600px">
            <div class="tool-input-area">
              <div class="tool-section-label">Markdown 源码</div>
              <textarea class="tool-textarea" id="mdInput" style="min-height:550px" placeholder="输入Markdown内容…"># Hello World

这是一段 **Markdown** 文本。

## 列表
- 项目一
- 项目二
- 项目三

## 代码
\`\`\`javascript
console.log('Hello Tools!');
\`\`\`

> 引用文本

| 名称 | 值 |
|------|-----|
| A | 1 |
| B | 2 |</textarea>
            </div>
            <div class="tool-output-area">
              <div class="tool-section-label">预览</div>
              <div class="tool-output" id="mdPreview" style="min-height:550px;padding:var(--space-lg);overflow:auto"></div>
            </div>
          </div>
          <div class="tool-actions">
            <button class="tool-btn" onclick="ToolsApp._mdExport()">导出HTML</button>
            <button class="tool-btn" onclick="ToolsApp._mdCopy()">复制HTML</button>
          </div>`;

        const input = document.getElementById('mdInput');
        const preview = document.getElementById('mdPreview');

        function renderMd() {
          if (typeof marked !== 'undefined') {
            preview.innerHTML = marked.parse(input.value);
          } else {
            preview.textContent = input.value;
          }
        }

        input.addEventListener('input', debounce(renderMd, 200));
        renderMd();

        ToolsApp._mdExport = () => {
          const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Markdown</title><style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px;line-height:1.6}pre{background:#f5f5f5;padding:12px;border-radius:6px;overflow-x:auto}code{background:#f0f0f0;padding:2px 4px;border-radius:3px}table{border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body>${preview.innerHTML}</body></html>`;
          downloadFile(html, 'document.html', 'text/html');
        };
        ToolsApp._mdCopy = () => copyText(preview.innerHTML);
      });
    });
  });

  /* ===== Image Compress (simplified) ===== */
  Router.register('image-compress', (container) => {
    renderToolPage(container, '图片压缩', 'PNG/JPEG/WebP图片压缩', (body) => {
      body.innerHTML = `
        <div class="drop-zone" id="imgDropZone">
          <div class="drop-zone-icon">🖼️</div>
          <p>拖拽图片到此处，或 <label for="imgFileInput" style="color:var(--accent);cursor:pointer;text-decoration:underline">点击选择文件</label></p>
          <p style="font-size:12px;color:var(--text-muted);margin-top:4px">支持 PNG / JPEG / WebP，最大 10MB</p>
          <input type="file" id="imgFileInput" accept="image/*" style="display:none">
        </div>
        <div style="margin-top:var(--space-lg);display:none" id="imgResult">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
            <div>
              <div class="tool-section-label">原始图片</div>
              <div id="imgOriginal" style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden"></div>
              <div id="imgOriginalSize" style="margin-top:var(--space-xs);font-size:13px;color:var(--text-muted)"></div>
            </div>
            <div>
              <div class="tool-section-label">压缩后</div>
              <div id="imgCompressed" style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden"></div>
              <div id="imgCompressedSize" style="margin-top:var(--space-xs);font-size:13px;color:var(--text-muted)"></div>
            </div>
          </div>
          <div class="tool-actions" style="margin-top:var(--space-md)">
            <button class="tool-btn primary" onclick="ToolsApp._imgDownload()">下载压缩图片</button>
          </div>
        </div>`;

      const dropZone = document.getElementById('imgDropZone');
      const fileInput = document.getElementById('imgFileInput');
      let compressedBlob = null;

      function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            document.getElementById('imgOriginal').innerHTML = `<img src="${e.target.result}" style="width:100%;display:block">`;
            document.getElementById('imgOriginalSize').textContent = `大小: ${(file.size / 1024).toFixed(1)} KB`;
            // Simple canvas-based compression
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              compressedBlob = blob;
              const url = URL.createObjectURL(blob);
              document.getElementById('imgCompressed').innerHTML = `<img src="${url}" style="width:100%;display:block">`;
              document.getElementById('imgCompressedSize').textContent = `大小: ${(blob.size / 1024).toFixed(1)} KB`;
              document.getElementById('imgResult').style.display = 'block';
            }, file.type, 0.7);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

      ToolsApp._imgDownload = () => {
        if (compressedBlob) downloadFile(compressedBlob, 'compressed-image.png', 'image/png');
      };
    });
  });

  /* ===== Code Screenshot (simplified) ===== */
  Router.register('code-screenshot', (container) => {
    loadLib('highlight').then(() => {
      renderToolPage(container, '代码截图', '多语言语法高亮、多种主题', (body) => {
        body.innerHTML = `
          <div style="display:flex;gap:var(--space-md);margin-bottom:var(--space-md);flex-wrap:wrap">
            <div class="tool-setting-group">
              <span class="tool-setting-label">语言:</span>
              <select class="tool-setting-select" id="codeLang">
                <option value="javascript">JavaScript</option><option value="python">Python</option><option value="java">Java</option>
                <option value="go">Go</option><option value="rust">Rust</option><option value="typescript">TypeScript</option>
                <option value="html">HTML</option><option value="css">CSS</option><option value="sql">SQL</option>
                <option value="bash">Bash</option><option value="json">JSON</option><option value="yaml">YAML</option>
              </select>
            </div>
            <div class="tool-setting-group">
              <span class="tool-setting-label">主题:</span>
              <select class="tool-setting-select" id="codeTheme">
                <option value="github">GitHub</option><option value="monokai">Monokai</option><option value="dracula">Dracula</option>
                <option value="atom-one-dark">Atom One Dark</option><option value="vs2015">VS 2015</option>
              </select>
            </div>
            <button class="tool-btn primary" onclick="ToolsApp._codeShot.render()">生成截图</button>
          </div>
          <textarea class="tool-textarea" id="codeInput" style="min-height:200px" placeholder="粘贴代码…">function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));</textarea>
          <div style="margin-top:var(--space-lg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;display:inline-block;background:#282c34;padding:24px 32px" id="codeShotPreview">
            <div style="display:flex;gap:6px;margin-bottom:16px">
              <span style="width:12px;height:12px;border-radius:50%;background:#ff5f56"></span>
              <span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e"></span>
              <span style="width:12px;height:12px;border-radius:50%;background:#27c93f"></span>
            </div>
            <pre style="margin:0;font-family:var(--font-mono);font-size:14px;line-height:1.6;color:#abb2bf;white-space:pre" id="codeShotCode"></pre>
          </div>
          <div class="tool-actions" style="margin-top:var(--space-md)">
            <button class="tool-btn" onclick="ToolsApp._codeShot.download()">下载PNG</button>
          </div>`;

        ToolsApp._codeShot = {
          render() {
            const code = document.getElementById('codeInput').value;
            const lang = document.getElementById('codeLang').value;
            const el = document.getElementById('codeShotCode');
            if (typeof hljs !== 'undefined') {
              el.innerHTML = hljs.highlight(code, { language: lang }).value;
            } else {
              el.textContent = code;
            }
          },
          download() {
            if (typeof html2canvas !== 'undefined') {
              html2canvas(document.getElementById('codeShotPreview')).then(canvas => {
                canvas.toBlob(blob => downloadFile(blob, 'code-screenshot.png', 'image/png'));
              });
            } else {
              ToolsApp.showToast('html2canvas库加载中，请稍后重试', 'error');
            }
          }
        };
        ToolsApp._codeShot.render();
      });
    });
  });

  /* ===== JWT Parser ===== */
  Router.register('jwt-parser', (container) => {
    loadLib('crypto-js').then(() => {
      renderToolPage(container, 'JWT解析/调试', 'JWT Token解码与验证', (body) => {
        body.innerHTML = `
          <div style="margin-bottom:var(--space-md)">
            <div class="tool-section-label">JWT Token</div>
            <textarea class="tool-textarea" id="jwtInput" style="min-height:120px" placeholder="粘贴JWT Token（Header.Payload.Signature）">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
          </div>
          <div class="tool-actions">
            <button class="tool-btn primary" onclick="ToolsApp._jwt.parse()">解析</button>
            <button class="tool-btn" onclick="ToolsApp._jwtCopyHeader()">复制Header</button>
            <button class="tool-btn" onclick="ToolsApp._jwtCopyPayload()">复制Payload</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)">
            <div>
              <div class="tool-section-label">Header</div>
              <div class="tool-output" id="jwtHeader" style="min-height:150px">—</div>
            </div>
            <div>
              <div class="tool-section-label">Payload</div>
              <div class="tool-output" id="jwtPayload" style="min-height:150px">—</div>
            </div>
          </div>
          <div style="margin-top:var(--space-md)">
            <div class="tool-section-label">Signature</div>
            <div class="tool-output" id="jwtSignature" style="min-height:60px">—</div>
          </div>`;

        const headerEl = document.getElementById('jwtHeader');
        const payloadEl = document.getElementById('jwtPayload');
        const sigEl = document.getElementById('jwtSignature');
        let headerJson = '', payloadJson = '';

        ToolsApp._jwt = {
          parse() {
            const token = document.getElementById('jwtInput').value.trim();
            const parts = token.split('.');
            if (parts.length < 2) { headerEl.textContent = '无效的JWT格式'; payloadEl.textContent = ''; sigEl.textContent = ''; return; }
            try {
              headerJson = JSON.stringify(JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
              payloadJson = JSON.stringify(JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
              headerEl.textContent = headerJson;
              payloadEl.textContent = payloadJson;
              sigEl.textContent = parts[2] || '(无签名)';
            } catch (e) {
              headerEl.innerHTML = `<div class="tool-error">解码失败: ${e.message}</div>`;
              payloadEl.textContent = '';
              sigEl.textContent = '';
            }
          }
        };
        ToolsApp._jwtCopyHeader = () => copyText(headerJson);
        ToolsApp._jwtCopyPayload = () => copyText(payloadJson);
        ToolsApp._jwt.parse();
      });
    });
  });

  /* ===== CSV/JSON Converter ===== */
  Router.register('csv-converter', (container) => {
    loadLib('papaparse').then(() => {
      renderToolPage(container, 'CSV/JSON转换', 'CSV与JSON格式互转', (body) => {
        body.innerHTML = `
          <div class="tool-layout">
            <div class="tool-input-area">
              <div class="tool-section-label">输入 CSV</div>
              <textarea class="tool-textarea" id="csvInput" placeholder="粘贴CSV数据…">name,age,city
Alice,28,Beijing
Bob,35,Shanghai
Charlie,22,Guangzhou</textarea>
            </div>
            <div class="tool-output-area">
              <div class="tool-section-label">JSON 输出</div>
              <div class="tool-output" id="csvOutput">转换结果将显示在这里</div>
            </div>
          </div>
          <div class="tool-actions">
            <button class="tool-btn primary" onclick="ToolsApp._csv.toJson()">CSV → JSON</button>
            <button class="tool-btn" onclick="ToolsApp._csv.fromJson()">JSON → CSV</button>
            <button class="tool-btn" onclick="ToolsApp._csvCopy()">复制</button>
            <button class="tool-btn" onclick="ToolsApp._csvDownload()">下载</button>
          </div>`;

        const input = document.getElementById('csvInput');
        const output = document.getElementById('csvOutput');
        let lastResult = '', lastFormat = 'json';

        ToolsApp._csv = {
          toJson() {
            if (typeof Papa === 'undefined') { output.innerHTML = '<div class="tool-error">PapaParse库加载中，请稍后重试</div>'; return; }
            const result = Papa.parse(input.value.trim(), { header: true, skipEmptyLines: true });
            lastResult = JSON.stringify(result.data, null, 2);
            lastFormat = 'json';
            output.textContent = lastResult;
          },
          fromJson() {
            try {
              const data = JSON.parse(input.value);
              if (typeof Papa === 'undefined') { output.innerHTML = '<div class="tool-error">PapaParse库加载中</div>'; return; }
              lastResult = Papa.unparse(Array.isArray(data) ? data : [data]);
              lastFormat = 'csv';
              output.textContent = lastResult;
            } catch (e) { output.innerHTML = `<div class="tool-error">JSON解析失败: ${e.message}</div>`; }
          }
        };
        ToolsApp._csvCopy = () => copyText(lastResult);
        ToolsApp._csvDownload = () => downloadFile(lastResult, lastFormat === 'json' ? 'data.json' : 'data.csv', lastFormat === 'json' ? 'application/json' : 'text/csv');
        ToolsApp._csv.toJson();
      });
    });
  });

  /* ===== QR Code Generator ===== */
  Router.register('qrcode', (container) => {
    loadLib('qrcode').then(() => {
      renderToolPage(container, '二维码生成', '自定义样式二维码生成', (body) => {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
            <div>
              <div class="tool-section-label">输入内容</div>
              <textarea class="tool-textarea" id="qrInput" style="min-height:150px" placeholder="输入文本或URL…">https://haome525.github.io</textarea>
              <div style="margin-top:var(--space-md);display:flex;gap:var(--space-md);flex-wrap:wrap">
                <div class="tool-setting-group">
                  <span class="tool-setting-label">尺寸:</span>
                  <select class="tool-setting-select" id="qrSize">
                    <option value="256">256×256</option>
                    <option value="512" selected>512×512</option>
                    <option value="1024">1024×1024</option>
                  </select>
                </div>
                <div class="tool-setting-group">
                  <span class="tool-setting-label">前景色:</span>
                  <input type="color" id="qrFg" value="#000000" style="width:36px;height:28px;border:1px solid var(--border);cursor:pointer">
                </div>
                <div class="tool-setting-group">
                  <span class="tool-setting-label">背景色:</span>
                  <input type="color" id="qrBg" value="#ffffff" style="width:36px;height:28px;border:1px solid var(--border);cursor:pointer">
                </div>
              </div>
              <button class="tool-btn primary" style="margin-top:var(--space-md)" onclick="ToolsApp._qr.gen()">生成二维码</button>
            </div>
            <div>
              <div class="tool-section-label">预览</div>
              <div id="qrPreview" style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-lg);display:flex;align-items:center;justify-content:center;min-height:300px;background:#fff">
                <canvas id="qrCanvas"></canvas>
              </div>
              <div class="tool-actions" style="margin-top:var(--space-sm)">
                <button class="tool-btn" onclick="ToolsApp._qrDownload()">下载PNG</button>
              </div>
            </div>
          </div>`;

        ToolsApp._qr = {
          gen() {
            if (typeof QRCode === 'undefined') { ToolsApp.showToast('QRCode库加载中，请稍后重试', 'error'); return; }
            const text = document.getElementById('qrInput').value.trim();
            if (!text) return;
            const size = parseInt(document.getElementById('qrSize').value);
            const fg = document.getElementById('qrFg').value;
            const bg = document.getElementById('qrBg').value;
            const canvas = document.getElementById('qrCanvas');
            canvas.width = size;
            canvas.height = size;
            QRCode.toCanvas(canvas, text, { width: size, color: { dark: fg, light: bg } }, err => {
              if (err) ToolsApp.showToast('生成失败: ' + err.message, 'error');
            });
          },
          download() {
            const canvas = document.getElementById('qrCanvas');
            canvas.toBlob(blob => downloadFile(blob, 'qrcode.png', 'image/png'));
          }
        };
        ToolsApp._qrDownload = () => ToolsApp._qr.download();
        ToolsApp._qr.gen();
      });
    });
  });

  /* ===== Cron Editor ===== */
  Router.register('cron-editor', (container) => {
    renderToolPage(container, 'Cron表达式', 'Cron表达式编辑与解释', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md)">
          <div class="tool-section-label">Cron 表达式</div>
          <div style="display:flex;gap:var(--space-sm)">
            <input type="text" id="cronInput" value="*/5 * * * *" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-family:var(--font-mono);font-size:14px;outline:none" oninput="ToolsApp._cron.parse()">
            <button class="tool-btn" onclick="ToolsApp._cronCopy()">复制</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:var(--space-sm);margin-bottom:var(--space-lg)">
          <div><label style="font-size:11px;color:var(--text-muted)">分钟 (0-59)</label><input type="text" id="cronMin" class="tool-setting-input" style="width:100%;margin-top:4px" value="*/5" oninput="ToolsApp._cron.fromFields()"></div>
          <div><label style="font-size:11px;color:var(--text-muted)">小时 (0-23)</label><input type="text" id="cronHour" class="tool-setting-input" style="width:100%;margin-top:4px" value="*" oninput="ToolsApp._cron.fromFields()"></div>
          <div><label style="font-size:11px;color:var(--text-muted)">日 (1-31)</label><input type="text" id="cronDay" class="tool-setting-input" style="width:100%;margin-top:4px" value="*" oninput="ToolsApp._cron.fromFields()"></div>
          <div><label style="font-size:11px;color:var(--text-muted)">月 (1-12)</label><input type="text" id="cronMonth" class="tool-setting-input" style="width:100%;margin-top:4px" value="*" oninput="ToolsApp._cron.fromFields()"></div>
          <div><label style="font-size:11px;color:var(--text-muted)">星期 (0-6)</label><input type="text" id="cronWeek" class="tool-setting-input" style="width:100%;margin-top:4px" value="*" oninput="ToolsApp._cron.fromFields()"></div>
        </div>
        <div class="tool-section-label">解释</div>
        <div class="tool-output" id="cronOutput" style="min-height:80px">—</div>
        <div class="tool-section-label" style="margin-top:var(--space-md)">常用表达式</div>
        <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;margin-top:var(--space-sm)">
          <button class="tool-btn" onclick="ToolsApp._cronSet('* * * * *')">每分钟</button>
          <button class="tool-btn" onclick="ToolsApp._cronSet('0 * * * *')">每小时</button>
          <button class="tool-btn" onclick="ToolsApp._cronSet('0 0 * * *')">每天零点</button>
          <button class="tool-btn" onclick="ToolsApp._cronSet('0 0 * * 1')">每周一</button>
          <button class="tool-btn" onclick="ToolsApp._cronSet('0 0 1 * *')">每月1号</button>
        </div>`;

      const desc = {
        minute: '每分钟', '*/5': '每5分钟', '*/10': '每10分钟', '*/15': '每15分钟', '*/30': '每30分钟',
        hour: '每小时', day: '每天', month: '每月', week: '每周'
      };
      const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

      ToolsApp._cron = {
        parse() {
          const v = document.getElementById('cronInput').value.trim();
          const parts = v.split(/\s+/);
          if (parts.length !== 5) { document.getElementById('cronOutput').textContent = '格式错误: 需要5个字段'; return; }
          const [min, hour, day, month, week] = parts;
          let explain = `时间: ${min} ${hour} ${day} ${month} ${week}\n`;
          explain += `分钟: ${min === '*' ? '每分钟' : min}\n`;
          explain += `小时: ${hour === '*' ? '每小时' : hour}\n`;
          explain += `日期: ${day === '*' ? '每天' : day}\n`;
          explain += `月份: ${month === '*' ? '每月' : month}\n`;
          explain += `星期: ${week === '*' ? '每天' : weekNames[parseInt(week)] || week}`;
          document.getElementById('cronOutput').textContent = explain;
          const p = v.split(/\s+/);
          document.getElementById('cronMin').value = p[0] || '*';
          document.getElementById('cronHour').value = p[1] || '*';
          document.getElementById('cronDay').value = p[2] || '*';
          document.getElementById('cronMonth').value = p[3] || '*';
          document.getElementById('cronWeek').value = p[4] || '*';
        },
        fromFields() {
          const v = [document.getElementById('cronMin').value, document.getElementById('cronHour').value, document.getElementById('cronDay').value, document.getElementById('cronMonth').value, document.getElementById('cronWeek').value].join(' ');
          document.getElementById('cronInput').value = v;
          this.parse();
        }
      };
      ToolsApp._cronCopy = () => copyText(document.getElementById('cronInput').value);
      ToolsApp._cronSet = (v) => { document.getElementById('cronInput').value = v; ToolsApp._cron.parse(); };
      window.ToolsApp._cronSet = ToolsApp._cronSet;
      ToolsApp._cron.parse();
    });
  });

  /* ===== IP Query ===== */
  Router.register('ip-query', (container) => {
    renderToolPage(container, 'IP地址查询', '查询IP地址地理位置信息', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm)">
          <input type="text" id="ipInput" placeholder="输入IP地址（留空查询本机）" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none">
          <button class="tool-btn primary" onclick="ToolsApp._ip.query()">查询</button>
        </div>
        <div class="tool-output" id="ipOutput" style="min-height:200px">点击"查询"获取IP信息</div>`;

      ToolsApp._ip = {
        async query() {
          const ip = document.getElementById('ipInput').value.trim();
          const output = document.getElementById('ipOutput');
          output.textContent = '正在查询…';
          try {
            // 使用多个备用API（依次尝试）
            const apis = [
              { url: ip ? `https://ip-api.com/json/${ip}` : 'https://ip-api.com/json/', fields: { ip: 'query', country: 'country', region: 'regionName', city: 'city', postal: 'zip', lat: 'lat', lon: 'lon', timezone: 'timezone', isp: 'isp', org: 'org', asn: 'as' } },
              { url: ip ? `https://ipwho.is/${ip}` : 'https://ipwho.is/', fields: { ip: 'ip', country: 'country', region: 'region', city: 'city', postal: 'postal', lat: 'latitude', lon: 'longitude', timezone: 'timezone', org: 'org', isp: 'isp', asn: 'asn' } },
              { url: ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json', fields: { ip: 'ip', country: 'country', region: 'region', city: 'city', postal: 'postal', lat: 'loc', lon: 'loc', timezone: 'timezone', org: 'org' } }
            ];
            let data = null;
            let lastError = null;
            let fields = null;
            
            for (const api of apis) {
              try {
                const res = await fetch(api.url);
                const d = await res.json();
                if (d && !d.error && d.status !== 'fail') {
                  data = d;
                  fields = api.fields;
                  break;
                }
              } catch (e) {
                lastError = e;
                continue;
              }
            }
            
            if (!data) {
              output.innerHTML = `<div class="tool-error">查询失败: ${lastError?.message || '无法获取IP信息'}</div>`;
              return;
            }
            
            function getField(f) {
              if (f === 'lat') return data[fields.lat]?.toString().split(',')[0] || '—';
              if (f === 'lon') {
                const val = data[fields.lon];
                return val?.includes(',') ? val.split(',')[1].trim() : '—';
              }
              return data[fields[f]] || '—';
            }
            
            output.textContent = [
              `IP地址:   ${getField('ip')}`,
              `国家:     ${getField('country')}`,
              `地区:     ${getField('region')}`,
              `城市:     ${getField('city')}`,
              `邮编:     ${getField('postal')}`,
              `经纬度:   ${getField('lat')}, ${getField('lon')}`,
              `时区:     ${getField('timezone')}`,
              `ISP:      ${getField('isp')}`,
              `AS:       ${getField('asn')}`
            ].join('\n');
          } catch (e) { output.innerHTML = `<div class="tool-error">查询失败: ${e.message}</div>`; }
        }
      };
      ToolsApp._ip.query();
    });
  });

  /* ===== CSS Flex Generator ===== */
  Router.register('css-flex', (container) => {
    renderToolPage(container, 'CSS Flex生成器', '可视化Flex布局生成CSS代码', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="tool-section-label">布局设置</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
              <div class="tool-setting-group" style="flex-direction:column;align-items:stretch">
                <span class="tool-setting-label">flex-direction</span>
                <select class="tool-setting-select" id="flexDir" onchange="ToolsApp._flex.gen()" style="width:100%">
                  <option value="row">row</option><option value="row-reverse">row-reverse</option>
                  <option value="column">column</option><option value="column-reverse">column-reverse</option>
                </select>
              </div>
              <div class="tool-setting-group" style="flex-direction:column;align-items:stretch">
                <span class="tool-setting-label">justify-content</span>
                <select class="tool-setting-select" id="flexJustify" onchange="ToolsApp._flex.gen()" style="width:100%">
                  <option value="flex-start">flex-start</option><option value="flex-end">flex-end</option>
                  <option value="center">center</option><option value="space-between">space-between</option>
                  <option value="space-around">space-around</option><option value="space-evenly">space-evenly</option>
                </select>
              </div>
              <div class="tool-setting-group" style="flex-direction:column;align-items:stretch">
                <span class="tool-setting-label">align-items</span>
                <select class="tool-setting-select" id="flexAlign" onchange="ToolsApp._flex.gen()" style="width:100%">
                  <option value="stretch">stretch</option><option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option><option value="center">center</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>
              <div class="tool-setting-group" style="flex-direction:column;align-items:stretch">
                <span class="tool-setting-label">flex-wrap</span>
                <select class="tool-setting-select" id="flexWrap" onchange="ToolsApp._flex.gen()" style="width:100%">
                  <option value="nowrap">nowrap</option><option value="wrap">wrap</option><option value="wrap-reverse">wrap-reverse</option>
                </select>
              </div>
              <div class="tool-setting-group" style="flex-direction:column;align-items:stretch">
                <span class="tool-setting-label">gap</span>
                <input type="text" class="tool-setting-input" id="flexGap" value="8px" style="width:100%" oninput="ToolsApp._flex.gen()">
              </div>
            </div>
            <div class="tool-section-label">预览</div>
            <div id="flexPreview" style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-md);min-height:200px;background:var(--bg-card)"></div>
          </div>
          <div>
            <div class="tool-section-label">生成的CSS</div>
            <div class="tool-output" id="flexCode" style="min-height:300px;font-size:13px">—</div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._flexCopy()">复制CSS</button>
          </div>
        </div>`;

      ToolsApp._flex = {
        gen() {
          const dir = document.getElementById('flexDir').value;
          const justify = document.getElementById('flexJustify').value;
          const align = document.getElementById('flexAlign').value;
          const wrap = document.getElementById('flexWrap').value;
          const gap = document.getElementById('flexGap').value;
          const preview = document.getElementById('flexPreview');
          preview.style.display = 'flex';
          preview.style.flexDirection = dir;
          preview.style.justifyContent = justify;
          preview.style.alignItems = align;
          preview.style.flexWrap = wrap;
          preview.style.gap = gap;
          if (!preview.children.length) {
            for (let i = 0; i < 4; i++) {
              const item = document.createElement('div');
              item.style.cssText = `background:var(--accent);color:#fff;padding:12px 16px;border-radius:6px;font-size:13px;font-weight:600;min-width:60px;text-align:center`;
              item.textContent = `${i + 1}`;
              preview.appendChild(item);
            }
          }
          const css = `.container {\n  display: flex;\n  flex-direction: ${dir};\n  justify-content: ${justify};\n  align-items: ${align};\n  flex-wrap: ${wrap};\n  gap: ${gap};\n}`;
          document.getElementById('flexCode').textContent = css;
        }
      };
      ToolsApp._flexCopy = () => copyText(document.getElementById('flexCode').textContent);
      ToolsApp._flex.gen();
    });
  });

  /* ===== CSS Gradient Generator ===== */
  Router.register('gradient', (container) => {
    renderToolPage(container, 'CSS渐变生成器', '线性/径向渐变可视化编辑', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="tool-section-label">渐变设置</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
              <div class="tool-setting-group" style="flex-direction:column;align-items:stretch">
                <span class="tool-setting-label">类型</span>
                <select class="tool-setting-select" id="gradType" onchange="ToolsApp._grad.gen()" style="width:100%">
                  <option value="linear">线性渐变</option><option value="radial">径向渐变</option>
                </select>
              </div>
              <div class="tool-setting-group" style="flex-direction:column;align-items:stretch">
                <span class="tool-setting-label">角度</span>
                <input type="range" id="gradAngle" min="0" max="360" value="135" style="width:100%" oninput="document.getElementById('gradAngleVal').textContent=this.value+'°';ToolsApp._grad.gen()">
                <span id="gradAngleVal" style="font-size:12px;color:var(--text-muted)">135°</span>
              </div>
            </div>
            <div style="margin-bottom:var(--space-md)">
              <div class="tool-section-label">颜色停靠点</div>
              <div id="gradStops" style="display:flex;gap:var(--space-sm);flex-wrap:wrap;margin-bottom:var(--space-sm)">
                <div style="display:flex;align-items:center;gap:4px"><input type="color" class="grad-color" value="#C8341B" onchange="ToolsApp._grad.gen()"><input type="text" class="grad-pos tool-setting-input" value="0%" style="width:50px" oninput="ToolsApp._grad.gen()"></div>
                <div style="display:flex;align-items:center;gap:4px"><input type="color" class="grad-color" value="#FFB000" onchange="ToolsApp._grad.gen()"><input type="text" class="grad-pos tool-setting-input" value="50%" style="width:50px" oninput="ToolsApp._grad.gen()"></div>
                <div style="display:flex;align-items:center;gap:4px"><input type="color" class="grad-color" value="#16a34a" onchange="ToolsApp._grad.gen()"><input type="text" class="grad-pos tool-setting-input" value="100%" style="width:50px" oninput="ToolsApp._grad.gen()"></div>
              </div>
              <button class="tool-btn" onclick="ToolsApp._grad.addStop()">+ 添加颜色</button>
            </div>
            <div class="tool-section-label">预览</div>
            <div id="gradPreview" style="width:100%;height:200px;border-radius:var(--radius-sm);border:1px solid var(--border)"></div>
          </div>
          <div>
            <div class="tool-section-label">生成的CSS</div>
            <div class="tool-output" id="gradCode" style="min-height:200px;font-size:13px">—</div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._gradCopy()">复制CSS</button>
          </div>
        </div>`;

      ToolsApp._grad = {
        gen() {
          const type = document.getElementById('gradType').value;
          const angle = document.getElementById('gradAngle').value;
          const colors = [...document.querySelectorAll('.grad-color')].map(el => el.value);
          const positions = [...document.querySelectorAll('.grad-pos')].map(el => el.value);
          const stops = colors.map((c, i) => `${c} ${positions[i] || '0%'}`).join(', ');
          const grad = type === 'linear' ? `linear-gradient(${angle}deg, ${stops})` : `radial-gradient(circle, ${stops})`;
          document.getElementById('gradPreview').style.background = grad;
          document.getElementById('gradCode').textContent = `background: ${grad};`;
        },
        addStop() {
          const container = document.getElementById('gradStops');
          const div = document.createElement('div');
          div.style.cssText = 'display:flex;align-items:center;gap:4px';
          div.innerHTML = `<input type="color" class="grad-color" value="#666666" onchange="ToolsApp._grad.gen()"><input type="text" class="grad-pos tool-setting-input" value="50%" style="width:50px" oninput="ToolsApp._grad.gen()">`;
          container.appendChild(div);
          this.gen();
        }
      };
      ToolsApp._gradCopy = () => copyText(document.getElementById('gradCode').textContent);
      ToolsApp._grad.gen();
    });
  });

  /* ===== File Hash ===== */
  Router.register('hash-file', (container) => {
    loadLib('crypto-js').then(() => {
      renderToolPage(container, '文件哈希计算', '拖拽文件计算MD5/SHA哈希', (body) => {
        body.innerHTML = `
          <div class="drop-zone" id="hashFileDrop">
            <div class="drop-zone-icon">📄</div>
            <p>拖拽文件到此处，或 <label for="hashFileInput" style="color:var(--accent);cursor:pointer;text-decoration:underline">点击选择文件</label></p>
            <input type="file" id="hashFileInput" style="display:none">
          </div>
          <div id="hashFileInfo" style="margin-top:var(--space-md);display:none">
            <div style="display:flex;gap:var(--space-lg);margin-bottom:var(--space-sm);font-size:14px;color:var(--text-secondary)">
              <span>文件名: <strong id="hashFileName">—</strong></span>
              <span>大小: <strong id="hashFileSize">—</strong></span>
            </div>
            <div class="tool-output" id="hashFileOutput" style="min-height:150px">计算中…</div>
          </div>`;

      const drop = document.getElementById('hashFileDrop');
      const fileInput = document.getElementById('hashFileInput');

      function handleFile(file) {
        if (!file) return;
        document.getElementById('hashFileInfo').style.display = 'block';
        document.getElementById('hashFileName').textContent = file.name;
        document.getElementById('hashFileSize').textContent = (file.size / 1024).toFixed(1) + ' KB';
        document.getElementById('hashFileOutput').textContent = '正在计算哈希…';
        const reader = new FileReader();
        reader.onload = (e) => {
          const word = CryptoJS.lib.WordArray.create(e.target.result);
          const md5 = CryptoJS.MD5(word).toString();
          const sha1 = CryptoJS.SHA1(word).toString();
          const sha256 = CryptoJS.SHA256(word).toString();
          const sha512 = CryptoJS.SHA512(word).toString();
          document.getElementById('hashFileOutput').textContent = `MD5:    ${md5}\nSHA1:   ${sha1}\nSHA256: ${sha256}\nSHA512: ${sha512}`;
        };
        reader.readAsArrayBuffer(file);
      }

      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
      drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
      });
    });
  });

  /* ===== Image to Base64 ===== */
  Router.register('image-base64', (container) => {
    renderToolPage(container, '图片转Base64', '图片与Base64 Data URL互转', (body) => {
      body.innerHTML = `
        <div class="drop-zone" id="imgB64Drop">
          <div class="drop-zone-icon">🖼️</div>
          <p>拖拽图片到此处，或 <label for="imgB64FileInput" style="color:var(--accent);cursor:pointer;text-decoration:underline">点击选择文件</label></p>
          <p style="font-size:12px;color:var(--text-muted);margin-top:4px">支持 PNG / JPEG / WebP / GIF</p>
          <input type="file" id="imgB64FileInput" accept="image/*" style="display:none">
        </div>
        <div id="imgB64Result" style="margin-top:var(--space-lg);display:none">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
            <div>
              <div class="tool-section-label">预览</div>
              <div id="imgB64Preview" style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden"></div>
            </div>
            <div>
              <div class="tool-section-label">Base64 Data URL</div>
              <div class="tool-output" id="imgB64Output" style="min-height:200px;word-break:break-all;font-size:12px">—</div>
            </div>
          </div>
          <div class="tool-actions" style="margin-top:var(--space-md)">
            <button class="tool-btn" onclick="ToolsApp._imgB64Copy()">复制Data URL</button>
            <button class="tool-btn" onclick="ToolsApp._imgB64Download()">下载Base64文本</button>
          </div>
        </div>`;

      const drop = document.getElementById('imgB64Drop');
      const fileInput = document.getElementById('imgB64FileInput');
      let lastDataUrl = '';

      function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          lastDataUrl = e.target.result;
          document.getElementById('imgB64Preview').innerHTML = `<img src="${lastDataUrl}" style="max-width:100%;display:block">`;
          document.getElementById('imgB64Output').textContent = lastDataUrl;
          document.getElementById('imgB64Result').style.display = 'block';
        };
        reader.readAsDataURL(file);
      }

      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
      drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

      ToolsApp._imgB64Copy = () => copyText(lastDataUrl);
      ToolsApp._imgB64Download = () => downloadFile(lastDataUrl, 'image-base64.txt', 'text/plain');
    });
  });

  /* ===== XML Formatter ===== */
  Router.register('xml-formatter', (container) => {
    renderToolPage(container, 'XML格式化', 'XML文档格式化、压缩、校验', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入 XML</div>
            <textarea class="tool-textarea" id="xmlInput" placeholder="粘贴XML数据…"></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="xmlOutput">格式化结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._xml.format()">格式化</button>
          <button class="tool-btn" onclick="ToolsApp._xml.compress()">压缩</button>
          <button class="tool-btn" onclick="ToolsApp._xml.validate()">校验</button>
          <button class="tool-btn" onclick="ToolsApp._xmlCopy()">复制</button>
        </div>`;
      const input = document.getElementById('xmlInput');
      const output = document.getElementById('xmlOutput');
      let lastResult = '';
      function formatXml(xml) {
        let formatted = '';
        let indentLevel = 0;
        const lines = xml.replace(/>\s*</g, '>\n<').split('\n');
        lines.forEach(line => {
          line = line.trim();
          if (!line) return;
          if (line.match(/^<\/\w/)) indentLevel--;
          formatted += '  '.repeat(Math.max(0, indentLevel)) + line + '\n';
          if (line.match(/^<\w[^>]*[^/]>$/)) indentLevel++;
        });
        return formatted.trim();
      }
      ToolsApp._xml = {
        format() {
          try {
            lastResult = formatXml(input.value);
            output.textContent = lastResult;
          } catch (e) { output.innerHTML = `<div class="tool-error">${e.message}</div>`; }
        },
        compress() {
          lastResult = input.value.replace(/>\s*</g, '><').replace(/\s+/g, ' ').trim();
          output.textContent = lastResult;
        },
        validate() {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(input.value, 'text/xml');
            const error = doc.querySelector('parsererror');
            if (error) { output.innerHTML = `<div class="tool-error">XML格式无效: ${error.textContent.substring(0, 200)}</div>`; }
            else { output.innerHTML = '<div style="color:var(--success)">✅ XML格式有效</div>'; }
          } catch (e) { output.innerHTML = `<div class="tool-error">${e.message}</div>`; }
        }
      };
      ToolsApp._xmlCopy = () => copyText(lastResult);
    });
  });

  /* ===== YAML/JSON Converter ===== */
  Router.register('yaml-converter', (container) => {
    renderToolPage(container, 'YAML/JSON转换', 'YAML与JSON格式互转', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入 YAML</div>
            <textarea class="tool-textarea" id="yamlInput" placeholder="输入YAML数据…">name: haome525
tools:
  - json
  - base64
  - yaml</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">JSON 输出</div>
            <div class="tool-output" id="yamlOutput">转换结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._yaml.toJson()">YAML → JSON</button>
          <button class="tool-btn" onclick="ToolsApp._yamlCopy()">复制</button>
        </div>`;
      const input = document.getElementById('yamlInput');
      const output = document.getElementById('yamlOutput');
      let lastResult = '';
      function yamlToJson(yaml) {
        const lines = yaml.split('\n');
        const result = {};
        let currentKey = null;
        let currentArray = null;
        lines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return;
          const indent = line.length - line.trimStart().length;
          if (indent === 0 && trimmed.includes(':')) {
            const [key, ...valueParts] = trimmed.split(':');
            const value = valueParts.join(':').trim();
            if (value === '' || value === '|' || value === '>') {
              currentKey = key.trim();
              result[currentKey] = [];
              currentArray = result[currentKey];
            } else {
              result[key.trim()] = value.replace(/^["']|["']$/g, '');
              currentKey = null;
              currentArray = null;
            }
          } else if (indent > 0 && trimmed.startsWith('- ')) {
            const value = trimmed.substring(2).trim();
            if (currentArray) currentArray.push(value.replace(/^["']|["']$/g, ''));
          } else if (indent > 0 && trimmed.includes(':')) {
            const [key, ...valueParts] = trimmed.split(':');
            const value = valueParts.join(':').trim();
            if (currentKey && Array.isArray(result[currentKey])) {
              const lastItem = result[currentKey][result[currentKey].length - 1];
              if (typeof lastItem === 'object') lastItem[key.trim()] = value.replace(/^["']|["']$/g, '');
            }
          }
        });
        return result;
      }
      ToolsApp._yaml = {
        toJson() {
          try {
            const obj = yamlToJson(input.value);
            lastResult = JSON.stringify(obj, null, 2);
            output.textContent = lastResult;
          } catch (e) { output.innerHTML = `<div class="tool-error">${e.message}</div>`; }
        }
      };
      ToolsApp._yamlCopy = () => copyText(lastResult);
    });
  });

  /* ===== SQL Formatter ===== */
  Router.register('sql-formatter', (container) => {
    renderToolPage(container, 'SQL格式化', 'SQL语句格式化与美化', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入 SQL</div>
            <textarea class="tool-textarea" id="sqlInput" placeholder="粘贴SQL语句…">SELECT u.id, u.name, u.email, o.id as order_id, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2026-01-01' ORDER BY o.created_at DESC LIMIT 100</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">格式化结果</div>
            <div class="tool-output" id="sqlOutput">格式化结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._sql.format()">格式化</button>
          <button class="tool-btn" onclick="ToolsApp._sql.compress()">压缩</button>
          <button class="tool-btn" onclick="ToolsApp._sqlCopy()">复制</button>
        </div>`;
      const input = document.getElementById('sqlInput');
      const output = document.getElementById('sqlOutput');
      let lastResult = '';
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'ON', 'HAVING', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'LIMIT', 'OFFSET', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION', 'ALL', 'DISTINCT'];
      ToolsApp._sql = {
        format() {
          let sql = input.value.replace(/\s+/g, ' ').trim();
          const sorted = keywords.sort((a, b) => b.length - a.length);
          sql = sql.replace(new RegExp('\\b(?:' + sorted.join('|') + ')\\b', 'gi'), '\n$&');
          lastResult = sql.trim();
          output.textContent = lastResult;
        },
        compress() {
          lastResult = input.value.replace(/\s+/g, ' ').trim();
          output.textContent = lastResult;
        }
      };
      ToolsApp._sqlCopy = () => copyText(lastResult);
    });
  });

  /* ===== HTML Entities ===== */
  Router.register('html-entities', (container) => {
    renderToolPage(container, 'HTML实体编码', 'HTML实体编码与解码转换', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="htmlEntInput" placeholder="输入文本或HTML实体…">你好 &lt;div&gt;世界&lt;/div&gt;</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="htmlEntOutput">结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._htmlEnt.encode()">编码</button>
          <button class="tool-btn" onclick="ToolsApp._htmlEnt.decode()">解码</button>
          <button class="tool-btn" onclick="ToolsApp._htmlEntCopy()">复制</button>
        </div>`;
      const input = document.getElementById('htmlEntInput');
      const output = document.getElementById('htmlEntOutput');
      let lastResult = '';
      const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', ' ': '&nbsp;' };
      const reverseEntities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
      ToolsApp._htmlEnt = {
        encode() { lastResult = input.value.replace(/[&<>"' ]/g, c => entities[c]); output.textContent = lastResult; },
        decode() { lastResult = input.value.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, m => reverseEntities[m]); output.textContent = lastResult; }
      };
      ToolsApp._htmlEntCopy = () => copyText(lastResult);
    });
  });

  /* ===== HTML Encoder ===== */
  Router.register('html-encode', (container) => {
    renderToolPage(container, 'HTML编码/解码', 'HTML标签编码与解码', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="htmlEncInput" placeholder="输入HTML代码或文本…"><div class="test">Hello</div></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="htmlEncOutput">结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._htmlEnc.encode()">编码</button>
          <button class="tool-btn" onclick="ToolsApp._htmlEnc.decode()">解码</button>
          <button class="tool-btn" onclick="ToolsApp._htmlEncCopy()">复制</button>
        </div>`;
      const input = document.getElementById('htmlEncInput');
      const output = document.getElementById('htmlEncOutput');
      let lastResult = '';
      ToolsApp._htmlEnc = {
        encode() { lastResult = input.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); output.textContent = lastResult; },
        decode() { lastResult = input.value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'); output.textContent = lastResult; }
      };
      ToolsApp._htmlEncCopy = () => copyText(lastResult);
    });
  });

  /* ===== Unicode Converter ===== */
  Router.register('unicode-converter', (container) => {
    renderToolPage(container, 'Unicode转换', 'Unicode编码与中文互转', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="unicodeInput" placeholder="输入中文或Unicode…">你好世界</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="unicodeOutput">结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._unicode.toUnicode()">转Unicode</button>
          <button class="tool-btn" onclick="ToolsApp._unicode.fromUnicode()">Unicode转中文</button>
          <button class="tool-btn" onclick="ToolsApp._unicodeCopy()">复制</button>
        </div>`;
      const input = document.getElementById('unicodeInput');
      const output = document.getElementById('unicodeOutput');
      let lastResult = '';
      ToolsApp._unicode = {
        toUnicode() {
          lastResult = Array.from(input.value).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
          output.textContent = lastResult;
        },
        fromUnicode() {
          lastResult = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
          output.textContent = lastResult;
        }
      };
      ToolsApp._unicodeCopy = () => copyText(lastResult);
    });
  });

  /* ===== Hex/ASCII Converter ===== */
  Router.register('hex-converter', (container) => {
    renderToolPage(container, 'Hex/ASCII转换', '十六进制与ASCII字符互转', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="hexInput" placeholder="输入文本或十六进制…">Hello World</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="hexOutput">结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._hex.toHex()">文本→Hex</button>
          <button class="tool-btn" onclick="ToolsApp._hex.fromHex()">Hex→文本</button>
          <button class="tool-btn" onclick="ToolsApp._hexCopy()">复制</button>
        </div>`;
      const input = document.getElementById('hexInput');
      const output = document.getElementById('hexOutput');
      let lastResult = '';
      ToolsApp._hex = {
        toHex() { lastResult = Array.from(input.value).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '); output.textContent = lastResult; },
        fromHex() { lastResult = input.value.trim().split(/\s+/).map(h => String.fromCharCode(parseInt(h, 16))).join(''); output.textContent = lastResult; }
      };
      ToolsApp._hexCopy = () => copyText(lastResult);
    });
  });

  /* ===== MIME Type ===== */
  Router.register('mime-type', (container) => {
    renderToolPage(container, 'MIME类型查询', '文件扩展名与MIME类型对照', (body) => {
      const mimeMap = {
        '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json',
        '.xml': 'application/xml', '.pdf': 'application/pdf', '.zip': 'application/zip', '.gz': 'application/gzip',
        '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
        '.webp': 'image/webp', '.ico': 'image/x-icon', '.bmp': 'image/bmp',
        '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
        '.mp4': 'video/mp4', '.webm': 'video/webm', '.avi': 'video/x-msvideo',
        '.txt': 'text/plain', '.csv': 'text/csv', '.md': 'text/markdown',
        '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf'
      };
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm)">
          <input type="text" id="mimeInput" placeholder="输入文件扩展名，如 .html" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none" oninput="ToolsApp._mime.lookup()">
        </div>
        <div class="tool-output" id="mimeOutput" style="min-height:100px">输入扩展名查询MIME类型</div>`;
      const input = document.getElementById('mimeInput');
      const output = document.getElementById('mimeOutput');
      ToolsApp._mime = {
        lookup() {
          const ext = input.value.trim().toLowerCase();
          if (!ext) { output.textContent = '输入扩展名查询MIME类型'; return; }
          const mime = mimeMap[ext];
          output.textContent = mime ? `${ext} → ${mime}` : `未找到 ${ext} 对应的MIME类型`;
        }
      };
    });
  });

  /* ===== Text Counter ===== */
  Router.register('text-counter', (container) => {
    renderToolPage(container, '字数统计', '统计字符数、单词数、行数', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="counterInput" placeholder="输入要统计的文本…" oninput="ToolsApp._counter.count()"></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">统计结果</div>
            <div class="tool-output" id="counterOutput" style="min-height:200px">输入文本后自动统计</div>
          </div>
        </div>`;
      const input = document.getElementById('counterInput');
      const output = document.getElementById('counterOutput');
      ToolsApp._counter = {
        count() {
          const text = input.value;
          const chars = text.length;
          const charsNoSpace = text.replace(/\s/g, '').length;
          const words = text.trim() ? text.trim().split(/\s+/).length : 0;
          const lines = text ? text.split('\n').length : 0;
          const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
          const english = (text.match(/[a-zA-Z]/g) || []).length;
          const numbers = (text.match(/[0-9]/g) || []).length;
          output.textContent = [
            `字符数:     ${chars}`, `字符(不含空格): ${charsNoSpace}`,
            `单词数:     ${words}`, `行数:       ${lines}`,
            `中文字符:   ${chinese}`, `英文字母:   ${english}`, `数字:       ${numbers}`
          ].join('\n');
        }
      };
    });
  });

  /* ===== Text Case Converter ===== */
  Router.register('text-case', (container) => {
    renderToolPage(container, '大小写转换', '文本大小写、驼峰、蛇形转换', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="caseInput" placeholder="输入文本…">hello world example</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">输出结果</div>
            <div class="tool-output" id="caseOutput">转换结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn" onclick="ToolsApp._case.upper()">UPPER</button>
          <button class="tool-btn" onclick="ToolsApp._case.lower()">lower</button>
          <button class="tool-btn" onclick="ToolsApp._case.title()">Title Case</button>
          <button class="tool-btn" onclick="ToolsApp._case.camel()">camelCase</button>
          <button class="tool-btn" onclick="ToolsApp._case.pascal()">PascalCase</button>
          <button class="tool-btn" onclick="ToolsApp._case.snake()">snake_case</button>
          <button class="tool-btn" onclick="ToolsApp._case.kebab()">kebab-case</button>
        </div>`;
      const input = document.getElementById('caseInput');
      const output = document.getElementById('caseOutput');
      const toWords = (s) => s.toLowerCase().split(/[\s_-]+/).filter(Boolean);
      ToolsApp._case = {
        upper() { output.textContent = input.value.toUpperCase(); },
        lower() { output.textContent = input.value.toLowerCase(); },
        title() { output.textContent = toWords(input.value).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); },
        camel() { const w = toWords(input.value); output.textContent = w[0] + w.slice(1).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(''); },
        pascal() { output.textContent = toWords(input.value).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''); },
        snake() { output.textContent = toWords(input.value).join('_'); },
        kebab() { output.textContent = toWords(input.value).join('-'); }
      };
    });
  });

  /* ===== Lorem Ipsum Generator ===== */
  Router.register('lorem-ipsum', (container) => {
    renderToolPage(container, 'Lorem Ipsum生成', '生成占位文本（中英文）', (body) => {
      const enText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
      const zhText = '天地玄黄，宇宙洪荒。日月盈昃，辰宿列张。寒来暑往，秋收冬藏。闰余成岁，律吕调阳。云腾致雨，露结为霜。金生丽水，玉出昆冈。';
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-md);align-items:center;flex-wrap:wrap">
          <div class="tool-setting-group">
            <span class="tool-setting-label">语言:</span>
            <select class="tool-setting-select" id="loremLang"><option value="en">英文</option><option value="zh">中文</option></select>
          </div>
          <div class="tool-setting-group">
            <span class="tool-setting-label">段落数:</span>
            <input type="number" class="tool-setting-input" id="loremCount" value="3" min="1" max="20">
          </div>
          <button class="tool-btn primary" onclick="ToolsApp._lorem.gen()">生成</button>
          <button class="tool-btn" onclick="ToolsApp._loremCopy()">复制</button>
        </div>
        <div class="tool-output" id="loremOutput" style="min-height:200px;white-space:pre-wrap">点击"生成"按钮</div>`;
      let lastResult = '';
      ToolsApp._lorem = {
        gen() {
          const lang = document.getElementById('loremLang').value;
          const count = parseInt(document.getElementById('loremCount').value) || 3;
          const text = lang === 'zh' ? zhText : enText;
          lastResult = Array.from({ length: count }, () => text).join('\n\n');
          document.getElementById('loremOutput').textContent = lastResult;
        }
      };
      ToolsApp._loremCopy = () => copyText(lastResult);
    });
  });

  /* ===== Text Sort ===== */
  Router.register('text-sort', (container) => {
    renderToolPage(container, '文本排序', '按字母、数字、长度排序', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本（每行一项）</div>
            <textarea class="tool-textarea" id="sortInput" placeholder="每行一个项目…">banana
apple
cherry
date</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">排序结果</div>
            <div class="tool-output" id="sortOutput">排序结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn" onclick="ToolsApp._sort.alpha()">字母升序 A→Z</button>
          <button class="tool-btn" onclick="ToolsApp._sort.alphaDesc()">字母降序 Z→A</button>
          <button class="tool-btn" onclick="ToolsApp._sort.num()">数字升序</button>
          <button class="tool-btn" onclick="ToolsApp._sort.numDesc()">数字降序</button>
          <button class="tool-btn" onclick="ToolsApp._sort.len()">按长度</button>
          <button class="tool-btn" onclick="ToolsApp._sort.random()">随机打乱</button>
          <button class="tool-btn" onclick="ToolsApp._sortCopy()">复制</button>
        </div>`;
      const input = document.getElementById('sortInput');
      const output = document.getElementById('sortOutput');
      let lastResult = '';
      const getLines = () => input.value.split('\n').filter(l => l.trim());
      ToolsApp._sort = {
        alpha() { lastResult = getLines().sort().join('\n'); output.textContent = lastResult; },
        alphaDesc() { lastResult = getLines().sort().reverse().join('\n'); output.textContent = lastResult; },
        num() { lastResult = getLines().sort((a, b) => parseFloat(a) - parseFloat(b)).join('\n'); output.textContent = lastResult; },
        numDesc() { lastResult = getLines().sort((a, b) => parseFloat(b) - parseFloat(a)).join('\n'); output.textContent = lastResult; },
        len() { lastResult = getLines().sort((a, b) => a.length - b.length).join('\n'); output.textContent = lastResult; },
        random() { const a = getLines(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } lastResult = a.join('\n'); output.textContent = lastResult; }
      };
      ToolsApp._sortCopy = () => copyText(lastResult);
    });
  });

  /* ===== Word Frequency ===== */
  Router.register('word-frequency', (container) => {
    renderToolPage(container, '词频统计', '分析文本中词语出现频率', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入文本</div>
            <textarea class="tool-textarea" id="freqInput" placeholder="输入要分析的文本…">hello world hello javascript world hello</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">词频统计</div>
            <div class="tool-output" id="freqOutput">统计结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._freq.analyze()">分析</button>
          <button class="tool-btn" onclick="ToolsApp._freqCopy()">复制</button>
        </div>`;
      const input = document.getElementById('freqInput');
      const output = document.getElementById('freqOutput');
      let lastResult = '';
      ToolsApp._freq = {
        analyze() {
          const words = input.value.toLowerCase().match(/[\w\u4e00-\u9fa5]+/g) || [];
          const freq = {};
          words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
          const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
          lastResult = sorted.map(([word, count]) => `${word}: ${count}`).join('\n');
          output.textContent = lastResult;
        }
      };
      ToolsApp._freqCopy = () => copyText(lastResult);
    });
  });

  /* ===== Image Resize ===== */
  Router.register('image-resize', (container) => {
    renderToolPage(container, '图片裁剪缩放', '在线图片尺寸调整与裁剪', (body) => {
      body.innerHTML = `
        <div class="drop-zone" id="resizeDropZone">
          <div class="drop-zone-icon">✂</div>
          <p>拖拽图片到此处，或 <label for="resizeFileInput" style="color:var(--accent);cursor:pointer;text-decoration:underline">点击选择文件</label></p>
          <input type="file" id="resizeFileInput" accept="image/*" style="display:none">
        </div>
        <div id="resizeControls" style="margin-top:var(--space-lg);display:none">
          <div style="display:flex;gap:var(--space-md);align-items:end;flex-wrap:wrap;margin-bottom:var(--space-md)">
            <div><label style="font-size:12px;color:var(--text-muted)">宽度</label><input type="number" id="resizeW" value="800" style="width:100px;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
            <div><label style="font-size:12px;color:var(--text-muted)">高度</label><input type="number" id="resizeH" value="600" style="width:100px;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
            <label style="display:flex;align-items:center;gap:4px;font-size:13px"><input type="checkbox" id="resizeLock" checked> 锁定比例</label>
            <button class="tool-btn primary" onclick="ToolsApp._resize.apply()">应用</button>
            <button class="tool-btn" onclick="ToolsApp._resizeDownload()">下载</button>
          </div>
          <canvas id="resizeCanvas" style="max-width:100%;border:1px solid var(--border);border-radius:var(--radius-sm)"></canvas>
        </div>`;
      const drop = document.getElementById('resizeDropZone');
      const fileInput = document.getElementById('resizeFileInput');
      let origImg = null, origW = 0, origH = 0;
      function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            origImg = img; origW = img.width; origH = img.height;
            document.getElementById('resizeW').value = origW;
            document.getElementById('resizeH').value = origH;
            document.getElementById('resizeControls').style.display = 'block';
            ToolsApp._resize.apply();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
      drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
      document.getElementById('resizeW').addEventListener('input', () => {
        if (document.getElementById('resizeLock').checked && origW) {
          document.getElementById('resizeH').value = Math.round(parseInt(document.getElementById('resizeW').value) * origH / origW);
        }
      });
      ToolsApp._resize = {
        apply() {
          if (!origImg) return;
          const w = parseInt(document.getElementById('resizeW').value) || origW;
          const h = parseInt(document.getElementById('resizeH').value) || origH;
          const canvas = document.getElementById('resizeCanvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(origImg, 0, 0, w, h);
        }
      };
      ToolsApp._resizeDownload = () => {
        const canvas = document.getElementById('resizeCanvas');
        canvas.toBlob(blob => downloadFile(blob, 'resized-image.png', 'image/png'));
      };
    });
  });

  /* ===== Image Format Converter ===== */
  Router.register('image-format', (container) => {
    renderToolPage(container, '图片格式转换', 'PNG/JPEG/WebP/BMP格式互转', (body) => {
      body.innerHTML = `
        <div class="drop-zone" id="fmtDropZone">
          <div class="drop-zone-icon">Fmt</div>
          <p>拖拽图片到此处，或 <label for="fmtFileInput" style="color:var(--accent);cursor:pointer;text-decoration:underline">点击选择文件</label></p>
          <input type="file" id="fmtFileInput" accept="image/*" style="display:none">
        </div>
        <div id="fmtControls" style="margin-top:var(--space-lg);display:none">
          <div style="display:flex;gap:var(--space-md);align-items:center;flex-wrap:wrap;margin-bottom:var(--space-md)">
            <div class="tool-setting-group">
              <span class="tool-setting-label">输出格式:</span>
              <select class="tool-setting-select" id="fmtType"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select>
            </div>
            <div class="tool-setting-group">
              <span class="tool-setting-label">质量:</span>
              <input type="range" id="fmtQuality" min="0.1" max="1" step="0.1" value="0.9" style="width:120px">
              <span id="fmtQualityVal">0.9</span>
            </div>
            <button class="tool-btn primary" onclick="ToolsApp._fmt.convert()">转换</button>
          </div>
          <div id="fmtPreview" style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;display:inline-block"></div>
        </div>`;
      const drop = document.getElementById('fmtDropZone');
      const fileInput = document.getElementById('fmtFileInput');
      let origImg = null, origType = '';
      document.getElementById('fmtQuality').addEventListener('input', function() { document.getElementById('fmtQualityVal').textContent = this.value; });
      function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        origType = file.type;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => { origImg = img; document.getElementById('fmtControls').style.display = 'block'; };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
      drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
      ToolsApp._fmt = {
        convert() {
          if (!origImg) return;
          const canvas = document.createElement('canvas');
          canvas.width = origImg.width; canvas.height = origImg.height;
          canvas.getContext('2d').drawImage(origImg, 0, 0);
          const type = document.getElementById('fmtType').value;
          const quality = parseFloat(document.getElementById('fmtQuality').value);
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            document.getElementById('fmtPreview').innerHTML = `<img src="${url}" style="max-width:100%;display:block">`;
          }, type, quality);
        }
      };
    });
  });

  /* ===== SVG Viewer ===== */
  Router.register('svg-viewer', (container) => {
    renderToolPage(container, 'SVG查看器', 'SVG代码预览与编辑', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">SVG 代码</div>
            <textarea class="tool-textarea" id="svgInput" placeholder="粘贴SVG代码…" style="min-height:400px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#C8341B"/>
  <text x="50" y="55" text-anchor="middle" fill="white" font-size="14">SVG</text>
</svg></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">预览</div>
            <div id="svgPreview" style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-md);min-height:200px;background:#fff;display:flex;align-items:center;justify-content:center"></div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._svg.preview()">预览</button>
          <button class="tool-btn" onclick="ToolsApp._svgDownload()">下载SVG</button>
        </div>`;
      const input = document.getElementById('svgInput');
      ToolsApp._svg = {
        preview() { document.getElementById('svgPreview').innerHTML = input.value; }
      };
      ToolsApp._svgDownload = () => downloadFile(input.value, 'image.svg', 'image/svg+xml');
      ToolsApp._svg.preview();
    });
  });

  /* ===== Favicon Generator ===== */
  Router.register('favicon-gen', (container) => {
    renderToolPage(container, 'Favicon生成', '从图片生成网站图标', (body) => {
      body.innerHTML = `
        <div class="drop-zone" id="favDropZone">
          <div class="drop-zone-icon">ICO</div>
          <p>拖拽图片到此处，或 <label for="favFileInput" style="color:var(--accent);cursor:pointer;text-decoration:underline">点击选择文件</label></p>
          <input type="file" id="favFileInput" accept="image/*" style="display:none">
        </div>
        <div id="favResult" style="margin-top:var(--space-lg);display:none">
          <div style="display:flex;gap:var(--space-lg);flex-wrap:wrap">
            <div><div class="tool-section-label">16×16</div><canvas id="fav16" width="16" height="16" style="border:1px solid var(--border)"></canvas></div>
            <div><div class="tool-section-label">32×32</div><canvas id="fav32" width="32" height="32" style="border:1px solid var(--border)"></canvas></div>
            <div><div class="tool-section-label">48×48</div><canvas id="fav48" width="48" height="48" style="border:1px solid var(--border)"></canvas></div>
            <div><div class="tool-section-label">64×64</div><canvas id="fav64" width="64" height="64" style="border:1px solid var(--border)"></canvas></div>
          </div>
          <div class="tool-actions" style="margin-top:var(--space-md)">
            <button class="tool-btn" onclick="ToolsApp._favDownload(16)">下载16px</button>
            <button class="tool-btn" onclick="ToolsApp._favDownload(32)">下载32px</button>
            <button class="tool-btn" onclick="ToolsApp._favDownload(48)">下载48px</button>
            <button class="tool-btn" onclick="ToolsApp._favDownload(64)">下载64px</button>
          </div>
        </div>`;
      const drop = document.getElementById('favDropZone');
      const fileInput = document.getElementById('favFileInput');
      let origImg = null;
      function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            origImg = img;
            [16, 32, 48, 64].forEach(size => {
              const canvas = document.getElementById('fav' + size);
              canvas.getContext('2d').drawImage(img, 0, 0, size, size);
            });
            document.getElementById('favResult').style.display = 'block';
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
      drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
      ToolsApp._favDownload = (size) => {
        const canvas = document.getElementById('fav' + size);
        canvas.toBlob(blob => downloadFile(blob, `favicon-${size}x${size}.png`, 'image/png'));
      };
    });
  });

  /* ===== CSS Grid Generator ===== */
  Router.register('css-grid', (container) => {
    renderToolPage(container, 'CSS Grid生成器', '可视化Grid布局生成CSS代码', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="tool-section-label">布局设置</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">columns</span><input type="text" id="gridCols" value="3" style="padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px" oninput="ToolsApp._grid.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">rows</span><input type="text" id="gridRows" value="auto" style="padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px" oninput="ToolsApp._grid.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">gap</span><input type="text" id="gridGap" value="16px" style="padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px" oninput="ToolsApp._grid.gen()"></div>
            </div>
            <div class="tool-section-label">预览</div>
            <div id="gridPreview" style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-md);min-height:200px;background:var(--bg-card)"></div>
          </div>
          <div>
            <div class="tool-section-label">生成的CSS</div>
            <div class="tool-output" id="gridCode" style="min-height:200px;font-size:13px">—</div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._gridCopy()">复制CSS</button>
          </div>
        </div>`;
      ToolsApp._grid = {
        gen() {
          const cols = document.getElementById('gridCols').value;
          const rows = document.getElementById('gridRows').value;
          const gap = document.getElementById('gridGap').value;
          const preview = document.getElementById('gridPreview');
          preview.style.display = 'grid';
          preview.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
          preview.style.gridTemplateRows = rows;
          preview.style.gap = gap;
          preview.innerHTML = '';
          for (let i = 0; i < parseInt(cols) * 2; i++) {
            const item = document.createElement('div');
            item.style.cssText = 'background:var(--accent);color:#fff;padding:16px;border-radius:6px;font-size:13px;font-weight:600;text-align:center';
            item.textContent = i + 1;
            preview.appendChild(item);
          }
          const css = `.container {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: ${rows};\n  gap: ${gap};\n}`;
          document.getElementById('gridCode').textContent = css;
        }
      };
      ToolsApp._gridCopy = () => copyText(document.getElementById('gridCode').textContent);
      ToolsApp._grid.gen();
    });
  });

  /* ===== CSS Box Shadow Generator ===== */
  Router.register('box-shadow', (container) => {
    renderToolPage(container, 'CSS阴影生成器', '可视化编辑box-shadow效果', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="tool-section-label">阴影设置</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">X偏移</span><input type="range" id="shadowX" min="-50" max="50" value="0" oninput="ToolsApp._shadow.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">Y偏移</span><input type="range" id="shadowY" min="-50" max="50" value="4" oninput="ToolsApp._shadow.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">模糊半径</span><input type="range" id="shadowBlur" min="0" max="100" value="12" oninput="ToolsApp._shadow.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">扩展半径</span><input type="range" id="shadowSpread" min="-50" max="50" value="0" oninput="ToolsApp._shadow.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">颜色</span><input type="color" id="shadowColor" value="#000000" oninput="ToolsApp._shadow.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">透明度</span><input type="range" id="shadowAlpha" min="0" max="100" value="20" oninput="ToolsApp._shadow.gen()"></div>
            </div>
            <div class="tool-section-label">预览</div>
            <div id="shadowPreview" style="width:150px;height:150px;background:#fff;border-radius:var(--radius-sm);margin:var(--space-md) auto"></div>
          </div>
          <div>
            <div class="tool-section-label">生成的CSS</div>
            <div class="tool-output" id="shadowCode" style="min-height:100px;font-size:13px">—</div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._shadowCopy()">复制CSS</button>
          </div>
        </div>`;
      ToolsApp._shadow = {
        gen() {
          const x = document.getElementById('shadowX').value;
          const y = document.getElementById('shadowY').value;
          const blur = document.getElementById('shadowBlur').value;
          const spread = document.getElementById('shadowSpread').value;
          const color = document.getElementById('shadowColor').value;
          const alpha = document.getElementById('shadowAlpha').value / 100;
          const r = parseInt(color.slice(1,3), 16), g = parseInt(color.slice(3,5), 16), b = parseInt(color.slice(5,7), 16);
          const css = `${x}px ${y}px ${blur}px ${spread}px rgba(${r},${g},${b},${alpha})`;
          document.getElementById('shadowPreview').style.boxShadow = css;
          document.getElementById('shadowCode').textContent = `box-shadow: ${css};`;
        }
      };
      ToolsApp._shadowCopy = () => copyText(document.getElementById('shadowCode').textContent);
      ToolsApp._shadow.gen();
    });
  });

  /* ===== CSS Border Radius Generator ===== */
  Router.register('border-radius', (container) => {
    renderToolPage(container, 'CSS圆角生成器', '可视化编辑border-radius', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="tool-section-label">圆角设置</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">左上</span><input type="range" id="brTL" min="0" max="100" value="12" oninput="ToolsApp._br.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">右上</span><input type="range" id="brTR" min="0" max="100" value="12" oninput="ToolsApp._br.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">右下</span><input type="range" id="brBR" min="0" max="100" value="12" oninput="ToolsApp._br.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">左下</span><input type="range" id="brBL" min="0" max="100" value="12" oninput="ToolsApp._br.gen()"></div>
            </div>
            <div class="tool-section-label">预览</div>
            <div id="brPreview" style="width:150px;height:150px;background:var(--accent);margin:var(--space-md) auto"></div>
          </div>
          <div>
            <div class="tool-section-label">生成的CSS</div>
            <div class="tool-output" id="brCode" style="min-height:100px;font-size:13px">—</div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._brCopy()">复制CSS</button>
          </div>
        </div>`;
      ToolsApp._br = {
        gen() {
          const tl = document.getElementById('brTL').value;
          const tr = document.getElementById('brTR').value;
          const br = document.getElementById('brBR').value;
          const bl = document.getElementById('brBL').value;
          const css = `${tl}% ${tr}% ${br}% ${bl}%`;
          document.getElementById('brPreview').style.borderRadius = css;
          document.getElementById('brCode').textContent = `border-radius: ${css};`;
        }
      };
      ToolsApp._brCopy = () => copyText(document.getElementById('brCode').textContent);
      ToolsApp._br.gen();
    });
  });

  /* ===== CSS Animation Generator ===== */
  Router.register('animation-generator', (container) => {
    renderToolPage(container, 'CSS动画生成器', '关键帧动画可视化编辑', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div class="tool-section-label">动画设置</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">类型</span>
                <select id="animType" onchange="ToolsApp._anim.gen()" style="padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px">
                  <option value="fadeIn">淡入</option><option value="fadeInUp">上滑淡入</option><option value="fadeInLeft">左滑淡入</option>
                  <option value="bounce">弹跳</option><option value="pulse">脉冲</option><option value="spin">旋转</option>
                  <option value="shake">抖动</option><option value="zoom">缩放</option>
                </select>
              </div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">时长(秒)</span><input type="number" id="animDuration" value="1" min="0.1" max="10" step="0.1" style="padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px" oninput="ToolsApp._anim.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">延迟(秒)</span><input type="number" id="animDelay" value="0" min="0" max="10" step="0.1" style="padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px" oninput="ToolsApp._anim.gen()"></div>
              <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">循环</span>
                <select id="animIter" onchange="ToolsApp._anim.gen()" style="padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px">
                  <option value="1">1次</option><option value="infinite">无限</option><option value="2">2次</option><option value="3">3次</option>
                </select>
              </div>
            </div>
            <div class="tool-section-label">预览</div>
            <div id="animPreview" style="width:80px;height:80px;background:var(--accent);border-radius:var(--radius-sm);margin:var(--space-md) auto"></div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._anim.play()">播放动画</button>
          </div>
          <div>
            <div class="tool-section-label">生成的CSS</div>
            <div class="tool-output" id="animCode" style="min-height:200px;font-size:13px">—</div>
            <button class="tool-btn" style="margin-top:var(--space-sm)" onclick="ToolsApp._animCopy()">复制CSS</button>
          </div>
        </div>`;
      const animations = {
        fadeIn: { from: 'opacity: 0', to: 'opacity: 1' },
        fadeInUp: { from: 'opacity: 0; transform: translateY(20px)', to: 'opacity: 1; transform: translateY(0)' },
        fadeInLeft: { from: 'opacity: 0; transform: translateX(-20px)', to: 'opacity: 1; transform: translateX(0)' },
        bounce: { from: 'transform: translateY(0)', to: 'transform: translateY(-20px)', steps: '0%, 100% { transform: translateY(0) } 50% { transform: translateY(-20px) }' },
        pulse: { from: 'transform: scale(1)', to: 'transform: scale(1.1)', steps: '0%, 100% { transform: scale(1) } 50% { transform: scale(1.1) }' },
        spin: { from: 'transform: rotate(0deg)', to: 'transform: rotate(360deg)' },
        shake: { steps: '0%, 100% { transform: translateX(0) } 25% { transform: translateX(-10px) } 75% { transform: translateX(10px) }' },
        zoom: { from: 'transform: scale(0.5)', to: 'transform: scale(1)' }
      };
      ToolsApp._anim = {
        gen() {
          const type = document.getElementById('animType').value;
          const duration = document.getElementById('animDuration').value;
          const delay = document.getElementById('animDelay').value;
          const iter = document.getElementById('animIter').value;
          const anim = animations[type];
          let keyframes;
          if (anim.steps) { keyframes = `@keyframes ${type} { ${anim.steps} }`; }
          else { keyframes = `@keyframes ${type} {\n  from { ${anim.from} }\n  to { ${anim.to} }\n}`; }
          const css = `${keyframes}\n\n.element {\n  animation: ${type} ${duration}s ease ${delay}s ${iter};\n}`;
          document.getElementById('animCode').textContent = css;
        },
        play() {
          const type = document.getElementById('animType').value;
          const duration = document.getElementById('animDuration').value;
          const el = document.getElementById('animPreview');
          el.style.animation = 'none';
          el.offsetHeight;
          el.style.animation = `${type} ${duration}s ease`;
        }
      };
      ToolsApp._animCopy = () => copyText(document.getElementById('animCode').textContent);
      ToolsApp._anim.gen();
    });
  });

  /* ===== Color Contrast Checker ===== */
  Router.register('color-contrast', (container) => {
    renderToolPage(container, '色彩对比度检测', 'WCAG无障碍色彩对比度检查', (body) => {
      body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
          <div>
            <div style="display:flex;gap:var(--space-md);margin-bottom:var(--space-md)">
              <div style="flex:1"><label style="font-size:12px;color:var(--text-muted)">前景色</label><input type="color" id="ccFg" value="#ffffff" style="width:100%;height:40px;cursor:pointer;margin-top:4px" oninput="ToolsApp._cc.check()"></div>
              <div style="flex:1"><label style="font-size:12px;color:var(--text-muted)">背景色</label><input type="color" id="ccBg" value="#C8341B" style="width:100%;height:40px;cursor:pointer;margin-top:4px" oninput="ToolsApp._cc.check()"></div>
            </div>
            <div id="ccPreview" style="padding:var(--space-xl);border-radius:var(--radius-sm);text-align:center;font-size:18px;font-weight:600">示例文字 Sample Text</div>
          </div>
          <div>
            <div class="tool-section-label">对比度结果</div>
            <div class="tool-output" id="ccOutput" style="min-height:200px">计算中…</div>
          </div>
        </div>`;
      function luminance(r, g, b) { const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722; }
      function contrast(hex1, hex2) {
        const r1 = parseInt(hex1.slice(1,3),16), g1 = parseInt(hex1.slice(3,5),16), b1 = parseInt(hex1.slice(5,7),16);
        const r2 = parseInt(hex2.slice(1,3),16), g2 = parseInt(hex2.slice(3,5),16), b2 = parseInt(hex2.slice(5,7),16);
        const l1 = luminance(r1, g1, b1), l2 = luminance(r2, g2, b2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }
      ToolsApp._cc = {
        check() {
          const fg = document.getElementById('ccFg').value;
          const bg = document.getElementById('ccBg').value;
          const ratio = contrast(fg, bg);
          document.getElementById('ccPreview').style.color = fg;
          document.getElementById('ccPreview').style.background = bg;
          const aaLarge = ratio >= 3 ? '✅ 通过' : '❌ 不通过';
          const aa = ratio >= 4.5 ? '✅ 通过' : '❌ 不通过';
          const aaa = ratio >= 7 ? '✅ 通过' : '❌ 不通过';
          document.getElementById('ccOutput').textContent = [
            `对比度: ${ratio.toFixed(2)}:1`, '',
            `AA (大文字 ≥3:1):   ${aaLarge}`,
            `AA (普通文字 ≥4.5:1): ${aa}`,
            `AAA (普通文字 ≥7:1): ${aaa}`
          ].join('\n');
        }
      };
      ToolsApp._cc.check();
    });
  });

  /* ===== Responsive Tester ===== */
  Router.register('responsive-test', (container) => {
    renderToolPage(container, '响应式测试', '模拟不同屏幕尺寸预览网页', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm);flex-wrap:wrap">
          <button class="tool-btn" onclick="ToolsApp._resp.set(375,667)">iPhone SE (375×667)</button>
          <button class="tool-btn" onclick="ToolsApp._resp.set(390,844)">iPhone 14 (390×844)</button>
          <button class="tool-btn" onclick="ToolsApp._resp.set(414,896)">iPhone 14 Plus (414×896)</button>
          <button class="tool-btn" onclick="ToolsApp._resp.set(768,1024)">iPad (768×1024)</button>
          <button class="tool-btn" onclick="ToolsApp._resp.set(1024,768)">iPad 横屏 (1024×768)</button>
          <button class="tool-btn" onclick="ToolsApp._resp.set(1280,800)">笔记本 (1280×800)</button>
          <button class="tool-btn" onclick="ToolsApp._resp.set(1920,1080)">桌面 (1920×1080)</button>
        </div>
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm)">
          <input type="text" id="respUrl" value="https://haome525.github.io" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none">
          <button class="tool-btn primary" onclick="ToolsApp._resp.load()">加载</button>
        </div>
        <div style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:var(--space-sm)" id="respSize">当前尺寸: 1920 × 1080</div>
        <div style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;background:#fff">
          <iframe id="respFrame" src="https://haome525.github.io" style="width:100%;height:600px;border:none"></iframe>
        </div>`;
      ToolsApp._resp = {
        set(w, h) {
          const frame = document.getElementById('respFrame');
          frame.style.width = w + 'px';
          frame.style.height = h + 'px';
          frame.style.margin = '0 auto';
          frame.style.display = 'block';
          document.getElementById('respSize').textContent = `当前尺寸: ${w} × ${h}`;
        },
        load() {
          const url = document.getElementById('respUrl').value;
          document.getElementById('respFrame').src = url;
        }
      };
    });
  });

  /* ===== HTTP Status Codes ===== */
  Router.register('http-status', (container) => {
    renderToolPage(container, 'HTTP状态码查询', 'HTTP状态码含义速查', (body) => {
      const codes = {
        '200': 'OK - 请求成功', '201': 'Created - 已创建', '204': 'No Content - 无内容',
        '301': 'Moved Permanently - 永久重定向', '302': 'Found - 临时重定向', '304': 'Not Modified - 未修改',
        '400': 'Bad Request - 请求错误', '401': 'Unauthorized - 未授权', '403': 'Forbidden - 禁止访问',
        '404': 'Not Found - 未找到', '405': 'Method Not Allowed - 方法不允许', '408': 'Request Timeout - 请求超时',
        '409': 'Conflict - 冲突', '413': 'Payload Too Large - 请求体过大', '429': 'Too Many Requests - 请求过多',
        '500': 'Internal Server Error - 服务器内部错误', '502': 'Bad Gateway - 网关错误', '503': 'Service Unavailable - 服务不可用', '504': 'Gateway Timeout - 网关超时'
      };
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm)">
          <input type="text" id="httpInput" placeholder="输入状态码，如 404" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none" oninput="ToolsApp._http.lookup()">
        </div>
        <div class="tool-output" id="httpOutput" style="min-height:100px">输入状态码查询含义</div>
        <div class="tool-section-label" style="margin-top:var(--space-md)">常用状态码</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-sm);margin-top:var(--space-sm)">
          ${Object.entries(codes).map(([code, desc]) => `<div style="padding:8px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px"><strong>${code}</strong> ${desc}</div>`).join('')}
        </div>`;
      const input = document.getElementById('httpInput');
      const output = document.getElementById('httpOutput');
      ToolsApp._http = {
        lookup() {
          const code = input.value.trim();
          if (!code) { output.textContent = '输入状态码查询含义'; return; }
          const desc = codes[code];
          output.textContent = desc ? `${code} - ${desc}` : `未找到 ${code} 的说明`;
        }
      };
    });
  });

  /* ===== Port Reference ===== */
  Router.register('port-scanner', (container) => {
    renderToolPage(container, '端口说明查询', '常用端口号与服务对照', (body) => {
      const ports = {
        '20': 'FTP 数据传输', '21': 'FTP 控制连接', '22': 'SSH', '23': 'Telnet', '25': 'SMTP',
        '53': 'DNS', '80': 'HTTP', '110': 'POP3', '143': 'IMAP', '443': 'HTTPS',
        '445': 'SMB', '993': 'IMAPS', '995': 'POP3S', '3306': 'MySQL', '3389': 'RDP',
        '5432': 'PostgreSQL', '6379': 'Redis', '8080': 'HTTP Alt', '8443': 'HTTPS Alt',
        '27017': 'MongoDB'
      };
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm)">
          <input type="text" id="portInput" placeholder="输入端口号" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none" oninput="ToolsApp._port.lookup()">
        </div>
        <div class="tool-output" id="portOutput" style="min-height:80px">输入端口号查询服务</div>
        <div class="tool-section-label" style="margin-top:var(--space-md)">常用端口</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-sm);margin-top:var(--space-sm)">
          ${Object.entries(ports).map(([port, service]) => `<div style="padding:8px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:13px"><strong>${port}</strong> ${service}</div>`).join('')}
        </div>`;
      const input = document.getElementById('portInput');
      const output = document.getElementById('portOutput');
      ToolsApp._port = {
        lookup() {
          const port = input.value.trim();
          if (!port) { output.textContent = '输入端口号查询服务'; return; }
          const service = ports[port];
          output.textContent = service ? `端口 ${port} - ${service}` : `未找到端口 ${port} 的常见服务`;
        }
      };
    });
  });

  /* ===== User-Agent Parser ===== */
  Router.register('user-agent', (container) => {
    renderToolPage(container, 'User-Agent解析', '解析浏览器UA字符串信息', (body) => {
      const defaultUA = navigator.userAgent;
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm)">
          <input type="text" id="uaInput" value="${defaultUA}" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:13px;outline:none;font-family:var(--font-mono)">
          <button class="tool-btn primary" onclick="ToolsApp._ua.parse()">解析</button>
        </div>
        <div class="tool-output" id="uaOutput" style="min-height:150px">点击"解析"查看结果</div>`;
      const input = document.getElementById('uaInput');
      const output = document.getElementById('uaOutput');
      ToolsApp._ua = {
        parse() {
          const ua = input.value;
          let browser = '未知', os = '未知', device = '桌面';
          if (ua.includes('Edg/')) browser = 'Edge ' + ua.match(/Edg\/([\d.]+)/)?.[1];
          else if (ua.includes('Chrome/')) browser = 'Chrome ' + ua.match(/Chrome\/([\d.]+)/)?.[1];
          else if (ua.includes('Firefox/')) browser = 'Firefox ' + ua.match(/Firefox\/([\d.]+)/)?.[1];
          else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari ' + ua.match(/Version\/([\d.]+)/)?.[1];
          if (ua.includes('Windows')) os = 'Windows';
          else if (ua.includes('Mac OS X')) os = 'macOS';
          else if (ua.includes('Linux')) os = 'Linux';
          else if (ua.includes('Android')) os = 'Android';
          else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
          if (ua.includes('Mobile') || ua.includes('Android')) device = '移动设备';
          else if (ua.includes('iPad') || ua.includes('Tablet')) device = '平板';
          output.textContent = [`浏览器: ${browser}`, `操作系统: ${os}`, `设备类型: ${device}`, '', `完整UA:`, ua].join('\n');
        }
      };
      ToolsApp._ua.parse();
    });
  });

  /* ===== DNS Lookup ===== */
  Router.register('dns-lookup', (container) => {
    renderToolPage(container, 'DNS记录查询', '查询域名DNS解析记录', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm)">
          <input type="text" id="dnsInput" placeholder="输入域名，如 example.com" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none">
          <button class="tool-btn primary" onclick="ToolsApp._dns.query()">查询</button>
        </div>
        <div class="tool-output" id="dnsOutput" style="min-height:150px">输入域名查询DNS记录</div>`;
      const input = document.getElementById('dnsInput');
      const output = document.getElementById('dnsOutput');
      ToolsApp._dns = {
        async query() {
          const domain = input.value.trim();
          if (!domain) return;
          output.textContent = '正在查询…';
          try {
            const res = await fetch(`https://dns.google/resolve?name=${domain}`);
            const data = await res.json();
            if (data.Answer) {
              output.textContent = data.Answer.map(a => `${a.type === 1 ? 'A' : a.type === 5 ? 'CNAME' : a.type === 28 ? 'AAAA' : 'Type ' + a.type}: ${a.data} (TTL: ${a.TTL})`).join('\n');
            } else {
              output.textContent = '未找到DNS记录';
            }
          } catch (e) { output.innerHTML = `<div class="tool-error">查询失败: ${e.message}</div>`; }
        }
      };
    });
  });

  /* ===== Random String Generator ===== */
  Router.register('random-string', (container) => {
    renderToolPage(container, '随机字符串生成', '生成指定长度的随机字符串', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-md);align-items:end;flex-wrap:wrap">
          <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">长度</span><input type="number" id="rsLen" value="16" min="1" max="256" style="width:80px;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
          <label style="display:flex;align-items:center;gap:4px;font-size:13px"><input type="checkbox" id="rsUpper" checked> 大写字母</label>
          <label style="display:flex;align-items:center;gap:4px;font-size:13px"><input type="checkbox" id="rsLower" checked> 小写字母</label>
          <label style="display:flex;align-items:center;gap:4px;font-size:13px"><input type="checkbox" id="rsDigit" checked> 数字</label>
          <label style="display:flex;align-items:center;gap:4px;font-size:13px"><input type="checkbox" id="rsSymbol"> 符号</label>
          <button class="tool-btn primary" onclick="ToolsApp._rs.gen()">生成</button>
          <button class="tool-btn" onclick="ToolsApp._rsCopy()">复制</button>
        </div>
        <div class="tool-output" id="rsOutput" style="font-size:18px;font-family:var(--font-mono);min-height:80px">点击"生成"</div>`;
      let lastResult = '';
      ToolsApp._rs = {
        gen() {
          const len = parseInt(document.getElementById('rsLen').value) || 16;
          let chars = '';
          if (document.getElementById('rsUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (document.getElementById('rsLower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
          if (document.getElementById('rsDigit').checked) chars += '0123456789';
          if (document.getElementById('rsSymbol').checked) chars += '!@#$%^&*()_+-=';
          if (!chars) { document.getElementById('rsOutput').textContent = '请至少选择一种字符'; return; }
          const arr = new Uint32Array(len);
          crypto.getRandomValues(arr);
          lastResult = Array.from(arr, x => chars[x % chars.length]).join('');
          document.getElementById('rsOutput').textContent = lastResult;
        }
      };
      ToolsApp._rsCopy = () => copyText(lastResult);
    });
  });

  /* ===== Random Number Generator ===== */
  Router.register('number-generator', (container) => {
    renderToolPage(container, '随机数生成', '生成指定范围的随机数', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-md);align-items:end;flex-wrap:wrap">
          <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">最小值</span><input type="number" id="rnMin" value="1" style="width:100px;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
          <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">最大值</span><input type="number" id="rnMax" value="100" style="width:100px;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
          <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">数量</span><input type="number" id="rnCount" value="1" min="1" max="100" style="width:80px;padding:8px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
          <button class="tool-btn primary" onclick="ToolsApp._rn.gen()">生成</button>
          <button class="tool-btn" onclick="ToolsApp._rnCopy()">复制</button>
        </div>
        <div class="tool-output" id="rnOutput" style="font-size:18px;font-family:var(--font-mono);min-height:80px">点击"生成"</div>`;
      let lastResult = '';
      ToolsApp._rn = {
        gen() {
          const min = parseInt(document.getElementById('rnMin').value);
          const max = parseInt(document.getElementById('rnMax').value);
          const count = parseInt(document.getElementById('rnCount').value) || 1;
          const nums = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
          lastResult = nums.join(', ');
          document.getElementById('rnOutput').textContent = lastResult;
        }
      };
      ToolsApp._rnCopy = () => copyText(lastResult);
    });
  });

  /* ===== List Shuffler ===== */
  Router.register('list-shuffler', (container) => {
    renderToolPage(container, '列表随机排序', '随机打乱列表顺序', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">输入列表（每行一项）</div>
            <textarea class="tool-textarea" id="shuffleInput" placeholder="每行一个项目…">苹果
香蕉
橙子
葡萄
西瓜</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">随机结果</div>
            <div class="tool-output" id="shuffleOutput">点击"打乱"按钮</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._shuffle.do()">🔀 打乱</button>
          <button class="tool-btn" onclick="ToolsApp._shuffleCopy()">复制</button>
        </div>`;
      const input = document.getElementById('shuffleInput');
      const output = document.getElementById('shuffleOutput');
      let lastResult = '';
      ToolsApp._shuffle = {
        do() {
          const arr = input.value.split('\n').filter(l => l.trim());
          for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
          lastResult = arr.join('\n');
          output.textContent = lastResult;
        }
      };
      ToolsApp._shuffleCopy = () => copyText(lastResult);
    });
  });

  /* ===== Color Namer ===== */
  Router.register('color-namer', (container) => {
    renderToolPage(container, '颜色名称查询', 'HEX颜色对应的中英文名称', (body) => {
      const colorNames = {
        '#FF0000': '红色 Red', '#00FF00': '绿色 Green', '#0000FF': '蓝色 Blue',
        '#FFFF00': '黄色 Yellow', '#FF00FF': '品红 Magenta', '#00FFFF': '青色 Cyan',
        '#000000': '黑色 Black', '#FFFFFF': '白色 White', '#808080': '灰色 Gray',
        '#C8341B': '品牌红 Brand Red', '#FF6B35': '橙色 Orange', '#8B5CF6': '紫色 Purple',
        '#10B981': '翡翠绿 Emerald', '#3B82F6': '蓝色 Blue', '#F59E0B': '琥珀色 Amber',
        '#EF4444': '红色 Red', '#06B6D4': '天蓝色 Sky Blue', '#84CC16': '青柠色 Lime'
      };
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm);align-items:center">
          <input type="color" id="cnPicker" value="#C8341B" style="width:60px;height:40px;cursor:pointer">
          <input type="text" id="cnHex" value="#C8341B" style="flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px;outline:none;font-family:var(--font-mono)" oninput="ToolsApp._cn.lookup()">
          <button class="tool-btn primary" onclick="ToolsApp._cn.lookup()">查询</button>
        </div>
        <div class="tool-output" id="cnOutput" style="min-height:100px">查询颜色名称</div>`;
      const picker = document.getElementById('cnPicker');
      const hexInput = document.getElementById('cnHex');
      picker.addEventListener('input', () => { hexInput.value = picker.value.toUpperCase(); ToolsApp._cn.lookup(); });
      ToolsApp._cn = {
        lookup() {
          const hex = hexInput.value.toUpperCase();
          picker.value = hex;
          const name = colorNames[hex];
          const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
          document.getElementById('cnOutput').innerHTML = `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\n${name ? '名称: ' + name : '未找到精确匹配的颜色名称'}\n\n预览:\n<div style="width:100px;height:50px;background:${hex};border-radius:8px;border:1px solid var(--border);margin-top:8px"></div>`;
        }
      };
    });
  });

  /* ===== Pomodoro Timer ===== */
  Router.register('pomodoro-timer', (container) => {
    renderToolPage(container, '番茄钟计时器', '25分钟工作+5分钟休息', (body) => {
      body.innerHTML = `
        <div style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:64px;font-family:var(--font-mono);font-weight:700;margin-bottom:var(--space-lg)" id="pomTimer">25:00</div>
          <div style="font-size:16px;color:var(--text-secondary);margin-bottom:var(--space-lg)" id="pomStatus">准备开始</div>
          <div style="display:flex;gap:var(--space-md);justify-content:center">
            <button class="tool-btn primary" id="pomStartBtn" onclick="ToolsApp._pom.start()">开始</button>
            <button class="tool-btn" onclick="ToolsApp._pom.pause()">暂停</button>
            <button class="tool-btn" onclick="ToolsApp._pom.reset()">重置</button>
          </div>
          <div style="margin-top:var(--space-lg);display:flex;gap:var(--space-sm);justify-content:center">
            <button class="tool-btn" onclick="ToolsApp._pom.set(25)">25分钟</button>
            <button class="tool-btn" onclick="ToolsApp._pom.set(15)">15分钟</button>
            <button class="tool-btn" onclick="ToolsApp._pom.set(5)">5分钟</button>
          </div>
        </div>`;
      let seconds = 25 * 60, interval = null, running = false;
      function updateDisplay() {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        document.getElementById('pomTimer').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      }
      ToolsApp._pom = {
        start() {
          if (running) return;
          running = true;
          document.getElementById('pomStatus').textContent = '专注中…';
          interval = setInterval(() => { seconds--; updateDisplay(); if (seconds <= 0) { clearInterval(interval); running = false; document.getElementById('pomStatus').textContent = '时间到！'; } }, 1000);
        },
        pause() { clearInterval(interval); running = false; document.getElementById('pomStatus').textContent = '已暂停'; },
        reset() { clearInterval(interval); running = false; seconds = 25 * 60; updateDisplay(); document.getElementById('pomStatus').textContent = '准备开始'; },
        set(min) { clearInterval(interval); running = false; seconds = min * 60; updateDisplay(); document.getElementById('pomStatus').textContent = '准备开始'; }
      };
    });
  });

  /* ===== Age Calculator ===== */
  Router.register('age-calculator', (container) => {
    renderToolPage(container, '年龄计算器', '根据出生日期计算年龄', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-sm);align-items:end">
          <div style="flex-direction:column;display:flex;gap:4px;flex:1"><span class="tool-setting-label">出生日期</span><input type="date" id="ageDate" value="1990-01-01" style="padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
          <button class="tool-btn primary" onclick="ToolsApp._age.calc()">计算</button>
        </div>
        <div class="tool-output" id="ageOutput" style="min-height:150px">点击"计算"</div>`;
      ToolsApp._age = {
        calc() {
          const birth = new Date(document.getElementById('ageDate').value);
          const now = new Date();
          let years = now.getFullYear() - birth.getFullYear();
          let months = now.getMonth() - birth.getMonth();
          let days = now.getDate() - birth.getDate();
          if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
          if (months < 0) { years--; months += 12; }
          const totalDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
          const totalWeeks = Math.floor(totalDays / 7);
          document.getElementById('ageOutput').textContent = [
            `年龄: ${years} 岁 ${months} 个月 ${days} 天`,
            `总天数: ${totalDays.toLocaleString()} 天`,
            `总周数: ${totalWeeks.toLocaleString()} 周`,
            `出生日期: ${birth.toLocaleDateString('zh-CN')}`
          ].join('\n');
        }
      };
    });
  });

  /* ===== Days Calculator ===== */
  Router.register('days-calculator', (container) => {
    renderToolPage(container, '日期天数计算', '计算两个日期之间的天数', (body) => {
      body.innerHTML = `
        <div style="margin-bottom:var(--space-md);display:flex;gap:var(--space-md);align-items:end;flex-wrap:wrap">
          <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">开始日期</span><input type="date" id="daysStart" style="padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
          <div style="flex-direction:column;display:flex;gap:4px"><span class="tool-setting-label">结束日期</span><input type="date" id="daysEnd" style="padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-input);color:var(--text);font-size:14px"></div>
          <button class="tool-btn primary" onclick="ToolsApp._days.calc()">计算</button>
        </div>
        <div class="tool-output" id="daysOutput" style="min-height:100px">选择日期后点击"计算"</div>`;
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('daysStart').value = today;
      document.getElementById('daysEnd').value = today;
      ToolsApp._days = {
        calc() {
          const start = new Date(document.getElementById('daysStart').value);
          const end = new Date(document.getElementById('daysEnd').value);
          const diff = Math.abs(end - start);
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const weeks = Math.floor(days / 7);
          const months = Math.floor(days / 30.44);
          document.getElementById('daysOutput').textContent = [
            `相差: ${days} 天`,
            `约 ${weeks} 周`,
            `约 ${months} 个月`,
            `从 ${start.toLocaleDateString('zh-CN')} 到 ${end.toLocaleDateString('zh-CN')}`
          ].join('\n');
        }
      };
    });
  });

  /* ===== Markdown to PDF ===== */
  Router.register('markdown-pdf', (container) => {
    renderToolPage(container, 'Markdown转PDF', '将Markdown文档导出为PDF', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">Markdown 输入</div>
            <textarea class="tool-textarea" id="mdPdfInput" placeholder="输入Markdown内容…"># 标题\n\n这是正文内容。\n\n- 列表项1\n- 列表项2</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">预览</div>
            <div class="tool-output" id="mdPdfPreview" style="padding:var(--space-lg);min-height:400px">预览将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._mdPdf.preview()">预览</button>
          <button class="tool-btn" onclick="ToolsApp._mdPdf.print()">打印为PDF</button>
        </div>`;
      const input = document.getElementById('mdPdfInput');
      const preview = document.getElementById('mdPdfPreview');
      ToolsApp._mdPdf = {
        preview() {
          let html = input.value
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
          preview.innerHTML = html;
        },
        print() {
          const win = window.open('', '_blank');
          win.document.write(`<html><head><title>Markdown</title><style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:40px;line-height:1.6}h1{font-size:24px}h2{font-size:20px}h3{font-size:16px}li{margin-left:20px}</style></head><body>${preview.innerHTML}</body></html>`);
          win.document.close();
          win.print();
        }
      };
      ToolsApp._mdPdf.preview();
    });
  });

  /* ===== HTML to Markdown ===== */
  Router.register('html-markdown', (container) => {
    renderToolPage(container, 'HTML转Markdown', '将HTML内容转换为Markdown', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">HTML 输入</div>
            <textarea class="tool-textarea" id="htmlMdInput" placeholder="粘贴HTML代码…"><h1>标题</h1><p>段落内容</p><ul><li>列表项</li></ul></textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">Markdown 输出</div>
            <div class="tool-output" id="htmlMdOutput">转换结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._htmlMd.convert()">转换</button>
          <button class="tool-btn" onclick="ToolsApp._htmlMdCopy()">复制</button>
        </div>`;
      const input = document.getElementById('htmlMdInput');
      const output = document.getElementById('htmlMdOutput');
      let lastResult = '';
      ToolsApp._htmlMd = {
        convert() {
          let md = input.value;
          md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
          md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
          md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
          md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
          md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
          md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
          md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
          md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
          md = md.replace(/<br\s*\/?>/gi, '\n');
          md = md.replace(/<[^>]+>/g, '');
          md = md.replace(/\n{3,}/g, '\n\n');
          lastResult = md.trim();
          output.textContent = lastResult;
        }
      };
      ToolsApp._htmlMdCopy = () => copyText(lastResult);
    });
  });

  /* ===== JSON to YAML ===== */
  Router.register('json-yaml', (container) => {
    renderToolPage(container, 'JSON转YAML', 'JSON格式转换为YAML格式', (body) => {
      body.innerHTML = `
        <div class="tool-layout">
          <div class="tool-input-area">
            <div class="tool-section-label">JSON 输入</div>
            <textarea class="tool-textarea" id="jsonYamlInput" placeholder="粘贴JSON数据…">{"name":"haome525","tools":["json","base64"]}</textarea>
          </div>
          <div class="tool-output-area">
            <div class="tool-section-label">YAML 输出</div>
            <div class="tool-output" id="jsonYamlOutput">转换结果将显示在这里</div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="tool-btn primary" onclick="ToolsApp._jsonYaml.convert()">转换</button>
          <button class="tool-btn" onclick="ToolsApp._jsonYamlCopy()">复制</button>
        </div>`;
      const input = document.getElementById('jsonYamlInput');
      const output = document.getElementById('jsonYamlOutput');
      let lastResult = '';
      function jsonToYaml(obj, indent = 0) {
        const prefix = '  '.repeat(indent);
        if (Array.isArray(obj)) {
          return obj.map(item => {
            if (typeof item === 'object' && item !== null) return `${prefix}-\n${jsonToYaml(item, indent + 1)}`;
            return `${prefix}- ${item}`;
          }).join('\n');
        }
        return Object.entries(obj).map(([key, val]) => {
          if (typeof val === 'object' && val !== null) return `${prefix}${key}:\n${jsonToYaml(val, indent + 1)}`;
          return `${prefix}${key}: ${val}`;
        }).join('\n');
      }
      ToolsApp._jsonYaml = {
        convert() {
          try {
            const obj = JSON.parse(input.value);
            lastResult = jsonToYaml(obj);
            output.textContent = lastResult;
          } catch (e) { output.innerHTML = `<div class="tool-error">${e.message}</div>`; }
        }
      };
      ToolsApp._jsonYamlCopy = () => copyText(lastResult);
    });
  });

  /* ===== Image OCR (placeholder) ===== */
  Router.register('image-text', (container) => {
    renderToolPage(container, '图片文字提取', '从图片中提取文字（OCR）', (body) => {
      body.innerHTML = `
        <div class="drop-zone" id="ocrDropZone">
          <div class="drop-zone-icon">OCR</div>
          <p>拖拽图片到此处，或 <label for="ocrFileInput" style="color:var(--accent);cursor:pointer;text-decoration:underline">点击选择文件</label></p>
          <input type="file" id="ocrFileInput" accept="image/*" style="display:none">
        </div>
        <div id="ocrResult" style="margin-top:var(--space-lg);display:none">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">
            <div><div class="tool-section-label">原图</div><div id="ocrPreview" style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden"></div></div>
            <div><div class="tool-section-label">识别结果</div><div class="tool-output" id="ocrOutput" style="min-height:200px;white-space:pre-wrap">OCR功能需要后端API支持，此处为演示界面</div></div>
          </div>
        </div>`;
      const drop = document.getElementById('ocrDropZone');
      const fileInput = document.getElementById('ocrFileInput');
      function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('ocrPreview').innerHTML = `<img src="${e.target.result}" style="max-width:100%;display:block">`;
          document.getElementById('ocrResult').style.display = 'block';
          document.getElementById('ocrOutput').textContent = 'OCR功能需要接入后端API（如Tesseract.js）才能使用。\n\n当前为演示界面，显示图片已加载成功。';
        };
        reader.readAsDataURL(file);
      }
      drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
      drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); handleFile(e.dataTransfer.files[0]); });
      fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
    });
  });

})();
