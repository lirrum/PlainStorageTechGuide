const CACHE_VERSION = 'pstg-v2';
const CACHE_NAME = `pstg-cache-${CACHE_VERSION}`;
const CACHEABLE_TYPES = ['document', 'stylesheet', 'script', 'image', 'font'];
const STATIC_ASSETS = [
    '/stylesheets/core.css',
    '/stylesheets/components.css',
    '/stylesheets/syntax.css',
    '/stylesheets/themes.css',
    '/javascripts/core.js',
    '/javascripts/navigation.js',
    '/javascripts/media.js',
    '/javascripts/ui.js',
    '/javascripts/reading.js',
    '/javascripts/first-visit.js',
    '/javascripts/lazy-image-loader.js',
    '/javascripts/service-worker-register.js',
    'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css',
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js',
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js',
    'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&display=swap',
    'https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap'
];
const CHAPTER_PAGES = [
    '/', '/01-contents/', '/02-preface/', '/03-chapter-00/', '/04-chapter-01/',
    '/05-chapter-02/', '/06-chapter-03/', '/07-chapter-04/', '/08-chapter-05/',
    '/09-chapter-06/', '/10-chapter-07/', '/11-chapter-08/', '/12-chapter-09/',
    '/13-chapter-10/', '/14-chapter-11/', '/15-chapter-12/', '/16-chapter-13/', '/17-chapter-14/'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS.map(url => new Request(url, {credentials: 'same-origin'}))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
            })
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== location.origin) return;
    if (requestUrl.pathname.includes('/service-worker')) return;
    
    event.respondWith(
        handleFetch(event.request, requestUrl)
            .catch(error => createOfflineResponse())
    );
});

async function handleFetch(request, url) {
    const cacheKey = request.url;
    if (isChapterPage(url.pathname)) return networkFirst(request, cacheKey);
    if (isStaticAsset(url.pathname)) return cacheFirst(request, cacheKey);
    if (isImage(url.pathname)) return staleWhileRevalidate(request, cacheKey);
    return networkFirst(request, cacheKey);
}

function isChapterPage(pathname) {
    return pathname === '/' || pathname.includes('/chapter-') || pathname.includes('/contents') || 
           pathname.includes('/preface') || /^\/(\d{2}-)/.test(pathname);
}

function isStaticAsset(pathname) {
    return pathname.includes('/stylesheets/') || pathname.includes('/javascripts/') ||
           pathname.includes('/images/') || pathname.endsWith('.css') || pathname.endsWith('.js');
}

function isImage(pathname) {
    return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname);
}

async function networkFirst(request, cacheKey) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, responseClone));
            return networkResponse;
        }
    } catch (error) {}
    const cachedResponse = await caches.match(cacheKey);
    if (cachedResponse) return cachedResponse;
    return createNotFoundResponse();
}

async function cacheFirst(request, cacheKey) {
    const cachedResponse = await caches.match(cacheKey);
    if (cachedResponse) {
        updateCacheInBackground(request, cacheKey);
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, responseClone));
        }
        return networkResponse;
    } catch (error) {
        return createOfflineResponse();
    }
}

function updateCacheInBackground(request, cacheKey) {
    setTimeout(async () => {
        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(cacheKey, networkResponse.clone());
            }
        } catch (error) {}
    }, 1000);
}

function createOfflineResponse() {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>离线模式</title><style>body{font-family:sans-serif;max-width:800px;margin:100px auto;padding:20px;text-align:center;color:#333}.offline-icon{font-size:64px;color:#ff6b6b;margin-bottom:20px}h1{color:#2c3e50;margin-bottom:20px}p{color:#7f8c8d;line-height:1.6;margin-bottom:30px}.tip{background:#f8f9fa;border-left:4px solid #3498db;padding:15px;margin:20px 0;text-align:left}</style></head><body><div class="offline-icon">📡</div><h1>网络连接已断开</h1><p>您当前处于离线状态。部分功能可能受限。</p><div class="tip"><strong>提示：</strong>您之前访问过的页面仍然可以查看。请检查网络连接后重试。</div><p><button onclick="location.reload()">重试连接</button></p></body></html>`;
    return new Response(html, {headers: {'Content-Type': 'text/html; charset=utf-8'}});
}

function createNotFoundResponse() {
    return new Response('页面未找到', {status: 404, statusText: 'Not Found'});
}