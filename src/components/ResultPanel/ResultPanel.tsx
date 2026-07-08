import React, { useState } from 'react';
import type { DivinationResult, HexagramData } from '../../types';
import HexagramDisplay from '../HexagramDisplay/HexagramDisplay';
import { getHexagramRelationships } from '../../utils/hexagramCalc';
import './ResultPanel.css';

interface ResultPanelProps {
  result: DivinationResult;
  onSaveHistory: () => void;
  shareRef: React.RefObject<HTMLDivElement | null>;
}

// ── helpers ────────────────────────────────────────────────────────────────────

const TRIGRAM_ATTRIBUTE: Record<string, string> = {
  '乾': '健', '坤': '顺', '震': '动', '巽': '入',
  '坎': '陷', '离': '丽', '艮': '止', '兑': '说',
};

const TRIGRAM_NATURE: Record<string, string> = {
  '乾': '天', '坤': '地', '震': '雷', '巽': '风',
  '坎': '水', '离': '火', '艮': '山', '兑': '泽',
};

const TRIGRAM_FAMILY: Record<string, string> = {
  '乾': '父', '坤': '母', '震': '长男', '巽': '长女',
  '坎': '中男', '离': '中女', '艮': '少男', '兑': '少女',
};

const TRIGRAM_BODY: Record<string, string> = {
  '乾': '首', '坤': '腹', '震': '足', '巽': '股',
  '坎': '耳', '离': '目', '艮': '手', '兑': '口',
};

const TRIGRAM_DIRECTION: Record<string, string> = {
  '乾': '西北', '坤': '西南', '震': '东', '巽': '东南',
  '坎': '北', '离': '南', '艮': '东北', '兑': '西',
};

const TRIGRAM_ADVICE: Record<string, string> = {
  '乾': '宜刚健有为，主动出击',
  '坤': '宜厚德载物，顺势而为',
  '震': '宜积极行动，把握先机',
  '巽': '宜柔顺渗透，循序渐进',
  '坎': '宜谨慎行事，以柔克刚',
  '离': '宜光明正大，展现才华',
  '艮': '宜适时止步，沉稳应对',
  '兑': '宜和谐沟通，以诚待人',
};

function getTrigramAdvice(trigram: string): string {
  return TRIGRAM_ADVICE[trigram] || '宜顺势而为';
}

function buildComprehensiveSummary(
  fullName: string,
  upper: string,
  lower: string,
  judgment: string,
): string {
  const upperAttr = TRIGRAM_ATTRIBUTE[upper] || upper;
  const lowerAttr = TRIGRAM_ATTRIBUTE[lower] || lower;
  const upperNature = TRIGRAM_NATURE[upper] || '';
  const lowerNature = TRIGRAM_NATURE[lower] || '';
  const upperFamily = TRIGRAM_FAMILY[upper] || '';
  const lowerFamily = TRIGRAM_FAMILY[lower] || '';
  const upperDir = TRIGRAM_DIRECTION[upper] || '';
  const lowerDir = TRIGRAM_DIRECTION[lower] || '';
  const auspicious = /[亨利贞吉泰]/.test(judgment);
  const toneWord = auspicious ? '整体卦象趋于吉祥亨通' : '整体卦象蕴含挑战与变数';

  // 自然意象描述
  const natureDesc = upperNature && lowerNature
    ? `上${upperNature}下${lowerNature}，如同${getNatureImage(upperNature, lowerNature)}，`
    : '';

  // 家庭角色关系
  const familyDesc = upperFamily && lowerFamily && upperFamily !== lowerFamily
    ? `从家庭象征来看，上卦${upperFamily}与下卦${lowerFamily}的组合，暗示着${getFamilyDynamic(upperFamily, lowerFamily)}。`
    : '';

  // 方位提示
  const dirDesc = upperDir && lowerDir
    ? `方位上，上卦居${upperDir}，下卦居${lowerDir}，${upperDir === lowerDir ? '同向一方，力量集中' : '分据' + upperDir + '与' + lowerDir + '，需兼顾多方'}` +
      (auspicious ? '，利于向对应方位发展。' : '，行动前宜先辨明方向。')
    : '';

  return (
    `此卦为「${fullName}」，上卦${upper}（${upperAttr}）象${upperNature}，下卦${lower}（${lowerAttr}）象${lowerNature}。` +
    `${natureDesc}${upperAttr}在上而${lowerAttr}在下，二者相互感应，构成此卦独特的气场与寓意。` +
    `${toneWord}，需结合当下情境细心体悟。` +
    `${familyDesc}` +
    `${dirDesc} ` +
    `卦辞所示，关键在于顺应天时、把握分寸，方能趋吉避凶。`
  );
}

function getNatureImage(upper: string, lower: string): string {
  const images: Record<string, string> = {
    // 天天（乾为天）
    '天_天': '苍穹之上复有苍穹，浩瀚无垠的纯阳之象',
    '天_地': '天在上地在下，天地各安其位的和谐之象',
    '天_雷': '天上有雷，雷声震动九天的壮盛之象',
    '天_风': '风行天上，号令四方的姤遇之象',
    '天_水': '天与水逆行，天水相违的争讼之象',
    '天_火': '天上有火，火光上腾的同人之象',
    '天_山': '天上山下，山高接天的遁隐之象',
    '天_泽': '天上泽下，恩泽普施的履礼之象',
    // 地地（坤为地）
    '地_天': '地在上天在下，天气下降地气上升的交泰之象',
    '地_地': '厚土之下复有厚土，广袤无边的纯阴之象',
    '地_雷': '地中有雷，蓄力待发的复归之象',
    '地_风': '地中有风，风行地中的观化之象',
    '地_水': '地中藏水，水源丰沛的积蓄之象',
    '地_火': '地中有火，火藏地中的明夷之象',
    '地_山': '地中有山，内蕴高远的谦卦之象',
    '地_泽': '地中有泽，泽润万物的临降之象',
    // 雷雷（震为雷）
    '雷_天': '雷在天上，声威远播的大壮之象',
    '雷_地': '雷在地中，春雷惊蛰的复苏之象',
    '雷_雷': '雷声相继，震动不息的重雷之象',
    '雷_风': '雷风相薄，刚柔并济的恒久之象',
    '雷_水': '雷在水上，雷雨交加的解困之象',
    '雷_火': '雷火交加，光明与动力并存的丰盈之象',
    '雷_山': '雷在山上，声震林木的小过之象',
    '雷_泽': '雷在泽上，雷动泽应的归妹之象',
    // 风风（巽为风）
    '风_天': '天下有风，风吹万物的姤遇之象',
    '风_地': '风行地上，万物随化的观民之象',
    '风_雷': '风雷交加，助长声势的益卦之象',
    '风_风': '风随风起，无孔不入的重风之象',
    '风_水': '风在水上，风行水面的涣散之象',
    '风_火': '风自火出，火势借风的家人之象',
    '风_山': '风在山上，山间清风的渐修之象',
    '风_泽': '风在泽上，风动泽波的中孚之象',
    // 水水（坎为水）
    '水_天': '天上含水，密云不雨的等待之象',
    '水_地': '地上有水，水聚成泽的亲比之象',
    '水_雷': '云中有雷，雷雨将至的蓄势之象',
    '水_风': '水在风上，风水相生的井养之象',
    '水_水': '水流相继，重重险阻的重坎之象',
    '水_火': '水在上火在下，水火既济的平衡之象',
    '水_山': '水在山上，高山流水的蹇难之象',
    '水_泽': '水在泽上，水聚成渊的节度之象',
    // 火火（离为火）
    '火_天': '火在天上，光芒万丈的大有之象',
    '火_地': '火在地上，光明普照的晋升之象',
    '火_雷': '火在雷上，雷电交加的噬嗑之象',
    '火_风': '火在风上，光明远播的鼎新之象',
    '火_水': '火在上水在下，火水未济的待调之象',
    '火_火': '火上加火，光明重叠的离丽之象',
    '火_山': '火在山上，山火映辉的旅人之象',
    '火_泽': '火在泽上，火泽相反的睽违之象',
    // 山山（艮为山）
    '山_天': '山在天上，天高山远的大畜之象',
    '山_地': '山附于地，高下相依的谦逊之象',
    '山_雷': '山中有雷，颐养正气的颐养之象',
    '山_风': '山中有风，蛊惑待治的整饬之象',
    '山_水': '山下有水，山水蒙昧的启蒙之象',
    '山_火': '山中有火，贲饰文明的贲美之象',
    '山_山': '山连山起，稳如磐石的重艮之象',
    '山_泽': '山上有泽，山泽通气的感应之象',
    // 泽泽（兑为泽）
    '泽_天': '泽在天上，恩泽天下的夬决之象',
    '泽_地': '泽在地上，泽润大地的萃聚之象',
    '泽_雷': '泽中有雷，随雷而动的随顺之象',
    '泽_风': '泽上有风，风波不定的大过之象',
    '泽_水': '泽中有水，水泽交融的困厄之象',
    '泽_火': '泽中有火，革故鼎新的变革之象',
    '泽_山': '山上有泽，泽润山林的咸感之象',
    '泽_泽': '泽水相连，和悦相欢的重兑之象',
  };
  return images[`${upper}_${lower}`] || `${upper}与${lower}交融的独特意象`;
}

function getFamilyDynamic(upper: string, lower: string): string {
  const dynamics: Record<string, string> = {
    '父_母': '刚柔互济，如父母持家般和谐稳定',
    '母_父': '内柔外刚，以柔承刚的默契配合',
    '父_长男': '父辈引领，后辈追随，传承有序',
    '长男_父': '后辈锐意进取，父辈稳守后方，新旧交融',
    '母_长女': '母女连心，温柔的力量层层传递',
    '长女_母': '女儿承母志，细腻中见深远',
    '长男_长女': '长男长女相遇，如兄如妹，动静相宜',
    '长女_长男': '长女长男配合，如姐如弟，刚柔互补',
    '中男_中女': '中男中女相遇，水火既济，平衡之道',
    '中女_中男': '中女中女搭配，离坎交错，明暗相生',
    '少男_少女': '少男少女相逢，山泽通气，纯真之感',
    '少女_少男': '少女少男配合，泽山相应，和悦之情',
  };
  return dynamics[`${upper}_${lower}`] || '不同角色之间的互补与协调';
}

function buildChangeInsight(
  originalName: string,
  changedName: string,
  upper1: string,
  upper2: string,
  lower1: string,
  lower2: string,
): string {
  const uChanged = upper1 !== upper2;
  const lChanged = lower1 !== lower2;
  let processNote: string;
  if (uChanged && lChanged) {
    processNote = '上下卦皆有变动，提示内外环境均在转化之中，需全面调整心态与策略';
  } else if (uChanged) {
    processNote = '上卦发生变动，外在形势正在变化，宜顺势而为，灵活应对外部环境';
  } else {
    processNote = '下卦发生变动，内在根基有所调整，宜稳固根本，由内而外逐步改变';
  }
  return (
    `本卦「${originalName}」显示当前所处状况，变卦「${changedName}」提示事物发展的趋向与可能。` +
    `${processNote}。变化之中蕴含转机，关键在于保持中正平和之心。`
  );
}

interface InterpretationAdvice {
  career: string;
  love: string;
  wealth: string;
  health: string;
}

function getInterpretationAdvice(upper: string, lower: string): InterpretationAdvice {
  const ua = TRIGRAM_ATTRIBUTE[upper] || '';
  const la = TRIGRAM_ATTRIBUTE[lower] || '';
  const uAdv = getTrigramAdvice(upper);
  const lAdv = getTrigramAdvice(lower);

  const baseAdvice = `上卦为${upper}（${ua}），${uAdv}；下卦为${lower}（${la}），${lAdv}。`;

  // Generate category-specific supplements based on trigram pairing
  const careerMap: Record<string, string> = {
    '健健': '事业运势强劲，可大胆推进重要项目，把握领导机遇。双重乾卦之气意味着你有充沛的动力和权威，但也需防刚愎自用，适当听取他人意见。',
    '顺顺': '事业上宜配合大局，借力使力，不宜独行。双坤之势主厚积薄发，以柔韧之姿承接机遇，稳扎稳打方能长远。',
    '动动': '事业充满动力，但需防止冒进，三思而后行。双震之气虽勇往直前，却需防方向重叠导致资源分散。',
    '丽丽': '适合展示才华与创意，有利于文化、教育、媒体领域发展。双离之象如双日当空，光明磊落，声名远播。',
    '健顺': '以乾之刚健引领方向，以坤之柔顺落实执行，上下一心，事业可成。领导者有魄力，团队有凝聚力，是大展宏图的好时机。',
    '顺健': '内在根基稳固（坤），外在积极进取（乾），事业呈现先蓄后发之势。前期的积累正在为此刻的突破提供能量。',
    '健动': '上有乾之决断力，下有震之行动力，事业正处于快速推进期。关键是在高速运转中保持方向清晰，避免多头并进。',
    '动健': '以震的冲劲打头阵，以乾的格局收全局，适合开拓新市场、启动新项目。先声夺人之后要以稳健来巩固成果。',
    '健入': '乾的领导力配合巽的渗透力，适合制定战略和推动变革。你既能看到全局又能深入细节，这是难得的优势。',
    '入健': '巽在内主深思熟虑，乾在外主果敢行动，事业的内在逻辑已经理顺，现在是把计划付诸实施的好时机。',
    '顺动': '坤的包容配合震的行动，适合在团队中扮演协调者和推动者的角色。你的存在能让变革在和谐中推进。',
    '动顺': '震的冲劲在上，坤的柔顺在下，事业起步有力但需防后继乏力。关键是保持初期的热情，同时建立可持续的节奏。',
    '顺入': '坤与巽相遇，事业适合以润物无声的方式推进。不必追求轰轰烈烈，细水长流中自见功夫。',
    '入顺': '巽在内主洞察，坤在外主包容，事业上适合做幕后策划和资源整合。你的敏锐嗅觉是别人看不见的竞争力。',
    '陷丽': '坎的深邃配合离的光明，适合在危机中寻找转机、在困境中发现机遇。你的洞察力是事业中最锋利的武器。',
    '丽陷': '离在上主明察秋毫，坎在下主深层风险，事业上虽然表面光鲜但暗流涌动。需在展现才华的同时做好风险管控。',
    '止动': '艮的定力配合震的行动力，知道何时停何时动是最高级的事业智慧。此刻宜谋定而后动，不急于求成。',
    '动止': '震在上主进取，艮在下主稳固，事业既有冲劲又有根基。但需防节奏忽快忽慢，保持稳定的输出频率。',
    '说丽': '兑的和悦配合离的光彩，适合公关、外交、演艺等需要人缘和表现力的领域。你的亲和力是最大的事业资产。',
    '丽说': '离的才华在上，兑的口才在下，适合教育培训、内容创作、咨询顾问等以知识表达为核心的事业方向。',
    '止说': '艮的沉稳配合兑的沟通力，适合需要耐心谈判和长期关系维护的事业领域。以静制动，以不变应万变。',
    '说止': '兑在上主表达，艮在下主沉淀，事业上善于表达但根基还需夯实。建议在对外拓展的同时加强内部建设。',
  };
  const loveMap: Record<string, string> = {
    '健健': '感情中双方都较为强势，需注意沟通方式，以柔济刚。两个乾卦相遇如双日当空，热烈但也容易灼伤彼此，学会给对方留空间是关键。',
    '顺顺': '感情温和柔顺，适合稳步发展，不宜操之过急。双坤之象如大地承载一切，感情基础稳固，但需防过于被动而错失表达爱意的时机。',
    '动动': '感情充满激情与变化，需保持新鲜感的同时注重稳定。双震如惊雷交加，心动之余也要学会在风平浪静时享受平淡的温馨。',
    '说说': '感情甜蜜和谐，善于表达爱意，适合深入交流。双兑之象如两面明镜互照，你们在对方面前可以完全敞开，这是难得的情感品质。',
    '健顺': '一刚一柔，一动一静，互补性极强的感情组合。一人负责引领方向，一人负责温暖人心，配合默契便是天作之合。',
    '顺健': '内在柔顺包容（坤），外在积极进取（乾），感情中一人是港湾一人是帆。关键是港湾不要觉得被忽视，帆不要忘记回港。',
    '健入': '乾的坚定配合巽的温柔渗透，感情中一方有主见，一方善解人意。你们的爱情不需要轰轰烈烈，日常中的理解和默契就是最好的情话。',
    '入健': '巽在内主细腻体贴，乾在外主果断担当，感情中的角色分工自然和谐。但要注意强势一方不要忽视细腻一方的感受。',
    '顺动': '坤的包容承接震的热情活力，感情中一个愿意等待，一个勇于追求。这是经典的"追逐-接纳"模式，甜蜜中带着踏实。',
    '动顺': '震在上主热烈追求，坤在下主温柔回应，感情的节奏明快而温馨。但热情一方需防三分钟热度，柔顺一方也要适时主动。',
    '陷丽': '坎的深沉配合离的热烈，感情中充满强烈的吸引和深刻的连接。你们之间的化学反应很强，但也要学会管理情绪的高低温差。',
    '丽陷': '离在上主热情浪漫，坎在下主深情内敛，感情中表面火热内心暗涌。关键是让内敛的一方感受到安全，让热情的一方学会倾听。',
    '止动': '艮的安静配合震的活跃，感情中一动一静形成独特平衡。活跃的一方带安静的一方看世界，安静的一方给活跃的一方一个家。',
    '动止': '震在上主主动追求，艮在下主沉稳回应，感情中的节奏有快有慢。需要找到双方都舒适的频率，不催促也不拖延。',
    '止说': '艮的沉稳配合兑的甜言蜜语，感情中一个用行动说话，一个用言语暖心。互补的表达方式是你们关系的保鲜剂。',
    '说止': '兑在上主表达，艮在下主含蓄，感情中一个爱说一个爱听。但要注意说的一方不要光说不做，含蓄的一方也要学会表达。',
    '入丽': '巽的温柔细腻配合离的热情浪漫，感情中既有心灵的深度共鸣又有外在的甜蜜表达。这是精神恋爱与现实相处兼备的美好组合。',
    '丽入': '离在上主光彩照人，巽在下主润物无声，感情中一个负责照亮，一个负责渗透。你们的爱情在细节中最动人。',
    '说动': '兑的甜蜜配合震的冲劲，感情中既有浪漫的表达又有积极的行动。甜言蜜语不是空话，因为每一个承诺都有行动来兑现。',
    '动说': '震在上主大胆追求，兑在下主欢喜回应，感情的发展节奏明快而愉悦。享受这份两情相悦的美好，同时记得给感情一些沉淀的时间。',
  };
  const wealthMap: Record<string, string> = {
    '健健': '财运旺盛，适合主动投资与开拓新财路。双乾之气如日中天，但盛极必衰，在高收益时记得落袋为安。',
    '顺顺': '财运平稳，适合保守理财，随势而动。双坤之象主积蓄和稳定，长线投资和稳健型理财产品更为适合。',
    '陷陷': '财运需谨慎，防范风险，避免冲动消费与投资。双坎之象如入深渊，当前不是冒险的时候，守住本金是第一要务。',
    '动动': '财运随行动而来，积极寻找机会但须控制节奏。双震之象主快速流转，短线操作可能比长线持有更适合当前财运。',
    '健顺': '乾的开拓力配合坤的守成力，财运呈现攻守兼备之象。可以拿出部分资金做进取型投资，同时保留充足的安全垫。',
    '顺健': '坤在内主积蓄，乾在外主拓展，财运先聚后散、先守后攻。前期做好充分的资金储备，后期才有底气大胆出手。',
    '健入': '乾的决断力配合巽的渗透力，适合在复杂的财务局面中找到突破口。你的商业嗅觉敏锐，能发现别人看不到的利润点。',
    '入健': '巽在内主精打细算，乾在外主大手笔运作，财运上适合以小博大、以巧取胜。不必追求规模，关键是精准和效率。',
    '顺动': '坤的稳当配合震的冲劲，财运上适合在稳健基础上尝试一些新方向。大部分资金保持原有配置，小部分试水新领域。',
    '动顺': '震在上主果断出手，坤在下主稳妥托底，财运上适合看准后快速行动。犹豫不决是最大的敌人，但行动前确保有退路。',
    '丽陷': '离的光明在上，坎的风险在下，财运表面看好但暗藏隐患。不要被高收益的表象迷惑，做好尽职调查再决策。',
    '陷丽': '坎在内主审慎判断，离在外主清晰视野，财运上适合先做风险分析再做投资决策。你的谨慎恰恰是赚钱的保障。',
    '止动': '艮的定力配合震的行动力，财运上需要等待最佳出手时机。过早入场或过晚退场都会损失，中间的节奏才是利润所在。',
    '动止': '震在上主积极运作，艮在下主适时收手，财运上适合快进快出。赚到了就落袋为安，不要贪心恋战。',
    '说丽': '兑的和悦配合离的光彩，财运适合通过人脉关系和公开表达来开拓。社交投资、口碑营销、品牌效应都是你的生财之道。',
    '丽说': '离在上主知名度，兑在下主沟通力，财运与你的表达能力和公众形象直接挂钩。内容变现、知识付费、咨询收费都是好方向。',
    '止说': '艮的稳健配合兑的和悦，财运上适合通过耐心谈判获取更好的交易条件。不急于成交，沉得住气才能拿到最好的价格。',
    '说止': '兑在上主善于交涉，艮在下主守得住底线，财运上适合商务谈判和合同签署。你知道什么时候该让步，什么时候该坚持。',
    '入丽': '巽的精明配合离的眼光，财运上适合做价值发现和趋势投资。你的敏锐让你能在众人还没反应过来时已经布局完成。',
    '丽入': '离在上主看清大势，巽在下主精细操作，财运上适合在明确趋势后做波段操作。大方向对了，细节处理决定最终收益。',
  };
  const healthMap: Record<string, string> = {
    '健健': '精力充沛，但需防止过劳，注意劳逸结合。双乾之象阳气过旺，易上火、失眠、头痛，宜多饮水、适当运动消耗多余能量。',
    '顺顺': '身体状况平和，适合养生调理，保持规律作息。双坤之象主脾胃系统，注意饮食均衡，避免寒凉食物过度摄入。',
    '陷陷': '健康方面需多加留意，定期体检，防范隐患。双坎之象主肾脏和泌尿系统，注意保暖防寒，避免过度消耗体力。',
    '止止': '宜静养休憩，避免过度劳累，给身心充分恢复的时间。双艮之象主关节和骨骼，适当做拉伸运动，避免久坐不动。',
    '健顺': '上乾下坤，阳气充沛而阴气调和，整体健康状况良好。但需注意上下不协调导致的头重脚轻，做些瑜伽或太极来平衡身心。',
    '顺健': '内坤外乾，内在需要休息但外在仍在拼命。这是最容易忽视健康信号的组合，身体发出的小不适要认真对待。',
    '健动': '乾与震皆为阳刚之象，体力和精力都很充沛，但也意味着身体始终处于高负荷状态。定期放松和减压至关重要。',
    '动健': '震在上主运动活跃，乾在下主体质强健，健康状况不错但要注意运动损伤。热身和拉伸不可省略，量力而行。',
    '健入': '乾的充沛精力配合巽的细致觉察，你既能保持高强度的工作节奏又能及时注意到身体的微小信号。这种自我觉察力是健康的保障。',
    '入健': '巽在内主敏感细腻，乾在外主刚强硬撑，身体可能已经发出疲劳信号但你还在坚持。是时候停下来听听身体的声音了。',
    '顺动': '坤的柔缓配合震的活跃，健康上适合选择温和但有活力的运动方式，如游泳、慢跑、舞蹈等。避免过于激烈的对抗性运动。',
    '动顺': '震在上主活跃好动，坤在下主柔缓包容，运动量适中即可，过度运动反而会消耗坤土所主的脾胃功能。',
    '丽陷': '离在上主心火旺，坎在下主肾水寒，健康上需注意心肾不交的问题。容易失眠多梦、心悸焦虑，宜做冥想和深呼吸练习。',
    '陷丽': '坎在内主体液循环，离在外主心血管，健康上需关注心脏和血液循环。定期监测血压，保持有氧运动的习惯。',
    '止动': '艮与震一静一动，健康上需要注意动静平衡。久坐之后要起来活动，剧烈运动后要充分休息，让身体在不同状态间平稳切换。',
    '动止': '震在上主好动，艮在下主关节，运动时要注意保护膝关节和脊柱。选择合适的运动鞋和正确的运动姿势很重要。',
    '说丽': '兑主肺部和呼吸系统，离主心脏和眼睛，健康上适合做有氧运动和眼部保健。注意用眼卫生，定期做心肺功能检查。',
    '丽说': '离在上主心血管，兑在下主呼吸道，健康上心肺系统需要特别关注。空气质量差时减少户外活动，保持室内通风。',
    '入说': '巽主肝胆和神经系统，兑主呼吸系统，健康上需注意情绪对身体的影响。肝气郁结容易导致免疫力下降，保持心情舒畅是最好的养生。',
    '说入': '兑在上主呼吸道，巽在下主肝胆，健康上适合做呼吸训练和情绪管理。瑜伽的调息法和正念冥想都很适合你当前的状态。',
  };

  const key = ua + la;
  const career = careerMap[key] || `${baseAdvice}在事业方面，应结合上下卦之势，刚柔并济，顺势而为。`;
  const love = loveMap[key] || `${baseAdvice}在感情方面，注意彼此沟通与理解，以诚相待。`;
  const wealth = wealthMap[key] || `${baseAdvice}在财运方面，审时度势，量入为出，稳中求进。`;
  const health = healthMap[key] || `${baseAdvice}在健康方面，顺应卦象之势，调养生息，保持身心平衡。`;

  return { career, love, wealth, health };
}

// ── 卦象关系卡片 ──────────────────────────────────────────────────────────────

const HexRelationCard: React.FC<{
  label: string;
  icon: string;
  hexagram: HexagramData;
  selfName: string;
  description: string;
}> = ({ label, icon, hexagram, selfName, description }) => {
  const isSame = hexagram.fullName === selfName;
  return (
    <div className="result-panel__hex-rel-card">
      <div className="result-panel__hex-rel-header">
        <span className="result-panel__hex-rel-icon">{icon}</span>
        <span className="result-panel__hex-rel-label">{label}</span>
      </div>
      <div className="result-panel__hex-rel-name">{hexagram.fullName}</div>
      {!isSame && (
        <p className="result-panel__hex-rel-judgment">「{hexagram.judgment.slice(0, 30)}{hexagram.judgment.length > 30 ? '…' : ''}」</p>
      )}
      <p className="result-panel__hex-rel-desc">
        {isSame
          ? `${label}与本卦相同（${hexagram.name}），说明此卦内外一致、表里如一，力量高度集中。`
          : description}
      </p>
    </div>
  );
};

// ── component ──────────────────────────────────────────────────────────────────

const ResultPanel: React.FC<ResultPanelProps> = ({ result, onSaveHistory, shareRef }) => {
  const [activeTab, setActiveTab] = useState<'judgment' | 'lines' | 'interpretation'>('judgment');
  const { hexagram, changedHexagram, changedLines, lines } = result;
  const lineValues: number[] = Array.from(lines);

  const upper = hexagram.upperTrigram;
  const lower = hexagram.lowerTrigram;
  const summary = buildComprehensiveSummary(
    hexagram.fullName, upper, lower, hexagram.judgment,
  );
  const advice = getInterpretationAdvice(upper, lower);

  const changeInsight = changedHexagram
    ? buildChangeInsight(
        hexagram.fullName,
        changedHexagram.fullName,
        upper,
        changedHexagram.upperTrigram,
        lower,
        changedHexagram.lowerTrigram,
      )
    : null;

  // 卦象关系：互卦、错卦、综卦
  const relationships = getHexagramRelationships(lines);

  return (
    <div className="result-panel" style={{ animation: 'fadeInUp 0.6s ease' }}>
      {/* 卦象展示 */}
      <div className="result-panel__hexagrams">
        <HexagramDisplay
          hexagram={hexagram}
          lines={lines}
          title="本 卦"
          changedPositions={changedLines}
        />
        {changedHexagram && (
          <div className="result-panel__arrow">⟶</div>
        )}
        {changedHexagram && (
          <HexagramDisplay
            hexagram={changedHexagram}
            lines={lineValues.map((v: number) => v === 6 ? 7 : v === 9 ? 8 : v)}
            title="变 卦"
          />
        )}
      </div>

      {/* 分享区域 */}
      <div ref={shareRef} className="result-panel__share-area">
        {/* 问卦问题 */}
        {result.question && (
          <div className="result-panel__question">
            <span className="result-panel__question-label">问</span>
            <span className="result-panel__question-text">{result.question}</span>
          </div>
        )}
        {/* 卦辞 */}
        <div className="result-panel__judgment-text">
          <p className="result-panel__judgment-quote">「{hexagram.judgment}」</p>
        </div>

        {/* Tab 切换 */}
        <div className="result-panel__tabs">
          <button
            className={`result-panel__tab ${activeTab === 'judgment' ? 'result-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('judgment')}
          >
            卦辞
          </button>
          <button
            className={`result-panel__tab ${activeTab === 'lines' ? 'result-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('lines')}
          >
            爻辞
          </button>
          <button
            className={`result-panel__tab ${activeTab === 'interpretation' ? 'result-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('interpretation')}
          >
            解读
          </button>
        </div>

        {/* Tab 内容 */}
        <div className="result-panel__content">
          {/* ── 卦辞 tab ── */}
          {activeTab === 'judgment' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="result-panel__item">
                <h4 className="result-panel__item-title">卦辞</h4>
                <p className="result-panel__item-text">{hexagram.judgment}</p>
                <p className="result-panel__item-translation">{hexagram.judgmentTranslation}</p>
              </div>
              <div className="result-panel__divider" />
              <div className="result-panel__item">
                <h4 className="result-panel__item-title">象辞</h4>
                <p className="result-panel__item-text">{hexagram.image}</p>
                <p className="result-panel__item-translation">{hexagram.imageTranslation}</p>
              </div>
              <div className="result-panel__divider" />
              <div className="result-panel__item">
                <h4 className="result-panel__item-title">彖辞</h4>
                <p className="result-panel__item-text">{hexagram.commentary}</p>
                <p className="result-panel__item-translation">{hexagram.commentaryTranslation}</p>
              </div>
            </div>
          )}

          {/* ── 爻辞 tab ── */}
          {activeTab === 'lines' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              {[...hexagram.lines].reverse().map((line) => {
                const isChanged = changedLines.includes(line.position);
                return (
                  <div
                    key={line.position}
                    className={`result-panel__yao${isChanged ? ' result-panel__yao--changed' : ''}`}
                  >
                    <div className="result-panel__yao-header">
                      <span className="result-panel__yao-name text-gold">{line.name}</span>
                      <span className="result-panel__yao-bar">
                        {line.type === 'yang' ? '⚊' : '⚋'}
                      </span>
                      {isChanged && (
                        <span className="result-panel__change-badge">变爻</span>
                      )}
                    </div>
                    <p className="result-panel__yao-text">{line.text}</p>
                    <p className="result-panel__yao-translation">{line.translation}</p>
                    <div className="result-panel__divider" />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── 解读 tab ── */}
          {activeTab === 'interpretation' && (
            <div className="result-panel__section" style={{ animation: 'fadeIn 0.3s ease' }}>
              {/* 综合分析 */}
              <div className="result-panel__summary">
                <h4 className="result-panel__summary-title">综合分析</h4>
                <p className="result-panel__summary-text">{summary}</p>
                <div className="result-panel__trigram-info">
                  <div className="result-panel__trigram-card">
                    <span className="result-panel__trigram-label">上卦</span>
                    <strong>{upper}</strong>（{TRIGRAM_ATTRIBUTE[upper] || ''}）
                    <span className="result-panel__trigram-meta">
                      象{TRIGRAM_NATURE[upper]} · {TRIGRAM_FAMILY[upper]} · {TRIGRAM_BODY[upper]} · {TRIGRAM_DIRECTION[upper]}
                    </span>
                  </div>
                  <span className="result-panel__trigram-sep">·</span>
                  <div className="result-panel__trigram-card">
                    <span className="result-panel__trigram-label">下卦</span>
                    <strong>{lower}</strong>（{TRIGRAM_ATTRIBUTE[lower] || ''}）
                    <span className="result-panel__trigram-meta">
                      象{TRIGRAM_NATURE[lower]} · {TRIGRAM_FAMILY[lower]} · {TRIGRAM_BODY[lower]} · {TRIGRAM_DIRECTION[lower]}
                    </span>
                  </div>
                </div>
              </div>

              {/* 变卦启示 */}
              {changeInsight && (
                <div className="result-panel__change-insight">
                  <h4 className="result-panel__change-insight-title">
                    变卦启示 — 从{hexagram.fullName}变为{changedHexagram!.fullName}
                  </h4>
                  <p className="result-panel__change-insight-text">{changeInsight}</p>
                </div>
              )}

              {/* 四维解读 + 补充建议 */}
              <div className="result-panel__interp">
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">💼</div>
                  <div>
                    <h4 className="result-panel__interp-title">事业</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.career}</p>
                    <p className="result-panel__interp-advice">{advice.career}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">❤️</div>
                  <div>
                    <h4 className="result-panel__interp-title">感情</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.love}</p>
                    <p className="result-panel__interp-advice">{advice.love}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">💰</div>
                  <div>
                    <h4 className="result-panel__interp-title">财运</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.wealth}</p>
                    <p className="result-panel__interp-advice">{advice.wealth}</p>
                  </div>
                </div>
                <div className="result-panel__interp-item">
                  <div className="result-panel__interp-icon">🏥</div>
                  <div>
                    <h4 className="result-panel__interp-title">健康</h4>
                    <p className="result-panel__interp-text">{hexagram.interpretation.health}</p>
                    <p className="result-panel__interp-advice">{advice.health}</p>
                  </div>
                </div>
              </div>

              {/* 卦象关系：互卦·错卦·综卦 */}
              <div className="result-panel__hex-relations">
                <h4 className="result-panel__hex-relations-title">卦象关系</h4>
                <div className="result-panel__hex-relations-grid">
                  <HexRelationCard
                    label="互卦"
                    icon="☯"
                    hexagram={relationships.nuclear}
                    selfName={hexagram.fullName}
                    description="取本卦第2-4爻为下、第3-5爻为上，揭示事物内在动力与隐藏因素"
                  />
                  <HexRelationCard
                    label="错卦"
                    icon="⇌"
                    hexagram={relationships.opposite}
                    selfName={hexagram.fullName}
                    description="本卦每爻阴阳互换，代表事物的对立面与互补视角"
                  />
                  <HexRelationCard
                    label="综卦"
                    icon="⟲"
                    hexagram={relationships.reversed}
                    selfName={hexagram.fullName}
                    description="本卦上下翻转，代表从对方或相反角度看同一件事"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="result-panel__actions">
        <button className="btn-secondary" onClick={onSaveHistory}>
          📜 保存记录
        </button>
      </div>
    </div>
  );
};

export default ResultPanel;
