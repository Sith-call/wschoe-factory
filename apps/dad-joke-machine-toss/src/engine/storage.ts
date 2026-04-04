/**
 * 토스 네이티브 Storage 래퍼.
 * Vite alias로 로컬 개발 시 localStorage, 토스 빌드 시 네이티브 Storage가 사용됩니다.
 */
import { Storage } from "@apps-in-toss/native-modules";

export async function getItem(key: string): Promise<string | null> {
  return Storage.getItem(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  await Storage.setItem(key, value);
}

export async function removeItem(key: string): Promise<void> {
  await Storage.removeItem(key);
}
