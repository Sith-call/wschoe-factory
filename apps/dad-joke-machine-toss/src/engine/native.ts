/**
 * 토스 네이티브 모듈 래퍼.
 * Vite alias로 로컬 개발 시 stub, 토스 빌드 시 실제 모듈이 사용됩니다.
 */
import {
  generateHapticFeedback,
  share,
  setClipboardText,
} from "@apps-in-toss/native-modules";

export function haptic(type: "tap" | "success" | "confetti" = "tap") {
  try {
    generateHapticFeedback({ type });
  } catch {
    // ignore
  }
}

export async function shareText(text: string) {
  try {
    await share({ message: text });
  } catch {
    if (navigator.share) {
      await navigator.share({ text });
    }
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await setClipboardText(text);
    return true;
  } catch {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
