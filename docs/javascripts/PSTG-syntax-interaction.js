document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.PSTG-spoiler').forEach(function(spoiler) {
        spoiler.addEventListener('click', function(e) {
            this.classList.toggle('revealed');
            this.style.transform = 'scale(1.05)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });
    
    document.querySelectorAll('.PSTG-img').forEach(function(img) {
        img.addEventListener('error', function() {
            this.alt = '图片加载失败: ' + this.alt;
            this.classList.add('img-error');
        });
        
        img.addEventListener('click', function(e) {
            e.preventDefault();
            window.simpleLightbox.open(this.src, this.alt || '');
        });
    });
});