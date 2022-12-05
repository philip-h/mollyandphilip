const config = {
  name: "Molly & Philip's Wedding",
  description:
    "A day to celebrate the Molly and Philip's Sacrament of Matrimony at 2pm, followed by great food, wonderful company, and lots of dancing!",
  startDate: "2023-04-22",
  endDate: "2023-04-22",
  options: ["Google", "Apple", "Microsoft365", "iCal"],
  location:
    "Revera Windermere on the Mount, 1486 Richmond St, London, ON N6G 2M3, Canada",
  timeZone: "America/Toronto",
  trigger: "click",
  iCalFileName: "Mollip-Wedding",
};
const button = document.querySelector("#rsvp-button");
button.addEventListener("click", () => atcb_action(config, button));

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
const observer = new IntersectionObserver((entries, _) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      navToggle.classList.add("mobile-nav-toggle__fab");
    } else {
      navToggle.classList.remove("mobile-nav-toggle__fab");
    }
  });
}, observerOptions);

observer.observe(header);

