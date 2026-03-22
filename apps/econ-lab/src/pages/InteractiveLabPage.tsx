import React, { useEffect, useCallback, useState } from 'react';
import { Concept } from '../types';
import { EconGraph } from '../components/EconGraph';
import { VariableSlider } from '../components/VariableSlider';
import { EquilibriumInfo } from '../components/EquilibriumInfo';
import { useModel } from '../hooks/useModel';
import { useProgress } from '../hooks/useProgress';
import { conceptScenarios, ScenarioPreset } from '../data/concepts';

interface InteractiveLabPageProps {
  concept: Concept;
  onBack: () => void;
}

export const InteractiveLabPage: React.FC<InteractiveLabPageProps> = ({ concept, onBack }) => {
  const { values, updateVariable, resetToDefaults, setPreset, output } = useModel(
    concept.modelConfig.id,
    concept.modelConfig.variables
  );
  const { markExperimented, markViewed } = useProgress();
  const hasInteracted = React.useRef(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset | null>(null);

  const scenarios = conceptScenarios[concept.id] || [];

  useEffect(() => {
    markViewed(concept.id);
  }, [concept.id, markViewed]);

  const handleSliderChange = useCallback((varId: string, value: number) => {
    updateVariable(varId, value);
    setActiveScenario(null); // clear scenario when manually adjusting
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      markExperimented(concept.id);
    }
  }, [updateVariable, markExperimented, concept.id]);

  const handleScenarioSelect = useCallback((scenario: ScenarioPreset) => {
    setPreset(scenario.values);
    setActiveScenario(scenario);
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      markExperimented(concept.id);
    }
  }, [setPreset, markExperimented, concept.id]);

  const handleReset = useCallback(() => {
    resetToDefaults();
    setActiveScenario(null);
  }, [resetToDefaults]);

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
          <button onClick={handleReset} className="active:scale-95 duration-150 ease-in-out">
            <span className="material-symbols-outlined text-[#040d1b] dark:text-[#fbf9f6]">restart_alt</span>
          </button>
        </div>
        <div className="bg-[#f2f0ed] dark:bg-[#1a2332] h-[1px] w-full"></div>
      </header>

      {/* Graph Area */}
      <EconGraph output={output} modelId={concept.modelConfig.id} />

      {/* Scenario Presets */}
      {scenarios.length > 0 && (
        <section className="bg-surface-container-lowest px-8 pt-8 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="material-symbols-outlined text-secondary scale-75"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <h2 className="font-headline text-base font-bold text-primary">실생활 시나리오</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 hide-scrollbar">
            {scenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario)}
                className={`flex-shrink-0 text-left p-4 rounded-lg border transition-all min-w-[200px] ${
                  activeScenario?.id === scenario.id
                    ? 'border-secondary bg-secondary-container/30 shadow-md'
                    : 'border-outline-variant/10 bg-surface-container-lowest hover:border-outline-variant/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-lg">{scenario.icon}</span>
                  <span className="font-body font-bold text-sm text-primary">{scenario.title}</span>
                </div>
                <p className="font-body text-xs text-on-surface-variant leading-snug">{scenario.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Scenario Explanation */}
      {activeScenario && (
        <section className="px-8 pb-4">
          <div className="bg-secondary-container/20 border border-secondary/20 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
              <div>
                <h3 className="font-body font-bold text-sm text-primary mb-2">{activeScenario.title}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{activeScenario.explanation}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Controls Area */}
      <section className="bg-surface-container-low px-8 pt-10 pb-6 rounded-t-3xl -mt-2 relative z-10">
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
