import React, { useState } from 'react';
import { Preset } from '../types';

interface Props {
  presets: Preset[];
  onSave: (name: string) => void;
  onLoad: (preset: Preset) => void;
  onDelete: (name: string) => void;
}

function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11 13H3a1 1 0 01-1-1V2a1 1 0 011-1h6l3 3v8a1 1 0 01-1 1z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 1v3h4V1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 9h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function PresetManager({ presets, onSave, onLoad, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    const name = newName.trim();
    if (!name) return;
    onSave(name);
    setNewName('');
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm text-forest font-medium font-outfit hover:text-lime-700 transition-colors"
      >
        <SaveIcon />
        <span>Presets ({presets.length}/5)</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white rounded-xl border border-gray-100 p-3">
          {/* Save new */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="프리셋 이름"
              maxLength={20}
              className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-lime-400 font-nanum"
            />
            <button
              onClick={handleSave}
              disabled={!newName.trim() || presets.length >= 5}
              className="px-3 py-1.5 bg-forest text-white text-xs font-medium rounded-lg hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>

          {/* Preset list */}
          {presets.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2 font-nanum">
              저장된 프리셋이 없습니다
            </p>
          ) : (
            <div className="space-y-1.5">
              {presets.map((preset) => {
                const activeCount = preset.channels.filter((c) => c.active).length;
                return (
                  <div
                    key={preset.name}
                    className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => onLoad(preset)}
                      className="text-sm text-forest font-medium hover:text-lime-700 transition-colors text-left flex-1"
                    >
                      {preset.name}
                      <span className="text-xs text-gray-400 ml-2">
                        {activeCount}ch
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete(preset.name)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      aria-label={`Delete ${preset.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
