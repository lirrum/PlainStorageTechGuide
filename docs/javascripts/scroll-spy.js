document.addEventListener('DOMContentLoaded', function() {
  const navContainer = document.querySelector('.md-sidebar__scrollwrap');
  const navLinks = document.querySelectorAll('.md-nav__link');
  const contentSections = [];
  
  document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach((section) => {
    contentSections.push({
      id: section.id,
      element: section,
      top: section.offsetTop
    });
  });
  
  let activeNavItem = null;
  
  function throttle(func, limit) {
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
  
  function updateActiveNav() {
    if (contentSections.length === 0) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    let currentSection = null;
    
    for (let i = contentSections.length - 1; i >= 0; i--) {
      const section = contentSections[i];
      if (scrollTop + (windowHeight * 0.15) >= section.top) {
        currentSection = section;
        break;
      }
    }
    
    if (!currentSection && contentSections.length > 0) {
      currentSection = contentSections[0];
    }
    
    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove('md-nav__link--active');
        link.classList.remove('PSTG-nav-active');
      });
      
      const targetLink = document.querySelector(`.md-nav__link[href="#${currentSection.id}"]`);
      if (targetLink) {
        targetLink.classList.add('md-nav__link--active');
        targetLink.classList.add('PSTG-nav-active');
        
        scrollNavToActive(targetLink);
      }
    }
  }
  
  function scrollNavToActive(activeLink) {
    if (!navContainer || !activeLink) return;
    
    const navRect = activeLink.getBoundingClientRect();
    const containerRect = navContainer.getBoundingClientRect();
    
    const targetScrollTop = activeLink.offsetTop - (containerRect.height / 2) + (navRect.height / 2);
    
    navContainer.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    
    activeNavItem = activeLink;
  }
  
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

    .md-nav__item {
      margin: 0.05rem 0 !important; 
    }
    
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
  
  window.addEventListener('scroll', throttle(updateActiveNav, 100));
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        navLinks.forEach(l => {
          l.classList.remove('md-nav__link--active');
          l.classList.remove('PSTG-nav-active');
        });
        this.classList.add('md-nav__link--active');
        this.classList.add('PSTG-nav-active');
        
        scrollNavToActive(this);
      }
    });
  });
  
  setTimeout(updateActiveNav, 100);
});