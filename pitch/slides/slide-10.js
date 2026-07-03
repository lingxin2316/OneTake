// slide-10.js - 结尾呼吁
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'summary',
  index: 10,
  title: '一次划走，相册清爽'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // 装饰几何元素
  slide.addShape(pres.shapes.OVAL, {
    x: -1.0, y: -1.0, w: 3, h: 3,
    fill: { color: theme.secondary, transparency: 70 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.0, y: 3.5, w: 3.5, h: 3.5,
    fill: { color: theme.accent, transparency: 75 }
  });

  // 主标题
  slide.addText("OneTake", {
    x: 0.5, y: 1.0, w: 9, h: 1.2,
    fontSize: 80, fontFace: "Arial",
    color: "FFFFFF", bold: true, align: "center"
  });

  // 橙色装饰线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.5, y: 2.25, w: 1.0, h: 0.06,
    fill: { color: theme.accent }
  });

  // Slogan
  slide.addText("一次划走，相册清爽", {
    x: 0.5, y: 2.4, w: 9, h: 0.8,
    fontSize: 36, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center"
  });

  // 三个核心价值
  const values = [
    { num: "50+", label: "单次清理照片数" },
    { num: "200MB+", label: "单次释放空间" },
    { num: "≤30s", label: "手势学习成本" }
  ];

  values.forEach((v, i) => {
    const x = 1.2 + i * 2.7;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 3.5, w: 2.5, h: 1.0,
      fill: { color: "FFFFFF", transparency: 90 },
      line: { color: theme.accent, width: 1 },
      rectRadius: 0.1
    });

    slide.addText(v.num, {
      x: x, y: 3.55, w: 2.5, h: 0.55,
      fontSize: 28, fontFace: "Arial",
      color: theme.accent, bold: true, align: "center", valign: "middle"
    });

    slide.addText(v.label, {
      x: x, y: 4.1, w: 2.5, h: 0.35,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: "FFFFFF", align: "center", valign: "middle"
    });
  });

  // 底部呼吁
  slide.addText("让相册整理，变成一件上瘾的事", {
    x: 0.5, y: 4.75, w: 9, h: 0.5,
    fontSize: 18, fontFace: "Microsoft YaHei",
    color: theme.light, align: "center"
  });

  // Thanks
  slide.addText("Thanks  ·  Q&A", {
    x: 0.5, y: 5.25, w: 9, h: 0.35,
    fontSize: 14, fontFace: "Arial",
    color: theme.accent, bold: true, align: "center"
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
  pres.writeFile({ fileName: "slide-10-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
