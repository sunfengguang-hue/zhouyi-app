import type { AppView } from '../../types';
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
    desc: '三枚铜钱摇六次，得本卦变卦，解读事业、感情、财运、健康。',
    modifier: 'zhouyi',
  },
  {
    view: 'bazi',
    icon: '命',
    title: '生辰八字',
    sub: '四柱推命',
    desc: '天干地支排四柱，五行十神论命格，真太阳时校正。',
  },
  {
    view: 'fengshui',
    icon: '風',
    title: '罗盘风水',
    sub: '八宅明镜',
    desc: '命卦定东西四宅，八方吉凶方位，居家布局参考。',
  },
  {
    view: 'naming',
    icon: '名',
    title: '起名测名',
    sub: '五格剖象',
    desc: '天格人格地格外格总格，三才配置，姓名评分与推荐。',
  },
  {
    view: 'astrology',
    icon: '☆',
    title: '星座运势',
    sub: '星座速查',
    desc: '十二星座今日运势，性格特质，元素相合度一览。',
  },
];

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="home">
      {/* 开篇 */}
      <div className="home__intro">
        <div className="home__intro-taiji">☯</div>
        <div className="home__intro-title">玄学测算</div>
        <div className="home__intro-sub">知命 · 趋吉 · 避凶</div>
      </div>

      {/* 功能卡片 */}
      <div className="home__grid">
        {CARDS.map((card) => (
          <button
            key={card.view}
            className={`home__card ${card.modifier ? `home__card--${card.modifier}` : ''}`}
            onClick={() => onNavigate(card.view)}
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

      {/* 免责声明 */}
      <div className="home__disclaimer">仅供娱乐参考，切勿迷信</div>
    </div>
  );
};

export default Home;
