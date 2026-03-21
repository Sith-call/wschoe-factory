import React from 'react';
import type { Variable } from '../types';
import { ALL_VARIABLES, VARIABLE_LABELS } from '../types';

interface VariableChipsProps {
  selected: Variable[];
  onChange: (variables: Variable[]) => void;
}

export function VariableChips({ selected, onChange }: VariableChipsProps) {
  const toggle = (variable: Variable) => {
    if (selected.includes(variable)) {
      onChange(selected.filter(v => v !== variable));
    } else {
      onChange([...selected, variable]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_VARIABLES.map(variable => {
        const isSelected = selected.includes(variable);
        return (
          <button
            key={variable}
            onClick={() => toggle(variable)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-body ${
              isSelected
                ? 'border border-sd-primary text-white bg-sd-primary'
                : 'border border-sd-border text-sd-text-secondary bg-white'
            }`}
            aria-label={VARIABLE_LABELS[variable]}
            aria-pressed={isSelected}
          >
            {VARIABLE_LABELS[variable]}
          </button>
        );
      })}
    </div>
  );
}
