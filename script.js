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
  const counter = slider.parentElement.querySelector(".wisdom-counter");

  let current = 0;

  if (!track || cards.length === 0 || !next || !prev) return;

  function updateSlider() {
    // Always show one advice card at a time.
    const maxIndex = cards.length - 1;
    current = Math.max(0, Math.min(current, maxIndex));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;

    track.style.transform =
      `translateX(-${current * (cardWidth + gap)}px)`;

    if (counter) {
      counter.textContent =
        `${String(current + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    }

    prev.disabled = current === 0;
    next.disabled = current === maxIndex;
  }

  next.addEventListener("click", () => {
    if (current < cards.length - 1) {
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
