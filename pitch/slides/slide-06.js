// slide-06.js - 核心功能2：智能分组
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 6,
  title: '核心功能：智能分组'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 标题
  slide.addText("核心功能 ②  智能分组，化繁为简", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 核心目的横幅：目标轻量化
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.1, w: 9.2, h: 0.5,
    fill: { color: theme.primary },
    rectRadius: 0.08
  });
  slide.addText("🎯 核心目的：目标轻量化 — 把「5000 张相册」拆成「20 个小组」，避免看到庞大相册就不想整理", {
    x: 0.5, y: 1.1, w: 9.2, h: 0.5,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 左侧：分组层级结构图
  slide.addText("分组层级结构", {
    x: 0.5, y: 1.75, w: 4.5, h: 0.35,
    fontSize: 15, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  // 大分类层
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 2.2, w: 2.2, h: 0.55,
    fill: { color: theme.primary },
    rectRadius: 0.08
  });
  slide.addText("大分类", {
    x: 0.8, y: 2.2, w: 2.2, h: 0.55,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });
  slide.addText("语义主题层", {
    x: 3.1, y: 2.2, w: 1.6, h: 0.55,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: theme.secondary, align: "left", valign: "middle"
  });

  // 连接线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 1.85, y: 2.75, w: 0.04, h: 0.25,
    fill: { color: theme.secondary }
  });

  // 小组层
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.0, w: 2.2, h: 0.55,
    fill: { color: theme.secondary },
    rectRadius: 0.08
  });
  slide.addText("小组", {
    x: 0.8, y: 3.0, w: 2.2, h: 0.55,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });
  slide.addText("时间+场景聚合", {
    x: 3.1, y: 3.0, w: 1.6, h: 0.55,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: theme.secondary, align: "left", valign: "middle"
  });

  // 连接线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 1.85, y: 3.55, w: 0.04, h: 0.25,
    fill: { color: theme.secondary }
  });

  // 照片层
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.8, w: 2.2, h: 0.55,
    fill: { color: theme.accent },
    rectRadius: 0.08
  });
  slide.addText("单张照片", {
    x: 0.8, y: 3.8, w: 2.2, h: 0.55,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });
  slide.addText("决策粒度", {
    x: 3.1, y: 3.8, w: 1.6, h: 0.55,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: theme.secondary, align: "left", valign: "middle"
  });

  // 心理学原理说明
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.5, w: 4.5, h: 0.85,
    fill: { color: theme.light },
    rectRadius: 0.08
  });
  slide.addText("💡 心理学原理：小目标效应\n5000 张 → 20 组 × 每组 250 张\n每完成一组即获成就感，降低放弃率", {
    x: 0.7, y: 4.55, w: 4.1, h: 0.75,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: theme.primary, align: "left", valign: "middle"
  });

  // 右侧：MVP 分组维度
  slide.addText("MVP 分组维度", {
    x: 5.3, y: 1.75, w: 4.5, h: 0.35,
    fontSize: 15, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  const dimensions = [
    {
      icon: "📅",
      title: "按时间分组",
      desc: "同日期 / 相邻时间段聚合"
    },
    {
      icon: "📄",
      title: "按文件类型分组",
      desc: "照片 / 视频 / 截图 分类"
    },
    {
      icon: "📂",
      title: "按来源分组",
      desc: "相机拍摄 / 截图 / 下载图片"
    }
  ];

  dimensions.forEach((dim, i) => {
    const y = 2.2 + i * 0.8;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.3, y: y, w: 4.4, h: 0.7,
      fill: { color: "FFFFFF" },
      line: { color: theme.light, width: 1 },
      rectRadius: 0.08
    });

    // 图标
    slide.addShape(pres.shapes.OVAL, {
      x: 5.5, y: y + 0.12, w: 0.46, h: 0.46,
      fill: { color: theme.primary }
    });
    slide.addText(dim.icon, {
      x: 5.5, y: y + 0.12, w: 0.46, h: 0.46,
      fontSize: 14, fontFace: "Arial",
      align: "center", valign: "middle"
    });

    // 标题
    slide.addText(dim.title, {
      x: 6.1, y: y + 0.08, w: 3.4, h: 0.3,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "left", valign: "middle"
    });

    // 描述
    slide.addText(dim.desc, {
      x: 6.1, y: y + 0.38, w: 3.4, h: 0.28,
      fontSize: 9, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "left", valign: "middle"
    });
  });

  // V1.5 AI 预告
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.3, y: 4.5, w: 4.4, h: 0.85,
    fill: { color: theme.accent },
    rectRadius: 0.08
  });
  slide.addText("V1.5 预告\nAI 事件识别 + 场景/人脸聚类\n+ pHash 重复检测 + 两两对比", {
    x: 5.4, y: 4.55, w: 4.2, h: 0.75,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("7", {
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
  pres.writeFile({ fileName: "slide-06-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
