const parallaxImgs = document.querySelectorAll(".parallax");

window.addEventListener("scroll", () => {
  console.log(window.scrollY);
  parallaxImgs.forEach((parallaxImg) => {
    parallaxImg.style.backgroundPositionY = window.scrollY * -0.2 + "px";
  });
});
