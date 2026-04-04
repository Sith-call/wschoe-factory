import type { Joke, AppPhase } from "../types";
import { jokes } from "../data/jokes";
import { pickRandomJoke, hasSeenAll } from "../engine/joke-picker";
import {
  loadFavorites,
  toggleFavorite,
  isFavorite,
  removeFavorite,
  getTotalViewed,
  incrementDailyCount,
  clearHistory,
} from "../engine/history";
import {
  animateJokeIn,
  animatePunchlineIn,
  animateHeartBounce,
  animateReactionIn,
  animateConfetti,
} from "./animations";

let currentPhase: AppPhase = "idle";
let loadingTimeout: ReturnType<typeof setTimeout> | null = null;
let reactionTimeout: ReturnType<typeof setTimeout> | null = null;

const LAUGH_REACTIONS = [
  "ㅋㅋㅋㅋㅋ",
  "푸하하핫",
  "아..ㅋㅋㅋ",
  "헐ㅋㅋㅋㅋ",
  "ㅎㅎㅎㅎㅎ",
  "크큭ㅋㅋ",
  "빵 터졌다",
  "아 왜 웃기지",
  "ㅋㅋ 아재다",
  "아놔ㅋㅋㅋ",
];

function pickReaction(): string {
  return LAUGH_REACTIONS[Math.floor(Math.random() * LAUGH_REACTIONS.length)];
}

// SVG icons as constants (Phosphor Icons - star outline and filled)
const STAR_OUTLINE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M243,96.05a20.5,20.5,0,0,0-17.57-14.07l-56.38-4.87L147.26,24.68a20.36,20.36,0,0,0-38.52,0L87,77.11,30.56,82a20.52,20.52,0,0,0-11.69,36.06l43.14,37.23L48.84,210.72a20.51,20.51,0,0,0,30.63,22.23L128,204.39l48.53,28.56a20.51,20.51,0,0,0,30.63-22.23L194,155.27l43.14-37.23A20.5,20.5,0,0,0,243,96.05Zm-51.37,43.51a12,12,0,0,0-3.84,11.86L200.4,205.3,155,178.58a12,12,0,0,0-12.18,0L97.6,205.3l12.56-53.88a12,12,0,0,0-3.84-11.86L63.48,102.53l55-4.76a12,12,0,0,0,10.06-7.32L128,36.89l.46,1.1-.46-1.1v0L149.5,90.45a12,12,0,0,0,10.06,7.32l55,4.76Z"/></svg>';
const STAR_FILLED_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,30.5,0l23.21,55.36L226.92,91a16.46,16.46,0,0,1,9.37,23.85Z"/></svg>';
const TRASH_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>';

let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string): void {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  // Force reflow to restart transition
  void toast.offsetWidth;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 200);
    toastTimer = null;
  }, 1500);
}

// DOM references
function $(id: string): HTMLElement {
  return document.getElementById(id)!;
}

export function initApp(): void {
  renderIdle();
  updateCounter();

  $("main-btn").addEventListener("click", onMainButtonClick);
  $("fav-icon-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    // Only navigate to favorites from idle or showing-punchline states
    if (currentPhase === "idle" || currentPhase === "showing-punchline" || currentPhase === "showing-setup") {
      renderFavorites();
    }
  });
}

function onMainButtonClick(): void {
  if (currentPhase === "loading") return;

  if (currentPhase === "idle" || currentPhase === "showing-joke" || currentPhase === "showing-punchline") {
    startLoading();
  } else if (currentPhase === "showing-setup") {
    // Skip: go to next joke
    startLoading();
  } else if (currentPhase === "clear") {
    clearHistory();
    renderIdle();
  }
}

function startLoading(): void {
  currentPhase = "loading";

  $("joke-area").classList.add("hidden");
  $("clear-area").classList.add("hidden");
  $("sub-copy").classList.add("hidden");
  $("loading-area").classList.remove("hidden");

  const btn = $("main-btn") as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = "\uB450\uAD6C\uB450\uAD6C...";
  btn.className = "btn-primary";

  const delay = 500 + Math.random() * 500;
  loadingTimeout = setTimeout(() => {
    loadingTimeout = null;

    // Check if all 50 seen
    if (hasSeenAll(jokes)) {
      renderClear();
      return;
    }

    const joke = pickRandomJoke(jokes);

    // Show setup first, user taps to see punchline
    renderSetup(joke);
  }, delay);
}

function renderIdle(): void {
  currentPhase = "idle";

  $("joke-area").classList.add("hidden");
  $("loading-area").classList.add("hidden");
  $("clear-area").classList.add("hidden");
  $("favorites-screen").classList.add("hidden");
  $("main-screen").classList.remove("hidden");
  $("sub-copy").classList.remove("hidden");

  const btn = $("main-btn") as HTMLButtonElement;
  btn.disabled = false;
  btn.textContent = "\uB20C\uB7EC\uBD10!";
  btn.className = "btn-primary";

  updateCounter();
}

function renderSetup(joke: Joke): void {
  currentPhase = "showing-setup";

  $("loading-area").classList.add("hidden");
  $("joke-area").classList.remove("hidden");
  $("sub-copy").classList.add("hidden");

  const setupEl = $("joke-setup");
  const punchlineEl = $("joke-punchline");
  const tapHint = $("tap-hint");
  const actionsEl = $("joke-actions");

  setupEl.textContent = joke.setup;
  punchlineEl.textContent = "";
  punchlineEl.classList.add("hidden");
  tapHint.classList.remove("hidden");
  actionsEl.classList.add("hidden");

  // Reset laugh reaction
  const reactionEl = $("laugh-reaction");
  reactionEl.classList.add("hidden");
  reactionEl.textContent = "";
  if (reactionTimeout) {
    clearTimeout(reactionTimeout);
    reactionTimeout = null;
  }

  animateJokeIn($("joke-card"));

  // "건너뛰기" = Secondary style (R16)
  const btn = $("main-btn") as HTMLButtonElement;
  btn.disabled = false;
  btn.textContent = "\uAC74\uB108\uB6F0\uAE30";
  btn.className = "btn-skip";

  // Tap to reveal punchline
  const jokeCard = $("joke-card");
  const revealHandler = () => {
    jokeCard.removeEventListener("click", revealHandler);
    revealPunchline(joke);
  };
  jokeCard.addEventListener("click", revealHandler);
}

function revealPunchline(joke: Joke): void {
  currentPhase = "showing-punchline";

  const punchlineEl = $("joke-punchline");
  const tapHint = $("tap-hint");
  const actionsEl = $("joke-actions");
  const favBtn = $("fav-btn");
  const copyBtn = $("copy-btn");

  punchlineEl.textContent = joke.punchline;
  punchlineEl.classList.remove("hidden");
  tapHint.classList.add("hidden");
  actionsEl.classList.remove("hidden");

  animatePunchlineIn(punchlineEl);

  // Show laugh reaction after a beat
  const reactionEl = $("laugh-reaction");
  reactionTimeout = setTimeout(() => {
    reactionEl.textContent = pickReaction();
    reactionEl.classList.remove("hidden");
    animateReactionIn(reactionEl);
    reactionTimeout = null;
  }, 500);

  // Update favorite button state
  updateFavButton(joke.id);

  // Favorite toggle — stays on current screen, shows toast
  favBtn.onclick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const isNowFav = toggleFavorite(joke.id);
    updateFavButton(joke.id);
    if (isNowFav) {
      animateHeartBounce(favBtn);
      showToast("\uC800\uC7A5\uB428!");
    } else {
      showToast("\uC800\uC7A5 \uCDE8\uC18C");
    }
  };

  // Copy joke to clipboard
  copyBtn.onclick = (e) => {
    e.stopPropagation();
    const text = `${joke.setup}\n${joke.punchline}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast("\uBCF5\uC0AC\uB428!");
    }).catch(() => {
      showToast("\uBCF5\uC0AC \uC2E4\uD328");
    });
  };

  // "다음!" = Primary style
  const btn = $("main-btn") as HTMLButtonElement;
  btn.disabled = false;
  btn.textContent = "\uB2E4\uC74C!";
  btn.className = "btn-primary";

  // Increment daily counter
  incrementDailyCount();
  updateCounter();
}

function updateFavButton(jokeId: number): void {
  const favBtn = $("fav-btn");
  const isFav = isFavorite(jokeId);
  // Static SVG constants defined in this file — no user input, safe to render
  const svgMarkup = isFav ? STAR_FILLED_SVG : STAR_OUTLINE_SVG;
  // eslint-disable-next-line no-unsanitized/property
  favBtn.innerHTML = svgMarkup + `<span>${isFav ? "\uC800\uC7A5\uB428" : "\uC800\uC7A5"}</span>`;
  favBtn.classList.toggle("is-favorite", isFav);
}

function renderClear(): void {
  currentPhase = "clear";

  $("loading-area").classList.add("hidden");
  $("joke-area").classList.add("hidden");
  $("clear-area").classList.remove("hidden");

  animateConfetti($("confetti-container"));

  const btn = $("main-btn") as HTMLButtonElement;
  btn.disabled = false;
  btn.textContent = "\uB2E4\uC2DC \uCC98\uC74C\uBD80\uD130";
}

function renderFavorites(): void {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }

  currentPhase = "favorites";

  $("main-screen").classList.add("hidden");
  $("favorites-screen").classList.remove("hidden");

  const favIds = loadFavorites();
  const listEl = $("fav-list");
  const emptyEl = $("fav-empty");

  // Clear list using DOM methods
  while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
  }

  if (favIds.length === 0) {
    emptyEl.classList.remove("hidden");
    listEl.classList.add("hidden");
  } else {
    emptyEl.classList.add("hidden");
    listEl.classList.remove("hidden");

    favIds.forEach((id) => {
      const joke = jokes.find((j) => j.id === id);
      if (!joke) return;

      const item = document.createElement("div");
      item.className = "favorite-item";

      const content = document.createElement("div");
      content.className = "fav-item-content";

      const setupSpan = document.createElement("span");
      setupSpan.className = "fav-item-setup";
      setupSpan.textContent = joke.setup;

      const punchlineSpan = document.createElement("span");
      punchlineSpan.className = "fav-item-punchline";
      punchlineSpan.textContent = joke.punchline;

      content.appendChild(setupSpan);
      content.appendChild(punchlineSpan);

      const actions = document.createElement("div");
      actions.className = "fav-item-actions";

      const copyItemBtn = document.createElement("button");
      copyItemBtn.className = "fav-action-btn";
      copyItemBtn.setAttribute("aria-label", "\uBCF5\uC0AC");
      copyItemBtn.textContent = "\uBCF5\uC0AC";
      copyItemBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const text = `${joke.setup}\n${joke.punchline}`;
        navigator.clipboard.writeText(text).then(() => {
          showToast("\uBCF5\uC0AC\uB428!");
        }).catch(() => {
          showToast("\uBCF5\uC0AC \uC2E4\uD328");
        });
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "fav-delete-btn";
      deleteBtn.setAttribute("aria-label", "\uC0AD\uC81C");
      deleteBtn.innerHTML = TRASH_SVG; // eslint-disable-line no-unsanitized/property
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFavorite(id);
        renderFavorites();
        showToast("\uC0AD\uC81C\uB428");
      });

      actions.appendChild(copyItemBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(content);
      item.appendChild(actions);
      listEl.appendChild(item);
    });
  }

  // Back button
  $("back-btn").onclick = () => {
    $("favorites-screen").classList.add("hidden");
    $("main-screen").classList.remove("hidden");
    renderIdle();
  };

  // CTA button in empty state
  const ctaBtn = document.getElementById("fav-cta-btn");
  if (ctaBtn) {
    ctaBtn.onclick = () => {
      $("favorites-screen").classList.add("hidden");
      $("main-screen").classList.remove("hidden");
      renderIdle();
    };
  }
}

function updateCounter(): void {
  const count = getTotalViewed();
  $("counter").textContent = `\uC624\uB298 ${count}\uAC1C \uBD04`;
}
