class ReadingProgressManager {
    constructor() {
        this.storageKey = 'last_reading';
        this.sessionKey = 'has_restored';
        this.notificationDuration = 10000;
        this.init();
    }
    
    init() {
        this.createProgressBar();
        
        const hasRestored = sessionStorage.getItem(this.sessionKey) === 'true';
        const isFirstVisit = !sessionStorage.getItem('visited');
        const savedProgress = this.getSavedProgress();
        
        sessionStorage.setItem('visited', 'true');
        
        if (isFirstVisit && savedProgress && !hasRestored) {
            this.createNotification();
            this.showNotification(savedProgress);
        }
        
        if (savedProgress && !hasRestored) {
            this.createRestoreButton();
        }
        
        this.bindEvents();
    }
    
    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'reading-progress-bar';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(this.progressBar);
        
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const progress = docHeight <= windowHeight ? 100 : 
                Math.min(Math.round((scrollTop / (docHeight - windowHeight)) * 100), 100);
            this.progressBar.style.width = progress + '%';
        };
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateProgress();
                this.saveReadingProgress();
            }, 100);
        });
        
        updateProgress();
    }
    
    saveReadingProgress() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        if (scrollPosition === 0) return;
        
        const data = {
            url: window.location.pathname + window.location.hash,
            page: window.location.pathname,
            scrollPosition: scrollPosition,
            timestamp: Date.now(),
            title: document.title
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {}
    }
    
    getSavedProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return null;
            
            const data = JSON.parse(saved);
            if (!data.page || data.scrollPosition === undefined) {
                localStorage.removeItem(this.storageKey);
                return null;
            }
            
            return data;
        } catch (e) {
            localStorage.removeItem(this.storageKey);
            return null;
        }
    }
    
    createNotification() {
        this.notification = document.createElement('div');
        this.notification.className = 'reading-notification';
        this.notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            padding: 16px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            display: none;
            animation: slideInRight 0.3s ease;
            border: 1px solid #e0e0e0;
        `;
        
        this.notification.innerHTML = `
            <div class="notification-header">
                <h4 style="margin: 0 0 8px 0; color: #333;">继续阅读</h4>
                <button class="notification-close" style="
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
            <div class="notification-content">
                <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;"></p>
                <div class="notification-actions" style="
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                ">
                    <button class="notification-reject" style="
                        padding: 6px 12px;
                        background: #f5f5f5;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        color: #666;
                        cursor: pointer;
                        font-size: 14px;
                    ">暂时不需要</button>
                    <button class="notification-accept" style="
                        padding: 6px 12px;
                        background: #3498db;
                        border: none;
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                    ">继续阅读</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.notification);
        
        this.notification.querySelector('.notification-close').addEventListener('click', () => this.hideNotification());
        this.notification.querySelector('.notification-reject').addEventListener('click', () => this.hideNotification());
        this.notification.querySelector('.notification-accept').addEventListener('click', () => this.doRestore());
    }
    
    showNotification(savedProgress) {
        if (!this.notification) return;
        
        const pageName = savedProgress.title || savedProgress.page.split('/').pop().replace('.html', '') || '页面';
        this.notification.querySelector('p').textContent = 
            `检测到上次在"${pageName}"的阅读记录，是否跳转到上次阅读的位置？`;
        
        this.notification.style.display = 'block';
        
        if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
        this.notificationTimeout = setTimeout(() => this.hideNotification(), this.notificationDuration);
    }
    
    hideNotification() {
        if (this.notification) {
            this.notification.style.display = 'none';
            if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
        }
    }
    
    createRestoreButton() {
        this.restoreButton = document.createElement('button');
        this.restoreButton.className = 'reading-restore-btn';
        this.restoreButton.title = '恢复上次阅读位置';
        this.restoreButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
            </svg>
        `;
        
        this.restoreButton.addEventListener('click', () => this.doRestore());
        document.body.appendChild(this.restoreButton);
    }
    
    hideRestoreButton() {
        if (this.restoreButton) {
            this.restoreButton.style.display = 'none';
        }
    }
    
    doRestore() {
        const saved = this.getSavedProgress();
        if (!saved) return;
        
        sessionStorage.setItem(this.sessionKey, 'true');
        this.hideRestoreButton();
        this.hideNotification();
        
        if (saved.page !== window.location.pathname) {
            window.location.href = saved.url || saved.page;
        } else {
            window.scrollTo({
                top: saved.scrollPosition,
                behavior: 'smooth'
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('beforeunload', () => this.saveReadingProgress());
    }
}