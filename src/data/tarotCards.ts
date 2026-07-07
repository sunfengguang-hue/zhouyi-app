import type { TarotCard, TarotDraw } from '../types';

// 22张大阿尔卡纳（增强版：含元素、星体关联）
export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: '愚者', nameEn: 'The Fool', suit: 'major', number: 0,
    upright: '新的开始、自由、冒险精神、纯真无畏、信仰的飞跃',
    reversed: '鲁莽、不计后果、迷失方向、需要谨慎、天真过头',
    keywords: ['新开始', '自由', '冒险'],
    description: '背着行囊的旅人，站在悬崖边仰望天空，脚下是万丈深渊却浑然不惧。白色玫瑰象征纯真，小狗代表本能的守护。这张牌呼唤你放下恐惧，拥抱未知的旅程。',
    element: '风', planet: '天王星' },
  { id: 1, name: '魔术师', nameEn: 'The Magician', suit: 'major', number: 1,
    upright: '创造力、意志力、技能运用、自信、化无为有',
    reversed: '欺骗、操控、才华浪费、缺乏自信、花招把戏',
    keywords: ['创造', '才能', '意志'],
    description: '一手指天一手指地，桌上摆满权杖、圣杯、宝剑、星币四元素。头顶无限符号象征无穷潜能，他拥有将意念化为现实的一切工具，关键在于是否愿意行动。',
    element: '风', planet: '水星' },
  { id: 2, name: '女祭司', nameEn: 'The High Priestess', suit: 'major', number: 2,
    upright: '直觉、潜意识、内在智慧、神秘、静待时机',
    reversed: '隐瞒、表面化、忽视直觉、秘密揭露、内心不安',
    keywords: ['直觉', '智慧', '神秘'],
    description: '端坐在黑白双柱之间的女祭司，手持半遮的托拉卷轴，帷幕后是无尽的水域。她守护着意识的门槛，提醒你有些答案只能在静默中听见。',
    element: '水', planet: '月亮' },
  { id: 3, name: '女皇', nameEn: 'The Empress', suit: 'major', number: 3,
    upright: '丰饶、母性、自然之美、感官享受、滋养万物',
    reversed: '依赖、创造力受阻、忽视自我、过度放纵、情感枯竭',
    keywords: ['丰饶', '母性', '自然'],
    description: '坐在繁花环绕的花园中，身披麦穗纹样的华袍，头戴十二星冠。脚下溪水潺潺，身后林木葱郁——她是大地母亲的化身，万物在她的滋养下蓬勃生长。',
    element: '土', planet: '金星' },
  { id: 4, name: '皇帝', nameEn: 'The Emperor', suit: 'major', number: 4,
    upright: '权威、结构、稳定、领导力、纪律、父亲形象',
    reversed: '独裁、僵化、缺乏纪律、权力滥用、控制欲过强',
    keywords: ['权威', '稳定', '纪律'],
    description: '身披红袍的帝王坐在雕刻着公羊头的石质宝座上，背景是荒凉的山脉。他手持权杖与圣球，代表以秩序和意志统御天下的决心。',
    element: '火', planet: '白羊' },
  { id: 5, name: '教皇', nameEn: 'The Hierophant', suit: 'major', number: 5,
    upright: '传统、信仰、教育、精神引导、遵循规范、师徒传承',
    reversed: '打破常规、挑战权威、教条主义、非传统、自我探索',
    keywords: ['传统', '信仰', '引导'],
    description: '身着祭袍的教皇端坐于两根灰色石柱之间，头戴三重冠冕，手持三重十字权杖。脚边两名信徒虔诚跪拜，象征传统智慧的传承与精神秩序的守护。',
    element: '土', planet: '金牛' },
  { id: 6, name: '恋人', nameEn: 'The Lovers', suit: 'major', number: 6,
    upright: '爱情、和谐、选择、价值观一致、深层连结、灵魂契合',
    reversed: '不和谐、失衡、价值观冲突、选择困难、关系破裂',
    keywords: ['爱情', '选择', '和谐'],
    description: '伊甸园中，一对男女在天使拉斐尔的祝福下彼此凝视。男子望向女子，女子望向天使——这不仅是爱情的象征，更是一场关于价值观和人生方向的深刻抉择。',
    element: '风', planet: '双子' },
  { id: 7, name: '战车', nameEn: 'The Chariot', suit: 'major', number: 7,
    upright: '胜利、意志力、决心、控制、前进、凯旋而归',
    reversed: '失控、缺乏方向、侵略性、内在冲突、力不从心',
    keywords: ['胜利', '意志', '前进'],
    description: '身披甲胄的驭者驾驶战车，驾驭一黑一白两只狮身人面兽。头顶星冠，肩有月牙，战车上绘有翅膀的太阳——他以纯粹的意志力驾驭对立的力量，向目标全速前进。',
    element: '水', planet: '巨蟹' },
  { id: 8, name: '力量', nameEn: 'Strength', suit: 'major', number: 8,
    upright: '内在力量、勇气、耐心、温柔的控制、自信、以柔克刚',
    reversed: '自我怀疑、软弱、缺乏自信、粗暴、情绪失控',
    keywords: ['勇气', '内在力量', '温柔'],
    description: '一位白衣女子从容地抚摸雄狮的鬃毛，头顶浮现无限符号。她没有用蛮力，而是以温柔和坚定的耐心驯服了野兽——象征真正的力量来自内心的平静与勇气。',
    element: '火', planet: '狮子' },
  { id: 9, name: '隐者', nameEn: 'The Hermit', suit: 'major', number: 9,
    upright: '内省、独处、智慧、寻找真理、精神指引、导师',
    reversed: '孤立、孤独、逃避、过度封闭、拒绝帮助',
    keywords: ['内省', '独处', '智慧'],
    description: '灰袍老者独行于雪山之巅，一手持杖，一手高举六芒星灯笼。灯光只能照亮脚下数步——智慧之路从来孤独，但每一盏灯都是给后来者的指引。',
    element: '土', planet: '处女' },
  { id: 10, name: '命运之轮', nameEn: 'Wheel of Fortune', suit: 'major', number: 10,
    upright: '命运转变、好运降临、因果循环、机遇、时来运转',
    reversed: '厄运、抗拒改变、运气不佳、失控、时机未到',
    keywords: ['命运', '转变', '机遇'],
    description: '巨大的轮盘上刻有TORA与YHVH字样，阿努比斯在下降端，斯芬克斯持剑守于顶端，四角的四神兽静静观看。命运之轮永不停歇，唯一不变的就是变化本身。',
    element: '火', planet: '木星' },
  { id: 11, name: '正义', nameEn: 'Justice', suit: 'major', number: 11,
    upright: '公正、真相、因果报应、平衡、法律、理性裁决',
    reversed: '不公正、逃避责任、不诚实、偏见、因果失衡',
    keywords: ['公正', '因果', '平衡'],
    description: '正义女神端坐于两根灰色柱子之间，右手持天平，左手握宝剑。她的目光直视前方，不偏不倚——每一个选择都有后果，每一笔账都将被清算。',
    element: '风', planet: '天秤' },
  { id: 12, name: '倒吊人', nameEn: 'The Hanged Man', suit: 'major', number: 12,
    upright: '换个视角、暂停、牺牲、等待、放下执着、顿悟',
    reversed: '拖延、无谓的牺牲、抗拒、停滞不前、白费力气',
    keywords: ['暂停', '换视角', '放下'],
    description: '年轻人一只脚倒挂于T形木架上，另一只脚交叉成数字4的形状。面容安详且头顶散发金色光环——这不是惩罚，而是自愿的倒悬，从颠倒中看见全新的世界。',
    element: '水', planet: '海王' },
  { id: 13, name: '死神', nameEn: 'Death', suit: 'major', number: 13,
    upright: '结束与新生、转变、告别旧事物、重大改变、涅槃重生',
    reversed: '抗拒改变、停滞、无法放下、恐惧变化、苟延残喘',
    keywords: ['转变', '结束', '新生'],
    description: '骑着白马的骷髅骑士手持黑旗，旗帜上绣着白色玫瑰。国王倒下，孩童献花，僧侣祈祷——死神面前众生平等。但死亡不是终点，旧事物凋零之处，新生命正在萌芽。',
    element: '水', planet: '天蝎' },
  { id: 14, name: '节制', nameEn: 'Temperance', suit: 'major', number: 14,
    upright: '平衡、调和、中庸之道、耐心、和谐、炼金术',
    reversed: '失衡、过度、缺乏耐心、不协调、极端',
    keywords: ['平衡', '调和', '中庸'],
    description: '天使米迦勒单足立于水中岩石上，将水在两只金杯间优雅地来回倾倒。身后小路通向远方两座山峰之间的金色冠冕——平衡的艺术是通往最高境界的修行之道。',
    element: '火', planet: '射手' },
  { id: 15, name: '恶魔', nameEn: 'The Devil', suit: 'major', number: 15,
    upright: '束缚、欲望、执着、物质诱惑、阴暗面、成瘾',
    reversed: '解脱、打破束缚、面对阴暗面、重获自由、觉醒',
    keywords: ['束缚', '欲望', '解脱'],
    description: '巨大的巴风特端坐于黑色方碑之上，一男一女被锁链拴在碑座上。仔细看——锁链松松地套在脖子上，他们随时可以离开，却浑然不觉自己其实是自由的。',
    element: '土', planet: '摩羯' },
  { id: 16, name: '塔', nameEn: 'The Tower', suit: 'major', number: 16,
    upright: '突变、崩塌、觉醒、打破旧结构、震撼、真相揭露',
    reversed: '逃避灾难、恐惧改变、延迟崩塌、内在转变、侥幸',
    keywords: ['突变', '崩塌', '觉醒'],
    description: '一道闪电劈中王冠，高塔瞬间起火。两个人从塔顶坠落，火焰与碎片四散——这是命运最猛烈的干预，摧毁一切虚假的结构，为真正的重建腾出空间。',
    element: '火', planet: '火星' },
  { id: 17, name: '星星', nameEn: 'The Star', suit: 'major', number: 17,
    upright: '希望、灵感、宁静、信念、精神疗愈、星光指引',
    reversed: '失去希望、缺乏信心、灰心丧气、与灵感断开、迷失',
    keywords: ['希望', '灵感', '疗愈'],
    description: '暴风雨过后，夜空清朗。一位裸身女子跪在池塘边，将生命之水同时倾注于大地与河流。头顶八颗星星闪耀——在经历了塔的毁灭后，希望之光终于重新降临。',
    element: '风', planet: '水瓶' },
  { id: 18, name: '月亮', nameEn: 'The Moon', suit: 'major', number: 18,
    upright: '幻觉、恐惧、潜意识、不安、直觉、梦境指引',
    reversed: '走出迷雾、真相大白、克服恐惧、理性回归、清明',
    keywords: ['直觉', '恐惧', '幻觉'],
    description: '苍白的满月悬挂在夜空中，两条小径从水中延伸向远方的双塔。一只龙虾爬出水面，两只犬对月嚎叫——月光下万物变形，真实与幻象的界限模糊不清。',
    element: '水', planet: '双鱼' },
  { id: 19, name: '太阳', nameEn: 'The Sun', suit: 'major', number: 19,
    upright: '成功、活力、光明、快乐、自信、生命力、温暖',
    reversed: '暂时消沉、过度乐观、自负、能量不足、乌云遮日',
    keywords: ['成功', '光明', '快乐'],
    description: '灿烂的太阳放射出明亮的光芒与向日葵围绕的花环。一个天真的孩童骑着白马，张开双臂迎接阳光——这是整副牌中最纯粹的喜悦，一切阴霾都已散去。',
    element: '火', planet: '太阳' },
  { id: 20, name: '审判', nameEn: 'Judgement', suit: 'major', number: 20,
    upright: '重生、觉醒、召唤、自我评价、人生转折、灵魂升华',
    reversed: '自我怀疑、拒绝成长、逃避审视、错失机遇、执迷不悟',
    keywords: ['觉醒', '重生', '召唤'],
    description: '天使加百列在云端吹响金色号角，号角上挂着白色十字旗。坟墓打开，男人、女人和孩子从中起身，张开双臂迎接神圣的召唤——这是灵魂最终的觉醒与蜕变时刻。',
    element: '火', planet: '冥王' },
  { id: 21, name: '世界', nameEn: 'The World', suit: 'major', number: 21,
    upright: '完成、圆满、成就、旅程终点、整合、功德圆满',
    reversed: '未完成、缺乏收尾、停滞、寻求圆满、差一步到位',
    keywords: ['完成', '圆满', '成就'],
    description: '月桂花环围绕着翩翩起舞的身影，四角分别是天使、鹰、狮子和牛——四元素的守护者。紫色帷幕象征着通往下一段旅程的大门，而此刻，你已圆满完成了一个伟大的循环。',
    element: '土', planet: '土星' },
];

// 牌组位置
export const SPREAD_POSITIONS = {
  single: ['当前指引'],
  three: ['过去', '现在', '未来'],
};

// 元素颜色映射
export const ELEMENT_COLORS: Record<string, string> = {
  '火': '#e74c3c',
  '水': '#3498db',
  '风': '#9b59b6',
  '土': '#e67e22',
};

// 元素象征
export const ELEMENT_SYMBOLS: Record<string, string> = {
  '火': '🔥',
  '水': '💧',
  '风': '🌬️',
  '土': '🌍',
};

/**
 * 根据三张牌生成组合解读
 * 分析元素搭配、牌序走向、位置关系
 */
export function generateCombinationReading(draws: TarotDraw[]): string {
  if (draws.length < 3) return '';

  const [past, present, future] = draws;
  const cards = [past.card, present.card, future.card];
  const elements = cards.map(c => c.element);
  const numbers = cards.map(c => c.number);
  const orientations = draws.map(d => d.orientation);

  const paragraphs: string[] = [];

  // === 第一部分：元素能量分析 ===
  const elementCounts: Record<string, number> = {};
  for (const el of elements) {
    elementCounts[el] = (elementCounts[el] || 0) + 1;
  }
  const dominant = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0];
  const uniqueElements = [...new Set(elements)];

  if (dominant[1] >= 2) {
    // 有重复元素
    const domEl = dominant[0];
    const domCards = cards.filter(c => c.element === domEl);
    const elementDesc: Record<string, string> = {
      '火': '行动力、激情与变革的能量贯穿整个牌阵。',
      '水': '情感、直觉与潜意识的流动主导了这次占卜。',
      '风': '思维、沟通与理性的力量是当前的核心主题。',
      '土': '物质、稳定与实际层面的议题最为突出。',
    };
    paragraphs.push(
      `${elementDesc[domEl]}${domCards.map(c => c.name).join('与')}在${domEl}元素的共振下彼此呼应，` +
      `意味着你所询问的事情深受这股能量的影响。` +
      `${domEl === '火' ? '此时宜主动出击，以热情推动变化。' : domEl === '水' ? '此时宜倾听内心的声音，让感受引导方向。' : domEl === '风' ? '此时宜冷静分析，用清晰的思路做出判断。' : '此时宜脚踏实地，一步一个脚印地推进计划。'}`
    );
  } else if (uniqueElements.length === 3) {
    // 三种不同元素
    paragraphs.push(
      `三张牌分别属于${elements[0]}、${elements[1]}、${elements[2]}三种不同的元素，呈现出丰富而多元的能量交织。` +
      `从${past.card.name}的${elements[0]}之力，到${present.card.name}的${elements[1]}之能，再到${future.card.name}的${elements[2]}之象——` +
      `你的处境正经历着多维度的变化，需要从不同层面去理解和应对。`
    );
  } else {
    paragraphs.push(
      `三种元素交织出现，暗示着当前的情境需要你在不同面向之间寻找平衡。`
    );
  }

  // === 第二部分：牌序走向分析 ===
  const isAscending = numbers[0] < numbers[1] && numbers[1] < numbers[2];
  const isDescending = numbers[0] > numbers[1] && numbers[1] > numbers[2];
  const isPeak = numbers[1] > numbers[0] && numbers[1] > numbers[2];
  const isValley = numbers[1] < numbers[0] && numbers[1] < numbers[2];

  if (isAscending) {
    paragraphs.push(
      `牌序从小到大递进（${numbers.join('→')}），呈现出清晰的成长轨迹。` +
      `从${past.card.name}的青涩起点，经过${present.card.name}的发展积累，` +
      `走向${future.card.name}的更高阶段。这是一条向上的曲线，` +
      `说明你的问题正在朝着积极的方向演进，保持目前的步伐即可。`
    );
  } else if (isDescending) {
    paragraphs.push(
      `牌序从大到小回落（${numbers.join('→')}），暗示着一段内省与回归的旅程。` +
      `${past.card.name}代表曾经的成熟或高峰状态，而现在正走向更本质的层面。` +
      `这并非退步，而是灵魂在提醒你需要重新审视基础，` +
      `${future.card.name}所象征的课题正是你下一段成长的关键起点。`
    );
  } else if (isPeak) {
    paragraphs.push(
      `中间的${present.card.name}（${numbers[1]}）是牌序的最高点，` +
      `意味着你正处于这段旅程的关键转折处。过去${past.card.name}为你积累了基础，` +
      `而${present.card.name}是你当前需要全力把握的契机。` +
      `至于未来${future.card.name}，则提醒你在高峰之后需要沉淀与整合。`
    );
  } else if (isValley) {
    paragraphs.push(
      `中间的${present.card.name}（${numbers[1]}）是牌序的最低谷，` +
      `暗示当前可能是最艰难或最需要耐心的阶段。但不要气馁——` +
      `${past.card.name}的力量仍在支撑你，而${future.card.name}预示着低谷之后的回升。` +
      `挺过当下，转机就在前方。`
    );
  } else {
    paragraphs.push(
      `三张牌的序号（${numbers.join('、')}）呈现出曲折的路径，` +
      `如同人生的真实写照——并非一路平坦，而是在起伏中寻找方向。` +
      `${past.card.name}到${present.card.name}的变化提示你注意当下的转折点，` +
      `而${future.card.name}为你指出了前进的方向。`
    );
  }

  // === 第三部分：过去-现在-未来 叙事 ===
  const pastOrient = orientations[0] === 'upright' ? '正位' : '逆位';
  const presentOrient = orientations[1] === 'upright' ? '正位' : '逆位';
  const futureOrient = orientations[2] === 'upright' ? '正位' : '逆位';

  // 根据具体牌面生成特定的过渡叙事
  let transitionText = '';

  // 过去到现在的过渡
  if (past.card.name === '死神' && present.card.name === '星星') {
    transitionText = '经历了死神带来的剧烈蜕变后，星星牌如同一道曙光穿透黑暗——你正从废墟中重建希望。';
  } else if (past.card.name === '塔' && present.card.name === '星星') {
    transitionText = '高塔崩塌后的尘埃已经落定，星星正在夜空中为你点亮方向。';
  } else if (past.card.name === '愚者' && presentOrient === '正位') {
    transitionText = `当初带着愚者的无畏踏上旅途，如今${present.card.name}的出现说明你的冒险正在结出果实。`;
  } else if (pastOrient === '逆位' && presentOrient === '正位') {
    transitionText = `从${past.card.name}逆位所代表的困境中走出，${present.card.name}正位为你带来了正面的能量转变。`;
  } else if (pastOrient === '正位' && presentOrient === '逆位') {
    transitionText = `${past.card.name}正位曾经给你的顺遂能量，在${present.card.name}逆位处遇到了阻碍，需要重新调整方向。`;
  } else {
    transitionText = `从${past.card.name}的${pastOrient}能量到${present.card.name}的${presentOrient}，你经历了一段独特的内在演变。`;
  }

  paragraphs.push(
    `${transitionText} ` +
    `展望未来，${future.card.name}（${futureOrient}）作为终点牌，` +
    `${futureOrient === '正位' ? `以正面的姿态为你描绘了充满可能性的图景——${future.card.upright.split('、').slice(0, 2).join('与')}将成为下一阶段的关键词。` : `逆位的姿态提醒你注意潜在的陷阱——${future.card.reversed.split('、').slice(0, 2).join('与')}是你需要警惕的课题。`}`
  );

  // === 第四部分：具体建议 ===
  const adviceMap: Record<string, string> = {
    '愚者': '大胆迈出第一步，不必等到万事俱备',
    '魔术师': '盘点手中资源，你会发现一切早已就绪',
    '女祭司': '安静下来倾听直觉，答案不在外界而在心中',
    '女皇': '给自己一些滋养和享受的时间，创造力需要土壤',
    '皇帝': '制定清晰的计划和结构，有序的行动比盲目努力更有效',
    '教皇': '不妨向有经验的前辈请教，传统智慧中藏着捷径',
    '恋人': '跟随内心真正认同的价值去选择，而非外界期待',
    '战车': '集中精力朝一个方向突破，分散力量是此牌大忌',
    '力量': '以耐心和温柔对待困难，蛮力只会适得其反',
    '隐者': '给自己一段独处的时间，向内寻找答案',
    '命运之轮': '顺势而为，不要逆流而上，好运正在转向你',
    '正义': '诚实面对自己的选择所产生的因果，承担该承担的责任',
    '倒吊人': '暂停前进，换一个完全不同的角度来看问题',
    '死神': '勇敢地告别不再适合你的人事物，腾出空间迎接新生',
    '节制': '寻找极端之间的中间道路，调和各方力量',
    '恶魔': '审视束缚你的执念，你比自己以为的更自由',
    '塔': '不要试图修补已经崩塌的旧结构，在废墟上建全新的东西',
    '星星': '保持希望和信念，即使前路还不清晰，星光终会指引你',
    '月亮': '不要急于在迷雾中做决定，等月光散去再行动',
    '太阳': '尽情享受当下的光明与成功，这是你应得的',
    '审判': '回应内心深处的召唤，这一次不要逃避改变的邀请',
    '世界': '你已接近一段旅程的圆满，好好庆祝并整合所学',
  };

  const futureAdvice = adviceMap[future.card.name] || '保持开放的心态，宇宙自有安排';
  const presentAdvice = adviceMap[present.card.name] || '专注当下，做好眼前的事';

  paragraphs.push(
    `💡 综合建议：当下最重要的是${presentAdvice}。` +
    `而对于未来走向，${futureAdvice}。` +
    `三张牌的整体信息是：${isAscending ? '保持上升势头，你正走在正确的道路上。' : isDescending ? '回归本心，从基础重新开始并不丢人。' : '在变化中保持平衡，顺应生命的自然节奏。'}`
  );

  return paragraphs.join('\n\n');
}

/**
 * 生成单张牌/多张牌的基础解读（含建议）
 */
export function generateTarotSummary(draws: TarotDraw[]): string {
  const parts: string[] = [];
  for (const d of draws) {
    const meaning = d.orientation === 'upright' ? d.card.upright : d.card.reversed;
    const orientLabel = d.orientation === 'upright' ? '正位' : '逆位';
    parts.push(`【${d.position}·${d.card.name}（${orientLabel}）】${meaning}`);
  }

  // 为每张牌添加建议
  const adviceParts: string[] = [];
  for (const d of draws) {
    const isUpright = d.orientation === 'upright';
    let advice = '';
    if (isUpright) {
      advice = `此牌提示你：发挥${d.card.name}的正面能量，${d.card.keywords.map(k => k).join('、')}是你当前可以主动运用的力量。`;
    } else {
      advice = `此牌提醒你：${d.card.name}逆位暗示你可能正面临${d.card.reversed.split('、').slice(0, 2).join('与')}的困扰，需要正视并调整。`;
    }
    adviceParts.push(`【${d.position}·${d.card.name}建议】${advice}`);
  }

  return parts.join('\n\n') + '\n\n---\n\n' + adviceParts.join('\n\n');
}
