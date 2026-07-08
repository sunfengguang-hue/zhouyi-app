import { useMemo } from 'react';
import type { AppView } from '../../types';
import { getLunarInfo } from '../../utils/lunarCalendar';
import { drawFortuneStick, getLevelColor } from '../../utils/fortuneStickCalc';
import './Home.css';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

interface CardItem {
  view: AppView;
  icon: string;
  title: string;
  sub: string;
  desc: string;
  modifier?: string;
}

const CARDS: CardItem[] = [
  {
    view: 'zhouyi',
    icon: '☯',
    title: '周易算卦',
    sub: '六爻占筮',
    desc: '三枚铜钱摇六次成卦，互卦错卦综卦全析，事业感情财运健康四维解读。',
    modifier: 'zhouyi',
  },
  {
    view: 'bazi',
    icon: '命',
    title: '生辰八字',
    sub: '四柱推命',
    desc: '天干地支排四柱，五行十神纳音神煞，大运流年全解析，五行生克圆图可视化。',
  },
  {
    view: 'fortune',
    icon: '签',
    title: '抽签问事',
    sub: '观音灵签',
    desc: '诚心摇签问事，百支灵签配典故仙机，五档吉凶分级，仪式感动画呈现。',
  },
  {
    view: 'tarot',
    icon: '🃏',
    title: '塔罗占卜',
    sub: '大阿尔卡纳',
    desc: '22张命运之牌3D翻转，元素星体关联，单牌指引或三牌阵组合叙事解读。',
  },
  {
    view: 'fengshui',
    icon: '風',
    title: '罗盘风水',
    sub: '八宅明镜',
    desc: '命卦定东西四命，SVG罗盘八方吉凶可视化，宅命匹配与化解之法。',
  },
  {
    view: 'naming',
    icon: '名',
    title: '起名测名',
    sub: '五格剖象',
    desc: '天格人格地格外格总格81数理，三才配置，音韵分析，AI推荐吉名。',
  },
  {
    view: 'astrology',
    icon: '☆',
    title: '星座运势',
    sub: '星座速查',
    desc: '十二星座性格深度解析，今日四维运势，本周前瞻，最佳配对与兼容分析。',
  },
];

// 每日种子随机
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getTodaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// 今日宜忌数据
const YI_ITEMS = [
  '祈福', '出行', '开业', '嫁娶', '动土', '安床', '修造', '纳财',
  '求医', '入学', '签约', '搬家', '祭祀', '交易', '开光', '栽种',
  '会友', '求职', '谈判', '理财', '远行', '置业', '装修', '求学',
];

const JI_ITEMS = [
  '破土', '安葬', '开仓', '伐木', '词讼', '造船', '掘井', '行丧',
  '探病', '远行', '嫁娶', '开业', '动土', '入宅', '修造', '出行',
  '纳畜', '开市', '移徙', '造桥', '筑堤', '开渠', '针灸', '服药',
];

// 今日推荐模块
const RECOMMEND_MODULES: { view: AppView; reason: string }[] = [
  { view: 'zhouyi', reason: '今日卦象灵动，适合摇卦问事' },
  { view: 'bazi', reason: '今日宜了解命理，探索自我' },
  { view: 'fortune', reason: '今日灵签有应，诚心可得指引' },
  { view: 'tarot', reason: '今日直觉敏锐，适合塔罗占卜' },
  { view: 'fengshui', reason: '今日宜审视风水，调整布局' },
  { view: 'naming', reason: '今日文曲星动，适合起名测名' },
  { view: 'astrology', reason: '今日星象活跃，查看运势正当时' },
];

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const todaySeed = useMemo(() => getTodaySeed(), []);

  // 今日宜忌（基于日期种子稳定）
  const todayYi = useMemo(() => {
    const items: string[] = [];
    for (let i = 0; items.length < 6 && i < YI_ITEMS.length; i++) {
      const idx = Math.floor(seededRandom(todaySeed + i * 7) * YI_ITEMS.length);
      if (!items.includes(YI_ITEMS[idx])) items.push(YI_ITEMS[idx]);
    }
    return items;
  }, [todaySeed]);

  const todayJi = useMemo(() => {
    const items: string[] = [];
    for (let i = 0; items.length < 4 && i < JI_ITEMS.length; i++) {
      const idx = Math.floor(seededRandom(todaySeed + i * 13 + 100) * JI_ITEMS.length);
      if (!items.includes(JI_ITEMS[idx]) && !todayYi.includes(JI_ITEMS[idx])) {
        items.push(JI_ITEMS[idx]);
      }
    }
    return items;
  }, [todaySeed, todayYi]);

  // 今日推荐
  const recommend = useMemo(() => {
    const idx = Math.floor(seededRandom(todaySeed + 42) * RECOMMEND_MODULES.length);
    return RECOMMEND_MODULES[idx];
  }, [todaySeed]);

  // 今日灵签（同日同签）
  const dailyStick = useMemo(() => drawFortuneStick('每日一问'), []);
  const stickLevelColor = getLevelColor(dailyStick.stick.level);

  // 今日日期显示
  const todayStr = useMemo(() => {
    const d = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${d.getMonth() + 1}月${d.getDate()}日 · 星期${weekDays[d.getDay()]}`;
  }, []);

  // 农历信息
  const lunarInfo = useMemo(() => getLunarInfo(), []);

  const lunarStr = useMemo(() => {
    if (!lunarInfo.lunarMonth) return '';
    return `农历 ${lunarInfo.ganZhi}${lunarInfo.shengXiao}年 · ${lunarInfo.lunarMonth}${lunarInfo.lunarDay}`;
  }, [lunarInfo]);

  return (
    <div className="home">
      <div className="home__intro">
        <div className="home__intro-taiji">☯</div>
        <div className="home__intro-title">玄学测算</div>
        <div className="home__intro-sub">知命 · 趋吉 · 避凶</div>
      </div>

      {/* 今日宜忌 */}
      <div className="home__daily">
        <div className="home__daily-header">
          <span className="home__daily-date">{todayStr}</span>
          {lunarStr && (
            <div className="home__daily-lunar">{lunarStr}</div>
          )}
          {lunarInfo.solarTerm && (
            <div className="home__daily-term">
              <span className="home__daily-term-dot">●</span>
              今日{lunarInfo.solarTerm}
            </div>
          )}
        </div>
        <div className="home__daily-content">
          <div className="home__daily-group">
            <span className="home__daily-label home__daily-label--yi">宜</span>
            <div className="home__daily-tags">
              {todayYi.map((item, i) => (
                <span key={i} className="home__daily-tag home__daily-tag--yi">{item}</span>
              ))}
            </div>
          </div>
          <div className="home__daily-divider" />
          <div className="home__daily-group">
            <span className="home__daily-label home__daily-label--ji">忌</span>
            <div className="home__daily-tags">
              {todayJi.map((item, i) => (
                <span key={i} className="home__daily-tag home__daily-tag--ji">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 今日推荐 */}
      <button className="home__recommend" onClick={() => onNavigate(recommend.view)}>
        <div className="home__recommend-badge">今日推荐</div>
        <div className="home__recommend-text">{recommend.reason}</div>
        <span className="home__recommend-arrow">立即体验 ›</span>
      </button>

      {/* 今日灵签 */}
      <button className="home__daily-stick" onClick={() => onNavigate('fortune')} style={{ animation: 'fadeInUp 0.6s ease 0.35s both' }}>
        <div className="home__daily-stick__badge">今日灵签</div>
        <div className="home__daily-stick__content">
          <div className="home__daily-stick__header">
            <span className="home__daily-stick__title">第{dailyStick.stick.id}签 · {dailyStick.stick.title}</span>
            <span className="home__daily-stick__level" style={{ color: stickLevelColor, borderColor: stickLevelColor }}>{dailyStick.stick.level}</span>
          </div>
          <p className="home__daily-stick__poem">{dailyStick.stick.poem.split('\n').slice(0, 2).join(' ')}</p>
          <span className="home__daily-stick__more">查看详解 ›</span>
        </div>
      </button>

      <div className="home__grid">
        {CARDS.map((card, i) => (
          <button
            key={card.view}
            className={`home__card ${card.modifier ? `home__card--${card.modifier}` : ''}`}
            onClick={() => onNavigate(card.view)}
            style={{ animation: `fadeInUp 0.5s ease ${0.4 + i * 0.08}s both` }}
          >
            <span className="home__card-icon">{card.icon}</span>
            <div className="home__card-body">
              <div className="home__card-title">{card.title}</div>
              <span className="home__card-sub">{card.sub}</span>
              <div className="home__card-desc">{card.desc}</div>
            </div>
            <span className="home__card-arrow">›</span>
          </button>
        ))}
      </div>

      <div className="home__disclaimer">仅供娱乐参考，切勿迷信</div>
    </div>
  );
};

export default Home;
