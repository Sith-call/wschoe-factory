import type { Joke } from "../types";
import { copyToClipboard } from "../engine/native";

interface FavoritesScreenProps {
  favorites: Joke[];
  onBack: () => void;
  onRemove: (jokeId: number) => void;
  onToast: (msg: string) => void;
}

export function FavoritesScreen({ favorites, onBack, onRemove, onToast }: FavoritesScreenProps) {
  const handleCopy = async (joke: Joke) => {
    const text = `${joke.setup}\n${joke.punchline}`;
    const ok = await copyToClipboard(text);
    onToast(ok ? "복사됨!" : "복사 실패");
  };

  return (
    <div className="favorites-screen">
      <header className="fav-header">
        <button className="back-btn" onClick={onBack} aria-label="뒤로가기">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
            <path fill="currentColor" d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z" />
          </svg>
        </button>
        <h2 className="fav-title">즐겨찾기</h2>
      </header>

      {favorites.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
              <path fill="currentColor" d="M243,96.05a20.5,20.5,0,0,0-17.57-14.07l-56.38-4.87L147.26,24.68a20.36,20.36,0,0,0-38.52,0L87,77.11,30.56,82a20.52,20.52,0,0,0-11.69,36.06l43.14,37.23L48.84,210.72a20.51,20.51,0,0,0,30.63,22.23L128,204.39l48.53,28.56a20.51,20.51,0,0,0,30.63-22.23L194,155.27l43.14-37.23A20.5,20.5,0,0,0,243,96.05Z" />
            </svg>
          </div>
          <p className="fav-empty-title">아직 저장한 개그가 없어요</p>
          <p className="fav-empty-desc">마음에 드는 개그를 발견하면 별표를 눌러보세요</p>
          <button className="btn-secondary" onClick={onBack}>개그 뽑으러 가기</button>
        </div>
      ) : (
        <div className="fav-list">
          {favorites.map((joke) => (
            <div key={joke.id} className="favorite-item">
              <div className="fav-item-content">
                <span className="fav-item-setup">{joke.setup}</span>
                <span className="fav-item-punchline">{joke.punchline}</span>
              </div>
              <div className="fav-item-actions">
                <button className="fav-action-btn" onClick={() => handleCopy(joke)}>복사</button>
                <button className="fav-delete-btn" onClick={() => onRemove(joke.id)} aria-label="삭제">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                    <path fill="currentColor" d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
