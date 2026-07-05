import React, { useState } from 'react';
import type { NameResult, WuXing } from '../../types';
import { recommendNames, analyzeName } from '../../utils/namingCalc';
import { SURNAMES } from '../../data/naming';
import './NamingPage.css';

const NamingPage: React.FC = () => {
  const [tab, setTab] = useState<'recommend' | 'analyze'>('recommend');
  const [surname, setSurname] = useState('李');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [preferWX, setPreferWX] = useState<WuXing | 'auto'>('auto');
  const [results, setResults] = useState<NameResult[] | null>(null);

  // 测名
  const [analyzeGiven, setAnalyzeGiven] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState<NameResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState('');

  const handleRecommend = () => {
    setResults(recommendNames(surname, gender, preferWX, 12));
    setAnalyzeResult(null);
  };

  const handleAnalyze = () => {
    if (!analyzeGiven.trim()) return;
    const r = analyzeName(surname, analyzeGiven.trim());
    if (!r) {
      setAnalyzeError('未找到该姓氏，暂不支持分析');
      setAnalyzeResult(null);
      return;
    }
    setAnalyzeError('');
    setAnalyzeResult(r);
    setResults(null);
  };

  const scoreColor = (s: number) => s >= 90 ? '#2ecc71' : s >= 80 ? '#f1c40f' : '#e67e22';
  const geNames = ['天格', '人格', '地格', '外格', '总格'];

  return (
    <div className="page-form naming-page">
      <div className="naming-tabs">
        <button className={`naming-tab ${tab==='recommend'?'naming-tab--active':''}`} onClick={()=>setTab('recommend')}>智能起名</button>
        <button className={`naming-tab ${tab==='analyze'?'naming-tab--active':''}`} onClick={()=>setTab('analyze')}>姓名测吉凶</button>
      </div>

      {tab === 'recommend' && (
        <>
          <div className="page-form__row">
            <div className="page-form__group">
              <label className="page-form__label">姓氏</label>
              <select className="page-form__select" value={surname} onChange={e=>setSurname(e.target.value)}>
                {Object.keys(SURNAMES).map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="page-form__group">
              <label className="page-form__label">性别</label>
              <select className="page-form__select" value={gender} onChange={e=>setGender(e.target.value as '男'|'女')}>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
          </div>
          <div className="page-form__group">
            <label className="page-form__label">八字喜用五行（可选）</label>
            <select className="page-form__select" value={preferWX} onChange={e=>setPreferWX(e.target.value as WuXing|'auto')}>
              <option value="auto">自动匹配</option>
              <option value="金">金</option><option value="木">木</option>
              <option value="水">水</option><option value="火">火</option><option value="土">土</option>
            </select>
          </div>
          <div className="page-form__actions">
            <button className="btn-primary" onClick={handleRecommend}>推荐吉名</button>
          </div>
        </>
      )}

      {tab === 'analyze' && (
        <>
          <div className="page-form__row">
            <div className="page-form__group">
              <label className="page-form__label">姓氏</label>
              <select className="page-form__select" value={surname} onChange={e=>setSurname(e.target.value)}>
                {Object.keys(SURNAMES).map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="page-form__group">
              <label className="page-form__label">名字</label>
              <input className="page-form__input" placeholder="输入名字（不含姓）" value={analyzeGiven} onChange={e=>setAnalyzeGiven(e.target.value)} />
            </div>
          </div>
          <div className="page-form__actions">
            <button className="btn-primary" onClick={handleAnalyze}>测算吉凶</button>
          </div>
        </>
      )}

      {/* 推荐结果 */}
      {results && results.length > 0 && (
        <div className="page-result naming-result">
          <h2 className="naming-result__title">为您推荐 · {surname}姓{gender}宝吉名</h2>
          <div className="naming-list">
            {results.map((r, i) => (
              <div key={i} className="naming-card" style={{animation:`fadeInUp 0.4s ease ${i*0.06}s both`}}>
                <div className="naming-card__head">
                  <span className="naming-card__name text-gold">{r.fullName}</span>
                  <span className="naming-card__score" style={{color:scoreColor(r.score)}}>{r.score}分</span>
                </div>
                <div className="naming-card__wuge">
                  {geNames.map((gn, gi) => (
                    <span key={gn} className={`naming-card__ge naming-card__ge--${r.wugeJi[gi].luck}`}>
                      {gn}{r.wugeJi[gi].index}<sub>{r.wugeJi[gi].luck}</sub>
                    </span>
                  ))}
                </div>
                <p className="naming-card__sancai">三才：{r.sancai.tian}{r.sancai.ren}{r.sancai.di} · <span className={`text-${r.sancai.luck==='吉'?'gold':'secondary'}`}>{r.sancai.luck}</span></p>
                <p className="naming-card__meaning">{r.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analyzeError && (
        <div className="page-result" style={{textAlign:'center',color:'var(--vermillion-light)',padding:'20px'}}>
          {analyzeError}
        </div>
      )}

      {/* 测名结果 */}
      {analyzeResult && (
        <div className="page-result naming-result">
          <h2 className="naming-result__title">{analyzeResult.fullName} · 名字分析</h2>
          <div className="naming-analyze">
            <div className="naming-analyze__score-box">
              <span className="naming-analyze__score" style={{color:scoreColor(analyzeResult.score)}}>{analyzeResult.score}</span>
              <span className="naming-analyze__score-label">综合评分</span>
            </div>
            <div className="naming-analyze__wuge">
              <h4>五格数理</h4>
              {geNames.map((gn, gi) => (
                <div key={gn} className="naming-analyze__ge-row">
                  <span className="naming-analyze__ge-name">{gn}</span>
                  <span className="text-gold">{analyzeResult.wugeJi[gi].index}</span>
                  <span className={`tag tag-${analyzeResult.wugeJi[gi].luck==='凶'?'vermillion':'gold'}`}>{analyzeResult.wugeJi[gi].luck}</span>
                  <span className="text-secondary">{analyzeResult.wugeJi[gi].desc}</span>
                </div>
              ))}
            </div>
            <div className="naming-analyze__sancai">
              <h4>三才配置</h4>
              <p>{analyzeResult.sancai.tian}（天）· {analyzeResult.sancai.ren}（人）· {analyzeResult.sancai.di}（地）</p>
              <p className={`tag tag-${analyzeResult.sancai.luck==='凶'?'vermillion':'gold'}`}>{analyzeResult.sancai.luck}：{analyzeResult.sancai.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamingPage;
