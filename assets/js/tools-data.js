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
    }
  ]
};
