// slide-09.js - 路线图 + Demo 状态
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 9,
  title: '路线图与当前进度'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 标题
  slide.addText("路线图 · 已跑通 MVP", {
    x: 0.5, y: 0.4, w: 9, h: 0.7,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 顶部：当前状态条
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.4, w: 9.2, h: 0.65,
    fill: { color: "2A9D8F" },
    rectRadius: 0.1
  });
  slide.addText("✅  MVP 已构建成功  ·  Debug APK 16MB  ·  前端原型可访问  ·  typecheck/build 全通过", {
    x: 0.5, y: 1.4, w: 9.2, h: 0.65,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 时间线
  const milestones = [
    {
      version: "V1.0 MVP",
      time: "已交付",
      status: "done",
      items: [
        "基础分组（时间/类型/来源）",
        "四向手势决策",
        "删除到系统回收站 + 撤回",
        "应用内精选集",
        "暂存栏 + 统计面板",
        "浅色/深色主题"
      ]
    },
    {
      version: "V1.5",
      time: "Q3 2026",
      status: "next",
      items: [
        "AI 事件识别 + 场景聚类",
        "人脸聚类（ML Kit）",
        "pHash 重复检测 + 对比",
        "6 套主题 + 整理报告"
      ]
    },
    {
      version: "V2.0",
      time: "Q4 2026",
      status: "future",
      items: [
        "OCR 截图文字检索",
        "照片压缩",
        "智能推荐动作",
        "跨相册/备份状态识别"
      ]
    }
  ];

  milestones.forEach((m, i) => {
    const x = 0.5 + i * 3.13;
    const statusColor = m.status === "done" ? "2A9D8F" : (m.status === "next" ? theme.accent : theme.secondary);

    // 卡片背景
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.25, w: 2.93, h: 2.7,
      fill: { color: "FFFFFF" },
      line: { color: statusColor, width: 2 },
      rectRadius: 0.12
    });

    // 顶部色条
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.25, w: 2.93, h: 0.55,
      fill: { color: statusColor },
      rectRadius: 0.12
    });
    // 遮住底部圆角
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 2.55, w: 2.93, h: 0.25,
      fill: { color: statusColor }
    });

    // 版本号
    slide.addText(m.version, {
      x: x + 0.1, y: 2.3, w: 2.0, h: 0.45,
      fontSize: 16, fontFace: "Arial",
      color: "FFFFFF", bold: true, align: "left", valign: "middle"
    });

    // 时间
    slide.addText(m.time, {
      x: x + 1.8, y: 2.3, w: 1.05, h: 0.45,
      fontSize: 10, fontFace: "Arial",
      color: "FFFFFF", align: "right", valign: "middle"
    });

    // 功能列表
    const itemsText = m.items.map(item => "• " + item).join("\n");
    slide.addText(itemsText, {
      x: x + 0.2, y: 2.95, w: 2.55, h: 1.9,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.primary, align: "left", valign: "top", lineSpacing: 18
    });
  });

  // 底部 KPI 目标
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.1, w: 9.2, h: 0.4,
    fill: { color: theme.primary },
    rectRadius: 0.06
  });
  slide.addText("成功指标  ·  7日留存 ≥ 40%  ·  单次清理 ≥ 50 张  ·  释放空间 ≥ 200MB  ·  崩溃率 ≤ 0.1%", {
    x: 0.5, y: 5.1, w: 9.2, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("11", {
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
  pres.writeFile({ fileName: "slide-09-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
