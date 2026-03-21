interface BossModeProps {
  onDismiss: () => void;
}

const departments = ['영업팀', '마케팅팀', '개발팀', '인사팀', '재무팀'];

const data: number[][] = [
  [245800, 312400, 289600, 847800, 112.3],
  [189200, 203500, 178900, 571600, 98.7],
  [456700, 489300, 512100, 1458100, 124.5],
  [67300, 72100, 69800, 209200, 103.2],
  [134500, 128900, 141200, 404600, 95.8],
];

function formatNum(n: number): string {
  if (n > 1000) return n.toLocaleString('ko-KR');
  return n.toFixed(1) + '%';
}

const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const headers = ['부서', '1월', '2월', '3월', '합계', '전년대비'];

export default function BossMode({ onDismiss }: BossModeProps) {
  const totals = [0, 1, 2].map((col) =>
    data.reduce((sum, row) => sum + row[col], 0)
  );
  const grandTotal = totals.reduce((a, b) => a + b, 0);

  return (
    <div
      className="fixed inset-0 bg-white text-black select-none"
      style={{ zIndex: 9999, fontFamily: "'Noto Sans KR', 'Malgun Gothic', sans-serif" }}
      onClick={onDismiss}
    >
      {/* Menu bar */}
      <div className="bg-[#217346] text-white text-[13px] px-4 py-1 flex items-center gap-1">
        <span className="font-bold mr-3 text-[14px]">Sheet</span>
        <span className="px-2 py-0.5 hover:bg-white/20 cursor-default">파일</span>
        <span className="px-2 py-0.5 hover:bg-white/20 cursor-default">편집</span>
        <span className="px-2 py-0.5 hover:bg-white/20 cursor-default">보기</span>
        <span className="px-2 py-0.5 hover:bg-white/20 cursor-default">삽입</span>
        <span className="px-2 py-0.5 hover:bg-white/20 cursor-default">서식</span>
      </div>

      {/* Title bar */}
      <div className="bg-[#f3f3f3] border-b border-[#d4d4d4] px-4 py-2">
        <span className="text-[14px] font-semibold text-[#333]">매출 실적 보고서 Q1 2026</span>
      </div>

      {/* Formula bar */}
      <div className="bg-white border-b border-[#d4d4d4] px-4 py-1.5 flex items-center gap-3 text-[12px]">
        <span className="bg-[#f3f3f3] border border-[#ccc] px-2 py-0.5 min-w-[60px] text-center text-[11px]">E8</span>
        <span className="text-[11px] text-[#555] italic">=SUM(B2:B6)</span>
      </div>

      {/* Spreadsheet grid */}
      <div className="overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            {/* Column letters */}
            <tr className="bg-[#f3f3f3]">
              <th className="border border-[#d4d4d4] w-[36px] py-1 text-[11px] text-[#666] font-normal"></th>
              {cols.map((c) => (
                <th key={c} className="border border-[#d4d4d4] min-w-[90px] py-1 text-[11px] text-[#666] font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row 1 - Headers */}
            <tr className="bg-[#e8f0fe]">
              <td className="border border-[#d4d4d4] text-center text-[11px] text-[#666] bg-[#f3f3f3]">1</td>
              {headers.map((h, i) => (
                <td key={i} className="border border-[#d4d4d4] px-3 py-1.5 font-semibold text-[12px]">
                  {h}
                </td>
              ))}
              <td className="border border-[#d4d4d4] px-3 py-1.5"></td>
            </tr>

            {/* Data rows */}
            {departments.map((dept, ri) => (
              <tr key={ri}>
                <td className="border border-[#d4d4d4] text-center text-[11px] text-[#666] bg-[#f3f3f3]">
                  {ri + 2}
                </td>
                <td className="border border-[#d4d4d4] px-3 py-1.5">{dept}</td>
                {data[ri].slice(0, 3).map((val, ci) => (
                  <td
                    key={ci}
                    className={`border border-[#d4d4d4] px-3 py-1.5 text-right ${
                      ri === 2 && ci === 2 ? 'bg-[#fef9e7]' : ''
                    }`}
                  >
                    {formatNum(val)}
                  </td>
                ))}
                <td className={`border border-[#d4d4d4] px-3 py-1.5 text-right font-semibold ${
                  ri === 2 ? 'bg-[#fef9e7]' : ''
                }`}>
                  {formatNum(data[ri][3])}
                </td>
                <td className={`border border-[#d4d4d4] px-3 py-1.5 text-right ${
                  data[ri][4] >= 110 ? 'text-[#1a7f37]' : data[ri][4] < 100 ? 'text-[#cf222e]' : ''
                }`}>
                  {data[ri][4].toFixed(1)}%
                </td>
                <td className="border border-[#d4d4d4]"></td>
              </tr>
            ))}

            {/* Totals row */}
            <tr className="bg-[#f0f6ff]">
              <td className="border border-[#d4d4d4] text-center text-[11px] text-[#666] bg-[#f3f3f3]">
                {departments.length + 2}
              </td>
              <td className="border border-[#d4d4d4] px-3 py-1.5 font-bold">합계</td>
              {totals.map((t, i) => (
                <td key={i} className="border border-[#d4d4d4] px-3 py-1.5 text-right font-bold">
                  {formatNum(t)}
                </td>
              ))}
              <td className="border border-[#d4d4d4] px-3 py-1.5 text-right font-bold">
                {formatNum(grandTotal)}
              </td>
              <td className="border border-[#d4d4d4]"></td>
              <td className="border border-[#d4d4d4]"></td>
            </tr>

            {/* Empty rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border border-[#d4d4d4] text-center text-[11px] text-[#666] bg-[#f3f3f3]">
                  {departments.length + 3 + i}
                </td>
                {cols.map((c) => (
                  <td key={c} className="border border-[#d4d4d4] px-3 py-1.5">&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#f3f3f3] border-t border-[#d4d4d4] flex items-center text-[11px] text-[#555]" style={{ zIndex: 9999 }}>
        <div className="flex">
          <span className="px-4 py-1.5 bg-white border-r border-[#d4d4d4] font-semibold">시트1</span>
          <span className="px-4 py-1.5 border-r border-[#d4d4d4]">시트2</span>
          <span className="px-4 py-1.5 border-r border-[#d4d4d4]">시트3</span>
        </div>
        <div className="ml-auto px-4 py-1.5 text-[10px] text-[#888]">
          합계: {formatNum(grandTotal)} &nbsp; 평균: {formatNum(Math.round(grandTotal / 5))}
        </div>
      </div>
    </div>
  );
}
