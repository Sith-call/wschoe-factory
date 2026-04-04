import { Category } from '../types';

export const categories: Category[] = [
  { id: 'fundamentals', name: '경제학 기초 원리', nameEn: 'Economic Fundamentals', icon: 'Blocks', description: '경제학의 핵심 원리와 사고방식을 배우는 출발점', order: 1, prerequisiteCategories: [] },
  { id: 'market-price', name: '시장과 가격', nameEn: 'Market & Price', icon: 'BarChart3', description: '수요와 공급이 만나 가격이 결정되는 시장 메커니즘', order: 2, prerequisiteCategories: ['fundamentals'] },
  { id: 'consumer-producer', name: '소비자와 생산자', nameEn: 'Consumer & Producer', icon: 'Handshake', description: '시장 참여자들의 의사결정과 잉여 분석', order: 3, prerequisiteCategories: ['fundamentals', 'market-price'] },
  { id: 'market-failure', name: '시장 실패와 정부', nameEn: 'Market Failure & Government', icon: 'Scale', description: '시장이 효율적으로 작동하지 못하는 상황과 정부 역할', order: 4, prerequisiteCategories: ['market-price', 'consumer-producer'] },
  { id: 'national-economy', name: '국민경제 측정', nameEn: 'Measuring National Economy', icon: 'Ruler', description: '한 나라 경제의 크기와 성과를 측정하는 지표', order: 5, prerequisiteCategories: ['fundamentals'] },
  { id: 'growth-productivity', name: '경제 성장과 생산성', nameEn: 'Growth & Productivity', icon: 'TrendingUp', description: '경제가 성장하는 원동력과 생산성의 역할', order: 6, prerequisiteCategories: ['national-economy'] },
  { id: 'money-finance', name: '화폐와 금융', nameEn: 'Money & Finance', icon: 'Landmark', description: '화폐의 역할과 금융 시스템의 작동 원리', order: 7, prerequisiteCategories: ['fundamentals', 'national-economy'] },
  { id: 'macro-fluctuation', name: '거시경제 변동', nameEn: 'Macroeconomic Fluctuation', icon: 'Waves', description: '경기순환, 인플레이션 등 거시경제 현상', order: 8, prerequisiteCategories: ['national-economy', 'growth-productivity', 'money-finance'] },
  { id: 'macro-policy', name: '거시경제 정책', nameEn: 'Macroeconomic Policy', icon: 'Building2', description: '재정정책과 통화정책으로 경제를 안정시키는 방법', order: 9, prerequisiteCategories: ['money-finance', 'macro-fluctuation'] },
  { id: 'international', name: '국제경제', nameEn: 'International Economy', icon: 'Globe', description: '무역, 환율, 국제수지 등 세계 경제의 연결', order: 10, prerequisiteCategories: ['national-economy', 'macro-fluctuation'] },
];
