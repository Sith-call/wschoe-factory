import { useEffect } from "react";
import { Post, useToast } from "@toss/tds-mobile";
import { useJokeEngine } from "./hooks/useJokeEngine";
import { JokeCard } from "./components/JokeCard";
import { FavoritesScreen } from "./components/FavoritesScreen";
import "./style.css";

export default function App() {
  const {
    phase,
    currentJoke,
    showPunchline,
    reaction,
    dailyCount,
    isFav,
    favorites,
    dispenseJoke,
    revealPunchline,
    toggleFavorite,
    copyJoke,
    shareJoke,
    resetAll,
    openFavorites,
    removeFavorite,
    goHome,
    updateDailyCount,
  } = useJokeEngine();

  const { openToast } = useToast();

  useEffect(() => {
    updateDailyCount();
  }, [updateDailyCount]);

  // 즐겨찾기 화면
  if (phase === "favorites") {
    return (
      <div className="app-container">
        <FavoritesScreen
          favorites={favorites}
          onBack={goHome}
          onRemove={(id) => {
            removeFavorite(id);
            openToast("삭제됨");
          }}
          onToast={openToast}
        />
      </div>
    );
  }

  // 메인 화면
  const mainBtnText = (() => {
    switch (phase) {
      case "idle": return "눌러봐!";
      case "loading": return "두구두구...";
      case "showing-setup": return "건너뛰기";
      case "showing-punchline": return "다음!";
      case "clear": return "다시 처음부터";
      default: return "눌러봐!";
    }
  })();

  const handleMainClick = () => {
    if (phase === "loading") return;
    if (phase === "clear") {
      resetAll();
      return;
    }
    dispenseJoke();
  };

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite();
    openToast(result ? "저장됨!" : "저장 취소");
  };

  const handleCopy = async () => {
    const result = await copyJoke();
    openToast(result ? "복사됨!" : "복사 실패");
  };

  return (
    <div className="app-container">
      <div className="main-screen">
        {/* Header */}
        <header className="header">
          <Post.H1 style={{ fontSize: "1.75rem", margin: 0 }}>아재개그 자판기</Post.H1>
          <button
            className="fav-icon-btn"
            onClick={openFavorites}
            aria-label="즐겨찾기"
          >
            <StarOutlineIcon />
          </button>
        </header>

        {/* Main Content */}
        <div className="main-content">
          {/* Loading */}
          {phase === "loading" && (
            <div className="loading-area">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          {/* Joke Card */}
          {(phase === "showing-setup" || phase === "showing-punchline") && currentJoke && (
            <JokeCard
              joke={currentJoke}
              showPunchline={showPunchline}
              reaction={reaction}
              isFav={isFav}
              onTap={revealPunchline}
              onCopy={handleCopy}
              onFavorite={handleToggleFavorite}
              onShare={shareJoke}
            />
          )}

          {/* Clear */}
          {phase === "clear" && (
            <div className="clear-area">
              <Post.H1 style={{ fontSize: "2.25rem", margin: 0 }}>50개 전부 클리어!</Post.H1>
              <Post.Paragraph>당신은 진정한</Post.Paragraph>
              <Post.Paragraph style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                아재개그 마스터
              </Post.Paragraph>
            </div>
          )}

          {/* Sub Copy (idle) */}
          {phase === "idle" && (
            <Post.Paragraph style={{ color: "var(--text-secondary)", textAlign: "center" }}>
              매일 아재개그 한 잔, 동전은 필요 없어요
            </Post.Paragraph>
          )}
        </div>

        {/* Main Button */}
        <button
          className={phase === "showing-setup" ? "btn-skip" : "btn-primary"}
          onClick={handleMainClick}
          disabled={phase === "loading"}
        >
          {mainBtnText}
        </button>

        {/* Counter */}
        <div className="counter">오늘 {dailyCount}개 봄</div>
      </div>
    </div>
  );
}

function StarOutlineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
      <path fill="currentColor" d="M243,96.05a20.5,20.5,0,0,0-17.57-14.07l-56.38-4.87L147.26,24.68a20.36,20.36,0,0,0-38.52,0L87,77.11,30.56,82a20.52,20.52,0,0,0-11.69,36.06l43.14,37.23L48.84,210.72a20.51,20.51,0,0,0,30.63,22.23L128,204.39l48.53,28.56a20.51,20.51,0,0,0,30.63-22.23L194,155.27l43.14-37.23A20.5,20.5,0,0,0,243,96.05Zm-51.37,43.51a12,12,0,0,0-3.84,11.86L200.4,205.3,155,178.58a12,12,0,0,0-12.18,0L97.6,205.3l12.56-53.88a12,12,0,0,0-3.84-11.86L63.48,102.53l55-4.76a12,12,0,0,0,10.06-7.32L128,36.89l.46,1.1-.46-1.1v0L149.5,90.45a12,12,0,0,0,10.06,7.32l55,4.76Z" />
    </svg>
  );
}
