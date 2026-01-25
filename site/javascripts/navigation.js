class ScrollSpy {
    constructor() {
        this.navContainer = document.querySelector('.md-sidebar__scrollwrap');
        this.navLinks = document.querySelectorAll('.md-nav__link');
        this.contentSections = [];
        this.activeNavItem = null;
        this.init();
    }
    
    init() {
        this.collectSections();
        this.setupStyles();
        this.bindEvents();
        this.updateActiveNav();
    }
    
    collectSections() {
        document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach((section) => {
            this.contentSections.push({
                id: section.id,
                element: section,
                top: section.offsetTop
            });
        });
    }
    
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .PSTG-nav-active {
                background: linear-gradient(90deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%) !important;
                border-left: 4px solid #3498db !important;
                color: #3498db !important;
                font-weight: bold !important;
                padding-left: calc(1rem - 4px) !important;
                transition: all 0.3s ease !important;
            }
            .PSTG-nav-active:hover {
                background: linear-gradient(90deg, rgba(52, 152, 219, 0.15) 0%, rgba(52, 152, 219, 0.08) 100%) !important;
            }
            .md-nav__item { margin: 0.05rem 0 !important; }
            .md-nav__link {
                border-radius: 4px !important;
                padding: 0.2rem 0.5rem !important;
                margin: 0.05rem 0.3rem !important;
                line-height: 1.2 !important;
                transition: all 0.2s ease !important;
            }
            .md-nav__link:hover {
                background-color: rgba(0, 0, 0, 0.05) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => this.updateActiveNav(), 100));
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.navLinks.forEach(l => {
                        l.classList.remove('md-nav__link--active', 'PSTG-nav-active');
                    });
                    link.classList.add('md-nav__link--active', 'PSTG-nav-active');
                    this.scrollNavToActive(link);
                }
            });
        });
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    updateActiveNav() {
        if (this.contentSections.length === 0) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        let currentSection = null;
        
        for (let i = this.contentSections.length - 1; i >= 0; i--) {
            const section = this.contentSections[i];
            if (scrollTop + (windowHeight * 0.15) >= section.top) {
                currentSection = section;
                break;
            }
        }
        
        if (!currentSection && this.contentSections.length > 0) {
            currentSection = this.contentSections[0];
        }
        
        if (currentSection) {
            this.navLinks.forEach(link => {
                link.classList.remove('md-nav__link--active', 'PSTG-nav-active');
            });
            
            const targetLink = document.querySelector(`.md-nav__link[href="#${currentSection.id}"]`);
            if (targetLink) {
                targetLink.classList.add('md-nav__link--active', 'PSTG-nav-active');
                this.scrollNavToActive(targetLink);
            }
        }
    }
    
    scrollNavToActive(activeLink) {
        if (!this.navContainer || !activeLink) return;
        
        const navRect = activeLink.getBoundingClientRect();
        const containerRect = this.navContainer.getBoundingClientRect();
        const targetScrollTop = activeLink.offsetTop - (containerRect.height / 2) + (navRect.height / 2);
        
        this.navContainer.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
        
        this.activeNavItem = activeLink;
    }
}

class ChapterNavigation {
    constructor() {
        this.pageOrder = this.detectPageOrder();
        this.currentPage = this.getCurrentPage();
        this.init();
    }
    
    init() {
        if (this.shouldShowNavigation()) {
            this.createNavigation();
            this.bindEvents();
        }
    }
    
    detectPageOrder() {
        const order = [];
        const navItems = document.querySelectorAll('.md-nav__item');
        
        navItems.forEach(item => {
            const link = item.querySelector('.md-nav__link');
            if (link) {
                const href = link.getAttribute('href');
                const title = link.textContent.trim();
                
                if (href && !href.startsWith('#') && !href.includes('extra_function')) {
                    let path = href;
                    if (path === '..') path = '';
                    else if (path.startsWith('../')) path = path.replace('../', '');
                    else if (path.startsWith('./')) path = path.replace('./', '');
                    
                    if (path && !path.includes('extra_function')) {
                        path = path.replace(/\/$/, '');
                        order.push({
                            path: path,
                            title: title,
                            element: link
                        });
                    }
                }
            }
        });
        
        return order;
    }
    
    getCurrentPage() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('extra_function')) return null;
        
        const pathParts = currentPath.split('/').filter(part => part);
        const currentPagePath = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';
        
        for (let i = 0; i < this.pageOrder.length; i++) {
            const page = this.pageOrder[i];
            if (page.path === currentPagePath) {
                const actualTitle = this.getActualTitle();
                return {
                    index: i,
                    path: page.path,
                    title: actualTitle || page.title || '当前页面',
                    actualTitle: actualTitle
                };
            }
        }
        
        const actualTitle = this.getActualTitle();
        return {
            index: -1,
            path: currentPagePath,
            title: actualTitle || document.title.split(' - ')[0] || '当前页面',
            actualTitle: actualTitle
        };
    }
    
    getActualTitle() {
        const mainContent = document.querySelector('.md-content') || 
                           document.querySelector('.md-typeset') || 
                           document.querySelector('main') ||
                           document.querySelector('article');
        
        if (!mainContent) return null;
        
        const h1 = mainContent.querySelector('h1');
        if (h1 && h1.textContent && h1.textContent.trim()) {
            let title = h1.textContent.trim();
            title = title.replace(/¶$/, '').trim();
            return title;
        }
        
        const h2 = mainContent.querySelector('h2');
        if (h2 && h2.textContent && h2.textContent.trim()) {
            let title = h2.textContent.trim();
            title = title.replace(/¶$/, '').trim();
            return title;
        }
        
        return null;
    }
    
    shouldShowNavigation() {
        if (!this.currentPage) return false;
        const currentPath = window.location.pathname;
        if (currentPath.includes('extra_function')) return false;
        return true;
    }
    
    getAdjacentPages() {
        if (this.currentPage.index === -1) {
            const files = [
                {path: '', title: '首页'},
                {path: '01-contents', title: '目录'},
                {path: '02-preface', title: '引言'},
                {path: '03-chapter-00', title: '第0章:初识储电'},
                {path: '04-chapter-01', title: '第1章:物流基础'},
                {path: '05-chapter-02', title: '第2章:分类基础'},
                {path: '06-chapter-03', title: '第3章:打包基础'},
                {path: '07-chapter-04', title: '第4章:盒子的分类和储存'},
                {path: '08-chapter-05', title: '第5章:不可堆叠处理'},
                {path: '09-chapter-06', title: '第6章:全物品与自适应基础'},
                {path: '10-chapter-07', title: '第7章:矿车流初步'},
                {path: '11-chapter-08', title: '第8章:盒子流初步'},
                {path: '12-chapter-09', title: '第9章:现代大宗处理'},
                {path: '13-chapter-10', title: '第10章:非全物品储电'},
                {path: '14-chapter-11', title: '第11章:编码初步'},
                {path: '15-chapter-12', title: '第12章:编码进阶'},
                {path: '16-chapter-13', title: '第13章:现代全物品'},
                {path: '17-chapter-14', title: '第14章:展望未来'}
            ];
            
            let currentIndex = -1;
            for (let i = 0; i < files.length; i++) {
                if (files[i].path === this.currentPage.path) {
                    currentIndex = i;
                    break;
                }
            }
            
            if (currentIndex !== -1) {
                this.currentPage.index = currentIndex;
                return {
                    prev: currentIndex > 0 ? files[currentIndex - 1] : null,
                    next: currentIndex < files.length - 1 ? files[currentIndex + 1] : null
                };
            }
            
            return { prev: null, next: null };
        }
        
        return {
            prev: this.currentPage.index > 0 ? this.pageOrder[this.currentPage.index - 1] : null,
            next: this.currentPage.index < this.pageOrder.length - 1 ? this.pageOrder[this.currentPage.index + 1] : null
        };
    }
    
    createNavigation() {
        const adjacent = this.getAdjacentPages();
        const navContainer = document.createElement('div');
        navContainer.className = 'chapter-navigation';
        
        if (adjacent.prev) {
            const prevBtn = this.createNavigationButton(
                adjacent.prev,
                'prev',
                '← 上一章',
                adjacent.prev.title
            );
            navContainer.appendChild(prevBtn);
        } else {
            const spacer = document.createElement('div');
            spacer.style.width = '200px';
            navContainer.appendChild(spacer);
        }
        
        const currentTitle = document.createElement('div');
        currentTitle.className = 'chapter-current-title';
        currentTitle.innerHTML = `
            <div class="subtitle">当前页面</div>
            <div class="title">${this.currentPage.title}</div>
        `;
        navContainer.appendChild(currentTitle);
        
        if (adjacent.next) {
            const nextBtn = this.createNavigationButton(
                adjacent.next,
                'next',
                '下一章 →',
                adjacent.next.title
            );
            navContainer.appendChild(nextBtn);
        } else {
            const spacer = document.createElement('div');
            spacer.style.width = '200px';
            navContainer.appendChild(spacer);
        }
        
        const contentContainer = document.querySelector('.md-content');
        if (contentContainer) {
            const existingNav = contentContainer.querySelector('.chapter-navigation');
            if (!existingNav) {
                contentContainer.appendChild(navContainer);
            }
        }
    }
    
    createNavigationButton(page, type, text, chapterTitle) {
        const button = document.createElement('a');
        button.className = `chapter-nav-btn chapter-nav-${type}`;
        let href = '/';
        if (page.path) href = '/' + page.path + '/';
        button.href = href;
        button.innerHTML = `
            <div class="nav-direction">${text}</div>
            <div class="nav-chapter-title">${chapterTitle}</div>
        `;
        return button;
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            
            const adjacent = this.getAdjacentPages();
            
            if (e.key === 'ArrowLeft' && adjacent.prev && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const href = adjacent.prev.path ? '/' + adjacent.prev.path + '/' : '/';
                window.location.href = href;
            }
            
            if (e.key === 'ArrowRight' && adjacent.next && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                const href = adjacent.next.path ? '/' + adjacent.next.path + '/' : '/';
                window.location.href = href;
            }
        });
    }
}