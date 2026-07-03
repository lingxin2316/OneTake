// slide-03b.js - 目标用户
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 4,
  title: '目标用户'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 标题
  slide.addText("谁需要 OneTake？", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 28, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.95, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 三个用户画像卡片
  const users = [
    {
      emoji: "🎓",
      name: "学生群体",
      age: "18-25 岁",
      pain: "毕业照、聚会、旅行\n截图量巨大",
      need: "找不到重要纪念照",
      goal: "快速整理 + 主题归档"
    },
    {
      emoji: "💼",
      name: "职场人士",
      age: "25-35 岁",
      pain: "工作截图、文档扫描\n生活记录混杂",
      need: "工作生活无法分离",
      goal: "按场景分类清理"
    },
    {
      emoji: "👨‍👩‍👧",
      name: "家庭用户",
      age: "30-45 岁",
      pain: "孩子成长照海量累积\n存储频繁告急",
      need: "不知道哪些可以删",
      goal: "释放空间 + 保留回忆"
    }
  ];

  users.forEach((user, i) => {
    const x = 0.5 + i * 3.13;

    // 卡片背景
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.25, w: 2.93, h: 3.2,
      fill: { color: "FFFFFF" },
      line: { color: theme.light, width: 1 },
      rectRadius: 0.12
    });

    // 顶部色条
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.25, w: 2.93, h: 0.7,
      fill: { color: theme.primary },
      rectRadius: 0.12
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.6, w: 2.93, h: 0.35,
      fill: { color: theme.primary }
    });

    // Emoji 图标
    slide.addText(user.emoji, {
      x: x + 0.2, y: 1.3, w: 0.7, h: 0.6,
      fontSize: 28, fontFace: "Arial",
      align: "center", valign: "middle"
    });

    // 名称
    slide.addText(user.name, {
      x: x + 0.9, y: 1.3, w: 1.8, h: 0.35,
      fontSize: 16, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true, align: "left", valign: "middle"
    });

    // 年龄
    slide.addText(user.age, {
      x: x + 0.9, y: 1.62, w: 1.8, h: 0.3,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.light, align: "left", valign: "middle"
    });

    // 痛点
    slide.addText("痛点", {
      x: x + 0.2, y: 2.1, w: 2.53, h: 0.25,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.accent, bold: true, align: "left"
    });
    slide.addText(user.pain, {
      x: x + 0.2, y: 2.35, w: 2.53, h: 0.6,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "left", valign: "top"
    });

    // 需求
    slide.addText("需求", {
      x: x + 0.2, y: 3.0, w: 2.53, h: 0.25,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.accent, bold: true, align: "left"
    });
    slide.addText(user.need, {
      x: x + 0.2, y: 3.25, w: 2.53, h: 0.35,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "left", valign: "top"
    });

    // 目标
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: 3.75, w: 2.53, h: 0.55,
      fill: { color: theme.light },
      rectRadius: 0.08
    });
    slide.addText("🎯 " + user.goal, {
      x: x + 0.25, y: 3.75, w: 2.43, h: 0.55,
      fontSize: 10, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center", valign: "middle"
    });
  });

  // 底部用户目标总结
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 4.65, w: 9.2, h: 0.55,
    fill: { color: theme.accent },
    rectRadius: 0.08
  });
  slide.addText("首要目标：释放空间  ·  次要目标：整理回忆  ·  体验目标：轻松有成就感", {
    x: 0.5, y: 4.65, w: 9.2, h: 0.55,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("4", {
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
  pres.writeFile({ fileName: "slide-03b-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
