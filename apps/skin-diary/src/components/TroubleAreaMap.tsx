import React from 'react';
import type { TroubleArea } from '../types';
import { TROUBLE_AREA_LABELS } from '../types';

interface Props {
  selected: TroubleArea[];
  onChange: (areas: TroubleArea[]) => void;
}

export function TroubleAreaMap({ selected, onChange }: Props) {
  const toggle = (area: TroubleArea) => {
    if (area === 'whole') {
      // Toggle whole: select all or deselect all
      if (selected.includes('whole')) {
        onChange([]);
      } else {
        onChange(['whole']);
      }
      return;
    }

    // Remove 'whole' if selecting individual areas
    const withoutWhole = selected.filter(a => a !== 'whole');

    if (withoutWhole.includes(area)) {
      onChange(withoutWhole.filter(a => a !== area));
    } else {
      onChange([...withoutWhole, area]);
    }
  };

  const isSelected = (area: TroubleArea) =>
    selected.includes(area) || selected.includes('whole');

  return (
    <div className="relative bg-surface-container-low rounded-[2.5rem] p-8 flex justify-center overflow-hidden">
      {/* Decorative sun ray */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#f9f2e3] rounded-full blur-3xl opacity-60 translate-x-10 -translate-y-10" />

      {/* Face outline with tappable zones */}
      <div className="relative w-48 h-64 border-[1.5px] border-outline-variant/40 rounded-full flex flex-col items-center">
        {/* Forehead */}
        <button
          onClick={() => toggle('forehead')}
          className={`absolute top-6 w-20 h-10 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
            isSelected('forehead')
              ? 'bg-primary/10 border-primary/30 text-primary font-bold'
              : 'border-outline-variant/20 text-on-surface-variant/40 hover:bg-white'
          }`}
        >
          {TROUBLE_AREA_LABELS.forehead}
        </button>

        {/* Nose */}
        <button
          onClick={() => toggle('nose')}
          className={`absolute top-24 w-8 h-16 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
            isSelected('nose')
              ? 'bg-primary/10 border-primary/30 text-primary font-bold'
              : 'border-outline-variant/20 text-on-surface-variant/40 hover:bg-white'
          }`}
        >
          {TROUBLE_AREA_LABELS.nose}
        </button>

        {/* Left Cheek */}
        <button
          onClick={() => toggle('cheek_left')}
          className={`absolute top-24 left-4 w-14 h-14 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
            isSelected('cheek_left')
              ? 'bg-primary/10 border-primary/30 text-primary font-bold'
              : 'border-outline-variant/20 text-on-surface-variant/40 hover:bg-white'
          }`}
        >
          {TROUBLE_AREA_LABELS.cheek_left}
        </button>

        {/* Right Cheek */}
        <button
          onClick={() => toggle('cheek_right')}
          className={`absolute top-24 right-4 w-14 h-14 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
            isSelected('cheek_right')
              ? 'bg-primary/10 border-primary/30 text-primary font-bold'
              : 'border-outline-variant/20 text-on-surface-variant/40 hover:bg-white'
          }`}
        >
          {TROUBLE_AREA_LABELS.cheek_right}
        </button>

        {/* Jawline */}
        <button
          onClick={() => toggle('jawline')}
          className={`absolute bottom-8 w-24 h-10 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
            isSelected('jawline')
              ? 'bg-primary/10 border-primary/30 text-primary font-bold'
              : 'border-outline-variant/20 text-on-surface-variant/40 hover:bg-white'
          }`}
        >
          {TROUBLE_AREA_LABELS.jawline}
        </button>
      </div>

      {/* Whole face toggle below */}
      <button
        onClick={() => toggle('whole')}
        className={`absolute bottom-4 px-4 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
          selected.includes('whole')
            ? 'bg-primary text-white'
            : 'bg-surface-container-highest text-on-surface-variant'
        }`}
      >
        전체
      </button>
    </div>
  );
}
