import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Concept } from '../types';
import { EconGraph } from '../components/EconGraph';
import { VariableSlider } from '../components/VariableSlider';
import { EquilibriumInfo } from '../components/EquilibriumInfo';
import { useModel } from '../hooks/useModel';
import { useProgress } from '../hooks/useProgress';
import { conceptScenarios, conceptHypotheses, HypothesisQuestion, ScenarioPreset } from '../data/concepts';

interface InteractiveLabPageProps {
  concept: Concept;
  onBack: () => void;
}

type LabMode = 'hypothesis' | 'simulation' | 'discovery' | 'free';

export const InteractiveLabPage: React.FC<InteractiveLabPageProps> = ({ concept, onBack }) => {
  const { values, updateVariable, resetToDefaults, setPreset, output } = useModel(
    concept.modelConfig.id,
    concept.modelConfig.variables
  );
  const { markExperimented, markViewed, addDiscovery } = useProgress();
  const hasInteracted = useRef(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset | null>(null);
  const [slidersExpanded, setSlidersExpanded] = useState(true);

  // Hypothesis flow state
  const hypotheses = conceptHypotheses[concept.id] || [];
  const [labMode, setLabMode] = useState<LabMode>(hypotheses.length > 0 ? 'hypothesis' : 'free');
  const [currentHypothesis, setCurrentHypothesis] = useState<HypothesisQuestion | null>(
    hypotheses.length > 0 ? hypotheses[0] : null
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hypothesisIndex, setHypothesisIndex] = useState(0);

  const scenarios = conceptScenarios[concept.id] || [];

  useEffect(() => {
    markViewed(concept.id);
  }, [concept.id, markViewed]);

  const handleSliderChange = useCallback((varId: string, value: number) => {
    updateVariable(varId, value);
    setActiveScenario(null);
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

  // Hypothesis flow handlers
  const handleOptionSelect = useCallback((index: number) => {
    setSelectedOption(index);
  }, []);

  const handleRunSimulation = useCallback(() => {
    if (selectedOption === null || !currentHypothesis) return;
    // Apply the preset values
    setPreset(currentHypothesis.presetValues);
    setLabMode('simulation');
    // After animation delay, show discovery
    setTimeout(() => {
      setShowResult(true);
      setLabMode('discovery');
      // Record discovery
      const isCorrect = selectedOption === currentHypothesis.correctIndex;
      addDiscovery({
        id: currentHypothesis.id,
        conceptId: concept.id,
        hypothesis: `${currentHypothesis.scenario} → ${currentHypothesis.options[selectedOption]}`,
        result: `${isCorrect ? 'correct' : 'wrong'}: ${currentHypothesis.correctExplanation}`,
      });
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        markExperimented(concept.id);
      }
    }, 1500);
  }, [selectedOption, currentHypothesis, setPreset, addDiscovery, concept.id, markExperimented]);

  const handleNextOrFree = useCallback(() => {
    const nextIndex = hypothesisIndex + 1;
    if (nextIndex < hypotheses.length) {
      setHypothesisIndex(nextIndex);
      setCurrentHypothesis(hypotheses[nextIndex]);
      setSelectedOption(null);
      setShowResult(false);
      resetToDefaults();
      setLabMode('hypothesis');
    } else {
      // All hypotheses done, go to free mode
      resetToDefaults();
      setLabMode('free');
      setShowResult(false);
    }
  }, [hypothesisIndex, hypotheses, resetToDefaults]);

  const handleSkipToFree = useCallback(() => {
    resetToDefaults();
    setLabMode('free');
    setShowResult(false);
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
          <h1 className="font-['Epilogue'] font-bold text-lg uppercase tracking-tight text-[#040d1b] dark:text-[#fbf9f6]">
            {concept.title} 실험
          </h1>
          <button onClick={handleReset} className="active:scale-95 duration-150 ease-in-out">
            <span className="material-symbols-outlined text-[#040d1b] dark:text-[#fbf9f6]">restart_alt</span>
          </button>
        </div>
        <div className="bg-[#f2f0ed] dark:bg-[#1a2332] h-[1px] w-full"></div>
      </header>

      {/* HYPOTHESIS STEP */}
      {labMode === 'hypothesis' && currentHypothesis && (
        <section className="px-6 py-8 space-y-6">
          <div className="space-y-2">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold text-secondary tracking-[0.2em] uppercase">
              Hypothesis #{hypothesisIndex + 1}
            </span>
            <h2 className="font-headline font-extrabold text-2xl text-primary leading-snug">
              당신의 예측은?
            </h2>
          </div>

          <div className="bg-[#1a2332] rounded-lg p-5">
            <p className="font-body font-bold text-white text-[15px] leading-relaxed">
              {currentHypothesis.scenario}
            </p>
            <p className="font-body text-white/60 text-sm mt-2">
              {currentHypothesis.question}
            </p>
          </div>

          <div className="space-y-3">
            {currentHypothesis.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(i)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedOption === i
                    ? 'border-secondary bg-secondary-container/20 shadow-md'
                    : 'border-outline-variant/10 bg-surface-container-lowest hover:border-outline-variant/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedOption === i
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-body font-semibold text-primary text-[15px]">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={selectedOption === null}
              className={`flex-1 py-4 rounded-lg font-headline font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all ${
                selectedOption !== null
                  ? 'bg-secondary text-white active:scale-[0.98] shadow-lg shadow-secondary/20'
                  : 'bg-surface-variant text-on-surface-variant/40 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              시뮬레이션 실행
            </button>
            <button
              onClick={handleSkipToFree}
              className="px-4 py-4 rounded-lg border border-outline-variant/20 text-on-surface-variant font-body text-sm hover:bg-surface-container transition-colors"
            >
              건너뛰기
            </button>
          </div>
        </section>
      )}

      {/* SIMULATION / DISCOVERY / FREE — show graph */}
      {labMode !== 'hypothesis' && (
        <>
          {/* Graph Area — 60vh */}
          <div className="relative">
            <EconGraph output={output} modelId={concept.modelConfig.id} large />

            {/* Equilibrium overlay ON graph */}
            {output.equilibrium && (
              <div className="absolute bottom-4 left-4 right-4 bg-[#040d1b]/60 backdrop-blur-md px-4 py-3 rounded-lg">
                <p className="font-['Space_Grotesk'] text-[#ffc971] text-sm font-bold text-center">
                  {output.equilibrium.label}
                </p>
              </div>
            )}
          </div>

          {/* DISCOVERY STEP */}
          {labMode === 'discovery' && showResult && currentHypothesis && (
            <section className="px-6 py-6 space-y-4">
              <div className={`rounded-lg p-5 border-2 ${
                selectedOption === currentHypothesis.correctIndex
                  ? 'bg-[#1a6b50]/8 border-[#1a6b50]/30'
                  : 'bg-[#ba1a1a]/8 border-[#ba1a1a]/30'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className={`material-symbols-outlined text-xl mt-0.5 ${
                    selectedOption === currentHypothesis.correctIndex ? 'text-[#1a6b50]' : 'text-[#ba1a1a]'
                  }`}>
                    {selectedOption === currentHypothesis.correctIndex ? 'check_circle' : 'cancel'}
                  </span>
                  <div>
                    <p className="font-headline font-bold text-primary text-base mb-1">
                      {selectedOption === currentHypothesis.correctIndex
                        ? '정답입니다!'
                        : `오답 — 정답: ${currentHypothesis.options[currentHypothesis.correctIndex]}`}
                    </p>
                    <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                      {currentHypothesis.correctExplanation}
                    </p>
                  </div>
                </div>
                <div className="bg-[#d4a24e]/10 rounded-lg p-3 mt-3">
                  <p className="font-body text-sm text-[#7e5703] leading-relaxed">
                    {currentHypothesis.sideEffect}
                  </p>
                </div>
              </div>

              {/* Discovery journal entry */}
              <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-base">auto_stories</span>
                  <span className="font-['Space_Grotesk'] text-[10px] font-bold text-secondary tracking-widest uppercase">
                    Discovery Logged
                  </span>
                </div>
                <p className="font-body text-sm text-on-surface-variant">
                  실험 #{hypothesisIndex + 1}: {currentHypothesis.scenario.slice(0, 40)}...
                  {selectedOption === currentHypothesis.correctIndex ? ' [correct]' : ' [learned]'}
                </p>
              </div>

              <button
                onClick={handleNextOrFree}
                className="w-full bg-primary text-on-primary py-4 rounded-lg font-headline font-bold text-sm tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                {hypothesisIndex + 1 < hypotheses.length ? (
                  <>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    다음 실험
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">science</span>
                    자유 실험 모드
                  </>
                )}
              </button>
            </section>
          )}

          {/* SIMULATION waiting state */}
          {labMode === 'simulation' && !showResult && (
            <section className="px-6 py-8 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-headline font-bold text-primary text-lg">시뮬레이션 실행 중...</p>
            </section>
          )}

          {/* FREE MODE — scenario presets + sliders */}
          {labMode === 'free' && (
            <>
              {/* Scenario Presets */}
              {scenarios.length > 0 && (
                <section className="px-6 pt-6 pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-secondary text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >lightbulb</span>
                    <h2 className="font-headline text-sm font-bold text-primary">실생활 시나리오</h2>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2 hide-scrollbar">
                    {scenarios.map(scenario => (
                      <button
                        key={scenario.id}
                        onClick={() => handleScenarioSelect(scenario)}
                        className={`flex-shrink-0 text-left p-3 rounded-lg border transition-all min-w-[180px] ${
                          activeScenario?.id === scenario.id
                            ? 'border-secondary bg-secondary-container/30 shadow-md'
                            : 'border-outline-variant/10 bg-surface-container-lowest hover:border-outline-variant/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-secondary text-base">{scenario.icon}</span>
                          <span className="font-body font-bold text-xs text-primary">{scenario.title}</span>
                        </div>
                        <p className="font-body text-[11px] text-on-surface-variant leading-snug">{scenario.description}</p>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Scenario Explanation */}
              {activeScenario && (
                <section className="px-6 pb-3">
                  <div className="bg-secondary-container/20 border border-secondary/20 rounded-lg p-4">
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed">{activeScenario.explanation}</p>
                  </div>
                </section>
              )}

              {/* Collapsible Sliders */}
              <section className="bg-surface-container-low px-6 pt-4 pb-4 rounded-t-2xl -mt-1 relative z-10">
                <button
                  onClick={() => setSlidersExpanded(!slidersExpanded)}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >tune</span>
                    <h2 className="font-headline text-sm font-bold text-primary">변수 조절</h2>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-lg transition-transform ${
                    slidersExpanded ? '' : 'rotate-180'
                  }`}>expand_less</span>
                </button>
                {slidersExpanded && (
                  <div className="space-y-8">
                    {concept.modelConfig.variables.map(variable => (
                      <VariableSlider
                        key={variable.id}
                        variable={variable}
                        value={values[variable.id]}
                        onChange={val => handleSliderChange(variable.id, val)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Summary — compact */}
              {output.summary.length > 0 && (
                <EquilibriumInfo summary={output.summary} />
              )}
            </>
          )}

          {/* Footer Action */}
          {labMode === 'free' && (
            <footer className="p-6">
              <button
                onClick={onBack}
                className="w-full bg-primary text-on-primary py-4 rounded-lg font-headline font-bold text-sm tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">keyboard_return</span>
                돌아가기
              </button>
            </footer>
          )}
        </>
      )}

      <div className="h-10"></div>
    </div>
  );
};
