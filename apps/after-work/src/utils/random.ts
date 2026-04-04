/** 날짜 문자열로부터 시드값을 생성 */
export function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** 시드 기반으로 배열에서 N개를 중복 없이 선택 */
export function seededPick<T>(arr: T[], count: number, seed: number): T[] {
  if (arr.length <= count) return [...arr];
  const result: T[] = [];
  const used = new Set<number>();
  let s = seed;

  while (result.length < count) {
    s = nextSeed(s);
    const idx = s % arr.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

/** 시드 기반으로 배열에서 1개 선택 */
export function seededPickOne<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** 간단한 시드 진행 함수 */
function nextSeed(s: number): number {
  s = ((s * 1103515245) + 12345) & 0x7fffffff;
  return s;
}
