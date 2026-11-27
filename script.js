// Mobile navigation: opens and closes the menu on small screens.
const menuButton = document.querySelector(".menu");
const navLinks = document.querySelector(".navlinks");
if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    menuButton.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", isOpen);
  });
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      menuButton.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}
// Highlight the current page in the navigation.
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".navlinks a").forEach(link => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
});


/* WORDS OF WISDOM SLIDER */

document.querySelectorAll(".wisdom-slider").forEach(slider => {

  const track = slider.querySelector(".wisdom-track");
  const cards = [...slider.querySelectorAll(".wisdom-card")];
  const next = slider.querySelector(".wisdom-next");
  const prev = slider.querySelector(".wisdom-prev");

  const counter = document.querySelector(".wisdom-counter");
  const progress = document.querySelector(".wisdom-progress span");

  let current = 0;

  function visibleCards() {
    if (window.innerWidth <= 620) return 1;
    if (window.innerWidth <= 950) return 2;
    return 3;
  }

  function updateSlider() {
    const visible = visibleCards();
    const maxIndex = Math.max(0, cards.length - visible);

    current = Math.min(current, maxIndex);

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const move = (cardWidth + gap) * current;

    track.style.transform = `translateX(-${move}px)`;

    if (counter) {
      counter.textContent =
        `${String(current + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    }

    if (progress) {
      progress.style.width =
        `${((current + visible) / cards.length) * 100}%`;
    }

    prev.disabled = current === 0;
    next.disabled = current >= maxIndex;

    prev.style.opacity = prev.disabled ? ".4" : "1";
    next.style.opacity = next.disabled ? ".4" : "1";
  }

  next.addEventListener("click", () => {
    const maxIndex = Math.max(0, cards.length - visibleCards());
    if (current < maxIndex) {
      current++;
      updateSlider();
    }
  });

  prev.addEventListener("click", () => {
    if (current > 0) {
      current--;
      updateSlider();
    }
  });

  window.addEventListener("resize", updateSlider);

  updateSlider();

});
