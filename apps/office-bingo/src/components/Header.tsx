import { FlameIcon } from '../icons';

interface HeaderProps {
  streak: number;
}

export default function Header({ streak }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 pt-6 pb-2">
      <h1
        className="text-2xl font-bold text-zinc-900"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        회사 빙고
      </h1>
      {streak > 0 && (
        <div className="flex items-center gap-1 text-sm font-medium text-zinc-500">
          <span className="text-primary">
            <FlameIcon />
          </span>
          <span>{streak}일 연속</span>
        </div>
      )}
    </header>
  );
}
