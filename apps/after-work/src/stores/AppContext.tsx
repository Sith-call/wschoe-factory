import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Settings, Entry } from '../types';
import { getAllEntries, openDB, putEntry, deleteEntry as dbDeleteEntry, clearAllEntries } from '../utils/db';
import { getTodayString } from '../utils/date';

const defaultSettings: Settings = {
  notificationEnabled: false,
  notificationTime: '19:00',
};

const initialState: AppState = {
  settings: defaultSettings,
  todayEntry: null,
  entries: [],
  toastMessage: null,
  initialized: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_TODAY_ENTRY':
      return { ...state, todayEntry: action.payload };
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload, todayEntry: action.payload.find(e => e.date === getTodayString()) ?? null };
    case 'ADD_ENTRY': {
      const filtered = state.entries.filter(e => e.date !== action.payload.date);
      const newEntries = [action.payload, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
      return {
        ...state,
        entries: newEntries,
        todayEntry: action.payload.date === getTodayString() ? action.payload : state.todayEntry,
      };
    }
    case 'UPDATE_ENTRY': {
      const updated = state.entries.map(e => e.date === action.payload.date ? action.payload : e);
      return {
        ...state,
        entries: updated,
        todayEntry: action.payload.date === getTodayString() ? action.payload : state.todayEntry,
      };
    }
    case 'DELETE_ENTRY': {
      const remaining = state.entries.filter(e => e.date !== action.payload);
      return {
        ...state,
        entries: remaining,
        todayEntry: action.payload === getTodayString() ? null : state.todayEntry,
      };
    }
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toastMessage: null };
    case 'CLEAR_ALL':
      return { ...state, entries: [], todayEntry: null };
    case 'SET_INITIALIZED':
      return { ...state, initialized: true };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  saveEntry: (entry: Entry) => Promise<void>;
  removeEntry: (date: string) => Promise<void>;
  clearAll: () => Promise<void>;
  showToast: (msg: string) => void;
  saveSettings: (settings: Settings) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function init() {
      await openDB();
      const entries = await getAllEntries();
      dispatch({ type: 'SET_ENTRIES', payload: entries });

      // Load settings from localStorage
      const saved = localStorage.getItem('aw-settings');
      if (saved) {
        try {
          dispatch({ type: 'SET_SETTINGS', payload: JSON.parse(saved) });
        } catch { /* ignore */ }
      }

      dispatch({ type: 'SET_INITIALIZED' });
    }
    init();
  }, []);

  const saveEntry = async (entry: Entry) => {
    await putEntry(entry);
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  };

  const removeEntry = async (date: string) => {
    await dbDeleteEntry(date);
    dispatch({ type: 'DELETE_ENTRY', payload: date });
  };

  const clearAll = async () => {
    await clearAllEntries();
    dispatch({ type: 'CLEAR_ALL' });
  };

  const showToast = (msg: string) => {
    dispatch({ type: 'SHOW_TOAST', payload: msg });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2500);
  };

  const saveSettings = (settings: Settings) => {
    localStorage.setItem('aw-settings', JSON.stringify(settings));
    dispatch({ type: 'SET_SETTINGS', payload: settings });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, saveEntry, removeEntry, clearAll, showToast, saveSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
