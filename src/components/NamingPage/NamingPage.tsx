import React, { useState, useMemo, useRef } from 'react';
import type { NameResult, WuXing } from '../../types';
import { recommendNames, analyzeName } from '../../utils/namingCalc';
import { SURNAMES } from '../../data/naming';
import ShareButton from '../ShareButton/ShareButton';
import './NamingPage.css';

const allSurnames = Object.keys(SURNAMES);

/** 可搜索姓氏选择器 */
const SurnamePicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() =>
    filter ? allSurnames.filter(s => s.includes(filter)) : allSurnames,
    [filter]
  );
  return (
    <div className="surname-picker">
      <input
        className="page-form__input surname-picker__input"
        placeholder={`当前：${value}（点击切换）`}
        value={filter}
        onChange={e => { setFilter(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && filtered.length > 0 && (
        <div className="surname-picker__dropdown">
          {filtered.slice(0, 30).map(s => (
            <button key={s} className={`surname-picker__option ${s === value ? 'surname-picker__option--active' : ''}`}
              onClick={() => { onChange(s); setFilter(''); setOpen(false); }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const NamingPage: React.FC = () => {
  const [tab, setTab] = useState<'recommend' | 'analyze'>('recommend');
  const [surname, setSurname] = useState('李');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [preferWX, setPreferWX] = useState<WuXing | 'auto'>('auto');
  const [results, setResults] = useState<NameResult[] | null>(null);
  const [analyzeGiven, setAnalyzeGiven] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState<NameResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState('');
  const analyzeRef = useRef<HTMLDivElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);

  const handleRecommend = () => { setResults(recommendNames(surname, gender, preferWX, 12)); setAnalyzeResult(null); };
  const handleAnalyze = () => {
    if (!analyzeGiven.trim()) return;
    const r = analyzeName(surname, analyzeGiven.trim());
    if (!r) { setAnalyzeError('未找到该姓氏，暂不支持分析'); setAnalyzeResult(null); return; }
    setAnalyzeError(''); setAnalyzeResult(r); setResults(null);
  };

  const scoreColor = (s: number) => s >= 90 ? '#2ecc71' : s >= 80 ? '#f1c40f' : '#e67e22';
  const geNames = ['天格', '人格', '地格', '外格', '总格'];
  const wxColors: Record<string, string> = { '金': '#f1c40f', '木': '#2ecc71', '水': '#3498db', '火': '#e74c3c', '土': '#e67e22' };

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
              <SurnamePicker value={surname} onChange={setSurname} />
            </div>
            <div className="page-form__group">
              <label className="page-form__label">性别</label>
              <select className="page-form__select" value={gender} onChange={e=>setGender(e.target.value as '男'|'女')}>
                <option value="男">男</option><option value="女">女</option>
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
          <div className="page-form__actions"><button className="btn-primary" onClick={handleRecommend}>推荐吉名</button></div>
        </>
      )}

      {tab === 'analyze' && (
        <>
          <div className="page-form__row">
            <div className="page-form__group">
              <label className="page-form__label">姓氏</label>
              <SurnamePicker value={surname} onChange={setSurname} />
            </div>
            <div className="page-form__group">
              <label className="page-form__label">名字</label>
              <input className="page-form__input" placeholder="输入名字（不含姓）" value={analyzeGiven} onChange={e=>setAnalyzeGiven(e.target.value)} />
            </div>
          </div>
          <div className="page-form__actions"><button className="btn-primary" onClick={handleAnalyze}>测算吉凶</button></div>
        </>
      )}

      {/* 推荐结果 */}
      {results && results.length > 0 && (
        <div ref={recommendRef} className="page-result naming-result">
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
                <p className="naming-card__meaning">{r.fullNameMeaning}</p>
                {/* 字义详解 */}
                {r.charDetails && r.charDetails.length > 0 && (
                  <div className="naming-card__chars">
                    {r.charDetails.map((cd, ci) => (
                      <div key={ci} className="naming-card__char">
                        <span className="naming-card__char-letter" style={{ color: wxColors[cd.wuxing] || '#ccc' }}>{cd.char}</span>
                        <div className="naming-card__char-info">
                          <span className="naming-card__char-wx" style={{ color: wxColors[cd.wuxing] || '#ccc' }}>{cd.wuxing} · {cd.strokes}画</span>
                          <span className="naming-card__char-meaning">{cd.meaning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {r.zodiacAdvice && (
                  <p className="naming-card__zodiac">{r.zodiacAdvice}</p>
                )}
                <div className="naming-card__pron">
                  <span className="naming-card__pron-label">音韵</span>
                  <span className="naming-card__pron-score" style={{color:scoreColor(r.pronunciation.score)}}>{r.pronunciation.score}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="page-form__actions">
            <ShareButton targetRef={recommendRef} fileName={`起名推荐_${surname}姓_${Date.now()}.png`} />
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
        <div ref={analyzeRef} className="page-result naming-result">
          <h2 className="naming-result__title">{analyzeResult.fullName} · 名字分析</h2>
          {analyzeResult.unknownChars && analyzeResult.unknownChars.length > 0 && (
            <div style={{
              textAlign:'center', padding:'10px 16px', margin:'0 auto 16px',
              maxWidth:'400px', background:'rgba(230,126,34,0.12)', border:'1px solid rgba(230,126,34,0.3)',
              borderRadius:'8px', fontSize:'13px', color:'#e67e22', lineHeight:'1.6'
            }}>
              字库未收录「{analyzeResult.unknownChars.join('、')}」，笔画数按默认6画计算，结果仅供参考
            </div>
          )}
          <div className="naming-analyze">
            {/* 综合评分 */}
            <div className="naming-analyze__score-box" style={{ animation: 'fadeInUp 0.5s ease 0.1s both' }}>
              <div className="naming-analyze__score-ring" style={{ ['--score-pct' as string]: `${analyzeResult.score}%` }}>
                <span className="naming-analyze__score" style={{color:scoreColor(analyzeResult.score)}}>{analyzeResult.score}</span>
              </div>
              <span className="naming-analyze__score-label">综合评分</span>
            </div>

            {/* 五格数理 */}
            <div className="naming-analyze__wuge" style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>
              <h4>五格数理</h4>
              {geNames.map((gn, gi) => {
                const ge = analyzeResult.wugeJi[gi];
                const isGood = ge.luck === '吉' || ge.luck === '半吉';
                const barColor = isGood ? '#2ecc71' : '#e74c3c';
                const barWidth = isGood ? `${Math.min(ge.index * 1.5, 100)}%` : `${Math.min(ge.index * 1.5, 100)}%`;
                return (
                  <div key={gn} className="naming-analyze__ge-row">
                    <span className="naming-analyze__ge-name">{gn}</span>
                    <span className="text-gold">{ge.index}</span>
                    <div className="naming-analyze__ge-bar">
                      <div className="naming-analyze__ge-bar-fill" style={{ width: barWidth, background: barColor }} />
                    </div>
                    <span className={`tag tag-${isGood ? 'gold' : 'vermillion'}`}>{ge.luck}</span>
                    <span className="text-secondary naming-analyze__ge-desc">{ge.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* 三才配置 */}
            <div className="naming-analyze__sancai" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
              <h4>三才配置</h4>
              <p>{analyzeResult.sancai.tian}（天）· {analyzeResult.sancai.ren}（人）· {analyzeResult.sancai.di}（地）</p>
              <p className={`tag tag-${analyzeResult.sancai.luck==='凶'?'vermillion':'gold'}`}>{analyzeResult.sancai.luck}：{analyzeResult.sancai.desc}</p>
            </div>

            {/* 名字寓意 */}
            <div className="naming-analyze__section" style={{ animation: 'fadeInUp 0.5s ease 0.4s both' }}>
              <h4>名字寓意</h4>
              <p className="naming-analyze__meaning-text">{analyzeResult.fullNameMeaning}</p>
            </div>

            {/* 逐字分析 */}
            <div className="naming-analyze__section" style={{ animation: 'fadeInUp 0.5s ease 0.5s both' }}>
              <h4>逐字分析</h4>
              <div className="naming-analyze__chars">
                {analyzeResult.charDetails.map((cd, i) => (
                  <div key={i} className="naming-analyze__char-card" style={{ animation: `fadeInUp 0.4s ease ${0.5 + i * 0.1}s both` }}>
                    <div className="naming-analyze__char-head">
                      <span className="naming-analyze__char-name">{cd.char}</span>
                      <span className="naming-analyze__char-wx" style={{color: wxColors[cd.wuxing] || '#ccc'}}>五行{cd.wuxing}</span>
                    </div>
                    <div className="naming-analyze__char-info">
                      <span>康熙笔画：{cd.strokes}画</span>
                      <span>部首：{cd.radical}</span>
                    </div>
                    <p className="naming-analyze__char-meaning">{cd.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 音韵分析 */}
            <div className="naming-analyze__section" style={{ animation: 'fadeInUp 0.5s ease 0.6s both' }}>
              <h4>音韵分析</h4>
              <div className="naming-analyze__pron">
                <span className="naming-analyze__pron-score" style={{color:scoreColor(analyzeResult.pronunciation.score)}}>
                  {analyzeResult.pronunciation.score}分
                </span>
                <p className="naming-analyze__pron-text">{analyzeResult.pronunciation.analysis}</p>
              </div>
            </div>

            {/* 生肖建议 */}
            <div className="naming-analyze__section" style={{ animation: 'fadeInUp 0.5s ease 0.7s both' }}>
              <h4>生肖宜忌</h4>
              <p className="naming-analyze__zodiac-text">{analyzeResult.zodiacAdvice}</p>
            </div>
          </div>
          <div className="page-form__actions">
            <ShareButton targetRef={analyzeRef} fileName={`姓名分析_${analyzeResult.fullName}_${Date.now()}.png`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NamingPage;
