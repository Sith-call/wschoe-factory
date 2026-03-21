import React, { useState, useEffect } from 'react';

interface CalculatingScreenProps {
  onDone: () => void;
}

const messages = [
  '시장 조사 중...',
  '헤드헌터에게 물어보는 중...',
  '당신의 가치를 환산하는 중...',
  '계산기가 과부하...',
  '결과 나왔다!',
];

const CalculatingScreen: React.FC<CalculatingScreenProps> = ({ onDone }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 500);

    const timeout = setTimeout(() => {
      onDone();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1d29' }}>
          계산 중...
        </h2>
        <p className="text-base" style={{ color: '#6b7084' }}>
          {messages[msgIndex]}
        </p>
      </div>
    </div>
  );
};

export default CalculatingScreen;
