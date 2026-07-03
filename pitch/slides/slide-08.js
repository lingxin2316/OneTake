// slide-08.js - 技术亮点
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 8,
  title: '技术亮点'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // 标题
  slide.addText("技术亮点 · 隐私优先，性能至上", {
    x: 0.5, y: 0.4, w: 9, h: 0.7,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 四个技术亮点卡片
  const techs = [
    {
      icon: "🔒",
      title: "完全本地运行",
      desc: "不申请网络权限\n零数据上传\n隐私安全有保障",
      tag: "MVP 核心"
    },
    {
      icon: "⚡",
      title: "Jetpack Compose",
      desc: "声明式 UI\n手势 / 动画状态驱动\n60fps 流畅体验",
      tag: "现代架构"
    },
    {
      icon: "🗄️",
      title: "MediaStore + Room",
      desc: "系统回收站机制\n本地数据库管理\n撤回链路完整",
      tag: "原生能力"
    },
    {
      icon: "🎨",
      title: "MVVM + Repository",
      desc: "ViewModel 会话管理\nRepository 封装媒体\n架构清晰可维护",
      tag: "工程规范"
    }
  ];

  techs.forEach((tech, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.7;
    const y = 1.5 + row * 1.85;

    // 卡片背景
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 4.5, h: 1.7,
      fill: { color: "FFFFFF" },
      rectRadius: 0.12
    });

    // 左侧图标区
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.15, y: y + 0.15, w: 1.2, h: 1.4,
      fill: { color: theme.primary },
      rectRadius: 0.08
    });
    slide.addText(tech.icon, {
      x: x + 0.15, y: y + 0.15, w: 1.2, h: 1.4,
      fontSize: 36, fontFace: "Arial",
      color: "FFFFFF", align: "center", valign: "middle"
    });

    // 标题
    slide.addText(tech.title, {
      x: x + 1.5, y: y + 0.2, w: 2.0, h: 0.4,
      fontSize: 16, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "left", valign: "middle"
    });

    // 描述
    slide.addText(tech.desc, {
      x: x + 1.5, y: y + 0.6, w: 2.0, h: 0.7,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "left", valign: "top"
    });

    // 标签
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 1.5, y: y + 1.3, w: 1.4, h: 0.3,
      fill: { color: theme.accent },
      rectRadius: 0.06
    });
    slide.addText(tech.tag, {
      x: x + 1.5, y: y + 1.3, w: 1.4, h: 0.3,
      fontSize: 9, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true, align: "center", valign: "middle"
    });
  });

  // 底部技术栈版本
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.1, w: 9.2, h: 0.4,
    fill: { color: theme.accent },
    rectRadius: 0.06
  });
  slide.addText("Kotlin 2.0.21  ·  AGP 8.13.0  ·  Gradle 8.13  ·  compileSdk 35  ·  Compose BOM 2024.12.01  ·  JDK 17", {
    x: 0.5, y: 5.1, w: 9.2, h: 0.4,
    fontSize: 10, fontFace: "Arial",
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
  pres.writeFile({ fileName: "slide-08-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
