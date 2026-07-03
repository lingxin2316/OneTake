// slide-07.js - 核心功能3：精选集 → 手账本虚拟相册
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 8,
  title: '核心功能：精选集'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 标题
  slide.addText("核心功能 ③  精选集 → 手账本虚拟相册", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 左侧：MVP - 拖拽归档基础功能
  slide.addText("MVP · 拖拽归档", {
    x: 0.5, y: 1.15, w: 4.5, h: 0.35,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  // 模拟手机屏幕
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 1.55, w: 2.4, h: 2.3,
    fill: { color: theme.primary },
    rectRadius: 0.12
  });

  // 照片区
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.85, y: 1.7, w: 2.1, h: 1.5,
    fill: { color: theme.light },
    rectRadius: 0.06
  });
  slide.addText("📷", {
    x: 0.85, y: 1.7, w: 2.1, h: 1.5,
    fontSize: 30, fontFace: "Arial",
    color: theme.primary, align: "center", valign: "middle"
  });

  // 精选集托盘（5个图标）
  const collections = [
    { emoji: "⭐", name: "精选" },
    { emoji: "✈️", name: "旅行" },
    { emoji: "👨‍👩‍👧", name: "家人" },
    { emoji: "💼", name: "工作" },
    { emoji: "➕", name: "新建" }
  ];

  collections.forEach((col, i) => {
    const x = 0.78 + i * 0.44;

    if (i === 0) {
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.72, y: 3.3, w: 2.36, h: 0.45,
        fill: { color: "FFFFFF" },
        rectRadius: 0.08
      });
    }

    slide.addShape(pres.shapes.OVAL, {
      x: x, y: 3.35, w: 0.36, h: 0.36,
      fill: { color: i === 4 ? theme.accent : theme.secondary }
    });
    slide.addText(col.emoji, {
      x: x, y: 3.35, w: 0.36, h: 0.36,
      fontSize: 9, fontFace: "Arial",
      align: "center", valign: "middle"
    });
  });

  // MVP 特性列表
  const mvpFeatures = [
    "✓  下划触发拖拽归档",
    "✓  5 个预设精选集 + 自定义",
    "✓  应用内独立体系 · 不同步系统收藏",
    "✓  仅存引用路径 · 不复制原文件"
  ];

  mvpFeatures.forEach((feat, i) => {
    slide.addText(feat, {
      x: 0.5, y: 4.05 + i * 0.32, w: 4.5, h: 0.3,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "left", valign: "middle"
    });
  });

  // 右侧：升级愿景 - 手账本虚拟相册
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.15, w: 4.6, h: 0.45,
    fill: { color: theme.accent },
    rectRadius: 0.08
  });
  slide.addText("🚀 升级愿景 · 手账本虚拟相册", {
    x: 5.2, y: 1.15, w: 4.6, h: 0.45,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 手账本特性卡片
  const visionFeatures = [
    {
      icon: "📔",
      title: "手账本式排版",
      desc: "照片 + 文字 + 贴纸 + 胶带\n自由 DIY 个性化回忆页面"
    },
    {
      icon: "🎨",
      title: "DIY 创作工具",
      desc: "多模板 / 多主题 / 多排版\n增加整理成就感与创作乐趣"
    },
    {
      icon: "🖨️",
      title: "一键导出打印",
      desc: "高清 PDF / 实体相册定制\n把数字回忆变成实体珍藏"
    },
    {
      icon: "📤",
      title: "分享与协作",
      desc: "生成分享链接 / 社媒卡片\n与好友共同编辑回忆手账"
    }
  ];

  visionFeatures.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 5.2 + col * 2.3;
    const y = 1.75 + row * 1.15;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 2.2, h: 1.05,
      fill: { color: "FFFFFF" },
      line: { color: theme.accent, width: 1 },
      rectRadius: 0.08
    });

    // 图标
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.12, y: y + 0.12, w: 0.4, h: 0.4,
      fill: { color: theme.accent }
    });
    slide.addText(f.icon, {
      x: x + 0.12, y: y + 0.12, w: 0.4, h: 0.4,
      fontSize: 14, fontFace: "Arial",
      align: "center", valign: "middle"
    });

    // 标题
    slide.addText(f.title, {
      x: x + 0.6, y: y + 0.1, w: 1.5, h: 0.3,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "left", valign: "middle"
    });

    // 描述
    slide.addText(f.desc, {
      x: x + 0.12, y: y + 0.55, w: 1.95, h: 0.45,
      fontSize: 8, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "left", valign: "top"
    });
  });

  // 底部：从工具到情感的进化
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 4.1, w: 4.6, h: 1.0,
    fill: { color: theme.primary },
    rectRadius: 0.08
  });
  slide.addText("从「清理工具」到「情感容器」", {
    x: 5.3, y: 4.15, w: 4.4, h: 0.35,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: theme.accent, bold: true, align: "center", valign: "middle"
  });
  slide.addText("MVP 解决「删什么」 → 手账本解决「留什么值得」\n整理不再是负担，而是创作回忆的过程", {
    x: 5.3, y: 4.5, w: 4.4, h: 0.55,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: "FFFFFF", align: "center", valign: "middle"
  });

  // 左下底部强调
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.35, w: 4.5, h: 0.0,
    fill: { color: theme.accent }
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("8", {
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
  pres.writeFile({ fileName: "slide-07-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
