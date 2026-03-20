import { useState } from 'react';
import type { DreamScene, PlaceKey, WeatherKey, PersonKey, ObjectKey } from '../types';
import { PLACES, WEATHERS, PERSONS, OBJECTS } from '../data';

// Place mood colors for background tint
const PLACE_BG_TINTS: Record<PlaceKey, string> = {
  ocean: 'rgba(30, 58, 95, 0.15)',
  forest: 'rgba(20, 83, 45, 0.12)',
  city: 'rgba(55, 65, 81, 0.12)',
  sky: 'rgba(30, 64, 100, 0.15)',
  underground: 'rgba(30, 20, 60, 0.15)',
  school: 'rgba(80, 60, 30, 0.10)',
  home: 'rgba(70, 50, 30, 0.10)',
  unknown: 'rgba(20, 20, 60, 0.15)',
  office: 'rgba(50, 50, 60, 0.10)',
  cafe: 'rgba(80, 50, 20, 0.12)',
  hospital: 'rgba(40, 60, 70, 0.10)',
  street: 'rgba(60, 50, 40, 0.10)',
};

interface Props {
  scene: DreamScene;
  onSceneChange: (scene: DreamScene) => void;
  onNext: () => void;
  onBack: () => void;
}

const TABS = [
  { key: 'place' as const, label: '장소', icon: 'landscape' },
  { key: 'weather' as const, label: '날씨', icon: 'wb_cloudy' },
  { key: 'characters' as const, label: '인물', icon: 'person' },
  { key: 'objects' as const, label: '오브젝트', icon: 'magic_button' },
];

export default function SceneBuilderScreen({ scene, onSceneChange, onNext, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'place' | 'weather' | 'characters' | 'objects'>('place');

  const canProceed = scene.place !== null && scene.weather !== null;

  const toggleCharacter = (key: PersonKey) => {
    const chars = scene.characters.includes(key)
      ? scene.characters.filter(c => c !== key)
      : scene.characters.length < 3
        ? [...scene.characters, key]
        : scene.characters;
    onSceneChange({ ...scene, characters: chars });
  };

  const toggleObject = (key: ObjectKey) => {
    const objs = scene.objects.includes(key)
      ? scene.objects.filter(o => o !== key)
      : scene.objects.length < 3
        ? [...scene.objects, key]
        : scene.objects;
    onSceneChange({ ...scene, objects: objs });
  };

  // Preview icons
  const previewItems: { icon: string; label: string; selected: boolean }[] = [];
  if (scene.place) {
    const p = PLACES.find(x => x.key === scene.place)!;
    previewItems.push({ icon: p.icon, label: p.label, selected: true });
  }
  if (scene.weather) {
    const w = WEATHERS.find(x => x.key === scene.weather)!;
    previewItems.push({ icon: w.icon, label: w.label, selected: true });
  }
  scene.characters.forEach(c => {
    const p = PERSONS.find(x => x.key === c)!;
    previewItems.push({ icon: p.icon, label: p.label, selected: true });
  });
  scene.objects.forEach(o => {
    const obj = OBJECTS.find(x => x.key === o)!;
    previewItems.push({ icon: obj.icon, label: obj.label, selected: true });
  });

  // Fill remaining with question marks
  const remaining = 4 - previewItems.length;
  for (let i = 0; i < remaining; i++) {
    previewItems.push({ icon: 'question_mark', label: '', selected: false });
  }

  const currentStep = activeTab === 'place' ? 1 : activeTab === 'weather' ? 1 : activeTab === 'characters' ? 2 : 3;
  const progressWidth = currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%';

  // Get items for current tab
  const getGridItems = () => {
    if (activeTab === 'place') return PLACES;
    if (activeTab === 'weather') return WEATHERS;
    if (activeTab === 'characters') return PERSONS;
    return OBJECTS;
  };

  const isSelected = (key: string) => {
    if (activeTab === 'place') return scene.place === key;
    if (activeTab === 'weather') return scene.weather === key;
    if (activeTab === 'characters') return scene.characters.includes(key as PersonKey);
    return scene.objects.includes(key as ObjectKey);
  };

  const handleSelect = (key: string) => {
    if (activeTab === 'place') onSceneChange({ ...scene, place: key as PlaceKey });
    else if (activeTab === 'weather') onSceneChange({ ...scene, weather: key as WeatherKey });
    else if (activeTab === 'characters') toggleCharacter(key as PersonKey);
    else toggleObject(key as ObjectKey);
  };

  // Background tint based on selected place
  const bgTint = scene.place ? PLACE_BG_TINTS[scene.place] : 'transparent';

  return (
    <div className="bg-surface text-on-surface min-h-screen relative screen-enter" style={{ transition: 'background-color 0.5s ease' }}>
      {/* Place mood tint overlay */}
      <div
        className="fixed inset-0 pointer-events-none -z-5 transition-all duration-500 ease-in-out"
        style={{ backgroundColor: bgTint }}
      />
      {/* Top Navigation Shell */}
      <header className="fixed top-0 w-full max-w-[430px] z-50 flex justify-between items-center px-6 h-16 bg-surface-dim/60 backdrop-blur-xl shadow-[0_4px_40px_rgba(79,70,229,0.08)]">
        <button onClick={onBack} className="flex items-center gap-2 text-primary-container">
          <span className="material-symbols-outlined">auto_awesome</span>
        </button>
        <h1 className="font-headline text-lg tracking-[0.1em] text-on-surface uppercase">꿈의 조각가</h1>
        <div className="w-6 h-6"></div>
      </header>

      <main className="pt-20 pb-32 px-6">
        {/* Progress Section */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="font-label text-[10px] tracking-[0.1em] text-primary">챕터 01</span>
            <span className="font-label text-[10px] tracking-[0.1em] text-on-surface/60">단계 1/3</span>
          </div>
          <div className="h-[2px] w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary-container shadow-[0_0_12px_var(--color-primary-container)] transition-all" style={{ width: progressWidth }}></div>
          </div>
        </section>

        {/* Category Tabs */}
        <nav className="flex justify-around items-center mb-10 bg-surface-container-low rounded-xl p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 transition-all active:scale-95 flex-1 ${
                activeTab === tab.key
                  ? 'text-primary bg-primary-container/20'
                  : 'text-on-surface/40 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined mb-1">{tab.icon}</span>
              <span className="font-body text-[10px] tracking-[0.1em] uppercase">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Preview Strip */}
        <section className="mb-10">
          <h3 className="font-headline text-sm mb-4 text-on-surface/80 flex items-center gap-2">
            <span className="w-1 h-1 bg-primary rounded-full"></span>
            꿈 조각 미리보기
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {previewItems.map((item, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-12 h-12 rounded-full glass-card-subtle flex items-center justify-center ${
                  item.selected
                    ? 'border border-primary/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                    : 'border border-outline-variant/10 opacity-30'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${item.selected ? 'text-primary' : 'text-on-surface'}`}>
                  {item.icon}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Selection Grid — 3 cols for place (12 items), 2 cols for others */}
        <div className={`grid gap-4 ${activeTab === 'place' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {getGridItems().map((item) => {
            const selected = isSelected(item.key);
            return (
              <button
                key={item.key}
                onClick={() => handleSelect(item.key)}
                className={`${activeTab === 'place' ? 'aspect-[3/4]' : 'aspect-square'} rounded-xl flex flex-col items-center justify-center gap-3 p-4 transition-all duration-200 active:scale-95 ${
                  selected
                    ? 'bg-primary-container/20 border-2 border-primary shadow-[0_0_20px_rgba(79,70,229,0.2)] scale-[1.02] glow-ring-animate'
                    : 'glass-card-subtle border border-outline-variant/10 hover:bg-surface-bright hover:scale-[1.02] group'
                }`}
                style={{ transition: 'transform 0.2s ease, box-shadow 0.3s ease, border-color 0.3s ease' }}
              >
                <span
                  className={`material-symbols-outlined ${activeTab === 'place' ? 'text-2xl' : 'text-3xl'} ${
                    selected ? 'text-primary icon-fill' : 'text-on-surface/60 group-hover:text-primary'
                  }`}
                >
                  {item.icon}
                </span>
                <span className={`font-headline ${activeTab === 'place' ? 'text-sm' : 'text-base'} ${selected ? 'text-primary' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <footer className="fixed bottom-0 left-0 w-full max-w-[430px] z-50 px-6 pb-10 pt-4 bg-gradient-to-t from-surface-dim via-surface-dim/90 to-transparent">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-4 rounded-full font-body font-bold text-lg shadow-[0_8px_30px_rgba(79,70,229,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            canProceed
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'
          }`}
        >
          다음 단계로
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[20%] -left-[10%] w-[60%] h-[40%] bg-primary-container/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[30%] bg-tertiary-container/10 blur-[80px] rounded-full"></div>
      </div>
    </div>
  );
}
