import React, { useState, useEffect, useCallback } from 'react';
import type { Screen, DiagnosisResult, Challenge } from './types';
import {
  saveDiagnosis,
  getDiagnosis,
  savePreviousDiagnosis,
  getActiveChallenge,
  getChallenges,
  createChallenge,
  saveChallenge,
  checkIn as storeCheckIn,
  calculateScores,
  calculateType,
  calculateWaste,
  getCurrentDay,
} from './store';

import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import ChallengeIntroScreen from './components/ChallengeIntroScreen';
import ChallengeScreen from './components/ChallengeScreen';
import CheckInScreen from './components/CheckInScreen';
import ChallengeCompleteScreen from './components/ChallengeCompleteScreen';
import ShareCard from './components/ShareCard';
import HistoryScreen from './components/HistoryScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  // On mount: check for returning user
  useEffect(() => {
    const savedDiagnosis = getDiagnosis();
    const activeChallenge = getActiveChallenge();

    if (activeChallenge) {
      setDiagnosis(savedDiagnosis);
      setChallenge(activeChallenge);

      // Check if challenge is completed (all 7 days checked in)
      if (activeChallenge.checkIns.length >= 7 || activeChallenge.status === 'completed') {
        activeChallenge.status = 'completed';
        saveChallenge(activeChallenge);
        setScreen('challengeComplete');
      } else {
        setScreen('challenge');
      }
    } else {
      // Check for recently completed challenge (completed within last 24 hours)
      const allChallenges = getChallenges();
      const recentCompleted = allChallenges.find((c) => c.status === 'completed' && c.checkIns.length >= 7);
      if (recentCompleted && savedDiagnosis) {
        setDiagnosis(savedDiagnosis);
        setChallenge(recentCompleted);
        setScreen('challengeComplete');
      } else if (savedDiagnosis) {
        setDiagnosis(savedDiagnosis);
        setScreen('result');
      }
    }
  }, []);

  const navigate = useCallback((to: Screen, dir: 'left' | 'right' = 'left') => {
    setSlideDirection(dir);
    setScreen(to);
  }, []);

  // --- Quiz complete ---
  const handleQuizComplete = useCallback((answers: number[]) => {
    const scores = calculateScores(answers);
    const type = calculateType(scores);
    const estimatedWaste = calculateWaste(scores);

    const result: DiagnosisResult = {
      type,
      scores,
      estimatedWaste,
      completedAt: new Date().toISOString(),
    };

    // If there was a previous diagnosis, save it for comparison
    const prevDiagnosis = getDiagnosis();
    if (prevDiagnosis) {
      savePreviousDiagnosis(prevDiagnosis);
    }

    saveDiagnosis(result);
    setDiagnosis(result);
    navigate('loading');
  }, [navigate]);

  // --- Start challenge ---
  const handleStartChallenge = useCallback(() => {
    if (!diagnosis) return;
    const newChallenge = createChallenge(diagnosis);
    saveChallenge(newChallenge);
    setChallenge(newChallenge);
    navigate('challenge');
  }, [diagnosis, navigate]);

  // --- Check in ---
  const handleCheckIn = useCallback((day: number, success: boolean) => {
    if (!challenge) return;
    const updated = storeCheckIn(challenge.id, day, success);
    if (updated) {
      setChallenge({ ...updated });

      // Check if all 7 days done
      if (updated.checkIns.length >= 7 || updated.status === 'completed') {
        setTimeout(() => {
          setChallenge({ ...updated, status: 'completed' });
          navigate('challengeComplete');
        }, 1600);
      }
    }
  }, [challenge, navigate]);

  // --- Rediagnose ---
  const handleRediagnose = useCallback(() => {
    navigate('quiz');
  }, [navigate]);

  // --- New challenge (from complete screen) ---
  const handleNewChallenge = useCallback(() => {
    if (diagnosis) {
      navigate('challengeIntro');
    }
  }, [diagnosis, navigate]);

  // --- Render ---
  const renderScreen = () => {
    switch (screen) {
      case 'intro':
        return <IntroScreen onStart={() => navigate('quiz')} />;

      case 'quiz':
        return <QuizScreen onComplete={handleQuizComplete} />;

      case 'loading':
        return <LoadingScreen onComplete={() => navigate('result')} />;

      case 'result':
        return diagnosis ? (
          <ResultScreen
            diagnosis={diagnosis}
            onStartChallenge={() => navigate('challengeIntro')}
            onShare={() => setShowShare(true)}
            onBack={() => navigate('intro', 'right')}
          />
        ) : null;

      case 'challengeIntro':
        return diagnosis ? (
          <ChallengeIntroScreen
            diagnosis={diagnosis}
            onStartChallenge={handleStartChallenge}
            onBack={() => navigate('result', 'right')}
          />
        ) : null;

      case 'challenge':
        return challenge ? (
          <ChallengeScreen
            challenge={challenge}
            onCheckIn={() => navigate('checkIn')}
            onHistory={() => navigate('history')}
            onBack={() => navigate('intro', 'right')}
          />
        ) : null;

      case 'checkIn':
        return challenge ? (
          <CheckInScreen
            challenge={challenge}
            onCheckIn={handleCheckIn}
            onBack={() => {
              // Refresh challenge state
              const active = getActiveChallenge();
              if (active) setChallenge({ ...active });
              navigate('challenge', 'right');
            }}
          />
        ) : null;

      case 'challengeComplete':
        return challenge ? (
          <ChallengeCompleteScreen
            challenge={challenge}
            onRediagnose={handleRediagnose}
            onShare={() => setShowShare(true)}
            onNewChallenge={handleNewChallenge}
          />
        ) : null;

      case 'history':
        return (
          <HistoryScreen
            onBack={() => navigate('challenge', 'right')}
            onNewDiagnosis={() => navigate('quiz')}
          />
        );

      default:
        return <IntroScreen onStart={() => navigate('quiz')} />;
    }
  };

  return (
    <>
      {renderScreen()}
      {showShare && diagnosis && (
        <ShareCard
          diagnosis={diagnosis}
          challenge={challenge?.status === 'completed' ? challenge : null}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}
