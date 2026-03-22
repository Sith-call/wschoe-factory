import React from 'react';
import { Variable } from '../types';

interface VariableSliderProps {
  variable: Variable;
  value: number;
  onChange: (value: number) => void;
}

export const VariableSlider: React.FC<VariableSliderProps> = ({ variable, value, onChange }) => {
  const displayValue = variable.unit === '%'
    ? `${value}%`
    : variable.unit === 'Lv.'
      ? `Lv. ${value}`
      : variable.unit === '회'
        ? `${value}회`
        : `${value} ${variable.unit}`;

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-3">
        <label className="font-body font-semibold text-sm text-on-surface">
          {variable.name}
        </label>
        <span className="font-label font-bold text-secondary text-sm">
          {displayValue}
        </span>
      </div>
      <input
        className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-secondary"
        type="range"
        min={variable.min}
        max={variable.max}
        step={variable.step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <p className="mt-3 text-[11px] text-on-surface-variant leading-relaxed">
        {variable.description}
      </p>
    </div>
  );
};
