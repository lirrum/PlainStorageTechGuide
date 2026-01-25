class SidebarToggle {
    constructor() {
        this.storageKey = 'sidebar_hidden';
        this.sidebar = null;
        this.toggleBtn = null;
        this.isInitialized = false;
        this.isAnimating = false;
        this.init();
    }
    
    init() {
        this.createToggleButton();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initSidebar());
        } else {
            this.initSidebar();
        }
        
        window.addEventListener('scroll', () => this.checkButtonVisibility());
    }
    
    createToggleButton() {
        if (document.querySelector('.sidebar-toggle-btn')) return;
        
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'sidebar-toggle-btn';
        this.toggleBtn.innerHTML = `
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 19l-7-7 7-7"/>
            </svg>
        `;
        this.toggleBtn.title = '隐藏侧边栏';
        document.body.appendChild(this.toggleBtn);
        
        this.toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleClick();
        });
        
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                this.handleClick();
            }
        });
    }
    
    initSidebar() {
        if (this.isInitialized) return;
        this.sidebar = document.querySelector('.md-sidebar--primary');
        
        if (!this.sidebar) {
            setTimeout(() => this.initSidebar(), 100);
            return;
        }
        
        this.isInitialized = true;
        this.restoreState();
        this.checkButtonVisibility();
    }
    
    restoreState() {
        const isHidden = localStorage.getItem(this.storageKey) === 'true';
        if (isHidden) {
            this.sidebar.classList.add('sidebar-hidden');
            this.updateButtonState(true, false);
        }
    }
    
    checkButtonVisibility() {
        if (!this.toggleBtn) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('.md-header')?.offsetHeight || 60;
        
        if (scrollTop > headerHeight * 1.5) {
            this.toggleBtn.classList.add('show');
        } else {
            this.toggleBtn.classList.remove('show');
        }
    }
    
    handleClick() {
        if (this.isAnimating || !this.sidebar) return;
        this.isAnimating = true;
        
        const isHidden = this.sidebar.classList.contains('sidebar-hidden');
        if (isHidden) {
            this.showSidebar();
        } else {
            this.hideSidebar();
        }
        
        setTimeout(() => { this.isAnimating = false; }, 300);
    }
    
    hideSidebar() {
        this.sidebar.classList.add('sidebar-hidden');
        setTimeout(() => {
            this.updateButtonState(true, true);
        }, 0);
        localStorage.setItem(this.storageKey, 'true');
    }
    
    showSidebar() {
        this.updateButtonState(false, true);
        setTimeout(() => {
            this.sidebar.classList.remove('sidebar-hidden');
        }, 200);
        localStorage.setItem(this.storageKey, 'false');
    }
    
    updateButtonState(isHidden, animate = true) {
        if (!this.toggleBtn) return;
        const arrowIcon = this.toggleBtn.querySelector('.arrow-icon');
        
        if (isHidden) {
            if (arrowIcon) arrowIcon.style.transform = 'rotate(180deg)';
            this.toggleBtn.title = '显示侧边栏';
            this.toggleBtn.classList.add('hidden');
            
            if (animate) {
                this.toggleBtn.classList.add('move-left');
                this.toggleBtn.classList.remove('move-right');
            } else {
                this.toggleBtn.classList.add('move-left-instant');
            }
        } else {
            if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
            this.toggleBtn.title = '隐藏侧边栏';
            this.toggleBtn.classList.remove('hidden');
            
            if (animate) {
                this.toggleBtn.classList.add('move-right');
                this.toggleBtn.classList.remove('move-left');
            } else {
                this.toggleBtn.classList.remove('move-left-instant');
            }
        }
    }
}

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

class BackToTop {
    constructor() {
        this.button = null;
        this.init();
    }
    
    init() {
        this.createButton();
        this.bindEvents();
        setTimeout(() => this.handleScroll(), 100);
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'back-to-top-btn';
        this.button.innerHTML = '↑';
        this.button.title = '返回顶部';
        document.body.appendChild(this.button);
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('.md-header')?.offsetHeight || 100;

        if (scrollTop > headerHeight * 1.5) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}