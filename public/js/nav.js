const header = document.querySelector(".header");
const navbar = document.querySelector(".navbar");
const navToggle = document.querySelector(".mobile-nav-toggle");
const navLinks = navbar.childNodes;

// Expland and deflate side menu on nav-toggle click
navToggle.addEventListener("click", (e) => {
  const visibility = navbar.getAttribute("data-visible");
  if (visibility === "false") {
    navbar.setAttribute("data-visible", true);
    navToggle.setAttribute("aria-expanded", true);
  } else if (visibility === "true") {
    navbar.setAttribute("data-visible", false);
    navToggle.setAttribute("aria-expanded", false);
  }
  e.stopPropagation();
});

// Close side nav when clicked outside
document.body.addEventListener("click", () => {
  const visibility = navbar.getAttribute("data-visible");
  if (visibility === "true") {
    navbar.setAttribute("data-visible", false);
    navToggle.setAttribute("aria-expanded", false);
  }
});

// Deflate menu on link click
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    navbar.setAttribute("data-visible", false);
    navToggle.setAttribute("aria-expanded", false);
  });
});

const observerOptions = {};
const observer = new IntersectionObserver((entries, observe) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      navToggle.classList.add("mobile-nav-toggle__fab");
    } else {
      navToggle.classList.remove("mobile-nav-toggle__fab");
    }
  });
}, observerOptions);

observer.observe(header);
