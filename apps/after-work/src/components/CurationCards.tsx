import { useState } from 'react';
import type { CurationCard } from '../types';
import { CATEGORY_LABELS } from '../types';
import styles from './CurationCards.module.css';

interface CurationCardsProps {
  cards: CurationCard[];
  onPickActivity?: (activity: string) => void;
}

export function CurationCards({ cards, onPickActivity }: CurationCardsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function handlePick(activity: string) {
    onPickActivity?.(activity);
    setExpandedId(null);
  }

  return (
    <>
      <div className={styles.sliderWrapper}>
        <div className={`${styles.slider} hide-scrollbar`}>
          {cards.map(card => (
            <button
              key={card.id}
              className={styles.card}
              onClick={() => setExpandedId(card.id)}
            >
              <span className={styles.category}>{CATEGORY_LABELS[card.category]}</span>
              <span className={styles.activity}>{card.activity}</span>
            </button>
          ))}
        </div>
        <div className={styles.scrollFade} />
      </div>

      {expandedId !== null && (
        <div
          className={styles.overlay}
          onClick={() => setExpandedId(null)}
        >
          <div className={styles.expandedCard} onClick={e => e.stopPropagation()}>
            {(() => {
              const card = cards.find(c => c.id === expandedId);
              if (!card) return null;
              return (
                <>
                  <span className={styles.expandedCategory}>{CATEGORY_LABELS[card.category]}</span>
                  <span className={styles.expandedActivity}>{card.activity}</span>
                  <span className={styles.expandedSubtext}>{card.subtext}</span>
                  <button
                    className={styles.pickBtn}
                    onClick={() => handlePick(card.activity)}
                  >
                    이걸로 적기
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
