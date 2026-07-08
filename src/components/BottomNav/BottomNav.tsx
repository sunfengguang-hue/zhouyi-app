import type { AppView } from '../../types';
import './BottomNav.css';

interface BottomNavProps {
  current: AppView;
  onNavigate: (view: AppView) => void;
}

interface NavItem {
  view: AppView;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: 'home', icon: '⌂', label: '首页' },
  { view: 'zhouyi', icon: '☯', label: '周易' },
  { view: 'bazi', icon: '命', label: '八字' },
  { view: 'fortune', icon: '签', label: '抽签' },
  { view: 'tarot', icon: '🃏', label: '塔罗' },
  { view: 'fengshui', icon: '風', label: '风水' },
  { view: 'naming', icon: '名', label: '起名' },
  { view: 'astrology', icon: '☆', label: '星座' },
];

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate }) => {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__scroll">
        {NAV_ITEMS.map((item) => {
          const active = current === item.view;
          return (
            <button
              key={item.view}
              className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
              onClick={() => onNavigate(item.view)}
            >
              <span className="bottom-nav__icon">{item.icon}</span>
              <span className="bottom-nav__label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
