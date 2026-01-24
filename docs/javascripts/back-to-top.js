document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.title = '返回顶部';
    document.body.appendChild(backToTopBtn);

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('.md-header')?.offsetHeight || 100;

        if (scrollTop > headerHeight * 1.5) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    window.addEventListener('scroll', handleScroll);
    backToTopBtn.addEventListener('click', scrollToTop);
    
    setTimeout(handleScroll, 100);
});