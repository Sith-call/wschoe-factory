import React, { useEffect, useCallback } from 'react';
import { Concept } from '../types';
import { EconGraph } from '../components/EconGraph';
import { VariableSlider } from '../components/VariableSlider';
import { EquilibriumInfo } from '../components/EquilibriumInfo';
import { useModel } from '../hooks/useModel';
import { useProgress } from '../hooks/useProgress';

interface InteractiveLabPageProps {
  concept: Concept;
  onBack: () => void;
}

export const InteractiveLabPage: React.FC<InteractiveLabPageProps> = ({ concept, onBack }) => {
  const { values, updateVariable, resetToDefaults, output } = useModel(
    concept.modelConfig.id,
    concept.modelConfig.variables
  );
  const { markExperimented, markViewed } = useProgress();
  const hasInteracted = React.useRef(false);

  useEffect(() => {
    markViewed(concept.id);
  }, [concept.id, markViewed]);

  const handleSliderChange = useCallback((varId: string, value: number) => {
    updateVariable(varId, value);
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      markExperimented(concept.id);
    }
  }, [updateVariable, markExperimented, concept.id]);

  if (!output) return null;

  return (
    <div className="bg-surface text-on-surface min-h-screen max-w-[430px] mx-auto overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-[#fbf9f6] dark:bg-[#040d1b] sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <button onClick={onBack} className="active:scale-95 duration-150 ease-in-out">
            <span className="material-symbols-outlined text-[#040d1b] dark:text-[#fbf9f6]">arrow_back</span>
          </button>
          <h1 className="font-['Epilogue'] font-bold text-xl uppercase tracking-tight text-[#040d1b] dark:text-[#fbf9f6]">
            {concept.title} 실험
          </h1>
          <button onClick={resetToDefaults} className="active:scale-95 duration-150 ease-in-out">
            <span className="material-symbols-outlined text-[#040d1b] dark:text-[#fbf9f6]">restart_alt</span>
          </button>
        </div>
        <div className="bg-[#f2f0ed] dark:bg-[#1a2332] h-[1px] w-full"></div>
      </header>

      {/* Graph Area */}
      <EconGraph output={output} modelId={concept.modelConfig.id} />

      {/* Interactive Controls Area */}
      <section className="bg-surface-container-low px-8 pt-10 pb-6 rounded-t-3xl -mt-6 relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <span
            className="material-symbols-outlined text-secondary scale-75"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            tune
          </span>
          <h2 className="font-headline text-lg font-bold text-primary">변수 조절</h2>
        </div>
        <div className="space-y-10">
          {concept.modelConfig.variables.map(variable => (
            <VariableSlider
              key={variable.id}
              variable={variable}
              value={values[variable.id]}
              onChange={val => handleSliderChange(variable.id, val)}
            />
          ))}
        </div>
      </section>

      {/* Current State Summary Card */}
      <EquilibriumInfo summary={output.summary} />

      {/* Footer Action */}
      <footer className="p-8">
        <button
          onClick={onBack}
          className="w-full bg-primary text-on-primary py-5 rounded-lg font-headline font-bold text-sm tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">keyboard_return</span>
          돌아가기
        </button>
      </footer>

      <div className="h-10"></div>
    </div>
  );
};
