// slide-01.js - Cover Page
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'cover',
  index: 1,
  title: 'OneTake'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 左侧装饰色块
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.8, h: 5.625,
    fill: { color: theme.primary }
  });

  // 橙色斜切装饰条
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 3.6, y: 0, w: 0.25, h: 5.625,
    fill: { color: theme.accent }
  });

  // 左侧装饰：手机相册图标（用圆形堆叠模拟）
  for (let i = 0; i < 5; i++) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6 + i * 0.15, y: 1.0 + i * 0.5, w: 2.2, h: 0.35,
      fill: { color: i % 2 === 0 ? theme.secondary : theme.light },
      rectRadius: 0.08,
      line: { color: theme.primary, width: 0 }
    });
  }

  // 左下角 Logo 文字
  slide.addText("OneTake", {
    x: 0.5, y: 4.7, w: 3.2, h: 0.5,
    fontSize: 20, fontFace: "Arial",
    color: "FFFFFF", bold: true, align: "left"
  });

  // 右侧主标题区
  slide.addText("OneTake", {
    x: 4.2, y: 1.4, w: 5.5, h: 1.4,
    fontSize: 72, fontFace: "Arial",
    color: theme.primary, bold: true, align: "left"
  });

  // 橙色装饰短线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.3, y: 2.85, w: 0.8, h: 0.06,
    fill: { color: theme.accent }
  });

  // 副标题：中文 Slogan
  slide.addText("一次划走，相册清爽", {
    x: 4.2, y: 3.0, w: 5.5, h: 0.7,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: theme.secondary, bold: true, align: "left"
  });

  // 描述
  slide.addText("像刷卡片一样快速清理手机相册", {
    x: 4.2, y: 3.75, w: 5.5, h: 0.5,
    fontSize: 18, fontFace: "Microsoft YaHei",
    color: theme.secondary, align: "left"
  });

  // 底部元信息
  slide.addText("Hackathon Pitch  ·  3 分钟路演  ·  2026", {
    x: 4.2, y: 4.9, w: 5.5, h: 0.4,
    fontSize: 13, fontFace: "Arial",
    color: "9A8C98", align: "left"
  });

  return slide;
}

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = {
    primary: "023047",
    secondary: "219ebc",
    accent: "fb8500",
    light: "8ecae6",
    bg: "ffffff"
  };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
