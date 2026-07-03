import './Header.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = '周易算卦' }) => {
  return (
    <header className="header">
      <div className="header__taiji">☯</div>
      <h1 className="header__title">{title}</h1>
      <p className="header__subtitle">古法正宗 · 知命不惧</p>
    </header>
  );
};

export default Header;
