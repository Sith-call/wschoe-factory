import type { Joke } from "../types";

interface JokeCardProps {
  joke: Joke;
  showPunchline: boolean;
  reaction: string;
  isFav: boolean;
  onTap: () => void;
  onCopy: () => void;
  onFavorite: () => void;
  onShare: () => void;
}

export function JokeCard({
  joke,
  showPunchline,
  reaction,
  isFav,
  onTap,
  onCopy,
  onFavorite,
  onShare,
}: JokeCardProps) {
  return (
    <div className="joke-area">
      <div className="joke-card joke-appear" onClick={!showPunchline ? onTap : undefined}>
        <p className="joke-setup">{joke.setup}</p>

        {showPunchline && (
          <p className="joke-punchline punchline-appear">{joke.punchline}</p>
        )}

        {!showPunchline && <p className="tap-hint">탭해서 답 보기</p>}

        {showPunchline && reaction && (
          <div className="laugh-reaction reaction-appear">{reaction}</div>
        )}

        {showPunchline && (
          <div className="joke-actions">
            <button className="joke-action-btn" onClick={(e) => { e.stopPropagation(); onCopy(); }} aria-label="복사">
              <CopyIcon />
              <span>복사</span>
            </button>
            <button className="joke-action-btn" onClick={(e) => { e.stopPropagation(); onShare(); }} aria-label="공유">
              <ShareIcon />
              <span>공유</span>
            </button>
            <button
              className={`joke-action-btn ${isFav ? "is-favorite" : ""}`}
              onClick={(e) => { e.stopPropagation(); onFavorite(); }}
              aria-label="즐겨찾기"
            >
              {isFav ? <StarFilledIcon /> : <StarOutlineIcon />}
              <span>{isFav ? "저장됨" : "저장"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
      <path fill="currentColor" d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
      <path fill="currentColor" d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88.1,88.1,0,0,0-85.23,66,8,8,0,0,1-15.5-4A104.12,104.12,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V216a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

function StarOutlineIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
      <path fill="currentColor" d="M243,96.05a20.5,20.5,0,0,0-17.57-14.07l-56.38-4.87L147.26,24.68a20.36,20.36,0,0,0-38.52,0L87,77.11,30.56,82a20.52,20.52,0,0,0-11.69,36.06l43.14,37.23L48.84,210.72a20.51,20.51,0,0,0,30.63,22.23L128,204.39l48.53,28.56a20.51,20.51,0,0,0,30.63-22.23L194,155.27l43.14-37.23A20.5,20.5,0,0,0,243,96.05Zm-51.37,43.51a12,12,0,0,0-3.84,11.86L200.4,205.3,155,178.58a12,12,0,0,0-12.18,0L97.6,205.3l12.56-53.88a12,12,0,0,0-3.84-11.86L63.48,102.53l55-4.76a12,12,0,0,0,10.06-7.32L128,36.89l.46,1.1-.46-1.1v0L149.5,90.45a12,12,0,0,0,10.06,7.32l55,4.76Z" />
    </svg>
  );
}

function StarFilledIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
      <path fill="currentColor" d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,30.5,0l23.21,55.36L226.92,91a16.46,16.46,0,0,1,9.37,23.85Z" />
    </svg>
  );
}
