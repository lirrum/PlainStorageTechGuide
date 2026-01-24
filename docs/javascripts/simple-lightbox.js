class SimpleLightbox {
    constructor() {
        this.container = null;
        this.img = null;
        this.closeBtn = null;
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.scrollPosition = 0;
        this.wheelHandler = this.wheelHandler.bind(this);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
        this.init();
    }
    
    init() {
        this.createContainer();
        this.bindEvents();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'simple-lightbox';
        this.container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:none;justify-content:center;align-items:center;z-index:9999;cursor:zoom-out;';
        
        this.img = document.createElement('img');
        this.img.style.cssText = 'max-width:90%;max-height:90%;cursor:zoom-in;transform-origin:center center;transition:transform 0.2s ease-out;user-select:none;-webkit-user-drag:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;';
        
        this.closeBtn = document.createElement('button');
        this.closeBtn.className = 'simple-lightbox-close';
        this.closeBtn.innerHTML = '×';
        this.closeBtn.title = '关闭 (Esc)';
        this.closeBtn.style.cssText = 'position:absolute;top:20px;right:20px;width:40px;height:40px;border:none;background:rgba(0,0,0,0.5);border-radius:50%;color:white;font-size:24px;font-weight:bold;cursor:pointer;z-index:10001;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;';
        
        this.container.appendChild(this.img);
        this.container.appendChild(this.closeBtn);
        document.body.appendChild(this.container);
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('PSTG-img')) {
                e.preventDefault();
                this.open(e.target.src, e.target.alt || '');
            }
        });
        
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
        
        this.closeBtn.addEventListener('click', this.closeHandler);
        
        this.img.addEventListener('mousedown', this.mouseDownHandler);
        this.img.addEventListener('touchstart', this.mouseDownHandler, { passive: false });
    }
    
    closeHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        this.close();
    }
    
    mouseDownHandler(e) {
        if (this.scale <= 1) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.startX = (e.clientX || e.touches[0].clientX) - this.translateX;
        this.startY = (e.clientY || e.touches[0].clientY) - this.translateY;
        this.img.style.cursor = 'grabbing';
        this.img.style.transition = 'none';
        
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
        document.addEventListener('touchmove', this.mouseMoveHandler, { passive: false });
        document.addEventListener('touchend', this.mouseUpHandler);
    }
    
    mouseMoveHandler(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (clientX === undefined || clientY === undefined) return;
        
        this.translateX = clientX - this.startX;
        this.translateY = clientY - this.startY;
        
        requestAnimationFrame(() => {
            this.img.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        });
    }
    
    mouseUpHandler() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.img.style.cursor = this.scale > 1 ? 'grab' : 'zoom-in';
        this.img.style.transition = 'transform 0.2s ease-out';
        
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
        document.removeEventListener('touchmove', this.mouseMoveHandler);
        document.removeEventListener('touchend', this.mouseUpHandler);
    }
    
    wheelHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        const oldScale = this.scale;
        this.scale = Math.max(0.5, Math.min(5, this.scale + delta));
        
        if (this.scale !== oldScale) {
            this.img.style.cursor = this.scale > 1 ? 'grab' : 'zoom-in';
            this.img.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        }
    }
    
    keyDownHandler(e) {
        if (e.key === 'Escape' && this.container.style.display !== 'none') {
            this.close();
        }
    }
    
    open(src, alt) {
        this.scrollPosition = window.pageYOffset;
        
        this.img.src = src;
        this.img.alt = alt;
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.img.style.cursor = 'zoom-in';
        this.img.style.transform = `translate(0, 0) scale(1)`;
        this.img.style.transition = 'transform 0.2s ease-out';
        
        this.container.style.display = 'flex';
        
        this.img.addEventListener('wheel', this.wheelHandler, { passive: false });
        document.addEventListener('keydown', this.keyDownHandler);
        
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.left = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.container.style.display = 'none';
        
        this.img.removeEventListener('wheel', this.wheelHandler);
        document.removeEventListener('keydown', this.keyDownHandler);
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        window.scrollTo(0, this.scrollPosition);
        
        this.isDragging = false;
        this.img.style.cursor = 'zoom-in';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.simpleLightbox = new SimpleLightbox();
});