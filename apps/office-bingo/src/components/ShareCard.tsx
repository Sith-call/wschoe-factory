interface ShareCardProps {
  cells: number[];
  checked: boolean[];
  bingoCount: number;
  dateLabel: string;
  onClose: () => void;
}

export default function ShareCard({
  checked,
  bingoCount,
  dateLabel,
  onClose,
}: ShareCardProps) {
  const handleCopy = () => {
    const grid = Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 5 }, (_, col) => {
        const idx = row * 5 + col;
        return checked[idx] ? '\u25A0' : '\u25A1';
      }).join(' ')
    ).join('\n');

    const text = `오늘의 회사 빙고: ${bingoCount}빙고 달성!\n${dateLabel}\n\n${grid}\n\n#회사빙고`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="rounded-md p-6 mx-4 w-full"
        style={{
          maxWidth: '320px',
          backgroundColor: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="text-lg font-bold text-zinc-900 mb-1"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          회사 빙고
        </p>
        <p className="text-xs font-light text-zinc-400 mb-4">{dateLabel}</p>

        {bingoCount > 0 && (
          <p
            className="text-sm font-medium mb-3"
            style={{ color: '#dc2626' }}
          >
            {bingoCount} 빙고 달성!
          </p>
        )}

        {/* Mini grid */}
        <div className="grid grid-cols-5 gap-1 mb-5 mx-auto" style={{ maxWidth: '160px' }}>
          {checked.map((c, i) => (
            <div
              key={i}
              className="aspect-square"
              style={{
                backgroundColor: i === 12 ? '#fef2f2' : c ? '#18181b' : '#f4f4f5',
                border: c || i === 12 ? 'none' : '1px solid #e4e4e7',
              }}
            />
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white mb-2"
          style={{ backgroundColor: '#dc2626' }}
        >
          결과 복사하기
        </button>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-zinc-500 border"
          style={{ borderColor: '#e4e4e7' }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
