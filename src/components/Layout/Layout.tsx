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
        {/* SVG 山脉剪影 */}
        <svg className="layout__mountain-svg" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(22,33,62,0.6)" />
              <stop offset="100%" stopColor="rgba(22,33,62,0.2)" />
            </linearGradient>
            <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(15,52,96,0.4)" />
              <stop offset="100%" stopColor="rgba(15,52,96,0.1)" />
            </linearGradient>
            <linearGradient id="mtn3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(22,33,62,0.3)" />
              <stop offset="100%" stopColor="rgba(22,33,62,0.05)" />
            </linearGradient>
          </defs>
          {/* 远山 */}
          <path d="M0,280 Q120,180 240,220 Q360,140 480,200 Q600,120 720,190 Q840,100 960,170 Q1080,110 1200,180 Q1320,140 1440,200 L1440,320 L0,320 Z" fill="url(#mtn3)" />
          {/* 中山 */}
          <path d="M0,300 Q100,220 200,260 Q320,180 440,240 Q560,160 680,230 Q800,170 920,220 Q1040,160 1160,210 Q1300,180 1440,240 L1440,320 L0,320 Z" fill="url(#mtn2)" />
          {/* 近山 */}
          <path d="M0,290 Q80,250 180,270 Q300,220 420,260 Q540,200 660,250 Q780,210 900,245 Q1020,200 1140,240 Q1280,210 1440,260 L1440,320 L0,320 Z" fill="url(#mtn1)" />
        </svg>
        <div className="layout__mist" />
      </div>

      <div className="layout__content">
        {children}
      </div>

      <footer className="layout__footer">
        <p>玄学测算 · 知命不惧</p>
        <p className="layout__footer-sub">仅供娱乐参考，切勿迷信</p>
      </footer>
    </div>
  );
};

export default Layout;
