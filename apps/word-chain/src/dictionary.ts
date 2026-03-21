const WORDS: string[] = [
  // ㄱ
  "가방", "가수", "가지", "감자", "감기", "강아지", "거울", "거미", "건강", "건물",
  "결혼", "경기", "경치", "계단", "고래", "고구마", "고기", "공원", "공기", "공부",
  "과일", "과자", "교실", "교통", "구름", "구두", "구경", "국밥", "국수", "군인",
  "그림", "그릇", "금요일", "기차", "기분", "기억", "기술", "기린", "기회", "길거리",
  // ㄴ
  "나무", "나라", "나비", "낚시", "남자", "남산", "내일", "노래", "노력", "놀이터",
  "농사", "누나",
  // ㄷ
  "다리", "다람쥐", "단풍", "달리기", "당근", "대문", "도시", "도전", "도서관", "독서",
  "돌고래", "동물", "동생", "두부", "두통",
  // ㄹ (두음법칙 적용)
  "라면", "라디오", "레몬", "리본",
  // ㅁ
  "마을", "마차", "마음", "말벌", "매미", "모자", "모기", "목소리", "무지개", "무릎",
  "문제", "문어", "물건", "물고기", "물결", "물감", "미소", "미역",
  // ㅂ
  "바다", "바람", "바지", "박쥐", "반지", "발자국", "밤하늘", "방법", "배구", "배추",
  "버스", "벌레", "병원", "보물", "복숭아", "본능", "봉투", "부자", "분수", "분위기",
  "비행기",
  // ㅅ
  "사과", "사람", "사진", "사자", "사탕", "산책", "살구", "상자", "상어", "상추",
  "생선", "서점", "석탄", "선물", "선배", "세상", "소금", "소나무", "소리", "손가락",
  "수건", "수박", "수영", "숙제", "시간", "시계", "시장", "식당", "식물", "신발",
  "실내", "실수",
  // ㅇ
  "아이", "악기", "양말", "어른", "언니", "여행", "역사", "연필", "영화", "예절",
  "오리", "오이", "온도", "요리", "우산", "우유", "운동", "원숭이", "유리", "육지",
  "음식", "음악", "의자", "이름", "이사", "이유", "인사", "일기", "일출",
  // ㅈ
  "자동차", "자리", "자석", "자유", "자전거", "잠자리", "장미", "장난감", "전화",
  "점심", "정리", "제비", "조개", "주사위", "주머니", "주스", "준비", "지갑", "지구",
  "지도", "직업", "직선", "진실",
  // ㅊ
  "차량", "차이", "책상", "천둥", "치마", "친구",
  // ㅋ
  "콩나물",
  // ㅌ
  "태양", "터널", "토끼",
  // ㅍ
  "포도", "풍선", "피아노",
  // ㅎ
  "하늘", "학교", "행복", "호수", "화분", "화살", "화요일", "회사",
]

/** 두음법칙 매핑: 일부 글자는 변환된 형태로도 시작할 수 있음 */
const INITIAL_SOUND_MAP: Record<string, string[]> = {
  '녀': ['여'],
  '뇨': ['요'],
  '뉴': ['유'],
  '니': ['이'],
  '랴': ['야'],
  '려': ['여'],
  '례': ['예'],
  '료': ['요'],
  '류': ['유'],
  '리': ['이'],
  '라': ['나'],
  '래': ['내'],
  '로': ['노'],
  '뢰': ['뇌'],
  '루': ['누'],
  '르': ['느'],
}

function getLastChar(word: string): string {
  return word[word.length - 1]
}

function getPossibleStartChars(char: string): string[] {
  const result = [char]
  if (INITIAL_SOUND_MAP[char]) {
    result.push(...INITIAL_SOUND_MAP[char])
  }
  // reverse lookup too
  for (const [key, values] of Object.entries(INITIAL_SOUND_MAP)) {
    if (values.includes(char)) {
      result.push(key)
    }
  }
  return result
}

export function findAiWord(lastChar: string, usedWords: Set<string>): string | null {
  const possibleChars = getPossibleStartChars(lastChar)

  for (const word of WORDS) {
    if (usedWords.has(word)) continue
    if (possibleChars.includes(word[0])) {
      return word
    }
  }
  return null
}

export function isValidKoreanWord(word: string): boolean {
  // Check if all characters are Korean (Hangul)
  return /^[가-힣]{2,}$/.test(word)
}

export function isInDictionary(word: string): boolean {
  return WORDS.includes(word)
}

export function findHintWord(lastChar: string, usedWords: Set<string>): string | null {
  const possibleChars = getPossibleStartChars(lastChar)
  for (const word of WORDS) {
    if (usedWords.has(word)) continue
    if (possibleChars.includes(word[0])) {
      return word
    }
  }
  return null
}

export function checkWordChain(prevWord: string, nextWord: string): boolean {
  const lastChar = getLastChar(prevWord)
  const firstChar = nextWord[0]
  const possibleChars = getPossibleStartChars(lastChar)
  return possibleChars.includes(firstChar)
}
