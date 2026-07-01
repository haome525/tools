/* tools-data.js — Tool configuration data */
const TOOLS_DATA = {
  categories: [
    { id: 'all', name: '全部', icon: '📦' },
    { id: 'data', name: 'JSON/数据', icon: '{ }' },
    { id: 'encoding', name: '编码/加密', icon: '🔐' },
    { id: 'text', name: '文本/代码', icon: '📝' },
    { id: 'image', name: '图片', icon: '🖼️' },
    { id: 'frontend', name: '前端', icon: '🎨' },
    { id: 'network', name: '网络/运维', icon: '🌐' },
    { id: 'convert', name: '文档转换', icon: '📄' },
    { id: 'utility', name: '实用工具', icon: '🔧' }
  ],
  tools: [
    {
      id: 'json-formatter',
      name: 'JSON格式化',
      desc: '格式化、压缩、校验、树形视图',
      icon: '{ }',
      category: 'data',
      tags: ['json', '格式化', '校验', '压缩'],
      libs: []
    },
    {
      id: 'base64',
      name: 'Base64编码/解码',
      desc: '文本和图片的Base64编码与解码',
      icon: 'B64',
      category: 'encoding',
      tags: ['base64', '编码', '解码', '图片'],
      libs: []
    },
    {
      id: 'url-encoder',
      name: 'URL编码/解码',
      desc: 'URL编码、解码、查询参数解析',
      icon: 'URL',
      category: 'encoding',
      tags: ['url', '编码', '解码', '查询参数'],
      libs: []
    },
    {
      id: 'md5',
      name: 'MD5/SHA哈希',
      desc: 'MD5、SHA1、SHA256、SHA512哈希计算',
      icon: '#',
      category: 'encoding',
      tags: ['md5', 'sha', '哈希', 'hash', '加密'],
      libs: ['crypto-js']
    },
    {
      id: 'regex',
      name: '正则表达式测试',
      desc: '实时匹配、多引擎、代码生成',
      icon: '.*',
      category: 'text',
      tags: ['正则', 'regex', '匹配', '测试'],
      libs: []
    },
    {
      id: 'image-compress',
      name: '图片压缩',
      desc: 'PNG/JPEG/WebP图片压缩与格式转换',
      icon: 'IMG',
      category: 'image',
      tags: ['图片', '压缩', 'png', 'jpeg', 'webp'],
      libs: []
    },
    {
      id: 'markdown-editor',
      name: 'Markdown编辑器',
      desc: '实时预览、语法高亮、导出HTML',
      icon: 'MD',
      category: 'text',
      tags: ['markdown', '编辑器', '预览'],
      libs: ['marked', 'highlight']
    },
    {
      id: 'code-screenshot',
      name: '代码截图',
      desc: '多语言语法高亮、多种主题',
      icon: '📸',
      category: 'text',
      tags: ['代码', '截图', '分享', '图片'],
      libs: ['highlight', 'html2canvas']
    },
    {
      id: 'color-picker',
      name: '颜色选择器',
      desc: 'HEX/RGB/HSL转换、调色板',
      icon: '🎨',
      category: 'frontend',
      tags: ['颜色', 'color', 'hex', 'rgb', 'hsl'],
      libs: []
    },
    {
      id: 'uuid-generator',
      name: 'UUID生成器',
      desc: 'UUID v4批量生成',
      icon: 'ID',
      category: 'utility',
      tags: ['uuid', '生成', '随机'],
      libs: []
    },
    {
      id: 'timestamp',
      name: 'Unix时间戳',
      desc: '时间戳与日期互转',
      icon: '⏰',
      category: 'utility',
      tags: ['时间戳', 'timestamp', '日期', 'unix'],
      libs: []
    },
    {
      id: 'password-generator',
      name: '随机密码生成',
      desc: '安全随机密码生成器',
      icon: '🔑',
      category: 'utility',
      tags: ['密码', '随机', '安全', '生成'],
      libs: []
    },
    {
      id: 'unit-converter',
      name: '单位换算',
      desc: '长度/重量/温度/面积/速度换算',
      icon: '📐',
      category: 'utility',
      tags: ['单位', '换算', '长度', '重量', '温度'],
      libs: []
    },
    {
      id: 'base-converter',
      name: '进制转换',
      desc: '2/8/10/16/32/36进制互转',
      icon: '0x',
      category: 'encoding',
      tags: ['进制', '转换', '二进制', '十六进制'],
      libs: []
    },
    {
      id: 'jwt-parser',
      name: 'JWT解析/调试',
      desc: 'JWT Token解码与验证',
      icon: 'JWT',
      category: 'encoding',
      tags: ['jwt', 'token', '解析', '调试'],
      libs: []
    },
    {
      id: 'text-diff',
      name: '文本对比',
      desc: '并排对比文本差异',
      icon: 'Diff',
      category: 'text',
      tags: ['对比', 'diff', '文本', '差异'],
      libs: []
    },
    {
      id: 'csv-converter',
      name: 'CSV/JSON转换',
      desc: 'CSV与JSON格式互转',
      icon: 'CSV',
      category: 'convert',
      tags: ['csv', 'json', '转换', '表格'],
      libs: ['papaparse']
    },
    {
      id: 'qrcode',
      name: '二维码生成',
      desc: '自定义样式二维码生成',
      icon: 'QR',
      category: 'utility',
      tags: ['二维码', 'qrcode', '生成'],
      libs: ['qrcode']
    },
    {
      id: 'cron-editor',
      name: 'Cron表达式',
      desc: 'Cron表达式编辑与解释',
      icon: 'CRON',
      category: 'network',
      tags: ['cron', '定时', '表达式', '调度'],
      libs: []
    },
    {
      id: 'ip-query',
      name: 'IP地址查询',
      desc: '查询IP地址地理位置信息',
      icon: 'IP',
      category: 'network',
      tags: ['ip', '地址', '查询', '定位'],
      libs: []
    },
    {
      id: 'css-flex',
      name: 'CSS Flex生成器',
      desc: '可视化Flex布局生成CSS代码',
      icon: 'Flex',
      category: 'frontend',
      tags: ['css', 'flex', '布局', '生成'],
      libs: []
    },
    {
      id: 'gradient',
      name: 'CSS渐变生成器',
      desc: '线性/径向渐变可视化编辑',
      icon: 'Grad',
      category: 'frontend',
      tags: ['css', '渐变', 'gradient', '背景'],
      libs: []
    },
    {
      id: 'hash-file',
      name: '文件哈希计算',
      desc: '拖拽文件计算MD5/SHA哈希',
      icon: 'File',
      category: 'encoding',
      tags: ['文件', '哈希', 'md5', 'sha'],
      libs: ['crypto-js']
    },
    {
      id: 'image-base64',
      name: '图片转Base64',
      desc: '图片与Base64 Data URL互转',
      icon: 'B64',
      category: 'image',
      tags: ['图片', 'base64', '编码', 'dataurl'],
      libs: []
    },

    // ===== 新增工具 =====

    // --- 数据工具 ---
    {
      id: 'xml-formatter',
      name: 'XML格式化',
      desc: 'XML文档格式化、压缩、校验',
      icon: 'XML',
      category: 'data',
      tags: ['xml', '格式化', '校验'],
      libs: []
    },
    {
      id: 'yaml-converter',
      name: 'YAML/JSON转换',
      desc: 'YAML与JSON格式互转',
      icon: 'YML',
      category: 'data',
      tags: ['yaml', 'json', '转换'],
      libs: []
    },
    {
      id: 'sql-formatter',
      name: 'SQL格式化',
      desc: 'SQL语句格式化与美化',
      icon: 'SQL',
      category: 'data',
      tags: ['sql', '格式化', '数据库'],
      libs: []
    },
    {
      id: 'html-entities',
      name: 'HTML实体编码',
      desc: 'HTML实体编码与解码转换',
      icon: '&',
      category: 'data',
      tags: ['html', '实体', '编码', '转义'],
      libs: []
    },

    // --- 编码工具 ---
    {
      id: 'html-encode',
      name: 'HTML编码/解码',
      desc: 'HTML标签编码与解码',
      icon: '< >',
      category: 'encoding',
      tags: ['html', '编码', '解码', '转义'],
      libs: []
    },
    {
      id: 'unicode-converter',
      name: 'Unicode转换',
      desc: 'Unicode编码与中文互转',
      icon: 'U',
      category: 'encoding',
      tags: ['unicode', '编码', '中文', '转换'],
      libs: []
    },
    {
      id: 'hex-converter',
      name: 'Hex/ASCII转换',
      desc: '十六进制与ASCII字符互转',
      icon: '0x',
      category: 'encoding',
      tags: ['hex', 'ascii', '转换', '十六进制'],
      libs: []
    },
    {
      id: 'mime-type',
      name: 'MIME类型查询',
      desc: '文件扩展名与MIME类型对照',
      icon: 'MIME',
      category: 'encoding',
      tags: ['mime', '类型', '文件', '查询'],
      libs: []
    },

    // --- 文本工具 ---
    {
      id: 'text-counter',
      name: '字数统计',
      desc: '统计字符数、单词数、行数',
      icon: '#',
      category: 'text',
      tags: ['字数', '统计', '字符', '计数'],
      libs: []
    },
    {
      id: 'text-case',
      name: '大小写转换',
      desc: '文本大小写、驼峰、蛇形转换',
      icon: 'Aa',
      category: 'text',
      tags: ['大小写', '转换', '驼峰', '蛇形'],
      libs: []
    },
    {
      id: 'lorem-ipsum',
      name: 'Lorem Ipsum生成',
      desc: '生成占位文本（中英文）',
      icon: 'Li',
      category: 'text',
      tags: ['lorem', '占位', '文本', '生成'],
      libs: []
    },
    {
      id: 'text-sort',
      name: '文本排序',
      desc: '按字母、数字、长度排序',
      icon: '↕',
      category: 'text',
      tags: ['排序', '文本', '字母', '数字'],
      libs: []
    },
    {
      id: 'word-frequency',
      name: '词频统计',
      desc: '分析文本中词语出现频率',
      icon: 'Freq',
      category: 'text',
      tags: ['词频', '统计', '分析', '频率'],
      libs: []
    },

    // --- 图片工具 ---
    {
      id: 'image-resize',
      name: '图片裁剪缩放',
      desc: '在线图片尺寸调整与裁剪',
      icon: '✂',
      category: 'image',
      tags: ['图片', '裁剪', '缩放', '尺寸'],
      libs: []
    },
    {
      id: 'image-format',
      name: '图片格式转换',
      desc: 'PNG/JPEG/WebP/BMP格式互转',
      icon: 'Fmt',
      category: 'image',
      tags: ['图片', '格式', '转换', 'png', 'jpeg'],
      libs: []
    },
    {
      id: 'svg-viewer',
      name: 'SVG查看器',
      desc: 'SVG代码预览与编辑',
      icon: 'SVG',
      category: 'image',
      tags: ['svg', '查看', '编辑', '矢量'],
      libs: []
    },
    {
      id: 'favicon-gen',
      name: 'Favicon生成',
      desc: '从图片生成网站图标',
      icon: 'ICO',
      category: 'image',
      tags: ['favicon', '图标', '生成', '网站'],
      libs: []
    },

    // --- 前端工具 ---
    {
      id: 'css-grid',
      name: 'CSS Grid生成器',
      desc: '可视化Grid布局生成CSS代码',
      icon: '⊞',
      category: 'frontend',
      tags: ['css', 'grid', '布局', '生成'],
      libs: []
    },
    {
      id: 'box-shadow',
      name: 'CSS阴影生成器',
      desc: '可视化编辑box-shadow效果',
      icon: '▧',
      category: 'frontend',
      tags: ['css', '阴影', 'box-shadow', '效果'],
      libs: []
    },
    {
      id: 'border-radius',
      name: 'CSS圆角生成器',
      desc: '可视化编辑border-radius',
      icon: '◯',
      category: 'frontend',
      tags: ['css', '圆角', 'border-radius'],
      libs: []
    },
    {
      id: 'animation-generator',
      name: 'CSS动画生成器',
      desc: '关键帧动画可视化编辑',
      icon: '▶',
      category: 'frontend',
      tags: ['css', '动画', 'animation', '关键帧'],
      libs: []
    },
    {
      id: 'color-contrast',
      name: '色彩对比度检测',
      desc: 'WCAG无障碍色彩对比度检查',
      icon: '◐',
      category: 'frontend',
      tags: ['颜色', '对比度', 'wcag', '无障碍'],
      libs: []
    },
    {
      id: 'responsive-test',
      name: '响应式测试',
      desc: '模拟不同屏幕尺寸预览网页',
      icon: '📱',
      category: 'frontend',
      tags: ['响应式', '测试', '屏幕', '预览'],
      libs: []
    },

    // --- 网络工具 ---
    {
      id: 'http-status',
      name: 'HTTP状态码查询',
      desc: 'HTTP状态码含义速查',
      icon: '200',
      category: 'network',
      tags: ['http', '状态码', '查询', 'web'],
      libs: []
    },
    {
      id: 'port-scanner',
      name: '端口说明查询',
      desc: '常用端口号与服务对照',
      icon: '↕',
      category: 'network',
      tags: ['端口', '网络', '服务', '查询'],
      libs: []
    },
    {
      id: 'user-agent',
      name: 'User-Agent解析',
      desc: '解析浏览器UA字符串信息',
      icon: 'UA',
      category: 'network',
      tags: ['user-agent', '浏览器', '解析'],
      libs: []
    },
    {
      id: 'dns-lookup',
      name: 'DNS记录查询',
      desc: '查询域名DNS解析记录',
      icon: 'DNS',
      category: 'network',
      tags: ['dns', '域名', '解析', '查询'],
      libs: []
    },

    // --- 实用工具 ---
    {
      id: 'random-string',
      name: '随机字符串生成',
      desc: '生成指定长度的随机字符串',
      icon: '🎲',
      category: 'utility',
      tags: ['随机', '字符串', '生成'],
      libs: []
    },
    {
      id: 'number-generator',
      name: '随机数生成',
      desc: '生成指定范围的随机数',
      icon: '#',
      category: 'utility',
      tags: ['随机', '数字', '生成', '范围'],
      libs: []
    },
    {
      id: 'list-shuffler',
      name: '列表随机排序',
      desc: '随机打乱列表顺序',
      icon: '🔀',
      category: 'utility',
      tags: ['随机', '排序', '打乱', '列表'],
      libs: []
    },
    {
      id: 'color-namer',
      name: '颜色名称查询',
      desc: 'HEX颜色对应的中英文名称',
      icon: '🎨',
      category: 'utility',
      tags: ['颜色', '名称', '查询', 'hex'],
      libs: []
    },
    {
      id: 'pomodoro-timer',
      name: '番茄钟计时器',
      desc: '25分钟工作+5分钟休息',
      icon: '🍅',
      category: 'utility',
      tags: ['番茄', '计时', '效率', '专注'],
      libs: []
    },
    {
      id: 'age-calculator',
      name: '年龄计算器',
      desc: '根据出生日期计算年龄',
      icon: '🎂',
      category: 'utility',
      tags: ['年龄', '计算', '出生', '日期'],
      libs: []
    },
    {
      id: 'days-calculator',
      name: '日期天数计算',
      desc: '计算两个日期之间的天数',
      icon: '📅',
      category: 'utility',
      tags: ['日期', '天数', '计算', '差值'],
      libs: []
    },

    // --- 文档转换 ---
    {
      id: 'markdown-pdf',
      name: 'Markdown转PDF',
      desc: '将Markdown文档导出为PDF',
      icon: 'PDF',
      category: 'convert',
      tags: ['markdown', 'pdf', '导出', '转换'],
      libs: []
    },
    {
      id: 'html-markdown',
      name: 'HTML转Markdown',
      desc: '将HTML内容转换为Markdown',
      icon: 'MD',
      category: 'convert',
      tags: ['html', 'markdown', '转换'],
      libs: []
    },
    {
      id: 'json-yaml',
      name: 'JSON转YAML',
      desc: 'JSON格式转换为YAML格式',
      icon: 'JSON',
      category: 'convert',
      tags: ['json', 'yaml', '转换'],
      libs: []
    },
    {
      id: 'image-text',
      name: '图片文字提取',
      desc: '从图片中提取文字（OCR）',
      icon: 'OCR',
      category: 'convert',
      tags: ['图片', '文字', 'ocr', '提取'],
      libs: []
    },

    // ===== 新增工具（第三批） =====

    // --- 数据工具 ---
    {
      id: 'json-to-ts',
      name: 'JSON转TypeScript',
      desc: 'JSON生成TypeScript接口定义',
      icon: 'TS',
      category: 'data',
      tags: ['json', 'typescript', '接口', '定义'],
      libs: []
    },
    {
      id: 'json-to-go',
      name: 'JSON转Go结构体',
      desc: 'JSON生成Go语言结构体',
      icon: 'Go',
      category: 'data',
      tags: ['json', 'go', '结构体', '转换'],
      libs: []
    },
    {
      id: 'json-flatten',
      name: 'JSON展平/嵌套',
      desc: 'JSON对象展平与反向嵌套',
      icon: '⇌',
      category: 'data',
      tags: ['json', '展平', '嵌套', '转换'],
      libs: []
    },
    {
      id: 'json-diff',
      name: 'JSON对比',
      desc: '比较两个JSON对象的差异',
      icon: '≠',
      category: 'data',
      tags: ['json', '对比', '差异', 'diff'],
      libs: []
    },
    {
      id: 'xml-to-json',
      name: 'XML转JSON',
      desc: 'XML文档转换为JSON格式',
      icon: 'X→J',
      category: 'data',
      tags: ['xml', 'json', '转换'],
      libs: []
    },

    // --- 编码工具 ---
    {
      id: 'base32',
      name: 'Base32编码/解码',
      desc: 'Base32编码与解码转换',
      icon: 'B32',
      category: 'encoding',
      tags: ['base32', '编码', '解码'],
      libs: []
    },
    {
      id: 'rot13',
      name: 'ROT13密码',
      desc: 'ROT13字母替换加密解密',
      icon: 'R13',
      category: 'encoding',
      tags: ['rot13', '密码', '加密', '解密'],
      libs: []
    },
    {
      id: 'atbash',
      name: 'Atbash密码',
      desc: 'Atbash字母反向替换',
      icon: 'AtB',
      category: 'encoding',
      tags: ['atbash', '密码', '加密', '替换'],
      libs: []
    },
    {
      id: 'vigenere',
      name: 'Vigenère密码',
      desc: '维吉尼亚密码加密与解密',
      icon: 'Vig',
      category: 'encoding',
      tags: ['vigenere', '密码', '加密', '密钥'],
      libs: []
    },

    // --- 文本工具 ---
    {
      id: 'slug-generator',
      name: 'URL Slug生成',
      desc: '将文本转换为URL友好的slug',
      icon: 'Slg',
      category: 'text',
      tags: ['slug', 'url', '生成', '文本'],
      libs: []
    },
    {
      id: 'text-replacer',
      name: '文本查找替换',
      desc: '查找替换文本，支持正则',
      icon: 'Rpl',
      category: 'text',
      tags: ['查找', '替换', '文本', '正则'],
      libs: []
    },
    {
      id: 'reverse-text',
      name: '文本反转',
      desc: '反转文本、单词顺序、大小写',
      icon: '↔',
      category: 'text',
      tags: ['反转', '文本', '倒序'],
      libs: []
    },
    {
      id: 'morse-code',
      name: '摩斯密码',
      desc: '文本与摩斯密码互转',
      icon: '·−',
      category: 'text',
      tags: ['摩斯', 'morse', '密码', '编码'],
      libs: []
    },
    {
      id: 'binary-text',
      name: '二进制/文本互转',
      desc: '二进制与文本字符串互转',
      icon: '01',
      category: 'text',
      tags: ['二进制', '文本', '转换', '编码'],
      libs: []
    },
    {
      id: 'case-converter',
      name: '命名格式转换',
      desc: 'camelCase/snake_case/kebab-case/PascalCase互转',
      icon: 'Aa',
      category: 'text',
      tags: ['命名', '转换', '驼峰', '蛇形'],
      libs: []
    },
    {
      id: 'leet-converter',
      name: 'Leet语转换',
      desc: '文本与Leet语(1337)互转',
      icon: '1337',
      category: 'text',
      tags: ['leet', '1337', '编码', '转换'],
      libs: []
    },
    {
      id: 'pig-latin',
      name: 'Pig Latin转换',
      desc: '英文与Pig Latin互转',
      icon: 'Pig',
      category: 'text',
      tags: ['pig', 'latin', '转换', '英语'],
      libs: []
    },

    // --- 图片工具 ---
    {
      id: 'image-cropper',
      name: '图片裁剪',
      desc: '按尺寸裁剪图片',
      icon: '✂',
      category: 'image',
      tags: ['图片', '裁剪', '尺寸'],
      libs: []
    },
    {
      id: 'image-color',
      name: '图片取色',
      desc: '提取图片主色调与配色',
      icon: '🎨',
      category: 'image',
      tags: ['图片', '颜色', '取色', '调色板'],
      libs: []
    },
    {
      id: 'image-dataurl',
      name: '图片转DataURL',
      desc: '图片文件转Data URL字符串',
      icon: 'DURL',
      category: 'image',
      tags: ['图片', 'dataurl', 'base64', '转换'],
      libs: []
    },

    // --- 前端工具 ---
    {
      id: 'html-preview',
      name: 'HTML实时预览',
      desc: 'HTML/CSS/JS代码实时预览',
      icon: '▶',
      category: 'frontend',
      tags: ['html', '预览', '实时', '编辑'],
      libs: []
    },
    {
      id: 'css-minifier',
      name: 'CSS压缩',
      desc: 'CSS代码压缩与格式化',
      icon: 'CSS',
      category: 'frontend',
      tags: ['css', '压缩', '格式化', '美化'],
      libs: []
    },
    {
      id: 'js-minifier',
      name: 'JS压缩',
      desc: 'JavaScript代码压缩与格式化',
      icon: 'JS',
      category: 'frontend',
      tags: ['javascript', '压缩', '格式化'],
      libs: []
    },
    {
      id: 'browser-info',
      name: '浏览器信息',
      desc: '显示当前浏览器与系统信息',
      icon: 'ℹ',
      category: 'frontend',
      tags: ['浏览器', '信息', '系统', 'UA'],
      libs: []
    },
    {
      id: 'font-generator',
      name: 'CSS字体生成',
      desc: '生成@font-face CSS代码',
      icon: 'Fnt',
      category: 'frontend',
      tags: ['字体', 'font-face', 'css', '生成'],
      libs: []
    },

    // --- 网络工具 ---
    {
      id: 'mac-lookup',
      name: 'MAC地址查询',
      desc: '查询MAC地址厂商信息',
      icon: 'MAC',
      category: 'network',
      tags: ['mac', '地址', '查询', '厂商'],
      libs: []
    },
    {
      id: 'ip-scanner',
      name: 'IP网段计算',
      desc: 'IP地址与子网掩码计算',
      icon: '✜',
      category: 'network',
      tags: ['ip', '子网', '网段', '计算'],
      libs: []
    },
    {
      id: 'port-common',
      name: '端口大全',
      desc: '常用TCP/UDP端口速查',
      icon: '🔌',
      category: 'network',
      tags: ['端口', 'tcp', 'udp', '速查'],
      libs: []
    },

    // --- 实用工具 ---
    {
      id: 'percentage-calc',
      name: '百分比计算器',
      desc: '百分比、比例、增长率计算',
      icon: '%',
      category: 'utility',
      tags: ['百分比', '计算', '比例', '增长率'],
      libs: []
    },
    {
      id: 'bmi-calculator',
      name: 'BMI计算器',
      desc: '身体质量指数计算与评估',
      icon: 'BMI',
      category: 'utility',
      tags: ['bmi', '体重', '身高', '健康'],
      libs: []
    },
    {
      id: 'roman-numeral',
      name: '罗马数字转换',
      desc: '阿拉伯数字与罗马数字互转',
      icon: 'IVX',
      category: 'utility',
      tags: ['罗马', '数字', '转换', 'roman'],
      libs: []
    },
    {
      id: 'number-to-words',
      name: '数字转中文',
      desc: '阿拉伯数字转中文大小写',
      icon: '壹',
      category: 'utility',
      tags: ['数字', '中文', '大写', '金额'],
      libs: []
    },
    {
      id: 'password-strength',
      name: '密码强度检测',
      desc: '检测密码强度与安全性',
      icon: '🔒',
      category: 'utility',
      tags: ['密码', '强度', '检测', '安全'],
      libs: []
    },
    {
      id: 'emoji-search',
      name: 'Emoji搜索',
      desc: '搜索并复制Emoji表情符号',
      icon: '😊',
      category: 'utility',
      tags: ['emoji', '表情', '搜索', '复制'],
      libs: []
    },
    {
      id: 'keyboard-test',
      name: '键盘测试',
      desc: '测试键盘按键是否正常',
      icon: '⌨',
      category: 'utility',
      tags: ['键盘', '测试', '按键'],
      libs: []
    },

    // --- 文档转换 ---
    {
      id: 'csv-to-md',
      name: 'CSV转Markdown',
      desc: 'CSV数据转换为Markdown表格',
      icon: 'C→M',
      category: 'convert',
      tags: ['csv', 'markdown', '表格', '转换'],
      libs: []
    },
    {
      id: 'markdown-table',
      name: 'Markdown表格生成',
      desc: '可视化编辑生成Markdown表格',
      icon: 'Tbl',
      category: 'convert',
      tags: ['markdown', '表格', '生成', '编辑'],
      libs: []
    },
    {
      id: 'json-to-csv',
      name: 'JSON转CSV',
      desc: 'JSON数据转换为CSV格式',
      icon: 'J→C',
      category: 'convert',
      tags: ['json', 'csv', '转换', '导出'],
      libs: []
    }
  ]
};
