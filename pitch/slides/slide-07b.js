// slide-07b.js - 核心功能4：暂存栏
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 9,
  title: '核心功能：暂存栏'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 标题
  slide.addText("核心功能 ④  暂存栏 · 先放一放，回头再说", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 顶部：暂存入口说明
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.1, w: 9.2, h: 0.5,
    fill: { color: theme.primary },
    rectRadius: 0.08
  });
  slide.addText("📌 入口：卡片右上角钉住图标 · 一键暂存 · 不打断当前整理节奏", {
    x: 0.5, y: 1.1, w: 9.2, h: 0.5,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 三个核心能力卡片
  const abilities = [
    {
      icon: "🔍",
      title: "智能筛选",
      desc: "按时间 / 类型 / 来源\n快速过滤暂存内容",
      detail: "支持多条件组合筛选\n缩小决策范围",
      color: theme.secondary
    },
    {
      icon: "⚖️",
      title: "对比模式",
      desc: "并排对比相似照片\n独立/联动缩放",
      detail: "pHash 重复检测\n一键保留最佳张",
      color: theme.accent
    },
    {
      icon: "👁️",
      title: "发布预览",
      desc: "社媒预览 / 排版预览\n发布前最后一关",
      detail: "模拟朋友圈/小红书排版\n确认后再决定去留",
      color: "2A9D8F"
    }
  ];

  abilities.forEach((ab, i) => {
    const x = 0.5 + i * 3.13;

    // 卡片背景
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.8, w: 2.93, h: 2.6,
      fill: { color: "FFFFFF" },
      line: { color: ab.color, width: 1.5 },
      rectRadius: 0.12
    });

    // 顶部色条
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.8, w: 2.93, h: 0.6,
      fill: { color: ab.color },
      rectRadius: 0.12
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 2.15, w: 2.93, h: 0.25,
      fill: { color: ab.color }
    });

    // 图标
    slide.addText(ab.icon, {
      x: x + 0.15, y: 1.85, w: 0.5, h: 0.5,
      fontSize: 22, fontFace: "Arial",
      align: "center", valign: "middle"
    });

    // 标题
    slide.addText(ab.title, {
      x: x + 0.65, y: 1.85, w: 2.2, h: 0.5,
      fontSize: 15, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true, align: "left", valign: "middle"
    });

    // 主要描述
    slide.addText(ab.desc, {
      x: x + 0.2, y: 2.55, w: 2.53, h: 0.7,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center", valign: "middle"
    });

    // 分割线
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.6, y: 3.3, w: 1.73, h: 0.02,
      fill: { color: theme.light }
    });

    // 详细说明
    slide.addText(ab.detail, {
      x: x + 0.2, y: 3.4, w: 2.53, h: 0.9,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center", valign: "top"
    });
  });

  // 底部：暂存栏价值
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.55, w: 9.2, h: 0.85,
    fill: { color: theme.accent },
    rectRadius: 0.08
  });
  slide.addText("💡 暂存栏的价值：降低决策压力", {
    x: 0.5, y: 4.6, w: 9.2, h: 0.35,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });
  slide.addText("不确定的先暂存 → 闲暇时用筛选/对比/预览仔细斟酌 → 避免冲动删除珍贵照片", {
    x: 0.5, y: 4.95, w: 9.2, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: "FFFFFF", align: "center", valign: "middle"
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("9", {
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
  pres.writeFile({ fileName: "slide-07b-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
