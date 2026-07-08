import React, { useState } from 'react';
import type { BaziResult } from '../../types';
import { calculateBazi, getYearPillarInfo } from '../../utils/baziCalc';
import { SHISHEN_DESC, DAY_MASTER_PERSONALITY } from '../../data/bazi';
import './BaziPage.css';

const BaziPage: React.FC = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(now.getHours());
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [result, setResult] = useState<BaziResult | null>(null);

  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (year < 1900 || year > 2100) { setError('请输入1900-2100之间的年份'); return; }
    if (month < 1 || month > 12) { setError('月份须在1-12之间'); return; }
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) { setError(`${year}年${month}月的日期范围为1-${daysInMonth}`); return; }
    setError('');
    const res = calculateBazi(year, month, day, hour, 0, gender, 116.4);
    setResult(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => setResult(null);

  if (result) return <BaziResultView result={result} onReset={handleReset} />;

  return (
    <div className="page-form bazi-form">
      <p className="bazi-form__intro">输入出生时间，排四柱八字，析五行十神</p>

      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">出生年</label>
          <input className="page-form__input" type="number" min={1900} max={2100} value={year} onChange={e => setYear(+e.target.value)} />
        </div>
        <div className="page-form__group">
          <label className="page-form__label">月</label>
          <input className="page-form__input" type="number" min={1} max={12} value={month} onChange={e => setMonth(+e.target.value)} />
        </div>
        <div className="page-form__group">
          <label className="page-form__label">日</label>
          <input className="page-form__input" type="number" min={1} max={31} value={day} onChange={e => setDay(+e.target.value)} />
        </div>
      </div>

      <div className="page-form__row">
        <div className="page-form__group">
          <label className="page-form__label">时辰</label>
          <select className="page-form__select" value={hour} onChange={e => setHour(+e.target.value)}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}时</option>
            ))}
          </select>
        </div>
        <div className="page-form__group">
          <label className="page-form__label">性别</label>
          <select className="page-form__select" value={gender} onChange={e => setGender(e.target.value as '男' | '女')}>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
      </div>

      {error && <p className="page-form__error" style={{color:'#e74c3c',textAlign:'center',margin:'8px 0'}}>{error}</p>}

      <div className="page-form__actions">
        <button className="btn-primary" onClick={handleSubmit}>排盘测算</button>
      </div>
    </div>
  );
};

/** 结果展示 */
const BaziResultView: React.FC<{ result: BaziResult; onReset: () => void }> = ({ result, onReset }) => {
  const r = result;
  const pillars = [r.year, r.month, r.day, r.hour];
  const pillarNames = ['年柱', '月柱', '日柱', '时柱'];
  const wxNames = ['金', '木', '水', '火', '土'] as const;
  const wxTotal = Object.values(r.wuxingCount).reduce((a, b) => a + b, 0);

  const strengthColors: Record<string, string> = {
    '旺': '#e74c3c', '偏旺': '#e67e22', '中和': '#f1c40f',
    '偏弱': '#3498db', '弱': '#2ecc71',
  };

  const wxColors: Record<string, string> = {
    '金': '#f1c40f', '木': '#2ecc71', '水': '#3498db', '火': '#e74c3c', '土': '#e67e22',
  };

  // Deduplicate shiShenDetails by name+position for display
  const uniqueShiShen = r.shiShenDetails.reduce((acc, item) => {
    const key = `${item.position}-${item.name}`;
    if (!acc.find(a => `${a.position}-${a.name}` === key)) acc.push(item);
    return acc;
  }, [] as typeof r.shiShenDetails);

  return (
    <div className="page-result bazi-result">
      <h2 className="bazi-result__title">四柱八字排盘</h2>
      <p className="bazi-result__time">{r.input.gender}命 · {r.solarTime}</p>

      {/* 四柱表 */}
      <div className="bazi-result__pillars">
        {pillars.map((p, i) => (
          <div key={i} className="bazi-pillar" style={{ animation: `fadeInUp 0.4s ease ${i * 0.12}s both` }}>
            <span className="bazi-pillar__name">{pillarNames[i]}</span>
            <div className="bazi-pillar__gan">{p.gan}</div>
            <span className="bazi-pillar__ss">{p.ganSS}</span>
            <div className="bazi-pillar__zhi">{p.zhi}</div>
            <span className="bazi-pillar__ss">{p.zhiSS}</span>
            <div className="bazi-pillar__cang">
              {p.zhiCangGan.map((c, j) => (
                <span key={j} className="bazi-pillar__cang-item">
                  {c.gan}({c.ss})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 日主信息 */}
      <div className="bazi-result__info">
        <div className="bazi-result__info-card">
          <h4>日主</h4>
          <span className="bazi-result__day-master">{r.dayMaster}</span>
          <span className="bazi-result__day-wx">（{r.dayMasterWX}）</span>
        </div>
        <div className="bazi-result__info-card">
          <h4>日主强弱</h4>
          <span style={{ color: strengthColors[r.strength], fontWeight: 'bold' }}>{r.strength}</span>
        </div>
        <div className="bazi-result__info-card">
          <h4>喜用神</h4>
          <span className="text-gold">{r.favorableWX.join('、')}</span>
        </div>
      </div>

      {/* 纳音五行 */}
      <div className="bazi-result__nayin">
        <h3 className="bazi-result__section-title">纳音五行</h3>
        <div className="bazi-nayin__grid">
          {r.nayin.map((item, i) => (
            <div key={i} className="bazi-nayin__item" style={{ animation: `fadeInUp 0.4s ease ${i * 0.1}s both` }}>
              <span className="bazi-nayin__pillar">{item.pillar}</span>
              <span className="bazi-nayin__value">{item.nayin}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 日主性格分析 */}
      <div className="bazi-result__personality">
        <h3 className="bazi-result__section-title">日主性格分析</h3>
        <div className="bazi-personality__card">
          <div className="bazi-personality__header">
            <span className="bazi-personality__stem">{r.dayMaster}</span>
            <span className="bazi-personality__wx">{r.dayMasterWX}</span>
          </div>
          <div className="bazi-personality__body">
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">性格特质</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.character}</p>
            </div>
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">事业运势</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.career}</p>
            </div>
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">感情婚姻</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.love}</p>
            </div>
            <div className="bazi-personality__section">
              <h5 className="bazi-personality__label">财运分析</h5>
              <p className="bazi-personality__text">{r.dayMasterPersonality.wealth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 十神详解 */}
      <div className="bazi-result__shishen">
        <h3 className="bazi-result__section-title">十神详解</h3>
        <div className="bazi-shishen__list">
          {uniqueShiShen.map((item, i) => (
            <div key={i} className="bazi-shishen__item" style={{ animation: `fadeInUp 0.3s ease ${i * 0.06}s both` }}>
              <div className="bazi-shishen__head">
                <span className="bazi-shishen__name">{item.name}</span>
                <span className="bazi-shishen__pos">{item.position}</span>
              </div>
              <p className="bazi-shishen__desc">{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 五行分布 */}
      <div className="bazi-result__wuxing">
        <h3 className="bazi-result__section-title">五行分布</h3>
        <div className="bazi-result__wx-bars">
          {wxNames.map(wx => {
            const val = r.wuxingCount[wx];
            const pct = wxTotal > 0 ? Math.round((val / wxTotal) * 100) : 0;
            const isFavorable = r.favorableWX.includes(wx);
            return (
              <div key={wx} className="bazi-wx-item">
                <span className="bazi-wx-item__label">
                  {wx}
                  {isFavorable && <span className="bazi-wx-item__tag bazi-wx-item__tag--xi">喜</span>}
                </span>
                <div className="bazi-wx-item__bar">
                  <div className="bazi-wx-item__fill" style={{ width: `${Math.max(pct, 4)}%`, background: wxColors[wx] }} />
                </div>
                <span className="bazi-wx-item__val">{val}</span>
                <span className="bazi-wx-item__pct">{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* 五行生克圆图 */}
        <div className="bazi-wx-circle-wrap">
          <svg className="bazi-wx-circle" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
            {/* 5 nodes arranged in circle: 木(top-left), 火(top-right), 土(center-bottom-right), 金(center-bottom-left), 水(bottom) */}
            {(() => {
              const cx = 130, cy = 130, R = 95;
              // Order: 木→火→土→金→水 (generation cycle order)
              const wxOrder: Array<'木'|'火'|'土'|'金'|'水'> = ['木','火','土','金','水'];
              const angles = [-90, -18, 54, 126, 198]; // evenly spaced starting from top
              const toRad = (d: number) => d * Math.PI / 180;
              const maxVal = Math.max(...Object.values(r.wuxingCount), 1);
              const nodes = wxOrder.map((wx, i) => {
                const a = toRad(angles[i]);
                return {
                  wx,
                  x: cx + R * Math.cos(a),
                  y: cy + R * Math.sin(a),
                  count: r.wuxingCount[wx],
                  pct: wxTotal > 0 ? Math.round((r.wuxingCount[wx] / wxTotal) * 100) : 0,
                  isFav: r.favorableWX.includes(wx),
                  r: 18 + (r.wuxingCount[wx] / maxVal) * 12, // 18-30 radius based on count
                };
              });

              return (
                <>
                  {/* 相生 arrows (outer): 木→火→土→金→水→木 */}
                  {nodes.map((n, i) => {
                    const next = nodes[(i + 1) % 5];
                    const dx = next.x - n.x, dy = next.y - n.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const ux = dx / dist, uy = dy / dist;
                    const x1 = n.x + ux * (n.r + 4), y1 = n.y + uy * (n.r + 4);
                    const x2 = next.x - ux * (next.r + 6), y2 = next.y - uy * (next.r + 6);
                    const mx = (x1 + x2) / 2 + (-(y2 - y1)) * 0.15;
                    const my = (y1 + y2) / 2 + ((x2 - x1)) * 0.15;
                    return (
                      <path key={`gen-${i}`} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                        fill="none" stroke="rgba(46,204,113,0.4)" strokeWidth="1.5"
                        markerEnd="url(#arrowGen)" />
                    );
                  })}
                  {/* 相克 arrows (inner star): 木→土→水→火→金→木 */}
                  {[0,1,2,3,4].map(i => {
                    const from = nodes[i];
                    const to = nodes[(i + 2) % 5];
                    const dx = to.x - from.x, dy = to.y - from.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const ux = dx / dist, uy = dy / dist;
                    const x1 = from.x + ux * (from.r + 4), y1 = from.y + uy * (from.r + 4);
                    const x2 = to.x - ux * (to.r + 6), y2 = to.y - uy * (to.r + 6);
                    return (
                      <line key={`over-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="rgba(231,76,60,0.25)" strokeWidth="1"
                        strokeDasharray="4 3" markerEnd="url(#arrowOver)" />
                    );
                  })}
                  {/* Arrow markers */}
                  <defs>
                    <marker id="arrowGen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="rgba(46,204,113,0.6)" />
                    </marker>
                    <marker id="arrowOver" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="rgba(231,76,60,0.4)" />
                    </marker>
                  </defs>
                  {/* Element nodes */}
                  {nodes.map((n, i) => (
                    <g key={i}>
                      <circle cx={n.x} cy={n.y} r={n.r}
                        fill={`${wxColors[n.wx]}22`}
                        stroke={n.isFav ? 'rgba(212,168,83,0.8)' : `${wxColors[n.wx]}88`}
                        strokeWidth={n.isFav ? 2.5 : 1.5} />
                      <text x={n.x} y={n.y - 2} textAnchor="middle" dominantBaseline="central"
                        fill={wxColors[n.wx]} fontSize="15" fontWeight="bold"
                        fontFamily="'STKaiti','KaiTi',serif">
                        {n.wx}
                      </text>
                      <text x={n.x} y={n.y + 12} textAnchor="middle" dominantBaseline="central"
                        fill="rgba(255,255,255,0.5)" fontSize="9">
                        {n.pct}%
                      </text>
                      {n.isFav && (
                        <text x={n.x} y={n.y - n.r - 6} textAnchor="middle" dominantBaseline="central"
                          fill="rgba(212,168,83,0.8)" fontSize="9" fontWeight="bold">
                          喜
                        </text>
                      )}
                    </g>
                  ))}
                  {/* Legend */}
                  <line x1="10" y1="248" x2="30" y2="248" stroke="rgba(46,204,113,0.5)" strokeWidth="1.5" />
                  <text x="34" y="248" dominantBaseline="central" fill="rgba(255,255,255,0.4)" fontSize="9">相生</text>
                  <line x1="70" y1="248" x2="90" y2="248" stroke="rgba(231,76,60,0.4)" strokeWidth="1" strokeDasharray="4 3" />
                  <text x="94" y="248" dominantBaseline="central" fill="rgba(255,255,255,0.4)" fontSize="9">相克</text>
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* 大运流年 */}
      <div className="bazi-result__dayun">
        <h3 className="bazi-result__section-title">大运流年</h3>
        <div className="bazi-dayun__timeline">
          {r.daYun.map((dy, i) => (
            <div key={i} className="bazi-dayun__item" style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
              <div className="bazi-dayun__age">{dy.age}-{dy.age + 9}岁</div>
              <div className="bazi-dayun__ganzhi">{dy.ganZhi}</div>
              <div className="bazi-dayun__wx" style={{ color: wxColors[dy.wuxing] || '#ccc' }}>{dy.wuxing}</div>
              <div className="bazi-dayun__year">{dy.year}年</div>
            </div>
          ))}
        </div>
        <div className="bazi-dayun__line" />
      </div>

      {/* 大运详解 */}
      <div className="bazi-result__dayun-detail">
        <h3 className="bazi-result__section-title">大运详解</h3>
        <div className="bazi-dayun-detail__list">
          {r.daYun.map((dy, i) => (
            <div key={i} className="bazi-dayun-detail__item" style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
              <div className="bazi-dayun-detail__header">
                <span className="bazi-dayun-detail__ganzhi">{dy.ganZhi}</span>
                <span className="bazi-dayun-detail__age">{dy.age}-{dy.age + 9}岁</span>
                <span className="bazi-dayun-detail__wx" style={{ color: wxColors[dy.wuxing] || '#ccc' }}>{dy.wuxing}运</span>
              </div>
              <p className="bazi-dayun-detail__text">{dy.interp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 神煞提示 */}
      {r.shenSha.length > 0 && (
        <div className="bazi-result__shensha">
          <h3 className="bazi-result__section-title">神煞</h3>
          <div className="bazi-shensha__grid">
            {r.shenSha.map((s, i) => {
              const match = s.match(/^(.+?)（(.+?)）$/);
              const name = match ? match[1] : s;
              const desc = match ? match[2] : '';
              const icons: Record<string, string> = {
                '天乙贵人': '🌟', '文昌贵人': '📚', '驿马星': '🐴',
                '桃花/咸池': '🌸', '羊刃': '⚔️', '禄神': '💰',
                '金舆星': '🚗', '将星': '🏴', '华盖星': '🎭',
                '天德贵人': '🛡️', '月德贵人': '🌙', '日坐禄地': '🏠',
                '五行俱全': '☯️',
              };
              const icon = icons[name] || '✨';
              return (
                <div key={i} className="bazi-shensha__card" style={{ animation: `fadeInUp 0.3s ease ${i * 0.06}s both` }}>
                  <span className="bazi-shensha__icon">{icon}</span>
                  <div className="bazi-shensha__body">
                    <span className="bazi-shensha__name">{name}</span>
                    {desc && <span className="bazi-shensha__desc">{desc}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 流年运势 */}
      {(() => {
        const currentYear = new Date().getFullYear();
        const liuNian = getYearPillarInfo(currentYear);
        const ss = liuNian.shiShen(r.dayMaster);
        const yearWXIsFav = r.favorableWX.includes(liuNian.ganWX) || r.favorableWX.includes(liuNian.zhiWX);
        const sameWX = liuNian.ganWX === r.dayMasterWX;

        // 流年四维度预测（基于十神类型）
        const forecasts: Record<string, { career: string; love: string; wealth: string; health: string }> = {
          '比肩': {
            career: '今年同行竞争激烈，合作关系增多。宜拓展人脉、组建团队，但需防合作伙伴反目。',
            love: '社交圈活跃，桃花机会多但也容易出现第三者。已有伴侣者需加强沟通，防范外界干扰。',
            wealth: '财运平稳但竞争激烈，正财为主。合伙投资需谨慎评估，独立经营反而更有主动权。',
            health: '体力充沛但易因争强好胜而透支，注意劳逸结合，防范运动损伤。',
          },
          '劫财': {
            career: '今年职场暗流涌动，表面和谐背后竞争激烈。宜守不宜攻，稳中求进为上策。',
            love: '感情中容易出现竞争者或三角关系。单身者选择多但需谨慎，有伴者注意维护关系。',
            wealth: '破财风险较高，不宜大额投资和冲动消费。守住本金是第一要务，偏财运不佳。',
            health: '情绪波动较大，易因焦虑影响睡眠。建议多做舒缓运动，保持心态平和。',
          },
          '食神': {
            career: '今年是展示才华的好年份，创意和表达能力突出。适合从事文化、艺术、教育相关工作。',
            love: '感情生活丰富多彩，浪漫气息浓厚。单身者易遇心动对象，有伴者感情升温。',
            wealth: '财运温和上升，以正财和稳定收入为主。适合长期投资，不宜短线投机。',
            health: '食欲旺盛，需注意饮食均衡防发胖。整体健康状况良好，适合培养运动习惯。',
          },
          '伤官': {
            career: '今年才华横溢但锋芒过露，易与上级产生摩擦。宜低调行事，将创新力用于解决实际问题。',
            love: '感情中个性张扬，容易吸引异性但也容易产生矛盾。学会包容和退让是今年的感情功课。',
            wealth: '偏财运不错，有意外收入的机会。但切忌贪心，见好就收是上策。',
            health: '精神压力大，易有神经衰弱倾向。建议定期放松，多接触大自然。',
          },
          '偏财': {
            career: '今年有意外机遇和商业嗅觉，适合跨界发展和副业拓展。抓住稍纵即逝的机会。',
            love: '桃花运旺盛，异性缘极佳。但需分辨真心与假意，勿因一时冲动而做出感情决定。',
            wealth: '偏财运强劲，投资眼光敏锐。但也意味着风险较高，做好止损准备再出手。',
            health: '应酬增多，注意饮食节制和酒精摄入。定期检查肝胆功能。',
          },
          '正财': {
            career: '今年事业稳步上升，努力会得到应有的回报。适合深耕现有领域，不宜频繁跳槽。',
            love: '感情稳定踏实，适合谈婚论嫁或加深承诺。单身者可通过相亲或朋友介绍遇到合适对象。',
            wealth: '正财运旺盛，薪资收入有增长空间。适合稳健理财和定投，不适合高风险投资。',
            health: '身体状况平稳，但需注意因工作繁忙而忽视休息。保持规律作息很重要。',
          },
          '七杀': {
            career: '今年事业压力大但机遇也大，有破格提拔或转型的可能。宜主动出击，化压力为动力。',
            love: '感情中强势主导的倾向明显，需注意不要过于霸道。有伴者给对方一些空间，单身者魅力十足。',
            wealth: '财运起伏较大，有暴起暴落的风险。适合做确定性高的投资，避免赌博心态。',
            health: '压力对身体的影响不可忽视，尤其注意心血管和肝脏。定期体检，学会减压。',
          },
          '正官': {
            career: '今年有利于升职加薪和获得认可，贵人运佳。宜遵循规则、踏实做事，不宜冒险和违规操作。',
            love: '感情正统稳定，有利于确定关系和步入婚姻。单身者会遇到正经靠谱的交往对象。',
            wealth: '财运与事业挂钩，升职意味着收入增长。正财为主，偏财运一般。',
            health: '因工作压力可能导致亚健康，注意颈椎、腰椎问题。定时起身活动，做做拉伸。',
          },
          '偏印': {
            career: '今年适合学习深造和钻研专业技能。冷门领域反而可能带来突破，独辟蹊径胜过随大流。',
            love: '感情偏内敛和理性，不擅表达可能导致误解。有伴者需要更多主动沟通，单身者享受独处也无妨。',
            wealth: '财运平平，不宜大规模投资。但适合投资自己——学习、考证、技能提升都是好选择。',
            health: '思虑过多易伤脾胃，消化不良是今年需注意的问题。保持饮食规律，少吃生冷。',
          },
          '正印': {
            career: '今年有贵人相助，学业和资质方面有好消息。适合考证、进修和接受培训，为未来发展铺路。',
            love: '感情中受到长辈或朋友的关怀和帮助。有伴者关系温馨，单身者可通过家人介绍认识对象。',
            wealth: '财运以稳定为主，有长辈或上级在经济上给予支持的可能。适合保守理财。',
            health: '整体健康状况良好，但需注意因安逸而放松锻炼。保持适度运动，防体重增长。',
          },
        };

        const f = forecasts[ss] || forecasts['比肩'];
        const overallTone = yearWXIsFav ? '流年五行与命局喜用相合，整体运势向好' : '流年五行与命局存在一定张力，需更加审慎应对';

        return (
          <div className="bazi-result__liunian" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
            <h3 className="bazi-result__section-title">{currentYear}流年运势</h3>

            {/* 流年基本信息 */}
            <div className="bazi-liunian__header">
              <div className="bazi-liunian__info">
                <span className="bazi-liunian__year">{currentYear}年</span>
                <span className="bazi-liunian__ganzhi">{liuNian.ganZhi}</span>
                <span className="bazi-liunian__nayin">{liuNian.nayin}</span>
              </div>
              <div className="bazi-liunian__relation">
                <span className="bazi-liunian__shishen">{ss}</span>
                <span className="bazi-liunian__wx">
                  {liuNian.ganWX}{liuNian.zhiWX}年
                  {sameWX && ' · 与日主同属'}
                  {yearWXIsFav && !sameWX && ' · 属喜用'}
                  {!yearWXIsFav && !sameWX && ' · 非喜用'}
                </span>
              </div>
            </div>

            <p className="bazi-liunian__summary">{overallTone}。流年天干{liuNian.gan}（{liuNian.ganWX}）与日主{r.dayMaster}（{r.dayMasterWX}）构成「{ss}」关系，{ss.includes('财') ? '财运是今年的重要主题' : ss.includes('官') || ss.includes('杀') ? '事业和权力是今年的核心议题' : ss.includes('印') ? '学习和成长是今年的主旋律' : ss.includes('食') || ss.includes('伤') ? '才华表达是今年的亮点' : '人际和竞争是今年的关键词'}。</p>

            {/* 四维预测 */}
            <div className="bazi-liunian__forecasts">
              <div className="bazi-liunian__card">
                <span className="bazi-liunian__icon">💼</span>
                <h4>事业</h4>
                <p>{f.career}</p>
              </div>
              <div className="bazi-liunian__card">
                <span className="bazi-liunian__icon">❤️</span>
                <h4>感情</h4>
                <p>{f.love}</p>
              </div>
              <div className="bazi-liunian__card">
                <span className="bazi-liunian__icon">💰</span>
                <h4>财运</h4>
                <p>{f.wealth}</p>
              </div>
              <div className="bazi-liunian__card">
                <span className="bazi-liunian__icon">🏥</span>
                <h4>健康</h4>
                <p>{f.health}</p>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="page-form__actions">
        <button className="btn-secondary" onClick={onReset}>重新测算</button>
      </div>
    </div>
  );
};

export default BaziPage;
