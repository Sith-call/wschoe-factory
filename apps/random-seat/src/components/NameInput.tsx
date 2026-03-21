import React, { useState } from 'react';

interface NameInputProps {
  names: string[];
  onNamesChange: (names: string[]) => void;
}

export default function NameInput({ names, onNamesChange }: NameInputProps) {
  const [input, setInput] = useState('');

  const addName = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (names.length >= 30) return;
    onNamesChange([...names, trimmed]);
    setInput('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Split on comma, newline, or tab. If that yields only one
      // item, fall back to splitting on whitespace (space-separated list).
      let parsed = text
        .split(/[,\n\t]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parsed.length <= 1) {
        parsed = text
          .split(/\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (parsed.length === 0) return;
      const combined = [...names, ...parsed].slice(0, 30);
      onNamesChange(combined);
    } catch {
      // Clipboard access denied — do nothing
    }
  };

  const removeName = (index: number) => {
    onNamesChange(names.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addName();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">참가자 입력</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="이름을 입력하세요"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-gray-800"
          maxLength={20}
        />
        <button
          onClick={addName}
          disabled={names.length >= 30}
          className="px-5 py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          추가
        </button>
        <button
          onClick={handlePaste}
          disabled={names.length >= 30}
          className="px-4 py-2.5 border border-primary text-primary font-semibold rounded-md hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 009 4.5h6A1.5 1.5 0 0013.5 3h-3zm-2.693.178A3 3 0 0110.5 1.5h3a3 3 0 012.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 01-3 3H6.75a3 3 0 01-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15z" clipRule="evenodd" />
          </svg>
          붙여넣기
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-500">빠른 추가:</span>
        {[2, 4, 6].map((count) => (
          <button
            key={count}
            onClick={() => {
              const preset = Array.from({ length: count }, (_, i) => `참가자${i + 1}`);
              onNamesChange(preset);
            }}
            className="px-3 py-1 text-sm font-medium border border-gray-200 rounded-md text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            {count}명
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {names.length}명 입력됨 (최소 2명, 최대 30명)
        </p>
        {names.length > 0 && (
          <button
            onClick={() => onNamesChange([])}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            전체 삭제
          </button>
        )}
      </div>

      {names.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {names.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary font-medium text-sm rounded-full"
            >
              {name}
              <button
                onClick={() => removeName(i)}
                className="ml-0.5 hover:text-red-500 transition-colors"
                aria-label={`${name} 삭제`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
