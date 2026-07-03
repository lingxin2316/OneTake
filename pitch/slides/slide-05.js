// slide-05.js - 核心功能1：四向手势
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 5,
  title: '核心功能：四向手势'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 标题
  slide.addText("核心功能 ①  四向手势，单手搞定", {
    x: 0.5, y: 0.4, w: 9, h: 0.7,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 左侧：手机卡片示意图
  // 手机外框
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.2, y: 1.5, w: 2.6, h: 3.8,
    fill: { color: theme.primary },
    rectRadius: 0.2
  });

  // 屏幕区域
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.4, y: 1.7, w: 2.2, h: 3.4,
    fill: { color: "FFFFFF" },
    rectRadius: 0.1
  });

  // 照片卡片（占位）
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.6, y: 2.2, w: 1.8, h: 2.4,
    fill: { color: theme.light },
    rectRadius: 0.08
  });

  // 卡片图标
  slide.addText("📷", {
    x: 1.6, y: 2.2, w: 1.8, h: 2.4,
    fontSize: 60, fontFace: "Arial",
    color: theme.primary, align: "center", valign: "middle"
  });

  // 钉住图标
  slide.addShape(pres.shapes.OVAL, {
    x: 3.05, y: 2.3, w: 0.3, h: 0.3,
    fill: { color: theme.accent }
  });
  slide.addText("📌", {
    x: 3.05, y: 2.3, w: 0.3, h: 0.3,
    fontSize: 12, fontFace: "Arial",
    align: "center", valign: "middle"
  });

  // 四向箭头
  // 上（删除-红）
  slide.addText("↑", {
    x: 1.6, y: 1.55, w: 1.8, h: 0.5,
    fontSize: 32, fontFace: "Arial",
    color: "D90429", bold: true, align: "center"
  });
  // 下（精选-金）
  slide.addText("↓", {
    x: 1.6, y: 4.6, w: 1.8, h: 0.5,
    fontSize: 32, fontFace: "Arial",
    color: "FFB703", bold: true, align: "center"
  });
  // 左（跳过-灰）
  slide.addText("←", {
    x: 0.7, y: 3.0, w: 0.5, h: 0.8,
    fontSize: 32, fontFace: "Arial",
    color: "8D99AE", bold: true, align: "center", valign: "middle"
  });
  // 右（撤回-绿）
  slide.addText("→", {
    x: 3.8, y: 3.0, w: 0.5, h: 0.8,
    fontSize: 32, fontFace: "Arial",
    color: "2A9D8F", bold: true, align: "center", valign: "middle"
  });

  // 右侧：手势说明
  const gestures = [
    { dir: "↑ 上划", action: "删除", desc: "移入系统回收站 · 可撤回", color: "D90429" },
    { dir: "↓ 下划", action: "加入精选集", desc: "拖拽至目标整理夹", color: "FFB703" },
    { dir: "← 左划", action: "Pass 跳过", desc: "本次不处理 · 下次再见", color: "8D99AE" },
    { dir: "→ 右划", action: "撤回", desc: "支持连续撤回本组操作", color: "2A9D8F" }
  ];

  gestures.forEach((g, i) => {
    const y = 1.5 + i * 0.85;

    // 行背景
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 4.5, y: y, w: 5.2, h: 0.72,
      fill: { color: "FFFFFF" },
      line: { color: theme.light, width: 1 },
      rectRadius: 0.08
    });

    // 方向标识
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 4.65, y: y + 0.1, w: 1.3, h: 0.52,
      fill: { color: g.color },
      rectRadius: 0.06
    });
    slide.addText(g.dir, {
      x: 4.65, y: y + 0.1, w: 1.3, h: 0.52,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true, align: "center", valign: "middle"
    });

    // 动作
    slide.addText(g.action, {
      x: 6.05, y: y + 0.05, w: 1.6, h: 0.62,
      fontSize: 14, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "left", valign: "middle"
    });

    // 说明
    slide.addText(g.desc, {
      x: 7.6, y: y + 0.05, w: 2.0, h: 0.62,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "left", valign: "middle"
    });
  });

  // 底部亮点
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 4.5, y: 4.95, w: 5.2, h: 0.55,
    fill: { color: theme.primary },
    rectRadius: 0.08
  });
  slide.addText("学习成本 ≤ 30 秒 · 60fps 流畅动画 · 触觉反馈", {
    x: 4.5, y: 4.95, w: 5.2, h: 0.55,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("6", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
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
  pres.writeFile({ fileName: "slide-05-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
