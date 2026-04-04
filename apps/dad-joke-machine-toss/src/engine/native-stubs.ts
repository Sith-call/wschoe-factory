/**
 * 로컬 개발용 네이티브 모듈 스텁.
 * 토스 앱 외부에서는 이 모듈이 사용됩니다.
 */

export function generateHapticFeedback(_opts: { type: string }) {
  // 로컬: 무시
}

export async function share(_msg: { message: string }) {
  if (navigator.share) {
    await navigator.share({ text: _msg.message });
  }
}

export async function setClipboardText(text: string) {
  await navigator.clipboard.writeText(text);
}

export async function getClipboardText(): Promise<string> {
  return navigator.clipboard.readText();
}

export const Storage = {
  getItem: async (key: string): Promise<string | null> => localStorage.getItem(key),
  setItem: async (key: string, value: string): Promise<void> => { localStorage.setItem(key, value); },
  removeItem: async (key: string): Promise<void> => { localStorage.removeItem(key); },
  clearItems: async (): Promise<void> => { localStorage.clear(); },
};
