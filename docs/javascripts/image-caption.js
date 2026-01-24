document.addEventListener('DOMContentLoaded', function() {
  const regularContainers = document.querySelectorAll('.md-content p:has(img):not(:has(a.glightbox)), .md-content figure:has(img):not(:has(a.glightbox))');
  regularContainers.forEach(container => {
    const img = container.querySelector('img');
    if (img && img.alt) {
      container.setAttribute('data-alt', img.alt);
    }
  });
  
  const glightboxContainers = document.querySelectorAll('.md-content p:has(a.glightbox), .md-content figure:has(a.glightbox)');
  glightboxContainers.forEach(container => {
    const link = container.querySelector('a.glightbox');
    const img = link.querySelector('img');
    if (img && img.alt) {
      container.setAttribute('data-alt', img.alt);
    }
  });
});