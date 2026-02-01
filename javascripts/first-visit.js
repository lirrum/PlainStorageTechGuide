class FirstVisitGuide {
    constructor() {
        this.storageKey = 'dont_show_guide';
        this.init();
    }
    
    init() {
        const dontShow = localStorage.getItem(this.storageKey) === 'true';
        if (!dontShow) {
            setTimeout(() => {
                this.showGuide();
            }, 1500);
        }
    }
    
    showGuide() {
        this.createGuideStyles();
        this.createGuideElement();
    }
    
    createGuideStyles() {
        const style = document.createElement('style');
        style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }@keyframes slideDown { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(30px); } }`;
        document.head.appendChild(style);
    }
    
    createGuideElement() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'first-visit-overlay';
        this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease';
        this.guide = document.createElement('div');
        this.guide.className = 'first-visit-guide';
        this.guide.style.cssText = 'position:relative;width:90%;max-width:700px;max-height:85vh;background:white;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.4s ease';
        this.guide.innerHTML = this.getGuideHTML();
        this.overlay.appendChild(this.guide);
        document.body.appendChild(this.overlay);
        this.bindEvents();
    }
    
    getGuideHTML() {
        return `<div class="guide-header" style="padding:24px 28px 20px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;position:relative"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h2 style="margin:0 0 8px 0;font-size:24px;font-weight:700">欢迎访问PSTG!</h2><p style="margin:0;opacity:0.9;font-size:14px">PSTG是专为系统学习储电打造的交互式教材网站，下面是我们的辅助功能：</p></div><button class="guide-close-btn" style="background:rgba(255,255,255,0.2);border:none;width:36px;height:36px;border-radius:50%;color:white;font-size:20px;cursor:pointer;transition:background 0.2s">×</button></div><div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#4ecdc4,#44a08d,#667eea,#764ba2)"></div></div><div class="guide-content" style="padding:28px;overflow-y:auto;max-height:55vh"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px"><div class="feature-card" style="background:#f8f9fa;border-radius:12px;padding:20px;border:1px solid #eaeaea"><div style="display:flex;align-items:center;margin-bottom:12px"><div style="width:40px;height:40px;background:linear-gradient(135deg,#3498db,#2980b9);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:12px;color:white;font-size:20px">📖</div><h3 style="margin:0;color:#2c3e50">阅读体验增强</h3></div><ul style="margin:0;padding-left:20px;color:#555;line-height:1.6"><li>顶部阅读进度条，实时跟踪进度</li><li>自动保存阅读位置，下次继续阅读</li><li>章节导航，快速跳转上下章</li><li>一键返回顶部，阅读更便捷</li></ul></div><div class="feature-card" style="background:#f8f9fa;border-radius:12px;padding:20px;border:1px solid #eaeaea"><div style="display:flex;align-items:center;margin-bottom:12px"><div style="width:40px;height:40px;background:linear-gradient(135deg,#2ecc71,#27ae60);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:12px;color:white;font-size:20px">🎨</div><h3 style="margin:0;color:#2c3e50">视觉与交互</h3></div><ul style="margin:0;padding-left:20px;color:#555;line-height:1.6"><li>一键切换黑夜模式，保护眼睛</li><li>侧边栏智能隐藏，专注阅读</li><li>图片点击放大，支持缩放拖拽</li><li>数学公式渲染，支持LaTeX</li></ul></div><div class="feature-card" style="background:#f8f9fa;border-radius:12px;padding:20px;border:1px solid #eaeaea"><div style="display:flex;align-items:center;margin-bottom:12px"><div style="width:40px;height:40px;background:linear-gradient(135deg,#9b59b6,#8e44ad);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:12px;color:white;font-size:20px">🧭</div><h3 style="margin:0;color:#2c3e50">智能导航</h3></div><ul style="margin:0;padding-left:20px;color:#555;line-height:1.6"><li>侧边栏自动高亮当前章节</li><li>快捷键支持：ESC关闭弹窗</li><li>左右箭头切换上下章节</li><li>Ctrl+Shift+B隐藏侧边栏</li></ul></div><div class="feature-card" style="background:#f8f9fa;border-radius:12px;padding:20px;border:1px solid #eaeaea"><div style="display:flex;align-items:center;margin-bottom:12px"><div style="width:40px;height:40px;background:linear-gradient(135deg,#f39c12,#e67e22);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:12px;color:white;font-size:20px">✨</div><h3 style="margin:0;color:#2c3e50">特色功能</h3></div><ul style="margin:0;padding-left:20px;color:#555;line-height:1.6"><li>剧透内容隐藏，点击显示</li><li>多彩文本标注，突出重点</li><li>图片自动添加标题说明</li><li>响应式设计，移动端适配</li></ul></div></div><div style="margin-top:28px;padding:20px;background:linear-gradient(135deg,#f8f9fa,#e9ecef);border-radius:12px;border-left:4px solid #3498db"><div style="display:flex;align-items:center;margin-bottom:12px"><div style="width:36px;height:36px;background:#3498db;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:12px;color:white;font-size:18px">💡</div><h4 style="margin:0;color:#2c3e50">快速开始建议</h4></div><p style="margin:0;color:#555;line-height:1.6;font-size:14px">建议您先浏览目录章节，了解全书结构。阅读时可以使用侧边栏快速导航到感兴趣的章节。如果遇到复杂图片，点击可以放大查看细节。晚上阅读时可以开启黑夜模式减少眼睛疲劳。</p></div></div><div class="guide-actions" style="padding:20px 28px;background:#f8f9fa;border-top:1px solid #eaeaea;display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center"><input type="checkbox" id="dont-show-again" style="margin-right:8px"><label for="dont-show-again" style="font-size:14px;color:#666;cursor:pointer">下次不再显示此引导</label></div><button class="guide-confirm-btn" style="padding:10px 32px;background:linear-gradient(135deg,#667eea,#764ba2);border:none;border-radius:8px;color:white;cursor:pointer;font-size:16px;font-weight:600;transition:transform 0.2s,box-shadow 0.2s">开始探索 →</button></div>`;
    }
    
    bindEvents() {
        const closeBtn = this.guide.querySelector('.guide-close-btn');
        const confirmBtn = this.guide.querySelector('.guide-confirm-btn');
        const dontShowCheckbox = this.guide.querySelector('#dont-show-again');
        const closeGuide = () => {
            if (dontShowCheckbox.checked) localStorage.setItem(this.storageKey, 'true');
            this.overlay.style.animation = 'fadeOut 0.3s ease forwards';
            this.guide.style.animation = 'slideDown 0.3s ease forwards';
            setTimeout(() => {
                if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
            }, 300);
        };
        closeBtn.addEventListener('click', closeGuide);
        confirmBtn.addEventListener('click', closeGuide);
        this.overlay.addEventListener('click', (e) => { if (e.target === this.overlay) closeGuide(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGuide(); });
    }
}