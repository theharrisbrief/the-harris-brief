// The Harris Brief - Enhanced Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration object
    const config = {
        animations: {
            duration: 600,
            easing: 'ease-out',
            stagger: 100
        },
        colors: {
            southAsia: { from: '#e74c3c', to: '#c0392b' },
            usPolicy: { from: '#27ae60', to: '#229954' },
            offRecord: { from: '#8e44ad', to: '#732d91' },
            blog: { from: '#f39c12', to: '#e67e22' },
            default: { from: '#667eea', to: '#764ba2' }
        }
    };
    
    // Utility functions
    const utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle: function(func, limit) {
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
        },
        
        isElementInViewport: function(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        createElement: function(tag, className, content) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (content) element.innerHTML = content;
            return element;
        }
    };
    
    // Enhanced smooth scrolling with offset calculation
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const offsetTop = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    // Enhanced country tag filtering with animations
    function initCountryTagFiltering() {
        const countryTags = document.querySelectorAll('.country-tag');
        const contentItems = document.querySelectorAll('.content-item[data-country]');
        let activeFilter = null;
        
        function showAllItems() {
            contentItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, index * 50);
            });
        }
        
        function filterItems(filter) {
            contentItems.forEach((item, index) => {
                const itemCountry = item.getAttribute('data-country');
                const shouldShow = itemCountry === filter;
                
                setTimeout(() => {
                    if (shouldShow) {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(-10px) scale(0.95)';
                        setTimeout(() => {
                            if (item.style.opacity === '0') {
                                item.style.display = 'none';
                            }
                        }, 300);
                    }
                }, index * 30);
            });
        }
        
        countryTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                if (this.classList.contains('active')) {
                    // Remove filter
                    this.classList.remove('active');
                    activeFilter = null;
                    showAllItems();
                } else {
                    // Apply filter
                    countryTags.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    activeFilter = filter;
                    filterItems(filter);
                }
            });
            
            // Add hover effects
            tag.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(-2px) scale(1.05)';
                }
            });
            
            tag.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    }
    
    // Enhanced scroll animations with better performance
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        const contentItems = document.querySelectorAll('.content-item');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        const itemObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.2 });
        
        sections.forEach(section => {
            section.classList.add('animate-ready');
            sectionObserver.observe(section);
        });
        
        contentItems.forEach(item => {
            item.classList.add('fade-ready');
            itemObserver.observe(item);
        });
    }
    
    // Enhanced content item effects with better performance
    function initContentItemEffects() {
        const contentItems = document.querySelectorAll('.content-item');
        
        contentItems.forEach(item => {
            let isHovered = false;
            
            item.addEventListener('mouseenter', function() {
                if (!isHovered) {
                    isHovered = true;
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (isHovered) {
                    isHovered = false;
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }
            });
            
            // Add click animation
            item.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(-6px) scale(0.98)';
            });
            
            item.addEventListener('mouseup', function() {
                if (isHovered) {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                }
            });
        });
    }
    
    // Enhanced dynamic backgrounds with smoother transitions
    function initDynamicBackgrounds() {
        const sections = document.querySelectorAll('.section');
        const body = document.body;
        let currentTheme = null;
        
        function setBackground(colorConfig) {
            body.style.background = `linear-gradient(135deg, ${colorConfig.from} 0%, ${colorConfig.to} 100%)`;
        }
        
        sections.forEach(section => {
            section.addEventListener('mouseenter', utils.throttle(function() {
                const newTheme = this.classList.contains('south-asia') ? 'southAsia' :
                                 this.classList.contains('us-policy') ? 'usPolicy' :
                                 this.classList.contains('off-record') ? 'offRecord' :
                                 this.classList.contains('blog') ? 'blog' : null;
                
                if (newTheme && newTheme !== currentTheme) {
                    currentTheme = newTheme;
                    setBackground(config.colors[newTheme]);
                }
            }, 100));
            
            section.addEventListener('mouseleave', utils.throttle(function() {
                setTimeout(() => {
                    if (!document.querySelector('.section:hover')) {
                        currentTheme = null;
                        setBackground(config.colors.default);
                    }
                }, 200);
            }, 100));
        });
    }
    
    // Enhanced search feature with better UX
    function initSearchFeature() {
        const searchContainer = utils.createElement('div', 'search-container');
        const searchInput = utils.createElement('input', 'search-input');
        const searchResults = utils.createElement('div', 'search-results');
        const clearButton = utils.createElement('button', 'search-clear', '×');
        
        searchInput.type = 'text';
        searchInput.placeholder = 'Search content...';
        searchInput.setAttribute('aria-label', 'Search content');
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearButton);
        searchContainer.appendChild(searchResults);
        
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(searchContainer);
        }
        
        let searchTimeout;
        const performSearch = utils.debounce(function(searchTerm) {
            const contentItems = document.querySelectorAll('.content-item');
            const results = [];
            
            contentItems.forEach(item => {
                const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
                const content = item.querySelector('p')?.textContent.toLowerCase() || '';
                const relevance = title.includes(searchTerm) ? 2 : content.includes(searchTerm) ? 1 : 0;
                
                if (relevance > 0) {
                    results.push({ item, relevance });
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
            
            // Update results count
            const resultCount = results.length;
            searchResults.textContent = searchTerm ? `${resultCount} result${resultCount !== 1 ? 's' : ''}` : '';
        }, 300);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            performSearch(searchTerm);
            clearButton.style.display = searchTerm ? 'block' : 'none';
        });
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
            this.style.display = 'none';
            searchInput.focus();
        });
    }
    
    // Enhanced keyboard navigation
    function initKeyboardNavigation() {
        let searchVisible = false;
        
        document.addEventListener('keydown', function(e) {
            // Search toggle (Ctrl/Cmd + K)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchVisible = !searchVisible;
                    const searchContainer = searchInput.closest('.search-container');
                    searchContainer.style.display = searchVisible ? 'block' : 'none';
                    if (searchVisible) {
                        searchInput.focus();
                    }
                }
            }
            
            // Clear filters (Escape)
            if (e.key === 'Escape') {
                // Clear search
                const searchInput = document.querySelector('.search-input');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                    return;
                }
                
                // Clear country filter
                const activeTag = document.querySelector('.country-tag.active');
                if (activeTag) {
                    activeTag.click();
                }
                
                // Hide search
                if (searchVisible) {
                    const searchContainer = document.querySelector('.search-container');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                        searchVisible = false;
                    }
                }
            }
            
            // Navigation shortcuts
            if (e.altKey) {
                const sections = document.querySelectorAll('.section');
                const currentIndex = Array.from(sections).findIndex(section => 
                    utils.isElementInViewport(section)
                );
                
                if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                    e.preventDefault();
                    sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    // Enhanced loading animation with staggered effects
    function initLoadingAnimation() {
        const elementsToAnimate = document.querySelectorAll('.content-item, .section-header, .subsection-header');
        
        elementsToAnimate.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = `opacity ${config.animations.duration}ms ${config.animations.easing}, transform ${config.animations.duration}ms ${config.animations.easing}`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * config.animations.stagger);
        });
    }
    
    // Progressive enhancement for modern browsers
    function initProgressiveEnhancement() {
        // Check for modern browser features
        const supportsIntersectionObserver = 'IntersectionObserver' in window;
        const supportsCustomProperties = CSS.supports('--custom-property', 'value');
        
        if (supportsIntersectionObserver) {
            document.body.classList.add('supports-intersection-observer');
        }
        
        if (supportsCustomProperties) {
            document.body.classList.add('supports-custom-properties');
        }
        
        // Reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.body.classList.add('prefers-reduced-motion');
            config.animations.duration = 0;
            config.animations.stagger = 0;
        }
    }
    
    // Performance monitoring
    function initPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            });
        }
    }
    
    // Enhanced theme toggle with system preference detection
    function initThemeToggle() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const themeToggle = utils.createElement('button', 'theme-toggle', prefersDark ? '☀️' : '🌙');
        
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 20px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(themeToggle);
        
        // Initialize theme based on system preference
        if (prefersDark) {
            document.body.classList.add('dark-theme');
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            this.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
            
            // Save preference
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                document.body.classList.toggle('dark-theme', e.matches);
                themeToggle.textContent = e.matches ? '☀️' : '🌙';
            }
        });
    }
    
    // Enhanced error handling
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
            // You could send this to an error reporting service
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
            // Handle promise rejections
        });
    }
    
    // Accessibility improvements
    function initAccessibility() {
        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('keyboard-focus');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('keyboard-focus');
            });
        });
        
        // Add ARIA labels where needed
        const countryTags = document.querySelectorAll('.country-tag');
        countryTags.forEach(tag => {
            tag.setAttribute('role', 'button');
            tag.setAttribute('aria-pressed', 'false');
            tag.setAttribute('tabindex', '0');
            
            tag.addEventListener('click', function() {
                this.setAttribute('aria-pressed', this.classList.contains('active'));
            });
            
            tag.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Public API
    window.HarrisBrief = {
        config: config,
        utils: utils,
        
        addContent: function(section, type, data) {
            const contentGrid = document.querySelector(`${section} .${type} .content-grid`);
            if (!contentGrid) return false;
            
            const contentItem = utils.createElement('div', 'content-item');
            if (data.country) {
                contentItem.setAttribute('data-country', data.country);
            }
            
            contentItem.innerHTML = `
                <div class="date">${data.date || 'Recently'}</div>
                <h3>${data.title}</h3>
                <p>${data.description}</p>
            `;
            
            contentGrid.appendChild(contentItem);
            initContentItemEffects();
            return true;
        },
        
        removePlaceholders: function() {
            const placeholders = document.querySelectorAll('.content-placeholder, .subsection-placeholder');
            placeholders.forEach(placeholder => placeholder.remove());
        },
        
        filterByCountry: function(country) {
            const countryTag = document.querySelector(`[data-filter="${country}"]`);
            if (countryTag) {
                countryTag.click();
            }
        },
        
        search: function(term) {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = term;
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    };
    
    // Initialize everything
    function init() {
        try {
            initProgressiveEnhancement();
            initErrorHandling();
            initSmoothScrolling();
            initCountryTagFiltering();
            initScrollAnimations();
            initContentItemEffects();
            initDynamicBackgrounds();
            initSearchFeature();
            initKeyboardNavigation();
            initLoadingAnimation();
            initThemeToggle();
            initAccessibility();
            initPerformanceMonitoring();
            
            console.log('The Harris Brief - Enhanced features initialized successfully');
        } catch (error) {
            console.error('Error initializing Harris Brief features:', error);
        }
    }
    
    // Initialize
    init();
});