document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lirrum-spoiler').forEach(function(spoiler) {
        spoiler.addEventListener('click', function(e) {
            this.classList.toggle('revealed');
            this.style.transform = 'scale(1.05)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    });
});