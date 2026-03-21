import { useState } from 'react';
import { DdayEvent, TAG_COLORS, TAG_OPTIONS, EditPayload } from '../types';
import { formatDday, getDdayDiff, formatDate } from '../date-utils';
import TagSelector from './TagSelector';

interface EventCardProps {
  event: DdayEvent;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (payload: EditPayload) => void;
  compact?: boolean;
}

export default function EventCard({ event, onTogglePin, onDelete, onEdit, compact }: EventCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pinAnimating, setPinAnimating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(event.title);
  const [editDate, setEditDate] = useState(event.date);
  const [editTag, setEditTag] = useState(event.tag);

  const diff = getDdayDiff(event.date);
  const ddayStr = formatDday(event.date);
  const tagColors = TAG_COLORS[event.tag];
  const tagLabel = TAG_OPTIONS.find((t) => t.id === event.tag)?.label ?? '';

  const isToday = diff === 0;
  const isFuture = diff > 0;

  const handlePin = () => {
    setPinAnimating(true);
    onTogglePin(event.id);
    setTimeout(() => setPinAnimating(false), 200);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setTimeout(() => onDelete(event.id), 250);
  };

  const handleShare = async () => {
    const text = `${ddayStr} ${event.title}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  const handleCardClick = () => {
    if (!editing) {
      setEditTitle(event.title);
      setEditDate(event.date);
      setEditTag(event.tag);
      setEditing(true);
    }
  };

  const handleEditSave = () => {
    if (!editTitle.trim() || !editDate) return;
    onEdit({ id: event.id, title: editTitle.trim(), date: editDate, tag: editTag });
    setEditing(false);
  };

  const handleEditCancel = () => {
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  if (editing) {
    return (
      <div className="bg-surface rounded-xl p-4 shadow-sm border-2 border-cyan-300">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            autoFocus
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            onKeyDown={handleEditKeyDown}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-700"
          />
          <TagSelector selected={editTag} onChange={setEditTag} />
          <div className="flex gap-2">
            <button
              onClick={handleEditSave}
              className="flex-1 py-2 rounded-md text-sm font-medium bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            >
              저장
            </button>
            <button
              onClick={handleEditCancel}
              className="flex-1 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-surface rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-gray-200 transition-colors ${deleting ? 'delete-animate' : ''} ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: D-day + info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`
                font-mono font-bold tracking-tight
                ${compact ? 'text-lg' : 'text-2xl'}
                ${isToday ? 'text-cyan-500' : isFuture ? 'text-gray-800' : 'text-gray-400'}
              `}
            >
              {ddayStr}
            </span>
            {event.pinned && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-cyan-500 flex-shrink-0">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          <h3 className={`font-semibold text-gray-800 truncate ${compact ? 'text-xs' : 'text-sm'}`}>{event.title}</h3>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors.bg} ${tagColors.text}`}>
              {tagLabel}
            </span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex flex-col gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Pin */}
          <button
            onClick={handlePin}
            title={event.pinned ? '고정 해제' : '고정'}
            className={`
              p-1.5 rounded-md transition-colors
              ${event.pinned ? 'text-cyan-500 bg-cyan-50' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'}
              ${pinAnimating ? 'pin-animate' : ''}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            title="클립보드에 복사"
            className="p-1.5 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors relative"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            title="삭제"
            className={`
              p-1.5 rounded-md transition-colors
              ${confirmDelete
                ? 'text-red-500 bg-red-50'
                : 'text-gray-300 hover:text-red-400 hover:bg-gray-50'
              }
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
