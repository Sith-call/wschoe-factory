import type {
  PlaceKey, WeatherKey, PersonKey, ObjectKey, DreamEmotionKey,
  DreamEntry, InterpretationResult, SymbolReading,
} from './types';

// ─── Places (12 total: original 8 + 4 new) ───
export const PLACES: { key: PlaceKey; label: string; icon: string; keyword: string }[] = [
  { key: 'forest', label: '숲', icon: 'park', keyword: '성장' },
  { key: 'ocean', label: '바다', icon: 'water', keyword: '무의식' },
  { key: 'city', label: '도시', icon: 'location_city', keyword: '야망' },
  { key: 'school', label: '학교', icon: 'school', keyword: '학습' },
  { key: 'home', label: '집', icon: 'home', keyword: '안식' },
  { key: 'sky', label: '하늘', icon: 'cloud', keyword: '자유' },
  { key: 'underground', label: '지하', icon: 'subway', keyword: '내면' },
  { key: 'unknown', label: '미지의 장소', icon: 'explore', keyword: '탐험' },
  { key: 'office', label: '회사', icon: 'business', keyword: '책임' },
  { key: 'cafe', label: '카페', icon: 'coffee', keyword: '여유' },
  { key: 'hospital', label: '병원', icon: 'local_hospital', keyword: '치유' },
  { key: 'street', label: '길거리', icon: 'directions_walk', keyword: '방향' },
];

// ─── Weathers ───
export const WEATHERS: { key: WeatherKey; label: string; icon: string; modifier: string }[] = [
  { key: 'clear', label: '맑음', icon: 'wb_sunny', modifier: '맑은' },
  { key: 'cloudy', label: '흐림', icon: 'cloud', modifier: '흐린' },
  { key: 'rain', label: '비', icon: 'rainy', modifier: '비 내리는' },
  { key: 'snow', label: '눈', icon: 'ac_unit', modifier: '눈 내리는' },
  { key: 'fog', label: '안개', icon: 'foggy', modifier: '안개 낀' },
  { key: 'storm', label: '폭풍', icon: 'thunderstorm', modifier: '폭풍의' },
];

// ─── Persons ───
export const PERSONS: { key: PersonKey; label: string; icon: string }[] = [
  { key: 'self', label: '나', icon: 'person' },
  { key: 'family', label: '가족', icon: 'family_restroom' },
  { key: 'lover', label: '연인', icon: 'favorite' },
  { key: 'friend', label: '친구', icon: 'group' },
  { key: 'stranger', label: '낯선사람', icon: 'person_search' },
  { key: 'celebrity', label: '유명인', icon: 'star' },
  { key: 'animal', label: '동물', icon: 'pets' },
];

// ─── Objects (5 meanings each) ───
export const OBJECTS: { key: ObjectKey; label: string; icon: string; keyword: string; meanings: string[] }[] = [
  { key: 'water', label: '물', icon: 'water_drop', keyword: '정화', meanings: [
    '감정의 흐름과 정화를 상징합니다',
    '무의식의 깊은 곳에서 올라오는 메시지입니다',
    '변화와 새로운 시작을 암시합니다',
    '마음속 응어리가 씻겨 내려가는 과정입니다',
    '감정의 파도가 당신을 새로운 곳으로 데려가려 합니다',
    '고여 있던 감정이 드디어 흐르기 시작한 징조입니다',
    '물의 투명함은 지금 진실을 볼 준비가 되었음을 뜻합니다',
    '깊은 물은 아직 탐험하지 않은 내면의 영역을 가리킵니다',
    '물결의 움직임은 삶의 리듬에 다시 맞춰지고 있음을 보여줍니다',
    '잔잔한 수면 아래 숨겨진 감정이 표면으로 올라오려 합니다',
  ]},
  { key: 'fire', label: '불', icon: 'local_fire_department', keyword: '열정', meanings: [
    '내면의 열정과 에너지를 나타냅니다',
    '변환과 재탄생의 과정을 의미합니다',
    '억압된 감정이 표출되려 합니다',
    '창조적 에너지가 폭발할 준비를 하고 있습니다',
    '오래된 것을 태우고 새것을 맞이할 시간입니다',
    '불꽃은 어둠 속에서도 길을 밝히는 내면의 의지입니다',
    '타오르는 불은 더 이상 참을 수 없는 진실이 있음을 말해줍니다',
    '불의 따뜻함은 차가워진 관계나 열정이 다시 살아나고 있음을 뜻합니다',
    '꺼지지 않는 불씨는 포기하지 않은 꿈이 여전히 살아있다는 증거입니다',
    '불길의 방향이 당신이 나아갈 길을 가리키고 있습니다',
  ]},
  { key: 'mirror', label: '거울', icon: 'blur_on', keyword: '자아', meanings: [
    '자아 성찰과 내면 탐색을 의미합니다',
    '숨겨진 진실을 마주할 시기입니다',
    '타인의 시선에 대한 의식을 반영합니다',
    '진정한 자신의 모습을 발견하게 될 것입니다',
    '거울 너머의 또 다른 가능성이 기다리고 있습니다',
    '거울에 비친 모습이 현실의 자신과 다르다면, 내면의 변화가 진행 중입니다',
    '깨진 거울은 오래된 자아상을 버리고 새로운 정체성을 받아들일 때임을 뜻합니다',
    '거울 속 눈빛은 스스로도 인식하지 못한 감정을 담고 있습니다',
    '거울을 피하는 꿈은 직면하기 두려운 진실이 있음을 나타냅니다',
    '맑은 거울은 자기 이해의 시야가 넓어지고 있다는 긍정적 신호입니다',
  ]},
  { key: 'key', label: '열쇠', icon: 'key', keyword: '기회', meanings: [
    '새로운 기회의 문이 열리고 있습니다',
    '해답을 찾기 위한 여정을 상징합니다',
    '중요한 결정의 순간이 다가옵니다',
    '잠겨 있던 가능성이 곧 해방될 것입니다',
    '당신만이 열 수 있는 비밀이 존재합니다',
    '열쇠를 찾았다면 준비가 완료되었다는 무의식의 확인입니다',
    '녹슨 열쇠는 오랫동안 잊고 있던 재능이나 관계를 다시 열 시간임을 뜻합니다',
    '여러 개의 열쇠는 선택지가 많아지고 있음을 상징합니다',
    '열쇠를 건네받는 꿈은 누군가의 신뢰를 얻게 될 것을 암시합니다',
    '빛나는 열쇠는 가장 중요한 답이 이미 가까이에 있음을 뜻합니다',
  ]},
  { key: 'stairs', label: '계단', icon: 'stairs', keyword: '도약', meanings: [
    '성장과 도약의 과정을 나타냅니다',
    '인생의 다음 단계로 나아가려는 욕구입니다',
    '목표를 향한 꾸준한 전진을 의미합니다',
    '한 계단씩 오르며 시야가 넓어지고 있습니다',
    '높은 곳에서 보면 지금의 고민이 작아질 것입니다',
    '끝이 보이지 않는 계단은 장기적 목표를 향한 인내심을 시험하고 있습니다',
    '내려가는 계단은 내면 깊숙이 탐구하려는 욕구를 반영합니다',
    '나선형 계단은 같은 문제가 다른 수준에서 반복되고 있음을 뜻합니다',
    '계단 위에서 내려다보는 풍경은 지금까지의 성장을 인정하라는 메시지입니다',
    '부서진 계단은 기존 방식을 버리고 새로운 접근이 필요함을 알려줍니다',
  ]},
  { key: 'clock', label: '시계', icon: 'schedule', keyword: '시간', meanings: [
    '시간에 대한 압박감을 반영합니다',
    '중요한 시기가 다가오고 있음을 암시합니다',
    '과거와 현재 사이의 갈등을 나타냅니다',
    '멈춰 있던 시간이 다시 흐르기 시작합니다',
    '지금 이 순간에 집중하라는 무의식의 메시지입니다',
    '거꾸로 도는 시계는 과거의 어떤 순간을 다시 살고 싶은 마음을 뜻합니다',
    '시계 소리는 놓치고 있는 중요한 것에 주의를 기울이라는 경고입니다',
    '깨진 시계는 시간의 압박에서 벗어나 자유로워질 수 있다는 메시지입니다',
    '빠르게 도는 시계바늘은 변화의 속도가 빨라지고 있음을 상징합니다',
    '시계가 정오를 가리키는 순간은 중요한 전환점이 임박했음을 알려줍니다',
  ]},
  { key: 'flower', label: '꽃', icon: 'local_florist', keyword: '아름다움', meanings: [
    '아름다움과 성장의 결실을 상징합니다',
    '사랑과 관계의 꽃이 피어나고 있습니다',
    '내면의 아름다움이 드러날 시기입니다',
    '인내의 시간이 지나고 만개의 순간이 왔습니다',
    '작은 씨앗이 놀라운 결과로 자라날 것입니다',
    '시든 꽃은 한 시기의 끝이자 새로운 계절의 시작을 의미합니다',
    '야생화는 통제할 수 없는 곳에서도 아름다움이 자란다는 메시지입니다',
    '꽃봉오리는 아직 드러나지 않은 잠재력이 곧 펼쳐질 것을 암시합니다',
    '꽃향기가 가득한 꿈은 감각적 기쁨과 현재를 즐기라는 초대입니다',
    '누군가에게 꽃을 주는 꿈은 표현하지 못한 감사와 애정이 있음을 뜻합니다',
  ]},
  { key: 'door', label: '문', icon: 'door_front', keyword: '전환', meanings: [
    '새로운 세계로의 전환점에 서 있습니다',
    '선택의 기로에서 결단이 필요합니다',
    '미지의 가능성이 기다리고 있습니다',
    '닫힌 문 뒤에 예상치 못한 기회가 숨어있습니다',
    '용기를 내어 문을 열면 세계가 달라질 것입니다',
    '잠긴 문은 아직 준비되지 않은 영역이 있음을 뜻하지만, 때가 오면 열릴 것입니다',
    '열려 있는 문은 이미 기회가 주어졌으니 행동할 때라는 메시지입니다',
    '여러 개의 문은 다양한 가능성 중 직감을 따르라는 무의식의 조언입니다',
    '문 뒤에서 들리는 소리는 미래에 대한 기대와 불안이 공존함을 나타냅니다',
    '사라지는 문은 기회가 영원하지 않으니 지금 결단하라는 긴급한 메시지입니다',
  ]},
];

// ─── Emotions ───
export const EMOTIONS: { key: DreamEmotionKey; label: string; emoji: string; keyword: string; gradient: [string, string] }[] = [
  { key: 'peace', label: '평화', emoji: '😌', keyword: '안정', gradient: ['#7C3AED', '#3B82F6'] },
  { key: 'fear', label: '공포', emoji: '😨', keyword: '경고', gradient: ['#374151', '#1E1B4B'] },
  { key: 'confusion', label: '혼란', emoji: '😵', keyword: '갈등', gradient: ['#8B5CF6', '#EC4899'] },
  { key: 'joy', label: '즐거움', emoji: '😊', keyword: '희망', gradient: ['#EC4899', '#F97316'] },
  { key: 'sorrow', label: '슬픔', emoji: '😢', keyword: '치유', gradient: ['#6366F1', '#8B5CF6'] },
  { key: 'anger', label: '분노', emoji: '😠', keyword: '해소', gradient: ['#DC2626', '#9333EA'] },
  { key: 'surprise', label: '놀라움', emoji: '😲', keyword: '각성', gradient: ['#F59E0B', '#EC4899'] },
  { key: 'longing', label: '그리움', emoji: '🥺', keyword: '갈망', gradient: ['#6366F1', '#06B6D4'] },
];

export const VIVIDNESS_LABELS = ['흐릿', '약간 흐릿', '보통', '선명', '생생'];

// ─── Place-based color shifts for emotion x place variation (H3) ───
export const PLACE_COLOR_SHIFTS: Record<PlaceKey, { hueShift: number }> = {
  ocean: { hueShift: -20 },       // bluer
  forest: { hueShift: 30 },       // greener
  city: { hueShift: -10 },        // cooler
  sky: { hueShift: 40 },          // cyan shift
  underground: { hueShift: -30 }, // darker purple
  school: { hueShift: 15 },       // warm shift
  home: { hueShift: 10 },         // slightly warm
  unknown: { hueShift: -40 },     // mysterious blue-shift
  office: { hueShift: -5 },       // neutral cool
  cafe: { hueShift: 20 },         // warm amber shift
  hospital: { hueShift: -15 },    // clinical cool
  street: { hueShift: 5 },        // slight warm
};

// ─── Fortune messages (40) ───
export const FORTUNE_MESSAGES: string[] = [
  '오늘은 예상치 못한 기쁜 소식이 찾아올 거예요.',
  '마음속 소원이 곧 이루어질 징조입니다.',
  '새로운 인연이 가까이에 있어요.',
  '지금 하고 있는 일이 좋은 결실을 맺을 거예요.',
  '자신을 믿으세요. 당신의 직감이 옳습니다.',
  '작은 변화가 큰 행운을 가져올 거예요.',
  '오래 기다린 기회가 드디어 다가오고 있어요.',
  '주변 사람들에게 감사하는 마음이 행운을 불러옵니다.',
  '용기를 내어 한 발짝 내딛으면 새로운 세계가 열려요.',
  '당신의 꿈이 현실이 되는 날이 머지않았어요.',
  '오늘의 작은 선택이 미래를 밝게 해줄 거예요.',
  '숨겨진 재능이 빛을 발할 시기입니다.',
  '마음의 평화가 최고의 행운입니다.',
  '좋은 에너지가 당신을 감싸고 있어요.',
  '포기하지 마세요. 전환점이 바로 코앞이에요.',
  '사랑하는 사람과의 관계가 더 깊어질 거예요.',
  '예술적 영감이 넘치는 하루가 될 거예요.',
  '건강과 활력이 충만한 시기입니다.',
  '뜻밖의 만남이 인생을 변화시킬 수 있어요.',
  '내면의 목소리에 귀 기울이면 답을 찾을 수 있어요.',
  '행운의 별이 당신을 비추고 있어요.',
  '오랫동안 고민했던 문제의 실마리가 풀릴 거예요.',
  '새로운 취미가 삶에 활력을 불어넣을 거예요.',
  '진심은 반드시 통합니다. 마음을 표현하세요.',
  '지금의 노력이 큰 보상으로 돌아올 거예요.',
  '우연한 발견이 큰 기쁨을 가져다줄 거예요.',
  '따뜻한 마음이 주변을 밝히는 하루가 될 거예요.',
  '꿈에서 본 것들이 현실의 힌트가 될 수 있어요.',
  '오늘은 자신에게 너그러운 하루를 보내세요.',
  '별들이 당신의 편입니다. 자신감을 가지세요.',
  '잠시 멈추고 하늘을 올려다보세요. 답이 보일 거예요.',
  '당신의 미소가 누군가에게 큰 힘이 될 거예요.',
  '오늘 만나는 사람 중 한 명이 행운의 열쇠를 쥐고 있어요.',
  '지금 느끼는 불안은 성장의 전조입니다.',
  '잃어버린 줄 알았던 것이 다시 돌아올 거예요.',
  '당신은 생각보다 훨씬 강한 사람이에요.',
  '조용한 시간이 가장 큰 깨달음을 가져다줄 거예요.',
  '오늘 하루가 인생에서 가장 빛나는 날이 될 수 있어요.',
  '누군가 당신을 조용히 응원하고 있어요.',
  '새벽의 어둠은 곧 밝아올 아침의 전주곡입니다.',
];

// ─── Interpretation text variants (3 per place/weather/emotion) ───
const PLACE_TEXTS: Record<PlaceKey, string[]> = {
  forest: [
    '무성한 숲은 당신의 내면에서 자라나는 가능성을 상징합니다.',
    '나무들 사이로 비치는 빛은 혼란 속에서도 길을 찾을 수 있다는 신호입니다.',
    '숲속 깊은 곳에서 만난 고요함은 지금 당신에게 가장 필요한 것입니다.',
  ],
  ocean: [
    '끝없는 바다는 당신의 무의식 깊은 곳의 감정을 반영합니다.',
    '파도의 리듬은 삶의 흐름에 몸을 맡기라는 메시지입니다.',
    '바다 깊이 잠든 보물처럼, 당신 안에 아직 발견되지 않은 능력이 있습니다.',
  ],
  city: [
    '복잡한 도시는 현실 세계에서의 도전과 야망을 나타냅니다.',
    '불빛 가득한 도시의 밤은 당신이 놓치고 있는 기회를 비추고 있습니다.',
    '도시의 소음 속에서 듣는 자신의 목소리가 가장 진실된 방향입니다.',
  ],
  school: [
    '학교는 배움과 성장, 그리고 과거의 경험을 의미합니다.',
    '교실의 풍경은 아직 끝나지 않은 인생의 수업이 남아있음을 말해줍니다.',
    '학창시절의 장면은 지금 당신에게 필요한 교훈을 되새기려는 무의식의 시도입니다.',
  ],
  home: [
    '집은 안식과 정체성, 당신의 근원적 자아를 상징합니다.',
    '꿈속의 집은 마음의 상태를 그대로 보여주는 거울입니다.',
    '익숙한 공간에서 느끼는 낯섦은 자기 자신에 대한 새로운 발견의 시작입니다.',
  ],
  sky: [
    '하늘은 무한한 가능성과 자유에 대한 갈망을 품고 있습니다.',
    '구름 위를 걷는 느낌은 현실의 제약에서 벗어나고 싶은 마음을 나타냅니다.',
    '넓은 하늘은 지금의 시야를 더 넓혀야 할 때라고 말하고 있습니다.',
  ],
  underground: [
    '지하 세계는 감추어진 내면과 억압된 감정을 드러냅니다.',
    '어둠 속으로 내려가는 것은 두렵지만, 그곳에서 진정한 자신을 만날 수 있습니다.',
    '땅 아래의 공간은 의식 아래 묻어둔 기억이 다시 올라오고 있음을 암시합니다.',
  ],
  unknown: [
    '미지의 장소는 탐험과 새로운 시작에 대한 호기심을 반영합니다.',
    '낯선 곳에 서 있다는 것은 인생의 새로운 챕터가 열리고 있다는 뜻입니다.',
    '어디인지 모를 공간은 무한한 선택지가 당신 앞에 펼쳐져 있음을 의미합니다.',
  ],
  office: [
    '회사는 책임감과 성취, 사회적 역할에 대한 의식을 반영합니다.',
    '업무 공간의 꿈은 현실에서 풀지 못한 과제가 무의식에까지 이어지고 있음을 보여줍니다.',
    '사무실 풍경은 일과 삶의 균형을 되돌아보라는 내면의 신호입니다.',
  ],
  cafe: [
    '카페는 여유와 만남, 일상 속 작은 행복을 상징합니다.',
    '커피 향이 감도는 공간은 잠시 멈추고 자신을 돌보라는 메시지입니다.',
    '카페에서의 시간은 소중한 인연과의 대화가 필요한 시기임을 알려줍니다.',
  ],
  hospital: [
    '병원은 치유와 회복, 자기 돌봄의 필요성을 나타냅니다.',
    '치료의 공간은 마음의 상처를 인정하고 치유할 준비가 되었음을 의미합니다.',
    '병원의 꿈은 지쳐있는 몸과 마음에 휴식이 필요하다는 경고입니다.',
  ],
  street: [
    '길거리는 인생의 방향과 선택의 갈림길을 상징합니다.',
    '거리를 걷는 꿈은 지금 당신이 어디로 향하고 있는지 돌아보라는 뜻입니다.',
    '낯선 거리의 풍경은 새로운 경험과 만남이 기다리고 있음을 암시합니다.',
  ],
};

const WEATHER_TEXTS: Record<WeatherKey, string[]> = {
  clear: [
    '맑은 날씨 속에서 당신의 마음도 명료해지고 있습니다.',
    '눈부신 햇살은 오래된 고민이 해결되는 시기가 왔음을 알려줍니다.',
    '맑은 하늘 아래에서 당신은 가장 솔직한 자신을 마주합니다.',
  ],
  cloudy: [
    '흐린 하늘은 아직 정리되지 않은 감정이 있음을 암시합니다.',
    '구름에 가려진 빛은 곧 다시 비추게 될 것입니다. 조금만 기다려보세요.',
    '흐린 날의 고요함은 내면의 목소리에 집중하기 좋은 시간입니다.',
  ],
  rain: [
    '비는 정화와 새로운 시작, 감정의 해방을 상징합니다.',
    '빗방울 하나하나가 묵은 감정을 씻어내고 있습니다.',
    '비 내리는 풍경은 슬프지만 아름다운 변화의 과정입니다.',
  ],
  snow: [
    '눈은 순수함과 고요함, 그리고 새로운 시작을 의미합니다.',
    '하얀 눈이 모든 것을 덮듯, 지금은 마음을 비우고 다시 시작할 때입니다.',
    '눈 내리는 풍경의 적막함은 당신에게 사색의 시간을 선물합니다.',
  ],
  fog: [
    '안개는 불확실성 속에서 진실을 찾으려는 여정을 나타냅니다.',
    '안개 속에서는 한 발짝 앞만 보입니다. 지금은 직감을 믿을 때입니다.',
    '자욱한 안개가 걷히면 예상치 못한 풍경이 펼쳐질 것입니다.',
  ],
  storm: [
    '폭풍은 내면의 격렬한 변화와 에너지의 분출을 상징합니다.',
    '거센 바람은 당신을 흔들지만, 그 후에 더 단단해진 자신을 만날 것입니다.',
    '폭풍우 속에서도 중심을 잡는 당신은 이미 충분히 강합니다.',
  ],
};

const EMOTION_TEXTS: Record<DreamEmotionKey, string[]> = {
  peace: [
    '평화로운 감정은 현재의 삶에 만족하고 있음을 보여줍니다.',
    '고요한 마음은 당신이 올바른 궤도에 있다는 확인입니다.',
    '내면의 평화는 가장 강력한 치유의 에너지입니다.',
  ],
  fear: [
    '공포는 변화 앞에서 느끼는 자연스러운 경계심입니다.',
    '두려움의 정체를 마주하면 그것은 더 이상 당신을 지배할 수 없습니다.',
    '공포 뒤에는 성장의 문이 숨어있는 경우가 많습니다.',
  ],
  confusion: [
    '혼란은 성장의 과도기에 흔히 나타나는 감정입니다.',
    '갈피를 잡지 못하는 지금이야말로 가장 많은 가능성이 열린 순간입니다.',
    '혼란 속에서 떠오르는 하나의 확신이 곧 길이 될 것입니다.',
  ],
  joy: [
    '즐거움은 당신이 올바른 방향으로 나아가고 있다는 신호입니다.',
    '마음 깊은 곳에서 올라오는 기쁨은 진정한 욕구를 반영합니다.',
    '이 즐거움을 기억하세요. 힘들 때 돌아올 수 있는 등대가 될 것입니다.',
  ],
  sorrow: [
    '슬픔은 내면의 치유가 시작되었음을 알려줍니다.',
    '눈물은 마음의 독소를 배출하는 가장 자연스러운 방법입니다.',
    '깊은 슬픔을 느낄 수 있다는 것은 그만큼 깊이 사랑했다는 증거입니다.',
  ],
  anger: [
    '분노는 변화를 향한 강력한 에너지의 원천입니다.',
    '억눌린 분노는 당신의 경계가 무시당했다는 신호입니다.',
    '분노를 인정하고 방향을 바꾸면 놀라운 추진력이 됩니다.',
  ],
  surprise: [
    '놀라움은 새로운 깨달음과 각성의 순간을 의미합니다.',
    '예상치 못한 전개는 고정된 사고방식을 깨뜨리려는 무의식의 노력입니다.',
    '놀라움 속에 숨겨진 메시지를 찾으면 큰 전환점이 될 수 있습니다.',
  ],
  longing: [
    '그리움은 진정으로 소중한 것이 무엇인지 알려주는 감정입니다.',
    '갈망하는 마음은 아직 포기하지 않은 꿈이 살아있다는 증거입니다.',
    '그리움의 끝에서 당신은 진정으로 원하는 것을 발견하게 될 것입니다.',
  ],
};

// ─── Combination synergy texts (place_weather pairs) ───
const COMBINATION_TEXTS: Record<string, string[]> = {
  'ocean_rain': [
    '비에 젖은 바다는 감정의 정화와 새로운 시작을 동시에 상징합니다. 깊은 감정의 파도가 지나간 후 맑은 수면이 드러날 것입니다.',
    '빗속의 바다는 눈물과 무의식이 하나로 합쳐지는 순간입니다. 감정을 있는 그대로 흘려보내도 괜찮습니다.',
  ],
  'ocean_storm': [
    '폭풍 속 바다는 감정적 격변의 한가운데에 있음을 뜻합니다. 파도에 맞서기보다 함께 흘러가는 것이 지금의 지혜입니다.',
    '거센 파도가 치는 바다는 내면의 거대한 에너지가 분출되고 있음을 보여줍니다. 이 에너지를 두려워하지 마세요.',
  ],
  'forest_fog': [
    '안개 낀 숲은 아직 보이지 않는 가능성이 주변에 가득하다는 신호입니다. 한 걸음씩 나아가면 길이 드러날 것입니다.',
    '숲속 안개는 무의식이 의식의 표면으로 천천히 올라오는 과정을 상징합니다. 직감을 믿어보세요.',
  ],
  'forest_rain': [
    '비에 젖은 숲은 정화와 성장이 동시에 일어나는 공간입니다. 감정의 비가 내면의 나무를 더 푸르게 만들 것입니다.',
    '빗소리가 가득한 숲은 자연의 리듬에 몸을 맡기라는 메시지입니다. 지금은 쉬어가도 좋습니다.',
  ],
  'city_storm': [
    '폭풍 속 도시는 외부 압박 속에서도 내면의 질서를 찾으려는 노력을 나타냅니다. 혼란 속의 중심을 잡으세요.',
    '도시를 덮친 폭풍은 일상의 구조가 흔들리는 시기를 반영합니다. 하지만 폭풍 후 도시는 더 단단해집니다.',
  ],
  'city_rain': [
    '비 내리는 도시의 네온 불빛은 현실의 피로 속에서도 아름다움을 찾을 수 있다는 메시지입니다.',
    '도시의 빗속을 걷는 꿈은 일상의 감정을 씻어내고 새로운 시각을 얻을 준비가 되었음을 뜻합니다.',
  ],
  'sky_clear': [
    '맑은 하늘을 나는 꿈은 제약에서 완전히 벗어난 자유로운 상태를 상징합니다. 지금 당신의 가능성은 무한합니다.',
    '투명한 하늘 아래에서 느끼는 해방감은 현실에서도 새로운 시도를 할 준비가 되었다는 신호입니다.',
  ],
  'underground_fog': [
    '안개 자욱한 지하 세계는 무의식의 가장 깊은 층에 접근하고 있음을 뜻합니다. 두렵지만 중요한 발견이 기다립니다.',
    '지하의 안개는 억압된 기억이나 감정이 서서히 의식으로 올라오는 과정을 나타냅니다.',
  ],
  'home_snow': [
    '눈 내리는 집은 안식처에서의 고요한 성찰의 시간을 상징합니다. 자기 자신과 조용히 대화할 때입니다.',
    '하얀 눈에 덮인 집은 일상의 소음을 차단하고 본질에 집중하라는 무의식의 메시지입니다.',
  ],
  'school_cloudy': [
    '흐린 하늘 아래 학교는 아직 정리되지 않은 과거의 교훈이 남아있음을 의미합니다. 배움은 끝나지 않았습니다.',
    '구름 낀 학교 풍경은 불확실한 시기에 기본으로 돌아가라는 메시지입니다.',
  ],
  'ocean_fog': [
    '안개에 둘러싸인 바다는 감정의 경계가 모호해진 상태를 뜻합니다. 지금은 판단보다 느낌에 집중하세요.',
    '바다 위 안개는 무의식과 의식 사이의 베일이 얇아진 순간입니다. 직관이 가장 정확할 때입니다.',
  ],
  'sky_storm': [
    '폭풍우 속 하늘은 자유를 향한 열망과 현실의 장벽 사이의 충돌을 상징합니다. 폭풍을 뚫고 나면 더 높이 날 수 있습니다.',
    '하늘의 폭풍은 큰 변화 직전의 에너지 축적을 뜻합니다. 곧 돌파구가 열릴 것입니다.',
  ],
};

const PERSON_DESCRIPTORS: Record<PersonKey, string[]> = {
  self: ['자기 자신과의 대화', '내면의 또 다른 나와의 만남', '거울 속 자신에게 건네는 질문'],
  family: ['가족과의 연결', '뿌리 깊은 유대감의 재확인', '가족이 전하는 무의식의 메시지'],
  lover: ['사랑하는 이와의 만남', '마음 깊은 곳의 애정이 투영된 장면', '사랑에 대한 갈망과 기대'],
  friend: ['벗과 함께하는 여정', '우정이 비추는 삶의 거울', '함께하는 이에게서 배우는 교훈'],
  stranger: ['낯선 이와의 조우', '아직 만나지 못한 가능성과의 대면', '미지의 존재가 가져오는 깨달음'],
  celebrity: ['동경하는 존재와의 만남', '이상적 자아에 대한 열망의 투영', '닮고 싶은 모습이 보여주는 방향'],
  animal: ['동물과의 교감', '본능적 직감이 전하는 메시지', '자연과 하나 되려는 원초적 욕구'],
};

// ─── Title generation patterns (7 patterns) ───
type TitlePatternFn = (
  placeLabel: string, weatherMod: string, objectLabel: string | null,
  personLabel: string | null, emotionLabel: string
) => string;

const TITLE_PATTERNS: TitlePatternFn[] = [
  // Pattern 0: Original style
  (place, weather, obj, person, _emotion) => {
    let suffix = '';
    if (obj && person) suffix = `${person}과 ${obj}의 꿈`;
    else if (obj) suffix = `${obj}을 찾아서`;
    else if (person) suffix = `${person}의 꿈`;
    else suffix = '꿈의 조각';
    return `${weather} ${place}에서 ${suffix}`;
  },
  // Pattern 1: "[장소]에서 만난 [오브젝트]의 비밀"
  (place, _weather, obj, _person, _emotion) => {
    if (obj) return `${place}에서 만난 ${obj}의 비밀`;
    return `${place}에 숨겨진 비밀`;
  },
  // Pattern 2: "[날씨] [장소], [인물]과의 재회"
  (place, weather, _obj, person, _emotion) => {
    if (person) return `${weather} ${place}, ${person}과의 재회`;
    return `${weather} ${place}의 속삭임`;
  },
  // Pattern 3: "[감정]이 물든 [날씨] [장소]"
  (place, weather, _obj, _person, emotion) => {
    return `${emotion}이 물든 ${weather} ${place}`;
  },
  // Pattern 4: "[오브젝트]가 이끈 [장소]로의 여정"
  (place, _weather, obj, _person, _emotion) => {
    if (obj) return `${obj}가 이끈 ${place}로의 여정`;
    return `${place}로 향하는 신비로운 여정`;
  },
  // Pattern 5: "[장소]의 [날씨] 속, 잊혀진 [오브젝트]"
  (place, weather, obj, _person, _emotion) => {
    if (obj) return `${place}의 ${weather} 속, 잊혀진 ${obj}`;
    return `${place}의 ${weather} 속에서`;
  },
  // Pattern 6: "[인물]에게 건네받은 [오브젝트]"
  (_place, _weather, obj, person, _emotion) => {
    if (obj && person) return `${person}에게 건네받은 ${obj}`;
    if (person) return `${person}이 남긴 이야기`;
    if (obj) return `어디선가 나타난 ${obj}의 의미`;
    return '이름 모를 꿈의 파편';
  },
];

// ─── Simple seeded random for deterministic variation ───
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ─── Generate interpretation ───
export function generateInterpretation(
  place: PlaceKey,
  weather: WeatherKey,
  characters: PersonKey[],
  objects: ObjectKey[],
  emotions: DreamEmotionKey[],
  vividness: number,
  history?: DreamEntry[],
  lastInterpretationTitle?: string,
): InterpretationResult {
  const placeData = PLACES.find(p => p.key === place)!;
  const weatherData = WEATHERS.find(w => w.key === weather)!;
  const primaryEmotion = emotions[0];
  const emotionData = EMOTIONS.find(e => e.key === primaryEmotion)!;

  // Seed for variation based on current time + inputs
  const seed = simpleHash(`${place}${weather}${emotions.join('')}${vividness}${Date.now()}`);

  // Title — pick from pattern pool
  const objectForTitle = objects.length > 0 ? OBJECTS.find(o => o.key === objects[0])! : null;
  const characterForTitle = characters.length > 0 ? characters[0] : null;
  const personLabel = characterForTitle ? PERSONS.find(p => p.key === characterForTitle)!.label : null;
  const objectLabel = objectForTitle ? objectForTitle.label : null;

  let patternIdx = seed % TITLE_PATTERNS.length;
  let title = TITLE_PATTERNS[patternIdx](
    placeData.label, weatherData.modifier, objectLabel, personLabel, emotionData.label,
  );

  // Anti-repetition: if title matches last interpretation, rotate to next pattern
  if (lastInterpretationTitle && title === lastInterpretationTitle) {
    patternIdx = (patternIdx + 1) % TITLE_PATTERNS.length;
    title = TITLE_PATTERNS[patternIdx](
      placeData.label, weatherData.modifier, objectLabel, personLabel, emotionData.label,
    );
  }

  // Keywords
  const keywords: string[] = [placeData.keyword];
  if (objects.length > 0) {
    keywords.push(OBJECTS.find(o => o.key === objects[0])!.keyword);
  } else {
    keywords.push('여정');
  }
  keywords.push(emotionData.keyword);

  // Interpretation text — check for combination synergy first, then fall back
  const comboKey = `${place}_${weather}`;
  const comboTexts = COMBINATION_TEXTS[comboKey];

  const placeVariants = PLACE_TEXTS[place];
  const weatherVariants = WEATHER_TEXTS[weather];
  const emotionVariants = EMOTION_TEXTS[primaryEmotion];

  // Anti-repetition offset: use minute-level timestamp to shift variant selection
  // when the same combination is recorded multiple times
  const antiRepeatOffset = lastInterpretationTitle ? Math.floor(Date.now() / 60000) : 0;

  let mainText: string;
  if (comboTexts) {
    // Use synergy text instead of independent place + weather concatenation
    const synergyText = comboTexts[(seed + antiRepeatOffset) % comboTexts.length];
    const emotionText = emotionVariants[((seed >> 6) + antiRepeatOffset) % emotionVariants.length];
    mainText = `${synergyText} ${emotionText}`;
  } else {
    const placeText = placeVariants[(seed + antiRepeatOffset) % placeVariants.length];
    const weatherText = weatherVariants[((seed >> 3) + antiRepeatOffset) % weatherVariants.length];
    const emotionText = emotionVariants[((seed >> 6) + antiRepeatOffset) % emotionVariants.length];
    mainText = `${placeText} ${weatherText} ${emotionText}`;
  }

  const personDescriptors = characters.length > 0 ? PERSON_DESCRIPTORS[characters[0]] : [];
  const characterNote = personDescriptors.length > 0
    ? ` ${personDescriptors[(seed >> 9) % personDescriptors.length]}이 이 꿈의 중요한 열쇠입니다.`
    : '';

  const vividnessNotes = [
    '이 꿈의 선명함은 메시지의 중요성을 강조합니다.',
    '놀랍도록 생생한 이 꿈은 당신의 무의식이 긴급히 전하려는 이야기입니다.',
    '선명한 잔상이 남는 이 꿈을 오래 기억해두세요.',
  ];
  const blurryNotes = [
    '흐릿한 꿈이지만 그 안에 숨겨진 의미가 있습니다.',
    '희미한 기억 속에서도 핵심 메시지는 남아있습니다.',
    '안개처럼 흐린 꿈일수록 깊은 무의식의 메시지를 담고 있습니다.',
  ];

  let vividnessNote = '';
  if (vividness >= 4) {
    vividnessNote = vividnessNotes[seed % vividnessNotes.length];
  } else if (vividness <= 2) {
    vividnessNote = blurryNotes[seed % blurryNotes.length];
  }

  const text = `${mainText}${characterNote}${vividnessNote ? ' ' + vividnessNote : ''}`;

  // Symbol readings
  const symbolReadings: SymbolReading[] = [];
  symbolReadings.push({
    symbol: place,
    meaning: `${placeData.label} — ${placeVariants[seed % placeVariants.length].slice(0, 30)}...`,
  });
  for (const objKey of objects) {
    const obj = OBJECTS.find(o => o.key === objKey)!;
    const meaningIdx = (seed + objKey.charCodeAt(0)) % obj.meanings.length;
    symbolReadings.push({ symbol: objKey, meaning: `${obj.label} — ${obj.meanings[meaningIdx]}` });
  }

  // Fortune
  const fortune = FORTUNE_MESSAGES[(seed + vividness) % FORTUNE_MESSAGES.length];

  // Personal insight based on dream history
  let personalInsight: string | undefined;
  if (history && history.length > 0) {
    const insightParts: string[] = [];

    // 1. Recurring symbol detection — check places, objects, persons across recent dreams
    const symbolCounts: Record<string, { label: string; count: number; type: string }> = {};
    const recentHistory = history.slice(0, 10);
    for (const d of recentHistory) {
      const pl = PLACES.find(p => p.key === d.scene.place);
      if (pl) {
        symbolCounts[d.scene.place] = symbolCounts[d.scene.place] || { label: pl.label, count: 0, type: 'place' };
        symbolCounts[d.scene.place].count++;
      }
      for (const o of d.scene.objects) {
        const obj = OBJECTS.find(x => x.key === o);
        if (obj) {
          symbolCounts[o] = symbolCounts[o] || { label: obj.label, count: 0, type: 'object' };
          symbolCounts[o].count++;
        }
      }
      for (const c of d.scene.characters) {
        const per = PERSONS.find(p => p.key === c);
        if (per) {
          symbolCounts[c] = symbolCounts[c] || { label: per.label, count: 0, type: 'person' };
          symbolCounts[c].count++;
        }
      }
    }
    // Also count current dream symbols
    const currentSymbols = [place, ...objects, ...characters];
    for (const sym of currentSymbols) {
      if (symbolCounts[sym] && symbolCounts[sym].count >= 2) {
        const RECURRING_MEANINGS: Record<string, string> = {
          place: '이 장소가 당신의 무의식에서 중요한 의미를 지니고 있어요.',
          object: '이 상징이 전하려는 메시지에 주목해보세요.',
          person: '이 존재와의 관계가 내면에서 큰 비중을 차지하고 있어요.',
        };
        const meaning = RECURRING_MEANINGS[symbolCounts[sym].type] || '무의식의 중요한 메시지일 수 있어요.';
        insightParts.push(`최근 꿈에서 '${symbolCounts[sym].label}'이(가) 자주 나타나고 있어요. ${meaning}`);
        break; // Only one recurring symbol note
      }
    }

    // 2. Emotional arc — check last 3 dreams
    if (recentHistory.length >= 3) {
      const NEGATIVE_EMOTIONS: DreamEmotionKey[] = ['fear', 'sorrow', 'anger', 'confusion'];
      const POSITIVE_EMOTIONS: DreamEmotionKey[] = ['peace', 'joy', 'surprise', 'longing'];
      const last3 = recentHistory.slice(0, 3);
      const last3Primary = last3.map(d => d.emotions[0]);
      const allNeg = last3Primary.every(e => NEGATIVE_EMOTIONS.includes(e));
      const allPos = last3Primary.every(e => POSITIVE_EMOTIONS.includes(e));
      const currentPrimary = emotions[0];
      const currentIsPositive = POSITIVE_EMOTIONS.includes(currentPrimary);
      const currentIsNegative = NEGATIVE_EMOTIONS.includes(currentPrimary);

      if (allNeg && currentIsPositive) {
        insightParts.push('최근 감정 흐름이 어두운 방향이었지만, 이번 꿈은 그 흐름 속에서 전환점이 될 수 있어요.');
      } else if (allNeg && currentIsNegative) {
        insightParts.push('최근 감정 흐름이 무거운 방향이에요. 이번 꿈은 그 흐름 속에서 내면의 목소리에 귀 기울여달라는 신호예요.');
      } else if (allPos && currentIsPositive) {
        insightParts.push('최근 감정 흐름이 밝은 방향이에요. 이번 꿈은 그 흐름 속에서 긍정적 에너지가 더욱 강해지고 있음을 보여줘요.');
      } else if (allPos && currentIsNegative) {
        insightParts.push('최근 감정 흐름이 밝은 방향이었지만, 이번 꿈은 그 흐름 속에서 주의가 필요한 변화를 감지했어요.');
      }
    }

    // 3. Connected narrative — reference previous dream's title
    if (recentHistory.length > 0) {
      const prevTitle = recentHistory[0].interpretation.title;
      insightParts.push(`지난번 '${prevTitle}'에 이어, 이번 꿈에서는 새로운 이야기가 펼쳐지고 있어요.`);
    }

    if (insightParts.length > 0) {
      personalInsight = insightParts.join(' ');
    }
  }

  return { title, keywords, text, symbolReadings, fortune, personalInsight };
}

// ─── Psychology-based symbol insights ───
const SYMBOL_PSYCHOLOGY: Record<string, string> = {
  water: '물은 융 심리학에서 감정과 무의식의 상태를 반영합니다. 감정적 정화가 필요하거나 진행 중일 수 있어요.',
  fire: '불은 변환의 원형 상징입니다. 내면의 열정이 분출구를 찾고 있거나, 오래된 패턴을 태우고 새로 시작하려는 욕구가 있어요.',
  mirror: '거울은 자기 인식의 상징입니다. 자아 정체성에 대한 탐색이 활발한 시기예요.',
  key: '열쇠는 해결의 원형입니다. 무의식이 중요한 답을 이미 알고 있다고 신호를 보내고 있어요.',
  stairs: '계단은 의식 수준의 변화를 상징합니다. 심리적 성장 또는 내면 탐구의 욕구가 강해지고 있어요.',
  clock: '시계는 시간 불안(time anxiety)을 반영합니다. 현재에 집중하기 어려운 상태일 수 있어요.',
  flower: '꽃은 자기실현의 상징입니다. 개인적 성장이 결실을 맺고 있거나 새로운 가능성이 열리고 있어요.',
  door: '문은 전환과 선택의 원형입니다. 중요한 결정의 시기가 다가오고 있음을 무의식이 인지하고 있어요.',
  forest: '숲은 융 심리학에서 무의식의 총체를 상징합니다. 내면 깊은 곳을 탐색하려는 욕구가 있을 수 있어요.',
  ocean: '바다는 집단 무의식과 감정의 깊이를 상징합니다. 감정적으로 깊은 곳을 탐색하려는 욕구가 강해지고 있어요.',
  city: '도시는 사회적 자아와 페르소나를 반영합니다. 사회적 역할과 진정한 자아 사이의 균형을 찾고 있을 수 있어요.',
  school: '학교는 미완의 과제와 자기 평가를 상징합니다. 과거의 경험에서 아직 배울 것이 남아있다고 무의식이 말하고 있어요.',
  home: '집은 자아의 구조를 상징합니다. 정체성과 안정감에 대한 욕구가 강해지고 있어요.',
  sky: '하늘은 초월과 자유의 원형입니다. 현실의 제약을 넘어서고 싶은 강한 열망이 있어요.',
  underground: '지하는 억압된 기억과 그림자 자아를 상징합니다. 인정하지 않았던 내면의 측면을 마주할 준비가 되고 있어요.',
  unknown: '미지의 장소는 자아 확장의 욕구를 반영합니다. 익숙한 것을 벗어나 새로운 자신을 발견할 시기예요.',
};

const EMOTION_PSYCHOLOGY: Record<string, string> = {
  peace: '내면의 균형이 잘 유지되고 있다는 신호예요. 지금의 방향을 신뢰해도 좋습니다.',
  fear: '공포의 반복은 회피하고 있는 과제가 있다는 무의식의 경고일 수 있어요. 두려움의 대상을 구체화해보세요.',
  confusion: '혼란은 성장의 과도기에 자연스러운 감정이에요. 새로운 이해가 형성되는 중입니다.',
  joy: '기쁨의 반복은 현재 삶의 방향이 내면의 욕구와 일치하고 있다는 긍정적 확인입니다.',
  sorrow: '반복되는 슬픔은 아직 처리되지 않은 감정이 있다는 신호예요. 자신에게 충분한 애도의 시간을 허락해보세요.',
  anger: '분노의 반복은 무시당한 경계가 있다는 뜻입니다. 자신의 필요를 명확히 표현할 시기예요.',
  surprise: '놀라움은 고정된 기대가 깨지고 있다는 뜻이에요. 열린 마음으로 변화를 받아들여보세요.',
  longing: '그리움은 충족되지 않은 핵심 욕구가 있음을 뜻합니다. 무엇을 갈망하는지 구체적으로 탐색해보세요.',
};

// ─── Pattern insights ───
export function getPatternInsights(dreams: DreamEntry[]): string[] {
  const insights: string[] = [];
  if (dreams.length < 3) return insights;

  const objCount: Record<string, number> = {};
  const placeCount: Record<string, number> = {};
  const emotionCount: Record<string, number> = {};
  const personCount: Record<string, number> = {};
  let totalVividness = 0;

  for (const d of dreams) {
    for (const o of d.scene.objects) {
      objCount[o] = (objCount[o] || 0) + 1;
    }
    placeCount[d.scene.place] = (placeCount[d.scene.place] || 0) + 1;
    for (const e of d.emotions) {
      emotionCount[e] = (emotionCount[e] || 0) + 1;
    }
    for (const c of d.scene.characters) {
      personCount[c] = (personCount[c] || 0) + 1;
    }
    totalVividness += d.vividness;
  }

  // Object insights with psychology
  for (const [key, count] of Object.entries(objCount)) {
    if (count >= 3) {
      const obj = OBJECTS.find(o => o.key === key)!;
      const psych = SYMBOL_PSYCHOLOGY[key] || obj.meanings[0];
      insights.push(`최근 '${obj.label}'이(가) ${count}번 등장했어요. ${psych}`);
    }
  }

  // Emotion insights with psychology
  for (const [key, count] of Object.entries(emotionCount)) {
    if (count >= 3) {
      const emo = EMOTIONS.find(e => e.key === key)!;
      const psych = EMOTION_PSYCHOLOGY[key] || '내면의 메시지에 귀 기울여보세요.';
      insights.push(`'${emo.label}' 감정이 ${count}번 반복되고 있어요. ${psych}`);
    }
  }

  // Vividness trend analysis
  const avgVividness = totalVividness / dreams.length;
  if (avgVividness >= 4) {
    insights.push('꿈의 선명도가 높아지고 있어요. 수면의 질이 개선되고 있을 수 있어요. 선명한 꿈꾸는 사람(Lucid Dreamer)의 특성이 있습니다.');
  }

  // Check if vividness is increasing over recent dreams
  if (dreams.length >= 4) {
    const recent = dreams.slice(0, 4).map(d => d.vividness);
    const firstHalf = (recent[2] + recent[3]) / 2;
    const secondHalf = (recent[0] + recent[1]) / 2;
    if (secondHalf > firstHalf + 0.5) {
      insights.push('꿈의 선명도가 높아지고 있어요. 수면의 질이 개선되고 있을 수 있어요.');
    } else if (firstHalf > secondHalf + 0.5) {
      insights.push('최근 꿈의 선명도가 낮아지고 있어요. 수면 환경이나 스트레스 수준을 확인해보세요.');
    }
  }

  // Place insights with psychology
  for (const [key, count] of Object.entries(placeCount)) {
    if (count >= 3) {
      const pl = PLACES.find(p => p.key === key)!;
      const psych = SYMBOL_PSYCHOLOGY[key] || PLACE_TEXTS[key as PlaceKey][0];
      insights.push(`무의식이 자주 '${pl.label}'을(를) ${count}번 찾아가고 있어요. ${psych}`);
    }
  }

  // Emotion trend (shift detection)
  if (dreams.length >= 4) {
    const NEGATIVE: DreamEmotionKey[] = ['fear', 'sorrow', 'anger', 'confusion'];
    const recent3 = dreams.slice(0, 3).map(d => d.emotions[0]);
    const older3 = dreams.slice(Math.max(0, dreams.length - 3)).map(d => d.emotions[0]);
    const recentNeg = recent3.filter(e => NEGATIVE.includes(e)).length;
    const olderNeg = older3.filter(e => NEGATIVE.includes(e)).length;
    if (recentNeg < olderNeg && olderNeg >= 2) {
      insights.push('감정이 긍정적인 방향으로 변화하고 있어요. 내면의 치유가 진행되고 있는 좋은 신호입니다.');
    } else if (recentNeg > olderNeg && recentNeg >= 2) {
      insights.push('감정이 무거운 방향으로 변화하고 있어요. 자신을 돌보는 시간을 가져보세요.');
    }
  }

  if (insights.length === 0 && dreams.length >= 5) {
    insights.push('다양한 꿈을 꾸고 있어요. 풍부한 상상력의 소유자입니다!');
  }

  return insights;
}

// ─── Seed data ───
export function createSeedData(): DreamEntry[] {
  const now = new Date();
  const seeds: DreamEntry[] = [];

  const configs: {
    daysAgo: number;
    place: PlaceKey; weather: WeatherKey;
    characters: PersonKey[]; objects: ObjectKey[];
    emotions: DreamEmotionKey[]; vividness: 1|2|3|4|5;
    memo?: string;
  }[] = [
    { daysAgo: 1, place: 'forest', weather: 'fog', characters: ['self'], objects: ['key', 'mirror'], emotions: ['peace', 'surprise'], vividness: 4, memo: '숲속 오두막에서 빛나는 열쇠를 찾았어' },
    { daysAgo: 3, place: 'ocean', weather: 'storm', characters: ['stranger', 'animal'], objects: ['water', 'door'], emotions: ['fear'], vividness: 5, memo: '거대한 파도와 고래를 봤다' },
    { daysAgo: 5, place: 'city', weather: 'rain', characters: ['friend'], objects: ['clock', 'stairs'], emotions: ['confusion', 'longing'], vividness: 3 },
    { daysAgo: 7, place: 'sky', weather: 'clear', characters: ['lover'], objects: ['flower'], emotions: ['joy'], vividness: 4, memo: '하늘 위에서 꽃비가 내렸어' },
    { daysAgo: 10, place: 'school', weather: 'cloudy', characters: ['family', 'self'], objects: ['mirror', 'door'], emotions: ['longing', 'sorrow'], vividness: 2 },
  ];

  for (const c of configs) {
    const date = new Date(now);
    date.setDate(date.getDate() - c.daysAgo);
    const interp = generateInterpretation(c.place, c.weather, c.characters, c.objects, c.emotions, c.vividness);
    seeds.push({
      id: `seed-${c.daysAgo}`,
      date: date.toISOString(),
      scene: { place: c.place, weather: c.weather, characters: c.characters, objects: c.objects },
      emotions: c.emotions,
      vividness: c.vividness,
      memo: c.memo,
      interpretation: interp,
      gradientType: c.emotions[0],
    });
  }

  return seeds;
}
