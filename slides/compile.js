// compile.js - 编译所有幻灯片为最终 PPTX
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

// Vibrant & Tech 配色（深蓝 + 活力橙）
const theme = {
  primary: "023047",    // 深蓝 - 标题/主色
  secondary: "219ebc",  // 中蓝 - 次要文本
  accent: "fb8500",     // 活力橙 - 强调色
  light: "8ecae6",      // 浅蓝 - 辅助
  bg: "ffffff"          // 白色背景
};

// 设置演示文稿属性
pres.author = "OneTake Team";
pres.company = "Hackathon 2026";
pres.subject = "OneTake 相册清理工具 - 3分钟路演";
pres.title = "OneTake - 一次划走，相册清爽";

// 幻灯片顺序（12 页）
const slideOrder = [
  './slide-01.js',   // 1. 封面
  './slide-02.js',   // 2. 痛点
  './slide-03.js',   // 3. 竞品全景对比矩阵
  './slide-03b.js',  // 4. 目标用户
  './slide-04.js',   // 5. 解决方案
  './slide-05.js',   // 6. 核心功能①四向手势
  './slide-06.js',   // 7. 核心功能②智能分组（目标轻量化）
  './slide-07.js',   // 8. 核心功能③精选集→手账本
  './slide-07b.js',  // 9. 核心功能④暂存栏（筛选/对比/发布预览）
  './slide-08.js',   // 10. 技术亮点
  './slide-09.js',   // 11. 路线图
  './slide-10.js'    // 12. 结尾
];

slideOrder.forEach((slidePath) => {
  const slideModule = require(slidePath);
  slideModule.createSlide(pres, theme);
});

pres.writeFile({ fileName: './output/OneTake_Hackathon_Pitch.pptx' })
  .then(fileName => {
    console.log(`✅ PPTX 生成成功: ${fileName}（共 ${slideOrder.length} 页）`);
  })
  .catch(err => {
    console.error('❌ 生成失败:', err);
    process.exit(1);
  });
