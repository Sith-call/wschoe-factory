import React, { useState } from 'react';
import { SavedGroup } from '../types';
import { addGroup, deleteGroup, loadGroups } from '../storage';

interface GroupManagerProps {
  names: string[];
  onLoadGroup: (members: string[]) => void;
}

export default function GroupManager({ names, onLoadGroup }: GroupManagerProps) {
  const [groups, setGroups] = useState<SavedGroup[]>(() => loadGroups());
  const [groupName, setGroupName] = useState('');
  const [showSave, setShowSave] = useState(false);

  const handleSave = () => {
    if (!groupName.trim() || names.length < 2) return;
    const updated = addGroup(groupName.trim(), names);
    setGroups(updated);
    setGroupName('');
    setShowSave(false);
  };

  const handleDelete = (id: string) => {
    const updated = deleteGroup(id);
    setGroups(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">저장된 그룹</h2>
        {names.length >= 2 && (
          <button
            onClick={() => setShowSave(!showSave)}
            className="text-sm font-semibold text-primary hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            현재 그룹 저장
          </button>
        )}
      </div>

      {showSave && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="그룹 이름 (예: 개발팀)"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-gray-800 text-sm"
            maxLength={20}
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors text-sm"
          >
            저장
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <p className="text-sm text-gray-400">저장된 그룹이 없습니다.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => onLoadGroup(group.members)}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {group.name}
                <span className="ml-1 text-gray-400">({group.members.length}명)</span>
              </button>
              <button
                onClick={() => handleDelete(group.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
                aria-label={`${group.name} 삭제`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
