class DarkModeManager {
    constructor() {
        this.DARK_MODE_KEY = 'site_dark_mode';
        this.init();
    }
    
    init() {
        this.createButton();
        this.restoreMode();
        this.bindEvents();
        this.checkButtonVisibility();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'dark-mode-btn';
        this.button.innerHTML = '🌙';
        this.button.title = '切换黑夜模式';
        document.body.appendChild(this.button);
    }
    
    restoreMode() {
        const isDark = localStorage.getItem(this.DARK_MODE_KEY) === 'true';
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            this.button.innerHTML = '☀️';
            this.button.title = '切换白天模式';
        }
    }
    
    checkButtonVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('.md-header')?.offsetHeight || 100;
        
        if (scrollTop > headerHeight * 1.5) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    toggleMode() {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem(this.DARK_MODE_KEY, isDark);
        
        if (isDark) {
            this.button.innerHTML = '☀️';
            this.button.title = '切换白天模式';
        } else {
            this.button.innerHTML = '🌙';
            this.button.title = '切换黑夜模式';
        }
    }
    
    bindEvents() {
        this.button.addEventListener('click', () => this.toggleMode());
        window.addEventListener('scroll', () => this.checkButtonVisibility());
        window.addEventListener('resize', () => this.checkButtonVisibility());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
});