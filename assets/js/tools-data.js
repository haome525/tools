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
    }
  ]
};
