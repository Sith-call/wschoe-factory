import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  completed: boolean;
}

export function ComparativeAdvantageLab({ onComplete, completed }: Props) {
  const [aWine, setAWine] = useState(10);
  const [aCloth, setACloth] = useState(20);
  const [bWine, setBWine] = useState(20);
  const [bCloth, setBCloth] = useState(10);
  const [showTrade, setShowTrade] = useState(false);
  const [changes, setChanges] = useState(0);

  const W = 320, H = 260, PAD = 20;

  // Opportunity costs
  const aOcWine = aCloth / aWine; // cloth given up per wine
  const aOcCloth = aWine / aCloth;
  const bOcWine = bCloth / bWine;
  const bOcCloth = bWine / bCloth;

  // Comparative advantage
  const aAdvWine = aOcWine < bOcWine;
  const aAdvCloth = aOcCloth < bOcCloth;

  // Autarky: each produces half-half
  const autarkyA = { wine: aWine / 2, cloth: aCloth / 2 };
  const autarkyB = { wine: bWine / 2, cloth: bCloth / 2 };
  const autarkyTotal = { wine: autarkyA.wine + autarkyB.wine, cloth: autarkyA.cloth + autarkyB.cloth };

  // Specialization
  const specA = { wine: aAdvWine ? aWine : 0, cloth: aAdvWine ? 0 : aCloth };
  const specB = { wine: !aAdvWine ? bWine : 0, cloth: !aAdvWine ? 0 : bCloth };
  const specTotal = { wine: specA.wine + specB.wine, cloth: specA.cloth + specB.cloth };

  const gain = { wine: specTotal.wine - autarkyTotal.wine, cloth: specTotal.cloth - autarkyTotal.cloth };

  const barY = 50, barH = 30, gap = 50;
  const maxVal = Math.max(aWine, aCloth, bWine, bCloth, 25);
  const barScale = (W - PAD * 2 - 80) / maxVal;

  function handleChange(setter: (v: number) => void, val: number) {
    setter(val);
    setChanges(prev => prev + 1);
    setShowTrade(false);
  }

  const canComplete = showTrade && changes >= 2;

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink mb-2">
        비교우위와 무역 이익
      </h3>
      <p className="text-sm text-ink-secondary mb-4">
        두 나라의 생산능력을 설정하고, 특화 후 무역했을 때의 총 생산량 변화를 비교하세요.
      </p>

      <div className="bg-stone-50 rounded-lg p-2 mb-4">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Country A */}
          <text x={PAD} y={barY - 10} fontSize={11} fill="#1C1917" fontWeight={600}>A국</text>
          <rect x={PAD + 50} y={barY} width={aWine * barScale} height={barH / 2 - 2} rx={2} fill="#7C3AED" fillOpacity={0.7} />
          <text x={PAD + 45} y={barY + barH / 4 + 3} fontSize={9} fill="#78716C" textAnchor="end">와인</text>
          <text x={PAD + 54 + aWine * barScale} y={barY + barH / 4 + 3} fontSize={9} fill="#7C3AED" fontWeight={600}>{aWine}</text>

          <rect x={PAD + 50} y={barY + barH / 2 + 2} width={aCloth * barScale} height={barH / 2 - 2} rx={2} fill="#D97706" fillOpacity={0.7} />
          <text x={PAD + 45} y={barY + barH * 3 / 4 + 3} fontSize={9} fill="#78716C" textAnchor="end">옷감</text>
          <text x={PAD + 54 + aCloth * barScale} y={barY + barH * 3 / 4 + 3} fontSize={9} fill="#D97706" fontWeight={600}>{aCloth}</text>

          {/* Comparative advantage badge for A */}
          <text x={W - PAD} y={barY + barH / 2 + 3} fontSize={9} fill={aAdvWine ? '#7C3AED' : '#D97706'} textAnchor="end" fontWeight={600}>
            {aAdvWine ? '와인 특화' : '옷감 특화'}
          </text>

          {/* Country B */}
          <text x={PAD} y={barY + gap + barH - 10} fontSize={11} fill="#1C1917" fontWeight={600}>B국</text>
          <rect x={PAD + 50} y={barY + gap + barH} width={bWine * barScale} height={barH / 2 - 2} rx={2} fill="#7C3AED" fillOpacity={0.7} />
          <text x={PAD + 45} y={barY + gap + barH + barH / 4 + 3} fontSize={9} fill="#78716C" textAnchor="end">와인</text>
          <text x={PAD + 54 + bWine * barScale} y={barY + gap + barH + barH / 4 + 3} fontSize={9} fill="#7C3AED" fontWeight={600}>{bWine}</text>

          <rect x={PAD + 50} y={barY + gap + barH + barH / 2 + 2} width={bCloth * barScale} height={barH / 2 - 2} rx={2} fill="#D97706" fillOpacity={0.7} />
          <text x={PAD + 45} y={barY + gap + barH + barH * 3 / 4 + 3} fontSize={9} fill="#78716C" textAnchor="end">옷감</text>
          <text x={PAD + 54 + bCloth * barScale} y={barY + gap + barH + barH * 3 / 4 + 3} fontSize={9} fill="#D97706" fontWeight={600}>{bCloth}</text>

          <text x={W - PAD} y={barY + gap + barH + barH / 2 + 3} fontSize={9} fill={!aAdvWine ? '#7C3AED' : '#D97706'} textAnchor="end" fontWeight={600}>
            {!aAdvWine ? '와인 특화' : '옷감 특화'}
          </text>

          {/* Results comparison */}
          {showTrade && (
            <>
              <line x1={PAD} y1={185} x2={W - PAD} y2={185} stroke="#E7E5E4" strokeWidth={1} />
              <text x={W / 2} y={200} fontSize={10} fill="#78716C" textAnchor="middle" fontWeight={600}>총 생산량 비교</text>

              {/* Autarky */}
              <text x={PAD + 10} y={220} fontSize={9} fill="#78716C">자급자족:</text>
              <text x={PAD + 70} y={220} fontSize={9} fill="#1C1917">와인 {autarkyTotal.wine.toFixed(0)} + 옷감 {autarkyTotal.cloth.toFixed(0)}</text>

              {/* Trade */}
              <text x={PAD + 10} y={236} fontSize={9} fill="#0D9488" fontWeight={600}>특화+무역:</text>
              <text x={PAD + 70} y={236} fontSize={9} fill="#0D9488" fontWeight={600}>
                와인 {specTotal.wine} + 옷감 {specTotal.cloth}
              </text>

              {/* Gain */}
              <text x={W - PAD} y={248} fontSize={10} fill="#16A34A" textAnchor="end" fontWeight={700}>
                무역이익: 와인 +{gain.wine.toFixed(0)}, 옷감 +{gain.cloth.toFixed(0)}
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-xs text-ink-secondary mb-1 font-semibold">A국 생산능력</p>
          <div className="flex gap-1 items-center text-xs mb-1"><span className="w-10">와인</span>
            <input type="range" min={5} max={30} value={aWine} onChange={e => handleChange(setAWine, Number(e.target.value))} className="flex-1 accent-purple-500" /><span className="w-6 text-right">{aWine}</span>
          </div>
          <div className="flex gap-1 items-center text-xs"><span className="w-10">옷감</span>
            <input type="range" min={5} max={30} value={aCloth} onChange={e => handleChange(setACloth, Number(e.target.value))} className="flex-1 accent-amber-500" /><span className="w-6 text-right">{aCloth}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-ink-secondary mb-1 font-semibold">B국 생산능력</p>
          <div className="flex gap-1 items-center text-xs mb-1"><span className="w-10">와인</span>
            <input type="range" min={5} max={30} value={bWine} onChange={e => handleChange(setBWine, Number(e.target.value))} className="flex-1 accent-purple-500" /><span className="w-6 text-right">{bWine}</span>
          </div>
          <div className="flex gap-1 items-center text-xs"><span className="w-10">옷감</span>
            <input type="range" min={5} max={30} value={bCloth} onChange={e => handleChange(setBCloth, Number(e.target.value))} className="flex-1 accent-amber-500" /><span className="w-6 text-right">{bCloth}</span>
          </div>
        </div>
      </div>

      {!showTrade && (
        <button
          onClick={() => setShowTrade(true)}
          className="w-full mb-3 rounded-md px-5 py-2 font-medium border border-primary text-primary hover:bg-primary-light transition-colors"
        >
          특화 후 무역 결과 보기
        </button>
      )}

      <div className="border-l-2 border-primary pl-3 text-sm text-ink mb-4">
        {showTrade ? (
          <p>각 나라가 <strong>기회비용이 낮은</strong> 재화에 특화하면 총 생산량이 증가합니다. 이것이 <strong>비교우위</strong>에 따른 무역의 이익입니다.</p>
        ) : (
          <p>A국의 와인 기회비용: 옷감 {aOcWine.toFixed(1)}단위. B국: 옷감 {bOcWine.toFixed(1)}단위. 기회비용이 <strong>더 낮은</strong> 쪽이 비교우위를 가집니다.</p>
        )}
      </div>

      {completed ? (
        <p className="text-sm text-success font-medium">실험 완료! 마스터 달성</p>
      ) : (
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`w-full rounded-md px-5 py-3 font-medium transition-colors ${
            canComplete ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-stone-200 text-ink-disabled cursor-not-allowed'
          }`}
        >
          {canComplete ? '실험 완료' : '생산능력을 변경하고 무역 결과를 확인하세요'}
        </button>
      )}
    </div>
  );
}
