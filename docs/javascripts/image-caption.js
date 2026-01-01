document.addEventListener('DOMContentLoaded', function() {
  const imgContainers = document.querySelectorAll('.md-content p:has(img), .md-content figure:has(img)');
  imgContainers.forEach(container => {
    const img = container.querySelector('img');
    if (img && img.alt) {
      container.setAttribute('data-alt', img.alt);
    }
  });
}); 