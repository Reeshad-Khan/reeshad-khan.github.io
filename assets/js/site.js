document.getElementById("y").textContent = new Date().getFullYear();

// Force MapMyVisitors globe to redraw correctly on first load (fixes “blank on fullscreen”)
window.addEventListener("load", () => {
  // Some embeds attach late, so trigger resize twice
  setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
  setTimeout(() => window.dispatchEvent(new Event("resize")), 1200);
});
