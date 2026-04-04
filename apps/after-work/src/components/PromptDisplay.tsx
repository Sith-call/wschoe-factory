import styles from './PromptDisplay.module.css';

interface PromptDisplayProps {
  text: string;
}

export function PromptDisplay({ text }: PromptDisplayProps) {
  return (
    <div className={styles.promptArea}>
      <span className={styles.label}>오늘의 질문</span>
      <h1 className={styles.text}>{text}</h1>
    </div>
  );
}
