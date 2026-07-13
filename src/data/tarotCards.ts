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
  relationship: ['你', '对方', '关系现状', '挑战', '发展方向'],
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

  // === 关系牌阵（5张牌） ===
  if (draws.length >= 5) {
    const [you, other, current, challenge, direction] = draws;
    const cards = [you.card, other.card, current.card, challenge.card, direction.card];
    const elements = cards.map(c => c.element);
    const orientations = draws.map(d => d.orientation);

    const paragraphs: string[] = [];

    // 第一部分：你与对方的能量对比
    const youOrient = orientations[0] === 'upright' ? '正位' : '逆位';
    const otherOrient = orientations[1] === 'upright' ? '正位' : '逆位';

    const sameElement = elements[0] === elements[1];
    const compatibleElements: Record<string, string[]> = {
      '火': ['风'],  '风': ['火'],
      '水': ['土'],  '土': ['水'],
    };
    const isCompatible = compatibleElements[elements[0]]?.includes(elements[1]);

    if (sameElement) {
      paragraphs.push(
        `你抽到了${you.card.name}（${youOrient}），对方是${other.card.name}（${otherOrient}），两张牌同属${elements[0]}元素——` +
        `这意味着你们在能量频率上有着天然的共鸣。你们看待世界的方式相似，` +
        `彼此之间容易产生默契和理解。但同元素也意味着你们的盲点可能重叠，` +
        `需要警惕在相同方向上一起走偏而无人踩刹车。`
      );
    } else if (isCompatible) {
      paragraphs.push(
        `你的${you.card.name}（${youOrient}）属于${elements[0]}元素，对方的${other.card.name}（${otherOrient}）属于${elements[1]}元素——` +
        `${elements[0]}与${elements[1]}在五行中互为助力，你们之间存在着天然的互补关系。` +
        `你带来的${elements[0] === '火' ? '激情与行动力' : elements[0] === '风' ? '思维与灵感' : elements[0] === '水' ? '情感深度与直觉' : '稳定与务实'}，` +
        `恰好被对方的${elements[1] === '火' ? '热情驱动力' : elements[1] === '风' ? '理性沟通力' : elements[1] === '水' ? '情感共鸣力' : '落地执行力'}所承接。` +
        `这是一对彼此成就的组合。`
      );
    } else {
      paragraphs.push(
        `你的${you.card.name}（${youOrient}）属于${elements[0]}元素，对方的${other.card.name}（${otherOrient}）属于${elements[1]}元素——` +
        `两种元素之间存在张力，这既是吸引的源泉也是摩擦的根源。` +
        `你们的不同恰恰是彼此学习的功课：你的世界里有对方缺少的东西，反之亦然。` +
        `关键在于是将差异视为威胁还是礼物。`
      );
    }

    // 第1.5部分：特殊牌对互动解读
    const relationshipPairInsights: Record<string, string> = {
      '恋人→恶魔': '你持有恋人牌而对方是恶魔牌——你在这段关系中代表着爱与选择的能量，而对方可能正被某种执着或欲望所驱动。你的存在是对方看见真实之爱的窗口。',
      '恶魔→恋人': '你是恶魔牌而对方是恋人——你内心可能正被某种强烈的执着或恐惧所困，而对方带来的是纯粹的爱与选择的可能。对方是你走出束缚的光。',
      '太阳→月亮': '你是太阳而对方是月亮——一个带来光明与活力，一个守护直觉与梦境。你们互相照亮对方的盲区，但也需要尊重彼此节奏的不同。',
      '月亮→太阳': '你是月亮而对方是太阳——你的敏感和直觉是对方的锚，而对方的乐观和热情是你的灯塔。关键是不要让对方的光芒淹没你内在的月光。',
      '皇帝→女皇': '皇帝与女皇——最具权力的一对组合。你们各自代表阳刚与阴柔的最高表达，若能彼此尊重而非争夺主导权，这将是一段互补且强大的关系。',
      '女皇→皇帝': '女皇与皇帝的组合——你的滋养与对方的秩序可以共同建立一个温暖且稳固的家，但也要警惕不要陷入传统的角色刻板中。',
      '隐者→愚者': '你是隐者而对方是愚者——你在内省中寻找深度，对方在冒险中寻找自由。你教对方沉思的价值，对方教你如何放下包袱轻装前行。',
      '愚者→隐者': '你是愚者而对方是隐者——你的活力和对世界的好奇是对方走出孤独的邀请，而对方的智慧能帮你的冒险找到更深的意义。',
      '塔→星星': '你是塔而对方是星星——也许你正在经历或引发某些剧变，而对方是你风暴之后的宁静港湾。珍惜对方的存在，那是你在废墟中最需要的力量。',
      '星星→塔': '你是星星而对方是塔——你的希望与信念可能被对方的突变或激烈所考验。但记住，塔摧毁的从来不是真实的东西，你的星光经得起这场考验。',
      '死神→审判': '死神与审判——死亡与重生。你负责终结旧事物，对方负责唤醒新可能。你们在一起是灵魂层面的强力搭档，共同完成一场深层的蜕变。',
      '力量→战车': '你是力量而对方是战车——你的温柔耐心与对方的意志力形成互补。你教会对方以柔克刚，对方帮你把内在力量转化为外在行动。',
      '命运之轮→正义': '命运之轮与正义——你代表命运的流转，对方代表因果的法则。你们在一起时，每一个选择都会更快地显化其结果，请共同慎重对待每一个决定。',
      '倒吊人→力量': '倒吊人与力量——你以暂停和换视角为策略，对方以勇气和耐心为武器。看似风格不同，但你们的核心能力其实惊人地一致：都是在逆境中保持内在力量的高手。',
    };

    const youOtherKey = `${you.card.name}→${other.card.name}`;
    if (relationshipPairInsights[youOtherKey]) {
      paragraphs.push(`🔮 牌对互动解读：${relationshipPairInsights[youOtherKey]}`);
    }

    // 第二部分：关系现状分析
    const currentOrient = orientations[2] === 'upright' ? '正位' : '逆位';
    const currentMeaning = currentOrient === '正位' ? current.card.upright : current.card.reversed;

    paragraphs.push(
      `关系现状牌出现了${current.card.name}（${currentOrient}）——${currentMeaning}。` +
      `${currentOrient === '正位'
        ? `这张牌显示当前关系正处于一个相对健康的阶段，${current.card.keywords.join('、')}是此刻关系的主旋律。你们之间的能量流动是顺畅的，彼此能够感受到对方的存在和重要性。`
        : `逆位的${current.card.name}暗示当前关系中存在一些未被正视的问题。${current.card.reversed.split('、').slice(0, 2).join('与')}的能量正在暗中影响你们的互动模式，也许是时候坐下来坦诚地聊一聊了。`
      }` +
      `${current.card.description.slice(0, 60)}——这个意象恰恰映射了你们关系此刻最真实的画面。`
    );

    // 第三部分：挑战与成长方向
    const challengeOrient = orientations[3] === 'upright' ? '正位' : '逆位';
    const directionOrient = orientations[4] === 'upright' ? '正位' : '逆位';
    const challengeMeaning = challengeOrient === '正位' ? challenge.card.upright : challenge.card.reversed;
    const directionMeaning = directionOrient === '正位' ? direction.card.upright : direction.card.reversed;

    paragraphs.push(
      `挑战牌${challenge.card.name}（${challengeOrient}）揭示了这段关系中最需要面对的课题：${challengeMeaning}。` +
      `${challengeOrient === '正位'
        ? `这个挑战是显性的，你们可能已经感受到了它的存在，但尚未找到最佳的应对方式。`
        : `逆位暗示这个挑战可能被你们有意无意地回避着，越不敢面对它越会在暗处发酵。`
      }` +
      `而发展方向牌${direction.card.name}（${directionOrient}）为你们指出了破局之道——${directionMeaning}。` +
      `${directionOrient === '正位'
        ? `沿着这张牌所指引的方向前行，${direction.card.keywords.join('与')}将成为关系进化的催化剂。`
        : `这张牌逆位提醒你们不要急于求成，先消化内在的功课再向外寻求改变。`
      }`
    );

    // 第四部分：综合关系建议
    const relationshipAdvice: Record<string, string> = {
      '愚者': '给关系注入新鲜感，一起尝试从未做过的事',
      '魔术师': '主动创造你们想要的关系模式，一切工具已在手中',
      '女祭司': '倾听关系中未说出口的声音，直觉会告诉你答案',
      '女皇': '用温柔和滋养对待彼此，给爱一个舒适生长的环境',
      '皇帝': '建立清晰的关系规则和边界，稳定感是亲密的基础',
      '教皇': '在关系里尊重彼此的传统和信仰，找到共同的价值观',
      '恋人': '回到爱的本质——你们是否真正选择了彼此？',
      '战车': '一起确立共同目标，并肩作战会让感情更加坚固',
      '力量': '以耐心和包容对待对方的缺点，温柔比强势更有力量',
      '隐者': '给彼此一些独处的空间，距离有时反而拉近心的距离',
      '命运之轮': '接受关系的自然起伏，不必在每个低谷都恐慌',
      '正义': '在关系中保持公平和诚实，因果法则同样适用于感情',
      '倒吊人': '试着从对方的角度看问题，你会发现一个全新的世界',
      '死神': '勇敢地告别关系中已经死去的旧模式，让新的互动方式诞生',
      '节制': '学会调和关系中的极端倾向，找到让双方都舒适的平衡点',
      '恶魔': '审视关系中的不健康依赖或控制模式，打破束缚双方的锁链',
      '塔': '不要害怕关系中的震荡，有时剧烈的冲击才能震碎虚假的平衡',
      '星星': '在关系中保持希望和信念，美好的愿景会引导你们前行',
      '月亮': '不要急于在情绪的迷雾中下结论，等直觉与理性重新对齐',
      '太阳': '尽情享受关系中的快乐时光，阳光下的爱最真实最纯粹',
      '审判': '关系正在召唤你们走向更深层的承诺，准备好回应了吗？',
      '世界': '你们的关系正在走向一个圆满的节点，好好珍惜这份完整',
    };

    const dirAdvice = relationshipAdvice[direction.card.name] || '保持开放与信任，关系自有其智慧';
    const youAdvice = relationshipAdvice[you.card.name] || '做真实的自己，是关系最好的起点';

    paragraphs.push(
      `💡 关系综合建议：对你而言，${youAdvice}。` +
      `而对于关系的未来方向，${dirAdvice}。` +
      `五张牌的整体信息是：${
        orientations.filter(o => o === 'upright').length >= 3
          ? '正位牌居多，说明这段关系整体的能量是积极向上的，把握住当前的势头。'
          : '逆位牌较多，暗示关系中仍有不少未解的功课需要双方共同面对，但挑战本身就是成长的邀请函。'
      }`
    );

    return paragraphs.join('\n\n');
  }

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
  // 牌对专属解读：过去→现在
  const pairTransitions: Record<string, string> = {
    '死神→星星': '经历了死神带来的剧烈蜕变后，星星牌如同一道曙光穿透黑暗——你正从废墟中重建希望，伤口正在愈合，新的信念正在生根。',
    '塔→星星': '高塔崩塌后的尘埃已经落定，星星正在夜空中为你点亮方向。那场风暴虽然猛烈，却为你扫清了障碍，让你终于看见了真正重要的东西。',
    '死神→太阳': '死神的镰刀割去了旧日的枝叶，而太阳正以灼热的光芒照亮你重生的道路——你不仅活过来了，而且比以前更强大。',
    '塔→太阳': '高塔崩塌时你以为是末日，但太阳牌告诉你——废墟之上，阳光反而更灿烂了。那些被摧毁的虚假结构，正是阻碍你真正发光的屏障。',
    '月亮→太阳': '月亮的迷雾终于散去，太阳以万丈光芒驱散了一切恐惧和幻象。你曾经历的那些困惑与不安，在真相大白后化为了成长的养分。',
    '恋人→恶魔': '恋人牌中那个美好的选择，如今在恶魔牌里显露出了它的阴暗面——也许当初的甜蜜背后藏着不易察觉的束缚。但意识到这一点，就是解脱的开始。',
    '恶魔→恋人': '从恶魔的束缚中挣脱后，恋人牌带来了真正纯净的爱与选择。你终于能够不被恐惧和欲望驱动，而是从心出发去做出真实的选择。',
    '隐者→命运之轮': '隐者的孤独沉思已经为你积累了足够的智慧，现在命运之轮开始转动——你准备已久的东西即将在恰当的时机派上用场。',
    '命运之轮→正义': '命运之轮的转动带来了变化，而正义牌告诉你——这些变化并非偶然，它们是你过去选择的因果回馈。收获该得的，承担该负的。',
    '愚者→魔术师': '当初带着愚者的天真无畏踏上旅途，如今魔术师的出现说明你已经从一张白纸变成了掌握四元素的能者——你的潜力正在被激活。',
    '愚者→世界': '从愚者的一无所知到世界的圆满成就——这是一段完整的大阿尔卡纳之旅。你从无知走到了智慧，从起点走到了终点，又即将开启下一个循环。',
    '倒吊人→力量': '倒吊人的暂停和换角度为你积蓄了内在的力量，现在力量牌的出现说明你已经准备好了——以柔克刚的智慧，正是从那段静止中获得的。',
    '战车→力量': '战车的冲锋陷阵为你赢得了阵地，而力量牌提醒你——真正的胜利不在于征服外界，而在于驯服内心的雄狮。外在的胜利需要内在的平和来承载。',
    '女皇→死神': '女皇曾带来的丰饶与滋养，如今在死神牌前迎来了必须告别的时刻。有些美好的事物已经完成了它的使命，学会放手才能让新的丰饶到来。',
    '教皇→恶魔': '教皇的传统教条也许在无意中构筑了恶魔牌中的束缚——那些"应该"和"必须"正在成为锁链。是时候分辨哪些传统是智慧，哪些只是牢笼。',
    '力量→塔': '力量牌曾教你以温柔驾驭一切，但塔牌带来了温柔无法化解的剧变——有些结构注定要崩塌，不是因为你的力量不够，而是因为它们本就不该存在。',
    '审判→世界': '审判的号角已经吹响，灵魂的觉醒正在发生，而世界牌预示着这份觉醒将带你走向圆满——你正处在一段伟大旅程的最后两步。',
    '星星→月亮': '星星的希望之光引领你进入了月亮的领域——希望虽然还在，但前方的路变得更加朦胧。这段从清晰到模糊的转变不是退步，而是你正在深入潜意识的更深层。',
    '太阳→月亮': '从太阳的绝对光明跌入月亮的朦胧暗影，你也许感到一阵眩晕。但月亮并非黑暗——它是另一种光，教你看见理性之光照不到的地方。',
    '节制→塔': '节制曾教你在极端间走钢丝，但塔牌突然抽走了脚下的绳索。也许平衡的努力本身就是一种维持虚假的方式，崩塌反而让你不再需要那么辛苦地维持。',
  };

  // 牌对专属解读：现在→未来
  const futurePairTransitions: Record<string, string> = {
    '死神→星星': '当下的蜕变虽然痛苦，但星星在未来等你——疗愈已经在路上了。',
    '死神→太阳': '告别旧事物之后，太阳将以最灿烂的光芒迎接你的新生。',
    '塔→星星': '眼前的震荡终将平息，星星会为你照亮重建的方向。',
    '月亮→太阳': '走过月亮的迷雾后，太阳的光明正在前方等你——不要在最黑暗的时刻放弃。',
    '恶魔→恋人': '当你挣脱恶魔的锁链，恋人牌中真正纯净的爱与自由的选择就在前方。',
    '隐者→世界': '隐者的内省之路虽然孤独，但它的终点是世界的圆满——你的独处正在为最终的整合铺路。',
    '命运之轮→世界': '命运之轮的每一次转动都在推你靠近世界的圆满——顺其自然，你离终点比想象中更近。',
    '力量→太阳': '你正在培养的内在力量，将在未来化为太阳般的光芒——温柔终将胜过一切。',
    '星星→太阳': '此刻的希望之光将在未来汇聚成太阳般的辉煌——保持信念，黎明就在眼前。',
    '审判→世界': '灵魂的觉醒正在引领你走向最终的圆满——回应这个召唤，一段伟大的旅程即将完成。',
    '倒吊人→力量': '此刻的暂停正在为你积蓄力量——等这段静止结束，你会发现自己比任何时候都更强大。',
    '塔→死神': '崩塌之后是更深层的蜕变——塔摧毁表象，死神带走本质已亡之物，两者合力为你彻底清空旧世界。',
    '战车→世界': '战车的全速前进正在将你推向世界的圆满——保持方向不变，终点线已在视野之内。',
  };

  const pastPresentKey = `${past.card.name}→${present.card.name}`;
  const presentFutureKey = `${present.card.name}→${future.card.name}`;
  let transitionText = '';
  let futureTransitionText = '';

  // 过去→现在：优先牌对专属，其次正逆位通用逻辑
  if (pairTransitions[pastPresentKey]) {
    transitionText = pairTransitions[pastPresentKey];
  } else if (past.card.name === '愚者' && presentOrient === '正位') {
    transitionText = `当初带着愚者的无畏踏上旅途，如今${present.card.name}的出现说明你的冒险正在结出果实。`;
  } else if (pastOrient === '逆位' && presentOrient === '正位') {
    transitionText = `从${past.card.name}逆位所代表的困境中走出，${present.card.name}正位为你带来了正面的能量转变。`;
  } else if (pastOrient === '正位' && presentOrient === '逆位') {
    transitionText = `${past.card.name}正位曾经给你的顺遂能量，在${present.card.name}逆位处遇到了阻碍，需要重新调整方向。`;
  } else {
    transitionText = `从${past.card.name}的${pastOrient}能量到${present.card.name}的${presentOrient}，你经历了一段独特的内在演变。`;
  }

  // 现在→未来：牌对专属或通用
  if (futurePairTransitions[presentFutureKey]) {
    futureTransitionText = futurePairTransitions[presentFutureKey];
  } else if (presentOrient === '逆位' && futureOrient === '正位') {
    futureTransitionText = `当下的${present.card.name}逆位虽有阻滞，但${future.card.name}正位预示着拨云见日的时刻终将到来。`;
  } else if (presentOrient === '正位' && futureOrient === '逆位') {
    futureTransitionText = `${present.card.name}正位的顺畅能量延伸到${future.card.name}逆位时遇到了暗流——提前警觉，便能化解于未然。`;
  } else {
    futureTransitionText = `${present.card.name}的能量正在向${future.card.name}自然流转，当下种下的因，将在未来结出对应的果。`;
  }

  paragraphs.push(
    `${transitionText} ` +
    `${futureTransitionText} ` +
    `${future.card.name}（${futureOrient}）作为终点牌，` +
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
