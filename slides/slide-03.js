// slide-03.js - 竞品全景对比矩阵
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 3,
  title: '竞品全景对比'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 标题
  slide.addText("竞品全景对比 · 市场空白清晰可见", {
    x: 0.5, y: 0.35, w: 9, h: 0.55,
    fontSize: 26, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.92, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 上半部分：5个竞品卡片
  const competitors = [
    {
      name: "腾讯相册管家",
      tag: "存储分析型",
      pros: "存储分析全面",
      cons: "广告多 · 手势弱",
      color: "8D99AE"
    },
    {
      name: "Slidebox",
      tag: "手势操作型",
      pros: "划卡体验好",
      cons: "无分组 · 无中文",
      color: "219ebc"
    },
    {
      name: "Google Photos",
      tag: "AI 智能型",
      pros: "AI 分组强",
      cons: "无快速清理",
      color: "2A9D8F"
    },
    {
      name: "系统相册",
      tag: "系统自带型",
      pros: "零门槛集成",
      cons: "纯时间线 · 无分组",
      color: "E76F51"
    },
    {
      name: "OneTake",
      tag: "我们的方案",
      pros: "分组+手势+精选集",
      cons: "MVP 阶段",
      color: "fb8500"
    }
  ];

  competitors.forEach((comp, i) => {
    const x = 0.5 + i * 1.84;
    const isOurs = i === 4;

    // 卡片背景
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.1, w: 1.74, h: 1.35,
      fill: { color: isOurs ? comp.color : "FFFFFF" },
      line: { color: comp.color, width: isOurs ? 0 : 1.5 },
      rectRadius: 0.1
    });

    // 名称
    slide.addText(comp.name, {
      x: x + 0.05, y: 1.15, w: 1.64, h: 0.35,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: isOurs ? "FFFFFF" : theme.primary,
      bold: true, align: "center", valign: "middle"
    });

    // 标签
    slide.addText(comp.tag, {
      x: x + 0.05, y: 1.48, w: 1.64, h: 0.25,
      fontSize: 8, fontFace: "Microsoft YaHei",
      color: isOurs ? "FFFFFF" : comp.color,
      align: "center", valign: "middle"
    });

    // 优势
    slide.addText("✓ " + comp.pros, {
      x: x + 0.08, y: 1.75, w: 1.58, h: 0.3,
      fontSize: 9, fontFace: "Microsoft YaHei",
      color: isOurs ? "FFFFFF" : "2A9D8F",
      align: "left", valign: "middle"
    });

    // 不足
    slide.addText("✗ " + comp.cons, {
      x: x + 0.08, y: 2.05, w: 1.58, h: 0.3,
      fontSize: 9, fontFace: "Microsoft YaHei",
      color: isOurs ? "FFFFFF" : "D90429",
      align: "left", valign: "middle"
    });
  });

  // 下半部分：功能对比矩阵表
  slide.addText("功能对比矩阵", {
    x: 0.5, y: 2.55, w: 4, h: 0.35,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  // 表头行
  const headerRow = [
    { text: "能力维度", options: { fill: { color: theme.primary }, color: "FFFFFF", bold: true, fontSize: 10, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
    { text: "腾讯相册管家", options: { fill: { color: theme.primary }, color: "FFFFFF", bold: true, fontSize: 9, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
    { text: "Slidebox", options: { fill: { color: theme.primary }, color: "FFFFFF", bold: true, fontSize: 9, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
    { text: "Google Photos", options: { fill: { color: theme.primary }, color: "FFFFFF", bold: true, fontSize: 9, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
    { text: "系统相册", options: { fill: { color: theme.primary }, color: "FFFFFF", bold: true, fontSize: 9, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } },
    { text: "OneTake", options: { fill: { color: theme.accent }, color: "FFFFFF", bold: true, fontSize: 10, fontFace: "Microsoft YaHei", align: "center", valign: "middle" } }
  ];

  // 数据行
  const dimLabels = ["基础分组", "手势决策", "应用内精选集", "快速清理流程", "中文本地化", "隐私本地化"];
  // ✗=无 ✓=有 ✓✓=强
  const matrix = [
    ["✓", "✗", "✓✓", "✗", "✓"],      // 基础分组
    ["✗", "✓", "✗", "✗", "✓"],        // 手势决策
    ["✗", "✗", "✗", "✗", "✓"],        // 应用内精选集
    ["✓", "✓", "✗", "✗", "✓"],        // 快速清理流程
    ["✓", "✗", "✓", "✓", "✓"],        // 中文本地化
    ["✗", "✓", "✗", "✓", "✓"]         // 隐私本地化
  ];

  const dataRows = dimLabels.map((label, rowIdx) => {
    const row = [
      { text: label, options: { fill: { color: "EDF2F4" }, color: theme.primary, bold: true, fontSize: 10, fontFace: "Microsoft YaHei", align: "left", valign: "middle" } }
    ];
    matrix[rowIdx].forEach((val, colIdx) => {
      const isOurs = colIdx === 4;
      let color = "8D99AE";
      if (val === "✓") color = "2A9D8F";
      if (val === "✓✓") color = "2A9D8F";
      if (val === "✗") color = "D90429";
      row.push({
        text: val,
        options: {
          fill: { color: isOurs ? "FFF3E0" : "FFFFFF" },
          color: color,
          bold: true,
          fontSize: 13,
          fontFace: "Arial",
          align: "center",
          valign: "middle"
        }
      });
    });
    return row;
  });

  const allRows = [headerRow, ...dataRows];

  slide.addTable(allRows, {
    x: 0.5, y: 2.9, w: 9.2,
    colW: [1.8, 1.48, 1.48, 1.48, 1.48, 1.48],
    rowH: 0.32,
    border: { type: "solid", color: "D4D4D4", pt: 1 }
  });

  // 底部结论条
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.0, w: 9.2, h: 0.5,
    fill: { color: theme.accent },
    rectRadius: 0.08
  });
  slide.addText("市场空白：基础分组 + 手势决策 + 应用内精选集，三者合一，尚无产品覆盖", {
    x: 0.5, y: 5.0, w: 9.2, h: 0.5,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("3", {
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
  pres.writeFile({ fileName: "slide-03-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
