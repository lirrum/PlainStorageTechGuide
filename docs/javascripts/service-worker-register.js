class ServiceWorkerManager {
    constructor() {
        this.isSupported = 'serviceWorker' in navigator;
        this.registration = null;
        this.isOnline = navigator.onLine;
        this.init();
    }
    
    async init() {
        if (!this.isSupported) return;
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        await this.register();
        navigator.serviceWorker.addEventListener('message', (event) => this.handleServiceWorkerMessage(event));
    }
    
    async register() {
        try {
            this.registration = await navigator.serviceWorker.register('/service-worker.js', {scope: '/'});
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) this.showUpdateNotification();
                });
            });
        } catch (error) {}
    }
    
    handleOnline() {
        this.isOnline = true;
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({type: 'NETWORK_STATUS', status: 'online'});
        }
    }
    
    handleOffline() {
        this.isOnline = false;
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({type: 'NETWORK_STATUS', status: 'offline'});
        }
        this.showOfflineNotification();
    }
    
    handleServiceWorkerMessage(event) {
        const { type, data } = event.data;
        switch (type) {
            case 'CACHE_UPDATED': break;
            case 'NEW_VERSION_AVAILABLE': this.showNewVersionNotification(); break;
            case 'OFFLINE_MODE': this.showOfflineNotification(); break;
        }
    }
    
    showUpdateNotification() {
        if (window.confirm('网站有更新可用，是否立即刷新？')) window.location.reload();
    }
    
    showNewVersionNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#2ecc71;color:white;padding:12px 20px;border-radius:8px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:slideInRight 0.3s ease';
        notification.innerHTML = '<div style="display:flex;align-items:center;gap:10px"><span>🔄</span><div><div style="font-weight:bold">新版本可用</div><div style="font-size:12px;opacity:0.9">刷新页面以更新</div></div><button onclick="this.parentElement.parentElement.remove();window.location.reload()" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:4px 12px;border-radius:4px;cursor:pointer">刷新</button></div>';
        document.body.appendChild(notification);
    }
    
    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#e74c3c;color:white;padding:12px 20px;border-radius:8px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:slideInRight 0.3s ease';
        notification.innerHTML = '<div style="display:flex;align-items:center;gap:10px"><span>📡</span><div><div style="font-weight:bold">离线模式</div><div style="font-size:12px;opacity:0.9">网络连接已断开</div></div></div>';
        document.body.appendChild(notification);
        setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 5000);
    }
    
    async checkForUpdates() { if (this.registration) await this.registration.update(); }
    async clearCache() { const cacheNames = await caches.keys(); await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))); }
}

document.addEventListener('DOMContentLoaded', () => { window.serviceWorkerManager = new ServiceWorkerManager(); });