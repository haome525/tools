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
            const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
            const res = await fetch(url);
            const data = await res.json();
            if (data.error) { output.innerHTML = `<div class="tool-error">${data.reason || '查询失败'}</div>`; return; }
            output.textContent = [
              `IP地址:   ${data.ip || '—'}`,
              `国家:     ${data.country_name || '—'}`,
              `地区:     ${data.region || '—'}`,
              `城市:     ${data.city || '—'}`,
              `邮编:     ${data.postal || '—'}`,
              `经纬度:   ${data.latitude}, ${data.longitude}`,
              `时区:     ${data.timezone || '—'}`,
              `ISP:      ${data.org || '—'}`,
              `AS:       ${data.asn || '—'}`
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

})();
