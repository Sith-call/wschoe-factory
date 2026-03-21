import React, { useState, useCallback, useEffect } from 'react';
import type { ProductCategory } from './types';
import { getToday } from './utils/date';
import { useRecords } from './hooks/useRecords';
import { useProducts } from './hooks/useProducts';
import { isOnboarded, setOnboarded, getProfile, saveProfile, isDemoMode as checkDemoMode, setDemoMode, clearAllData } from './utils/storage';
import { loadDemoData } from './data/demo';
import { useInsights } from './hooks/useInsights';
import { TabBar } from './components/TabBar';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { InsightPage } from './pages/InsightPage';
import { NightLogPage } from './pages/NightLogPage';
import { MorningLogPage } from './pages/MorningLogPage';
import { ProductListPage } from './pages/ProductListPage';
import { SettingsPage } from './pages/SettingsPage';

type Screen = 'home' | 'calendar' | 'insight' | 'nightLog' | 'morningLog' | 'products' | 'settings';

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(isOnboarded());
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'insight'>('home');
  const [overlay, setOverlay] = useState<Screen | null>(null);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState(getProfile());
  const [demoMode, setDemoModeState] = useState(checkDemoMode());

  const { records, saveNightLog, saveMorningLog, loadRecords } = useRecords();

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  }, []);
  const { products, activeProducts, archivedProducts, addProduct, removeProduct, archiveProduct, unarchiveProduct, loadProducts } = useProducts();

  // Auto-load demo data on app start if demo mode is ON but records are empty
  useEffect(() => {
    if (demoMode && Object.keys(records).length === 0) {
      const demo = loadDemoData();
      loadRecords(demo.records);
      loadProducts(demo.products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { productInsights, variableInsights } = useInsights(records, activeProducts);

  // Best product and worst variable for home insight summary
  const bestProduct = productInsights.filter(p => p.usedDays >= 3 && p.impact > 0)[0] || null;
  const worstVariable = variableInsights.filter(v => v.impact < -0.1)[0] || null;

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
    setDemoMode(true);
    setDemoModeState(true);
    saveProfile({ name: '유진', skinTypes: ['복합성'] });
    setProfile({ name: '유진', skinTypes: ['복합성'] });
    setOnboarded(true);
    setHasOnboarded(true);
  }, [loadRecords, loadProducts]);

  const handleToggleDemo = useCallback(() => {
    if (!demoMode) {
      const demo = loadDemoData();
      loadRecords(demo.records);
      loadProducts(demo.products);
      setDemoMode(true);
      setDemoModeState(true);
    } else {
      loadRecords({});
      loadProducts([]);
      setDemoMode(false);
      setDemoModeState(false);
    }
  }, [demoMode, loadRecords, loadProducts]);

  const handleResetData = useCallback(() => {
    clearAllData();
    loadRecords({});
    loadProducts([]);
    setProfile(null);
    setDemoModeState(false);
    setHasOnboarded(false);
  }, [loadRecords, loadProducts]);

  const handleExportData = useCallback(() => {
    const data = {
      records,
      products,
      profile,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-diary-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [records, products, profile]);

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
    <div className="max-w-[430px] mx-auto min-h-screen bg-sd-bg">
      <div className="px-5 pt-6" style={{ opacity: 1 }}>
        {activeTab === 'home' && (
          <HomePage
            records={records}
            products={activeProducts}
            userName={profile?.name || ''}
            onOpenNightLog={() => setOverlay('nightLog')}
            onOpenMorningLog={() => setOverlay('morningLog')}
            onOpenProducts={() => setOverlay('products')}
            onOpenSettings={() => setOverlay('settings')}
            bestProduct={bestProduct}
            worstVariable={worstVariable}
            onNavigateToInsight={() => setActiveTab('insight')}
            onEditMorning={() => { setEditDate(getToday()); setOverlay('morningLog'); }}
            onEditNight={() => { setEditDate(getToday()); setOverlay('nightLog'); }}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarPage
            records={records}
            onEditDate={(date: string) => {
              const r = records[date];
              setEditDate(date);
              if (r?.morningLog) {
                setOverlay('morningLog');
              } else if (r?.nightLog) {
                setOverlay('nightLog');
              } else {
                setOverlay('morningLog');
              }
            }}
            onEditNightDate={(date: string) => {
              setEditDate(date);
              setOverlay('nightLog');
            }}
          />
        )}
        {activeTab === 'insight' && (
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
          onSave={(date, log) => {
            saveNightLog(date, log);
            showToast('기록이 저장되었어요');
          }}
          onClose={() => { setOverlay(null); setEditDate(null); }}
          onAddProduct={handleAddProduct}
          editDate={editDate}
        />
      )}

      {overlay === 'morningLog' && (
        <MorningLogPage
          records={records}
          onSave={(date, log) => {
            saveMorningLog(date, log);
            showToast('기록이 저장되었어요');
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
          onToggleDemo={handleToggleDemo}
          onResetData={handleResetData}
          onBack={() => setOverlay(null)}
          onExportData={handleExportData}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-sd-text text-white font-body text-sm px-5 py-2.5 rounded-xl shadow-lg" style={{ opacity: 1, transition: 'opacity 200ms' }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
