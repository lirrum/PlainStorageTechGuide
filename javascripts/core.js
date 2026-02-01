document.addEventListener('DOMContentLoaded', () => {
    window.simpleLightbox = new SimpleLightbox();
    window.sidebarToggle = new SidebarToggle();
    window.readingProgress = new ReadingProgressManager();
    window.darkModeManager = new DarkModeManager();
    window.firstVisitGuide = new FirstVisitGuide();
    window.backToTop = new BackToTop();
    
    setTimeout(() => {
        try { window.chapterNavigation = new ChapterNavigation(); } 
        catch (error) {}
    }, 300);
    
    new ScrollSpy();
    new SyntaxInteraction();
    new ImageCaptionManager();
    
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.body, {
            delimiters: [{ left: "$", right: "$", display: false }, { left: "$$", right: "$$", display: true }],
            processEscapes: true,
            ignoreHtmlClass: "tex2jax_ignore",
            throwOnError: false  
        });
    }
});