import type { CurationCard } from '../types';

export const curations: CurationCard[] = [
  // 먹기 (eat)
  { id: 1, category: 'eat', activity: '안 먹어본 메뉴', subtext: '메뉴판 끝에서 골라보기.' },
  { id: 2, category: 'eat', activity: '직접 해먹기', subtext: '간단한 거 하나. 라면이라도.' },
  { id: 3, category: 'eat', activity: '좋아하는 카페', subtext: '그 자리에 앉아서.' },
  { id: 4, category: 'eat', activity: '동네 빵집', subtext: '지나치기만 하던 그 집.' },
  { id: 5, category: 'eat', activity: '혼밥 도전', subtext: '아무 식당이나 들어가 보기.' },
  { id: 6, category: 'eat', activity: '디저트 하나', subtext: '이유 없이.' },
  { id: 7, category: 'eat', activity: '편의점 신상', subtext: '새로 나온 거 하나.' },
  { id: 8, category: 'eat', activity: '따뜻한 국물', subtext: '찌개든 라면이든.' },

  // 움직이기 (move)
  { id: 9, category: 'move', activity: '동네 산책', subtext: '가까운 곳부터. 이어폰 없이.' },
  { id: 10, category: 'move', activity: '스트레칭 15분', subtext: '바닥에 누워서 시작.' },
  { id: 11, category: 'move', activity: '자전거 한 바퀴', subtext: '목적지 없이.' },
  { id: 12, category: 'move', activity: '계단 오르기', subtext: '엘리베이터 대신.' },
  { id: 13, category: 'move', activity: '달리기 10분', subtext: '딱 10분만.' },
  { id: 14, category: 'move', activity: '한 정거장 걷기', subtext: '하나 먼저 내려서.' },
  { id: 15, category: 'move', activity: '요가 한 세트', subtext: '유튜브 따라하기.' },
  { id: 16, category: 'move', activity: '춤추기', subtext: '방에서 혼자. 아무도 안 봐.' },

  // 쉬기 (rest)
  { id: 17, category: 'rest', activity: '아무것도 안 하기', subtext: '진짜로. 5분만.' },
  { id: 18, category: 'rest', activity: '창밖 보기', subtext: '폰 내려놓고.' },
  { id: 19, category: 'rest', activity: '반신욕 20분', subtext: '따뜻한 물이면 충분.' },
  { id: 20, category: 'rest', activity: '낮잠 30분', subtext: '알람 맞춰놓고.' },
  { id: 21, category: 'rest', activity: '향초 켜기', subtext: '불빛 하나로 분위기.' },
  { id: 22, category: 'rest', activity: '누워서 멍때리기', subtext: '생산적일 필요 없어.' },
  { id: 23, category: 'rest', activity: '조용한 음악', subtext: '말이 없는 음악으로.' },

  // 만나기 (meet)
  { id: 24, category: 'meet', activity: '오래된 친구 연락', subtext: '안부 한 줄이면 돼.' },
  { id: 25, category: 'meet', activity: '가족 전화', subtext: '5분이면 충분.' },
  { id: 26, category: 'meet', activity: '옆자리 동료 커피', subtext: '일 얘기 말고.' },
  { id: 27, category: 'meet', activity: '동네 모임', subtext: '한 번쯤 가볼까.' },
  { id: 28, category: 'meet', activity: '편지 쓰기', subtext: '손편지든 카톡이든.' },
  { id: 29, category: 'meet', activity: '같이 밥 먹기', subtext: '혼자 말고 오늘은.' },
  { id: 30, category: 'meet', activity: '안부 인사', subtext: '오랜만에 그 사람한테.' },

  // 배우기 (learn)
  { id: 31, category: 'learn', activity: '새 단어 하나', subtext: '아무 언어나.' },
  { id: 32, category: 'learn', activity: '다큐 한 편', subtext: '모르는 세계.' },
  { id: 33, category: 'learn', activity: '모르는 동네 검색', subtext: '지도 앱 켜서.' },
  { id: 34, category: 'learn', activity: '위키 서핑', subtext: '하나 읽다 보면 세 개.' },
  { id: 35, category: 'learn', activity: '강연 하나', subtext: 'TED든 유튜브든.' },
  { id: 36, category: 'learn', activity: '뉴스레터 읽기', subtext: '쌓아둔 거 하나만.' },
  { id: 37, category: 'learn', activity: '새 앱 써보기', subtext: '써보고 싶던 거.' },

  // 만들기 (make)
  { id: 38, category: 'make', activity: '손편지 쓰기', subtext: '줄 안 맞아도 돼.' },
  { id: 39, category: 'make', activity: '레고 조립', subtext: '설명서 없이도.' },
  { id: 40, category: 'make', activity: '요리 한 가지', subtext: '레시피 보면서.' },
  { id: 41, category: 'make', activity: '그림 그리기', subtext: '잘 그릴 필요 없어.' },
  { id: 42, category: 'make', activity: '글쓰기', subtext: '한 문단이면 충분.' },
  { id: 43, category: 'make', activity: '사진 찍기', subtext: '폰으로. 아무거나.' },
  { id: 44, category: 'make', activity: '플레이리스트 만들기', subtext: '오늘 기분으로.' },
  { id: 45, category: 'make', activity: '정리정돈', subtext: '서랍 하나만.' },

  // 보기듣기 (watch)
  { id: 46, category: 'watch', activity: '팟캐스트 한 편', subtext: '출퇴근길에 딱.' },
  { id: 47, category: 'watch', activity: '사진첩 넘기기', subtext: '작년 이맘때.' },
  { id: 48, category: 'watch', activity: '밤하늘 보기', subtext: '별이 보이든 안 보이든.' },
  { id: 49, category: 'watch', activity: '영화 한 편', subtext: '짧은 거라도.' },
  { id: 50, category: 'watch', activity: '새 음악 찾기', subtext: '추천 알고리즘 따라.' },
  { id: 51, category: 'watch', activity: '유튜브 한 편만', subtext: '진짜 한 편만.' },
  { id: 52, category: 'watch', activity: '라디오 듣기', subtext: '목소리가 있는 밤.' },
  { id: 53, category: 'watch', activity: '미술관 검색', subtext: '이번 주 전시 뭐가 있지.' },
  { id: 54, category: 'watch', activity: '웹툰 정주행', subtext: '완결작으로.' },
];
