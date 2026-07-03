import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      {/* 背景装饰 */}
      <div className="layout__bg">
        <div className="layout__cloud layout__cloud--1" />
        <div className="layout__cloud layout__cloud--2" />
        <div className="layout__cloud layout__cloud--3" />
        <div className="layout__mountain" />
        <div className="layout__mist" />
      </div>

      <div className="layout__content">
        {children}
      </div>

      <footer className="layout__footer">
        <p>周易算卦 · 铜钱摇卦法</p>
        <p className="layout__footer-sub">卦象仅供参考，命由己造</p>
      </footer>
    </div>
  );
};

export default Layout;
