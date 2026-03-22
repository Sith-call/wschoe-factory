import React, { useState } from 'react';
import type { Variable, CustomVariable } from '../types';
import { ALL_VARIABLES, VARIABLE_LABELS } from '../types';

interface Props {
  selected: string[];
  onChange: (variables: string[]) => void;
  pinnedVariables: string[];
  customVariables: CustomVariable[];
  onAddCustomVariable?: (label: string) => void;
}

export function VariableChips({
  selected,
  onChange,
  pinnedVariables,
  customVariables,
  onAddCustomVariable,
}: Props) {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newVarLabel, setNewVarLabel] = useState('');

  const toggle = (varKey: string) => {
    if (selected.includes(varKey)) {
      onChange(selected.filter(v => v !== varKey));
    } else {
      onChange([...selected, varKey]);
    }
  };

  const handleAdd = () => {
    if (newVarLabel.trim() && onAddCustomVariable) {
      onAddCustomVariable(newVarLabel.trim());
      setNewVarLabel('');
      setShowAddInput(false);
    }
  };

  const activeCustomVars = customVariables.filter(v => !v.archived);

  // Sort: pinned built-in first, then unpinned built-in
  const sortedBuiltIn = [...ALL_VARIABLES].sort((a, b) => {
    const aPinned = pinnedVariables.includes(a) ? 0 : 1;
    const bPinned = pinnedVariables.includes(b) ? 0 : 1;
    return aPinned - bPinned;
  });

  return (
    <div className="flex flex-wrap gap-2">
      {/* Built-in variables (pinned first) */}
      {sortedBuiltIn.map(v => {
        const isSelected = selected.includes(v);
        const isPinned = pinnedVariables.includes(v);
        return (
          <button
            key={v}
            onClick={() => toggle(v)}
            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1 ${
              isSelected
                ? 'bg-secondary-container text-on-secondary-container font-medium'
                : isPinned
                  ? 'border-2 border-primary/30 text-on-surface bg-primary-fixed/30 hover:bg-primary-fixed/50'
                  : 'border border-outline-variant/30 text-on-surface hover:bg-surface-container'
            }`}
          >
            {isPinned && (
              <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '12px' }}>push_pin</span>
            )}
            {VARIABLE_LABELS[v as Variable]}
          </button>
        );
      })}

      {/* Custom variables */}
      {activeCustomVars.map(cv => {
        const isSelected = selected.includes(cv.id);
        const isPinned = pinnedVariables.includes(cv.id);
        return (
          <button
            key={cv.id}
            onClick={() => toggle(cv.id)}
            className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1 ${
              isSelected
                ? 'bg-secondary-container text-on-secondary-container font-medium'
                : isPinned
                  ? 'border-2 border-primary/30 text-on-surface bg-primary-fixed/30 hover:bg-primary-fixed/50'
                  : 'border border-outline-variant/30 text-on-surface hover:bg-surface-container'
            }`}
          >
            {isPinned && (
              <span className="material-symbols-outlined text-primary/60" style={{ fontSize: '12px' }}>push_pin</span>
            )}
            {cv.label}
          </button>
        );
      })}

      {/* Add custom variable button */}
      {showAddInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newVarLabel}
            onChange={e => setNewVarLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="습관 이름"
            className="px-3 py-1.5 rounded-full border border-outline-variant/30 text-sm bg-white focus:ring-1 focus:ring-primary-container/30 focus:outline-none w-24"
            autoFocus
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold"
          >
            추가
          </button>
          <button
            onClick={() => { setShowAddInput(false); setNewVarLabel(''); }}
            className="text-on-surface-variant text-xs"
          >
            취소
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddInput(true)}
          className="px-4 py-2 rounded-full bg-surface-container-highest text-primary font-bold text-sm flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-xs" style={{ fontSize: '14px' }}>add</span>
          습관 추가
        </button>
      )}
    </div>
  );
}
