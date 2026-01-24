class FirstVisitGuide {
    constructor() {
        this.storageKey = 'site_first_visit';
        this.init();
    }
    
    init() {
        const hasVisited = localStorage.getItem(this.storageKey) === 'true';
        const dontShow = localStorage.getItem('dont_show_guide') === 'true';
        
        if (!hasVisited && !dontShow) {
            setTimeout(() => {
                this.showGuide();
                localStorage.setItem(this.storageKey, 'true');
            }, 1500);
        }
    }
    
    createGuideElement() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'first-visit-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        this.guide = document.createElement('div');
        this.guide.className = 'first-visit-guide';
        this.guide.style.cssText = `
            position: relative;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            animation: slideUp 0.4s ease;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px;
            overflow-y: auto;
            max-height: 60vh;
        `;
        
        content.innerHTML = `
            <h3 style="margin-top: 0; color: #667eea;">网站功能增强指南</h3>
            <div style="line-height: 1.6;">
                <p><strong>📸 图片查看增强</strong></p>
                <ul>
                    <li>点击图片放大查看</li>
                    <li>支持鼠标滚轮缩放</li>
                    <li>放大后可拖拽查看细节</li>
                    <li>ESC键关闭灯箱</li>
                </ul>
                
                <p><strong>🧭 智能导航系统</strong></p>
                <ul>
                    <li>顶部阅读进度条</li>
                    <li>自动保存阅读位置</li>
                    <li>侧边栏自动高亮</li>
                    <li>返回顶部按钮</li>
                </ul>
                
                <p><strong>🌙 黑夜模式</strong></p>
                <ul>
                    <li>一键切换护眼模式</li>
                    <li>自动保存偏好设置</li>
                </ul>
                
                <p><strong>✨ 文本特效</strong></p>
                <ul>
                    <li>剧透内容隐藏</li>
                    <li>多彩文本样式</li>
                    <li>LaTeX数学公式</li>
                </ul>
            </div>
        `;
        
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        `;
        
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 20px;">欢迎使用</h2>
                <button class="guide-close-btn" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>
        `;
        
        const actions = document.createElement('div');
        actions.style.cssText = `
            padding: 15px 20px;
            background: #f8f9fa;
            border-top: 1px solid #eaeaea;
            text-align: right;
        `;
        
        actions.innerHTML = `
            <div style="float: left;">
                <input type="checkbox" id="dont-show-again">
                <label for="dont-show-again" style="font-size: 14px;">
                    下次不再显示
                </label>
            </div>
            <button class="guide-confirm-btn" style="
                padding: 8px 20px;
                background: #667eea;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
            ">知道了</button>
        `;
        
        this.guide.appendChild(header);
        this.guide.appendChild(content);
        this.guide.appendChild(actions);
        this.overlay.appendChild(this.guide);
        document.body.appendChild(this.overlay);
        
        this.bindEvents();
    }
    
    bindEvents() {
        const closeBtn = this.guide.querySelector('.guide-close-btn');
        const confirmBtn = this.guide.querySelector('.guide-confirm-btn');
        const dontShowCheckbox = this.guide.querySelector('#dont-show-again');
        
        const closeGuide = () => {
            if (dontShowCheckbox.checked) {
                localStorage.setItem('dont_show_guide', 'true');
            }
            
            this.overlay.style.animation = 'fadeOut 0.3s ease forwards';
            this.guide.style.animation = 'slideDown 0.3s ease forwards';
            
            setTimeout(() => {
                if (this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeGuide);
        confirmBtn.addEventListener('click', closeGuide);
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                closeGuide();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeGuide();
            }
        });
    }
    
    showGuide() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideDown { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(30px); } }
        `;
        document.head.appendChild(style);
        
        this.createGuideElement();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.firstVisitGuide = new FirstVisitGuide();
});