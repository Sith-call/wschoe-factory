import { useState } from 'react';
import { TagColor, DdayEvent } from '../types';
import TagSelector from './TagSelector';

interface AddEventFormProps {
  onAdd: (event: DdayEvent) => void;
}

export default function AddEventForm({ onAdd }: AddEventFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState<TagColor>('blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const event: DdayEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      tag,
      pinned: false,
      createdAt: Date.now(),
    };
    onAdd(event);
    setTitle('');
    setDate('');
    setTag('blue');
  };

  const isValid = title.trim() !== '' && date !== '';

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-800 mb-4">새 이벤트 추가</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="이벤트 이름"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder:text-gray-400"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-700"
        />

        <TagSelector selected={tag} onChange={setTag} />

        <button
          type="submit"
          disabled={!isValid}
          className={`
            w-full py-2.5 rounded-md text-sm font-medium transition-colors
            ${isValid
              ? 'bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          추가하기
        </button>
      </div>
    </form>
  );
}
