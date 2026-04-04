export function animateJokeIn(element: HTMLElement): void {
  element.classList.remove("joke-appear");
  // Force reflow to restart animation
  void element.offsetWidth;
  element.classList.add("joke-appear");
}

export function animatePunchlineIn(element: HTMLElement): void {
  element.classList.remove("punchline-appear");
  void element.offsetWidth;
  element.classList.add("punchline-appear");
}

export function animateHeartBounce(element: HTMLElement): void {
  element.classList.remove("heart-bounce");
  void element.offsetWidth;
  element.classList.add("heart-bounce");
}

export function animateReactionIn(element: HTMLElement): void {
  element.classList.remove("reaction-appear");
  void element.offsetWidth;
  element.classList.add("reaction-appear");
}

export function animateConfetti(container: HTMLElement): void {
  const colors = ["#E8651A", "#2B5F3A", "#D4A843", "#C4520F", "#FFF0E6"];
  const confettiCount = 7;

  for (let i = 0; i < confettiCount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.left = `${10 + Math.random() * 80}%`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.animationDuration = `${1.5 + Math.random() * 1}s`;
    container.appendChild(piece);

    piece.addEventListener("animationend", () => piece.remove());
  }
}
