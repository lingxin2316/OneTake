// slide-04.js - Solution 解决方案
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 4,
  title: 'OneTake 解决方案'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // 大标题
  slide.addText("OneTake", {
    x: 0.5, y: 0.5, w: 9, h: 0.9,
    fontSize: 56, fontFace: "Arial",
    color: "FFFFFF", bold: true, align: "center"
  });

  // 橙色装饰线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.6, y: 1.45, w: 0.8, h: 0.06,
    fill: { color: theme.accent }
  });

  slide.addText("像刷短视频一样，刷走相册里的废片", {
    x: 0.5, y: 1.55, w: 9, h: 0.6,
    fontSize: 22, fontFace: "Microsoft YaHei",
    color: theme.light, align: "center"
  });

  // 核心理念三步流程
  const steps = [
    {
      num: "01",
      title: "智能分组",
      desc: "自动按时间 / 类型 / 来源\n生成大分类与小组",
      color: theme.secondary
    },
    {
      num: "02",
      title: "卡片决策",
      desc: "四向手势快速判断\n删除 / 精选 / 跳过",
      color: theme.accent
    },
    {
      num: "03",
      title: "释放空间",
      desc: "实时清理 + 成就反馈\n相册瞬间清爽",
      color: theme.light
    }
  ];

  steps.forEach((step, i) => {
    const x = 0.7 + i * 3.1;

    // 卡片
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 2.5, w: 2.7, h: 2.3,
      fill: { color: "FFFFFF" },
      rectRadius: 0.15
    });

    // 编号圆
    slide.addShape(pres.shapes.OVAL, {
      x: x + 1.0, y: 2.7, w: 0.7, h: 0.7,
      fill: { color: step.color }
    });
    slide.addText(step.num, {
      x: x + 1.0, y: 2.7, w: 0.7, h: 0.7,
      fontSize: 20, fontFace: "Arial",
      color: "FFFFFF", bold: true, align: "center", valign: "middle"
    });

    // 标题
    slide.addText(step.title, {
      x: x + 0.2, y: 3.5, w: 2.3, h: 0.45,
      fontSize: 20, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center"
    });

    // 描述
    slide.addText(step.desc, {
      x: x + 0.2, y: 3.95, w: 2.3, h: 0.8,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center", valign: "top"
    });

    // 箭头连接（除最后一个）
    if (i < 2) {
      slide.addText("→", {
        x: x + 2.7, y: 3.4, w: 0.4, h: 0.6,
        fontSize: 28, fontFace: "Arial",
        color: theme.accent, bold: true, align: "center", valign: "middle"
      });
    }
  });

  // 底部 slogan
  slide.addText("轻松决策，快速行动", {
    x: 0.5, y: 5.0, w: 9, h: 0.4,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: theme.accent, bold: true, align: "center"
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("5", {
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
  pres.writeFile({ fileName: "slide-04-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
