class LazyImageLoader {
    constructor() {
        this.observer = null;
        this.placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiIC8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmMGYwZjAiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iNTAiIHN0b3AtY29sb3I9IiNlMGUwZTAiIHN0b3Atb3BhY2l0eT0iMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2YwZjBmMCIgc3RvcC1vcGFjaXR5PSIxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+';
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) this.initWithIntersectionObserver();
        else this.initWithScrollListener();
        this.loadVisibleImages();
    }
    
    initWithIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.observer.unobserve(img);
                }
            });
        }, {root: null, rootMargin: '100px 0px', threshold: 0.01});
        document.querySelectorAll('img[data-src]').forEach(img => this.observer.observe(img));
    }
    
    initWithScrollListener() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => { this.loadVisibleImages(); ticking = false; });
                ticking = true;
            }
        });
        window.addEventListener('resize', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => { this.loadVisibleImages(); ticking = false; });
                ticking = true;
            }
        });
        this.loadVisibleImages();
    }
    
    loadVisibleImages() {
        const images = document.querySelectorAll('img[data-src]');
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        images.forEach(img => {
            const imgTop = img.getBoundingClientRect().top + scrollTop;
            const imgBottom = imgTop + img.offsetHeight;
            if (imgBottom >= scrollTop - 100 && imgTop <= scrollTop + windowHeight + 100) this.loadImage(img);
        });
    }
    
    async loadImage(img) {
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');
        if (!src) return;
        img.classList.add('lazy-loading');
        await this.preloadImage(src);
        img.src = src;
        if (srcset) img.srcset = srcset;
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        img.addEventListener('load', () => img.classList.add('lazy-load-complete'));
        img.addEventListener('error', () => {
            img.classList.add('lazy-load-error');
            img.alt = '图片加载失败: ' + (img.alt || '');
        });
    }
    
    async preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { resolve(url); URL.revokeObjectURL(img.src); };
            img.onerror = () => { reject(); URL.revokeObjectURL(img.src); };
            if (window.serviceWorkerManager && caches) {
                caches.match(url).then(response => {
                    if (response) response.blob().then(blob => img.src = URL.createObjectURL(blob));
                    else img.src = url;
                });
            } else img.src = url;
        });
    }
    
    loadImageById(id) {
        const img = document.getElementById(id);
        if (img && img.hasAttribute('data-src')) this.loadImage(img);
    }
    
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => this.loadImage(img));
    }
}

document.addEventListener('DOMContentLoaded', () => { window.lazyImageLoader = new LazyImageLoader(); });
if (typeof module !== 'undefined' && module.exports) module.exports = LazyImageLoader;