// slide-02.js - Problem 痛点
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  index: 2,
  title: '相册臃肿，三大痛点'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // 顶部标题
  slide.addText("你的相册，正在悄悄崩溃", {
    x: 0.5, y: 0.4, w: 9, h: 0.7,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true, align: "left"
  });

  // 橙色装饰线
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.15, w: 0.6, h: 0.05,
    fill: { color: theme.accent }
  });

  // 三个痛点卡片
  const pains = [
    {
      icon: "💾",
      title: "存储告急",
      desc: "重复、低质、无用图片\n占据宝贵空间",
      stat: "平均占用\n30%+"
    },
    {
      icon: "🔍",
      title: "整理无门",
      desc: "纯时间线铺排\n缺乏语义分组\n找不到值得保留的内容",
      stat: "整理放弃率\n78%"
    },
    {
      icon: "😩",
      title: "决策疲劳",
      desc: "逐张判断删除与否\n操作繁琐\n容易中途放弃",
      stat: "单次平均\n< 20 张"
    }
  ];

  pains.forEach((pain, i) => {
    const x = 0.5 + i * 3.13;

    // 卡片背景
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.5, w: 2.93, h: 3.5,
      fill: { color: "FFFFFF" },
      line: { color: theme.light, width: 1 },
      rectRadius: 0.12
    });

    // 顶部图标圆形
    slide.addShape(pres.shapes.OVAL, {
      x: x + 1.06, y: 1.75, w: 0.8, h: 0.8,
      fill: { color: theme.primary }
    });
    slide.addText(pain.icon, {
      x: x + 1.06, y: 1.75, w: 0.8, h: 0.8,
      fontSize: 28, fontFace: "Arial",
      color: "FFFFFF", align: "center", valign: "middle"
    });

    // 标题
    slide.addText(pain.title, {
      x: x + 0.2, y: 2.7, w: 2.53, h: 0.45,
      fontSize: 20, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center"
    });

    // 描述
    slide.addText(pain.desc, {
      x: x + 0.2, y: 3.2, w: 2.53, h: 1.0,
      fontSize: 13, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center", valign: "top"
    });

    // 统计数据高亮
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.3, y: 4.3, w: 2.33, h: 0.55,
      fill: { color: theme.accent },
      rectRadius: 0.08
    });
    slide.addText(pain.stat, {
      x: x + 0.3, y: 4.3, w: 2.33, h: 0.55,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true, align: "center", valign: "middle"
    });
  });

  // 页码
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("2", {
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
  pres.writeFile({ fileName: "slide-02-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
