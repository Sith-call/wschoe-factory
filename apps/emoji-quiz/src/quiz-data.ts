import { QuizItem, Category, CategoryInfo } from './types';

interface RawQuizItem {
  emoji: string;
  answer: string;
}

const movieItems: RawQuizItem[] = [
  { emoji: '\u{1F981}\u{1F451}', answer: '\uB77C\uC774\uC628\uD0B9' },
  { emoji: '\u{1F47B}\u{1F47B}\u{1F47B}', answer: '\uACE0\uC2A4\uD2B8\uBC84\uC2A4\uD130\uC988' },
  { emoji: '\u{1F577}\uFE0F\u{1F9D1}', answer: '\uC2A4\uD30C\uC774\uB354\uB9E8' },
  { emoji: '\u2744\uFE0F\u{1F478}', answer: '\uACA8\uC6B8\uC655\uAD6D' },
  { emoji: '\u{1F9F8}\u{1F36F}', answer: '\uACF0\uB3CC\uC774 \uD478' },
  { emoji: '\u{1F987}\u{1F9D1}\u200D\u{1F4BC}', answer: '\uBC30\uD2B8\uB9E8' },
  { emoji: '\u{1F9D9}\u200D\u2642\uFE0F\u{1F48D}', answer: '\uBC18\uC9C0\uC758 \uC81C\uC655' },
  { emoji: '\u{1F6A2}\u2744\uFE0F\u{1F491}', answer: '\uD0C0\uC774\uD0C0\uB2C9' },
  { emoji: '\u{1F996}\u{1F334}', answer: '\uC950\uB77C\uAE30 \uACF5\uC6D0' },
  { emoji: '\u{1F47D}\u{1F4DE}\u{1F3E0}', answer: 'E.T.' },
  { emoji: '\u{1F916}\u{1F52B}', answer: '\uD130\uBBF8\uB124\uC774\uD130' },
  { emoji: '\u{1F9DF}\u200D\u2642\uFE0F\u{1F30D}', answer: '\uBD80\uC0B0\uD589' },
];

const proverbItems: RawQuizItem[] = [
  { emoji: '\u{1F438}\u{1FAA8}', answer: '\uC6B0\uBB3C \uC548 \uAC1C\uAD6C\uB9AC' },
  { emoji: '\u{1F415}\u{1F4A9}', answer: '\uAC1C\uB625\uB3C4 \uC57D\uC5D0 \uC4F8 \uAC83' },
  { emoji: '\u{1F440}\u{1F370}', answer: '\uADF8\uB9BC\uC758 \uB5A1' },
  { emoji: '\u{1F56F}\uFE0F\u{1F311}', answer: '\uB4F1\uC794 \uBC11\uC774 \uC5B4\uB461\uB2E4' },
  { emoji: '\u{1FAA8}\u{1F95A}', answer: '\uACC4\uB780\uC73C\uB85C \uBC14\uC704\uCE58\uAE30' },
  { emoji: '\u{1F42F}\u{1F407}', answer: '\uD638\uB791\uC774 \uC5C6\uB294 \uACE8\uC5D0 \uD1A0\uB07C\uAC00 \uC655' },
  { emoji: '\u{1F305}\u{1F424}', answer: '\uC77C\uCC0D \uC77C\uC5B4\uB098\uB294 \uC0C8\uAC00 \uBC8C\uB808\uB97C \uC7A1\uB294\uB2E4' },
  { emoji: '\u{1F648}\u{1F431}', answer: '\uACE0\uC591\uC774 \uC55E\uC5D0 \uC950' },
  { emoji: '\u{1F4A7}\u{1F4A7}\u{1FAA8}', answer: '\uB099\uC218\uBB3C\uC774 \uB31B\uB3CC \uB69A\uB294\uB2E4' },
  { emoji: '\u{1F422}\u{1F407}', answer: '\uD1A0\uB07C\uC640 \uAC70\uBD81\uC774' },
];

const foodItems: RawQuizItem[] = [
  { emoji: '\u{1F96C}\u{1F336}\uFE0F', answer: '\uAE40\uCE58' },
  { emoji: '\u{1F35A}\u{1F969}\u{1F96C}', answer: '\uBE44\uBE54\uBC25' },
  { emoji: '\u{1F35C}\u{1F336}\uFE0F', answer: '\uC9EC\uBBBD' },
  { emoji: '\u{1F95F}\u{1F961}', answer: '\uB9CC\uB450' },
  { emoji: '\u{1F35A}\u{1F373}', answer: '\uBCF6\uC74C\uBC25' },
  { emoji: '\u{1F419}\u{1F525}', answer: '\uB099\uC9C0\uBCF6\uC74C' },
  { emoji: '\u{1F9CA}\u{1F35C}', answer: '\uB0C9\uBA74' },
  { emoji: '\u{1F414}\u{1F372}', answer: '\uC0BC\uACC4\uD0D5' },
  { emoji: '\u{1F969}\u{1F525}\u{1F96C}', answer: '\uBD88\uACE0\uAE30' },
  { emoji: '\u{1F355}\u{1F9C0}', answer: '\uD53C\uC790' },
  { emoji: '\u{1F363}\u{1F41F}', answer: '\uCD08\uBC25' },
  { emoji: '\u{1F35D}\u{1F345}', answer: '\uD30C\uC2A4\uD0C0' },
];

const allItems: Record<Category, RawQuizItem[]> = {
  movies: movieItems,
  proverbs: proverbItems,
  food: foodItems,
};

export const categoryInfos: CategoryInfo[] = [
  { id: 'movies', label: '\uC601\uD654', description: '\uC774\uBAA8\uC9C0\uB85C \uC601\uD654 \uC81C\uBAA9\uC744 \uB9DE\uCDB0\uBCF4\uC138\uC694', itemCount: movieItems.length },
  { id: 'proverbs', label: '\uC18D\uB2F4', description: '\uC774\uBAA8\uC9C0\uB85C \uC18D\uB2F4\uC744 \uB9DE\uCDB0\uBCF4\uC138\uC694', itemCount: proverbItems.length },
  { id: 'food', label: '\uC74C\uC2DD', description: '\uC774\uBAA8\uC9C0\uB85C \uC74C\uC2DD \uC774\uB984\uC744 \uB9DE\uCDB0\uBCF4\uC138\uC694', itemCount: foodItems.length },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateChoices(correct: string, allAnswers: string[]): string[] {
  const others = allAnswers.filter((a) => a !== correct);
  const wrongChoices = shuffle(others).slice(0, 3);
  return shuffle([correct, ...wrongChoices]);
}

export function getQuizItems(category: Category, count: number = 20): QuizItem[] {
  const raw = allItems[category];
  const allAnswers = raw.map((r) => r.answer);
  const selected = shuffle(raw).slice(0, Math.min(count, raw.length));

  return selected.map((item) => ({
    emoji: item.emoji,
    answer: item.answer,
    choices: generateChoices(item.answer, allAnswers),
  }));
}
