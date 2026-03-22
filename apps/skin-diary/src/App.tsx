import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { ProductCategory, WeeklyReport, SkinKeyword } from './types';
import { KEYWORD_LABELS } from './types';
import { getToday } from './utils/date';
import { useRecords } from './hooks/useRecords';
import { useProducts } from './hooks/useProducts';
import { useInsights } from './hooks/useInsights';
import { useMilestones } from './hooks/useMilestones';
import { usePresets } from './hooks/usePresets';
import {
  isOnboarded,
  setOnboarded,
  getProfile,
  saveProfile,
  isDemoMode as checkDemoMode,
  setDemoMode,
  clearAllData,
  migrateV1ToV2,
  getWeeklyReports,
  saveWeeklyReports,
} from './utils/storage';
import { loadDemoData } from './data/demo';
import { generateWeeklyReport, calculateRecordingRate } from './utils/insights';
import { TabBar } from './components/TabBar';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { InsightPage } from './pages/InsightPage';
import { NightLogPage } from './pages/NightLogPage';
import { MorningLogPage } from './pages/MorningLogPage';
import { ProductListPage } from './pages/ProductListPage';
import { SettingsPage } from './pages/SettingsPage';
import { WeeklyReportPage } from './pages/WeeklyReportPage';

type Screen = 'home' | 'calendar' | 'insight' | 'nightLog' | 'morningLog' | 'products' | 'settings' | 'weeklyReport';

export default function App() {
  // Run migration on mount
  useEffect(() => {
    migrateV1ToV2();
  }, []);

  const [hasOnboarded, setHasOnboarded] = useState(isOnboarded());
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'insight'>('home');
  const [overlay, setOverlay] = useState<Screen | null>(null);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState(getProfile());
  const [demoMode, setDemoModeState] = useState(checkDemoMode());
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(getWeeklyReports());

  const { records, saveNightLog, saveMorningLog, loadRecords } = useRecords();
  const { products, activeProducts, archivedProducts, addProduct, removeProduct, archiveProduct, unarchiveProduct, loadProducts } = useProducts();
  const { pinnedVariables, activeCustomVariables, customVariables, togglePinned, isPinned, addCustomVariable, removeCustomVariable, loadPresets } = usePresets();
  const { milestones, streak, latestMilestone, unseenMilestone, checkAndAwardMilestones, markMilestoneSeen, loadMilestones } = useMilestones(records);
  const { productInsights, variableInsights, miniInsight } = useInsights(records, activeProducts);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  }, []);

  // Auto-load demo data
  useEffect(() => {
    if (demoMode && Object.keys(records).length === 0) {
      const demo = loadDemoData();
      loadRecords(demo.records);
      loadProducts(demo.products);
      loadPresets(demo.pinnedVariables, demo.customVariables);
      loadMilestones(demo.milestones);
    }
  }, []);

  // Check milestones whenever records change
  useEffect(() => {
    if (Object.keys(records).length > 0) {
      checkAndAwardMilestones();
    }
  }, [records]);

  // Generate weekly report if needed
  useEffect(() => {
    const report = generateWeeklyReport(records);
    if (report && !weeklyReports.find(r => r.weekStart === report.weekStart)) {
      const updated = [report, ...weeklyReports].slice(0, 12); // Keep last 12 weeks
      setWeeklyReports(updated);
      saveWeeklyReports(updated);
    }
  }, [records]);

  const bestProduct = useMemo(() =>
    productInsights.filter(p => p.usedDays >= 3 && p.impact > 0)[0] || null,
    [productInsights]
  );

  const worstVariable = useMemo(() =>
    variableInsights.filter(v => v.impact < -0.1)[0] || null,
    [variableInsights]
  );

  const recordingRate = useMemo(() =>
    calculateRecordingRate(records, 30).rate,
    [records]
  );

  const handleOnboardingComplete = useCallback((prof: { name: string; skinTypes: string[] }, prods: { name: string; category: ProductCategory }[]) => {
    saveProfile(prof);
    setProfile(prof);
    setOnboarded(true);
    setHasOnboarded(true);
    for (const p of prods) {
      addProduct(p.name, p.category);
    }
  }, [addProduct]);

  const handleLoadDemo = useCallback(() => {
    const demo = loadDemoData();
    loadRecords(demo.records);
    loadProducts(demo.products);
    loadPresets(demo.pinnedVariables, demo.customVariables);
    loadMilestones(demo.milestones);
    setDemoMode(true);
    setDemoModeState(true);
    saveProfile({ name: '유진', skinTypes: ['복합성'] });
    setProfile({ name: '유진', skinTypes: ['복합성'] });
    setOnboarded(true);
    setHasOnboarded(true);
  }, [loadRecords, loadProducts, loadPresets, loadMilestones]);

  const handleToggleDemo = useCallback(() => {
    if (!demoMode) {
      const demo = loadDemoData();
      loadRecords(demo.records);
      loadProducts(demo.products);
      loadPresets(demo.pinnedVariables, demo.customVariables);
      loadMilestones(demo.milestones);
      setDemoMode(true);
      setDemoModeState(true);
    } else {
      loadRecords({});
      loadProducts([]);
      loadPresets([], []);
      loadMilestones([]);
      setDemoMode(false);
      setDemoModeState(false);
    }
  }, [demoMode, loadRecords, loadProducts, loadPresets, loadMilestones]);

  const handleResetData = useCallback(() => {
    clearAllData();
    loadRecords({});
    loadProducts([]);
    loadPresets([], []);
    loadMilestones([]);
    setProfile(null);
    setDemoModeState(false);
    setHasOnboarded(false);
    setWeeklyReports([]);
  }, [loadRecords, loadProducts, loadPresets, loadMilestones]);

  const handleExportData = useCallback(() => {
    const data = {
      records,
      products,
      profile,
      pinnedVariables,
      customVariables,
      milestones,
      weeklyReports,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-diary-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [records, products, profile, pinnedVariables, customVariables, milestones, weeklyReports]);

  const handleExportCSV = useCallback(() => {
    const dates = Object.keys(records).sort();
    const rows: string[] = [];
    rows.push('날짜,피부점수,키워드,트러블부위,아침메모,사용제품,생활습관,밤메모');
    for (const date of dates) {
      const rec = records[date];
      const score = rec.morningLog?.score || '';
      const keywords = (rec.morningLog?.keywords || []).map((k: SkinKeyword) => KEYWORD_LABELS[k] || k).join(';');
      const troubleAreas = (rec.morningLog?.troubleAreas || []).join(';');
      const morningMemo = (rec.morningLog?.memo || '').replace(/,/g, ' ').replace(/\n/g, ' ');
      const prods = (rec.nightLog?.products || []).join(';');
      const vars = (rec.nightLog?.variables || []).join(';');
      const nightMemo = (rec.nightLog?.memo || '').replace(/,/g, ' ').replace(/\n/g, ' ');
      rows.push(`${date},${score},${keywords},${troubleAreas},${morningMemo},${prods},${vars},${nightMemo}`);
    }
    const csv = '\uFEFF' + rows.join('\n'); // BOM for Excel Korean support
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-diary-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [records]);

  const handleAddProduct = useCallback((name: string, category: ProductCategory) => {
    addProduct(name, category);
  }, [addProduct]);

  if (!hasOnboarded) {
    return (
      <div className="max-w-[430px] mx-auto">
        <OnboardingPage
          onComplete={handleOnboardingComplete}
          onLoadDemo={handleLoadDemo}
        />
      </div>
    );
  }

  const showTabBar = overlay === null;

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-background">
      <div className="px-6 pt-2">
        {activeTab === 'home' && overlay === null && (
          <HomePage
            records={records}
            products={activeProducts}
            userName={profile?.name || ''}
            streak={streak}
            latestMilestone={latestMilestone}
            bestProduct={bestProduct}
            worstVariable={worstVariable}
            recordingRate={recordingRate}
            miniInsight={miniInsight}
            onOpenNightLog={() => setOverlay('nightLog')}
            onOpenMorningLog={() => setOverlay('morningLog')}
            onOpenSettings={() => setOverlay('settings')}
            onNavigateToInsight={() => setActiveTab('insight')}
            onEditMorning={(d) => { setEditDate(d); setOverlay('morningLog'); }}
            onEditNight={(d) => { setEditDate(d); setOverlay('nightLog'); }}
            onOpenWeeklyReport={() => setOverlay('weeklyReport')}
          />
        )}
        {activeTab === 'calendar' && overlay === null && (
          <CalendarPage
            records={records}
            onEditMorning={(d) => { setEditDate(d); setOverlay('morningLog'); }}
            onEditNight={(d) => { setEditDate(d); setOverlay('nightLog'); }}
          />
        )}
        {activeTab === 'insight' && overlay === null && (
          <InsightPage records={records} products={activeProducts} />
        )}
      </div>

      {showTabBar && (
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {overlay === 'nightLog' && (
        <NightLogPage
          products={activeProducts}
          records={records}
          pinnedVariables={pinnedVariables}
          customVariables={activeCustomVariables}
          onSave={(date, log) => {
            saveNightLog(date, log);
            showToast('밤 기록이 저장되었어요');
          }}
          onClose={() => { setOverlay(null); setEditDate(null); }}
          onAddProduct={handleAddProduct}
          onAddCustomVariable={(label) => addCustomVariable(label)}
          editDate={editDate}
        />
      )}

      {overlay === 'morningLog' && (
        <MorningLogPage
          records={records}
          onSave={(date, log) => {
            saveMorningLog(date, log);
            showToast('아침 기록이 저장되었어요');
          }}
          onClose={() => { setOverlay(null); setEditDate(null); }}
          editDate={editDate}
        />
      )}

      {overlay === 'products' && (
        <ProductListPage
          products={activeProducts}
          archivedProducts={archivedProducts}
          records={records}
          onAddProduct={handleAddProduct}
          onArchive={archiveProduct}
          onUnarchive={unarchiveProduct}
          onDelete={removeProduct}
          onBack={() => setOverlay(null)}
        />
      )}

      {overlay === 'settings' && (
        <SettingsPage
          profile={profile}
          records={records}
          isDemoMode={demoMode}
          milestones={milestones}
          pinnedVariables={pinnedVariables}
          customVariables={customVariables}
          onToggleDemo={handleToggleDemo}
          onResetData={handleResetData}
          onBack={() => setOverlay(null)}
          onExportData={handleExportData}
          onExportCSV={handleExportCSV}
          onOpenProducts={() => setOverlay('products')}
          onTogglePinned={togglePinned}
          onRemoveCustomVariable={removeCustomVariable}
        />
      )}

      {overlay === 'weeklyReport' && (
        <WeeklyReportPage
          reports={weeklyReports}
          onBack={() => setOverlay(null)}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-inverse-surface text-inverse-on-surface font-body text-sm px-5 py-2.5 rounded-xl shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
