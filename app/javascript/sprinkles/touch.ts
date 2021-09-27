document.addEventListener('turbo:load', () => {
  if (window.ontouchstart !== undefined) {
    document.body.classList.add('touch');
  } else {
    document.body.classList.add('no-touch');
  }
});
