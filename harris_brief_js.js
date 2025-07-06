// The Harris Brief - Enhanced Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration object with improved defaults
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
        },
        storage: {
            theme: 'harris-brief-theme',
            searchHistory: 'harris-brief-search-history'
        }
    };
    
    // Enhanced utility functions
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
        },
        
        // Safe storage methods (fallback for environments without localStorage)
        safeStorage: {
            getItem: function(key) {
                try {
                    return localStorage?.getItem(key) || null;
                } catch (e) {
                    return null;
                }
            },
            setItem: function(key, value) {
                try {
                    localStorage?.setItem(key, value);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            removeItem: function(key) {
                try {
                    localStorage?.removeItem(key);
                    return true;
                } catch (e) {
                    return false;
                }
            }
        },
        
        // Animation frame utilities
        requestAnimationFrame: function(callback) {
            return window.requestAnimationFrame || 
                   window.webkitRequestAnimationFrame || 
                   window.mozRequestAnimationFrame || 
                   function(callback) { setTimeout(callback, 1000/60); };
        },
        
        // Intersection Observer with fallback
        createObserver: function(callback, options) {
            if ('IntersectionObserver' in window) {
                return new IntersectionObserver(callback, options);
            } else {
                // Fallback for older browsers
                return {
                    observe: function(element) {
                        const checkVisibility = () => {
                            if (utils.isElementInViewport(element)) {
                                callback([{ target: element, isIntersecting: true }]);
                            }
                        };
                        window.addEventListener('scroll', utils.throttle(checkVisibility, 100));
                        checkVisibility();
                    },
                    disconnect: function() {}
                };
            }
        }
    };
    
    // Enhanced smooth scrolling with better performance
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
                    
                    // Use smooth scrolling with better browser support
                    if ('scrollBehavior' in document.documentElement.style) {
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    } else {
                        // Fallback smooth scroll for older browsers
                        const start = window.pageYOffset;
                        const distance = offsetTop - start;
                        const duration = 800;
                        let startTime = null;
                        
                        function animation(currentTime) {
                            if (startTime === null) startTime = currentTime;
                            const timeElapsed = currentTime - startTime;
                            const progress = Math.min(timeElapsed / duration, 1);
                            
                            window.scrollTo(0, start + (distance * easeInOutQuad(progress)));
                            
                            if (timeElapsed < duration) {
                                requestAnimationFrame(animation);
                            }
                        }
                        
                        function easeInOutQuad(t) {
                            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                        }
                        
                        requestAnimationFrame(animation);
                    }
                    
                    // Update URL without triggering scroll
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }
    
    // Enhanced country tag filtering with better state management
    function initCountryTagFiltering() {
        const countryTags = document.querySelectorAll('.country-tag');
        const contentItems = document.querySelectorAll('.content-item[data-country]');
        let activeFilter = null;
        
        function updateItemVisibility(item, shouldShow, delay = 0) {
            setTimeout(() => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                if (shouldShow) {
                    item.style.display = 'block';
                    // Force reflow
                    item.offsetHeight;
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
            }, delay);
        }
        
        function showAllItems() {
            contentItems.forEach((item, index) => {
                updateItemVisibility(item, true, index * 50);
            });
        }
        
        function filterItems(filter) {
            contentItems.forEach((item, index) => {
                const itemCountry = item.getAttribute('data-country');
                const shouldShow = itemCountry === filter;
                updateItemVisibility(item, shouldShow, index * 30);
            });
        }
        
        countryTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.getAttribute('data-filter');
                
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    this.setAttribute('aria-pressed', 'false');
                    activeFilter = null;
                    showAllItems();
                } else {
                    countryTags.forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-pressed', 'false');
                    });
                    this.classList.add('active');
                    this.setAttribute('aria-pressed', 'true');
                    activeFilter = filter;
                    filterItems(filter);
                }
            });
            
            // Enhanced hover effects
            tag.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transition = 'transform 0.2s ease';
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
        
        const sectionObserver = utils.createObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        const itemObserver = utils.createObserver(function(entries) {
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
            let isPressed = false;
            
            // Mouse events
            item.addEventListener('mouseenter', function() {
                if (!isHovered) {
                    isHovered = true;
                    this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
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
            
            // Touch events for mobile
            item.addEventListener('touchstart', function() {
                isPressed = true;
                this.style.transform = 'translateY(-6px) scale(0.98)';
            });
            
            item.addEventListener('touchend', function() {
                isPressed = false;
                if (isHovered) {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                } else {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            // Click animation
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
            body.style.transition = 'background 0.5s ease';
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
    
    // Enhanced search feature with search history
    function initSearchFeature() {
        const searchContainer = utils.createElement('div', 'search-container');
        const searchInput = utils.createElement('input', 'search-input');
        const searchResults = utils.createElement('div', 'search-results');
        const clearButton = utils.createElement('button', 'search-clear', '×');
        const searchHistory = utils.createElement('div', 'search-history');
        
        searchInput.type = 'text';
        searchInput.placeholder = 'Search content...';
        searchInput.setAttribute('aria-label', 'Search content');
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearButton);
        searchContainer.appendChild(searchResults);
        searchContainer.appendChild(searchHistory);
        
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(searchContainer);
        }
        
        // Load search history
        function loadSearchHistory() {
            const history = utils.safeStorage.getItem(config.storage.searchHistory);
            return history ? JSON.parse(history) : [];
        }
        
        function saveSearchHistory(term) {
            if (term.trim().length < 2) return;
            
            let history = loadSearchHistory();
            history = history.filter(item => item !== term);
            history.unshift(term);
            history = history.slice(0, 5); // Keep only last 5 searches
            
            utils.safeStorage.setItem(config.storage.searchHistory, JSON.stringify(history));
        }
        
        function showSearchHistory() {
            const history = loadSearchHistory();
            if (history.length === 0) {
                searchHistory.style.display = 'none';
                return;
            }
            
            searchHistory.innerHTML = '<div class="search-history-title">Recent searches:</div>';
            history.forEach(term => {
                const historyItem = utils.createElement('div', 'search-history-item', term);
                historyItem.addEventListener('click', function() {
                    searchInput.value = term;
                    performSearch(term);
                    searchHistory.style.display = 'none';
                });
                searchHistory.appendChild(historyItem);
            });
            
            searchHistory.style.display = 'block';
        }
        
        const performSearch = utils.debounce(function(searchTerm) {
            const contentItems = document.querySelectorAll('.content-item');
            const results = [];
            
            if (searchTerm.trim().length === 0) {
                contentItems.forEach(item => {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                });
                searchResults.textContent = '';
                return;
            }
            
            contentItems.forEach(item => {
                const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
                const content = item.querySelector('p')?.textContent.toLowerCase() || '';
                const searchLower = searchTerm.toLowerCase();
                
                const titleMatch = title.includes(searchLower);
                const contentMatch = content.includes(searchLower);
                const relevance = titleMatch ? 2 : contentMatch ? 1 : 0;
                
                if (relevance > 0) {
                    results.push({ item, relevance });
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    
                    // Highlight search terms
                    const titleEl = item.querySelector('h3');
                    const contentEl = item.querySelector('p');
                    
                    if (titleEl && titleMatch) {
                        titleEl.innerHTML = titleEl.textContent.replace(
                            new RegExp(`(${searchTerm})`, 'gi'),
                            '<mark>$1</mark>'
                        );
                    }
                    if (contentEl && contentMatch) {
                        contentEl.innerHTML = contentEl.textContent.replace(
                            new RegExp(`(${searchTerm})`, 'gi'),
                            '<mark>$1</mark>'
                        );
                    }
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
            
            // Sort results by relevance
            results.sort((a, b) => b.relevance - a.relevance);
            
            const resultCount = results.length;
            searchResults.textContent = `${resultCount} result${resultCount !== 1 ? 's' : ''}`;
            
            if (searchTerm.trim().length > 1) {
                saveSearchHistory(searchTerm);
            }
        }, 300);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            performSearch(searchTerm);
            clearButton.style.display = searchTerm ? 'block' : 'none';
            searchHistory.style.display = 'none';
        });
        
        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length === 0) {
                showSearchHistory();
            }
        });
        
        searchInput.addEventListener('blur', function() {
            // Delay hiding to allow clicks on history items
            setTimeout(() => {
                searchHistory.style.display = 'none';
            }, 200);
        });
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
            this.style.display = 'none';
            searchInput.focus();
            
            // Remove highlights
            const highlights = document.querySelectorAll('mark');
            highlights.forEach(mark => {
                mark.outerHTML = mark.textContent;
            });
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
            
            // Clear filters and search (Escape)
            if (e.key === 'Escape') {
                const searchInput = document.querySelector('.search-input');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                    return;
                }
                
                const activeTag = document.querySelector('.country-tag.active');
                if (activeTag) {
                    activeTag.click();
                    return;
                }
                
                if (searchVisible) {
                    const searchContainer = document.querySelector('.search-container');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                        searchVisible = false;
                    }
                }
            }
            
            // Section navigation (Alt + Arrow keys)
            if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                const sections = document.querySelectorAll('.section');
                let currentIndex = -1;
                
                sections.forEach((section, index) => {
                    if (utils.isElementInViewport(section)) {
                        currentIndex = index;
                    }
                });
                
                if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                    sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    // Enhanced loading animation with better performance
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
    
    // Enhanced read more/less functionality
    function initReadMoreLess() {
        const readMoreButtons = document.querySelectorAll('.read-more');
        const readLessButtons = document.querySelectorAll('.read-less');
        
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const contentItem = this.closest('.content-item');
                const fullArticle = contentItem.querySelector('.full-article');
                const preview = contentItem.querySelector('.article-preview');
                
                if (preview && fullArticle) {
                    preview.style.display = 'none';
                    fullArticle.style.display = 'block';
                    fullArticle.classList.add('fade-in');
                    
                    // Smooth scroll to full article
                    setTimeout(() => {
                        fullArticle.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }, 100);
                }
            });
        });
        
        readLessButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const contentItem = this.closest('.content-item');
                const fullArticle = contentItem.querySelector('.full-article');
                const preview = contentItem.querySelector('.article-preview');
                
                if (preview && fullArticle) {
                    fullArticle.style.display = 'none';
                    preview.style.display = 'block';
                    
                    // Smooth scroll back to top of article
                    setTimeout(() => {
                        contentItem.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }, 100);
                }
            });
        });
    }
    
    // Progressive enhancement for modern browsers
    function initProgressiveEnhancement() {
        const supportsIntersectionObserver = 'IntersectionObserver' in window;
        const supportsCustomProperties = CSS.supports('--custom-property', 'value');
        const supportsGrid = CSS.supports('display', 'grid');
        
        if (supportsIntersectionObserver) {
            document.body.classList.add('supports-intersection-observer');
        }
        
        if (supportsCustomProperties) {
            document.body.classList.add('supports-custom-properties');
        }
        
        if (supportsGrid) {
            document.body.classList.add('supports-grid');
        }
        
        // Reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.body.classList.add('prefers-reduced-motion');
            config.animations.duration = 0;
            config.animations.stagger = 0;
        }
    }
    
    // Enhanced theme toggle with better persistence
    function initThemeToggle() {
        const savedTheme = utils.safeStorage.getItem(config.storage.theme);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        const themeToggle = utils.createElement('button', 'theme-toggle', shouldUseDark ? '☀️' : '🌙');
        
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
            transform: scale(1);
        `;
        
        document.body.appendChild(themeToggle);
        
        // Initialize theme
        if (shouldUseDark) {
            document.body.classList.add('dark-theme');
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            this.textContent = isDark ? '☀️' : '🌙';
            
            // Save preference
            utils.safeStorage.setItem(config.storage.theme, isDark ? 'dark' : 'light');
            
            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            const savedTheme = utils.safeStorage.getItem(config.storage.theme);
            if (!savedTheme) {
                document.body.classList.toggle('dark-theme', e.matches);
                themeToggle.textContent = e.matches ? '☀️' : '🌙';
            }
        });
    }
    
    // Enhanced error handling
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
            // Could integrate with error reporting service here
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
            e.preventDefault(); // Prevent default browser behavior
        });
    }
    
    // Enhanced accessibility
    function initAccessibility() {
        // Add focus indicators
        const focusableElements = document.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('keyboard-focus');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('keyboard-focus');
            });
        });
        
        // Enhance country tags with better ARIA
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
        
        // Add skip links for better navigation
        const skipLink = utils.createElement('a', 'skip-link', 'Skip to main content');
        skipLink.href = '#main-content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Performance monitoring
    function initPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('The Harris Brief Performance Metrics:', {
                        loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                        totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
                    });
                }
            });
        }
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
                ${data.readMore ? `
                    <div class="article-preview">
                        <button class="read-more">Read More</button>
                    </div>
                    <div class="full-article" style="display: none;">
                        <div class="article-content">${data.fullContent || data.description}</div>
                        <button class="read-less">Read Less</button>
                    </div>
                ` : ''}
            `;
            
            contentGrid.appendChild(contentItem);
            
            // Re-initialize effects for new content
            initContentItemEffects();
            initReadMoreLess();
            
            return true;
        },
        
        removePlaceholders: function() {
            const placeholders = document.querySelectorAll('.content-placeholder, .subsection-placeholder');
            placeholders.forEach(placeholder => {
                placeholder.style.opacity = '0';
                placeholder.style.transform = 'translateY(-20px)';
                setTimeout(() => placeholder.remove(), 300);
            });
        },
        
        filterByCountry: function(country) {
            const countryTag = document.querySelector(`[data-filter="${country}"]`);
            if (countryTag) {
                countryTag.click();
                return true;
            }
            return false;
        },
        
        search: function(term) {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = term;
                searchInput.dispatchEvent(new Event('input'));
                return true;
            }
            return false;
        },
        
        clearSearch: function() {
            const clearButton = document.querySelector('.search-clear');
            if (clearButton && clearButton.style.display !== 'none') {
                clearButton.click();
                return true;
            }
            return false;
        },
        
        toggleTheme: function() {
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.click();
                return true;
            }
            return false;
        },
        
        scrollToSection: function(sectionId) {
            const section = document.querySelector(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                return true;
            }
            return false;
        },
        
        getActiveFilter: function() {
            const activeTag = document.querySelector('.country-tag.active');
            return activeTag ? activeTag.getAttribute('data-filter') : null;
        },
        
        getSearchTerm: function() {
            const searchInput = document.querySelector('.search-input');
            return searchInput ? searchInput.value.trim() : '';
        },
        
        updateContent: function(selector, content) {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = content;
                return true;
            }
            return false;
        },
        
        addNotification: function(message, type = 'info', duration = 5000) {
            const notification = utils.createElement('div', `notification notification-${type}`);
            notification.innerHTML = `
                <div class="notification-content">${message}</div>
                <button class="notification-close">×</button>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
                word-wrap: break-word;
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Close button
            const closeButton = notification.querySelector('.notification-close');
            closeButton.addEventListener('click', function() {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            });
            
            // Auto-remove
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => notification.remove(), 300);
                    }
                }, duration);
            }
            
            return notification;
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
            initReadMoreLess();
            initThemeToggle();
            initAccessibility();
            initPerformanceMonitoring();
            
            // Add initialization complete event
            document.dispatchEvent(new CustomEvent('harrisBriefReady', {
                detail: { timestamp: Date.now() }
            }));
            
            console.log('The Harris Brief - Enhanced features initialized successfully');
            
            // Show welcome notification
            setTimeout(() => {
                window.HarrisBrief.addNotification('Welcome to The Harris Brief! Use Ctrl+K to search.', 'info', 3000);
            }, 1000);
            
        } catch (error) {
            console.error('Error initializing Harris Brief features:', error);
            // Fallback initialization for critical features
            try {
                initSmoothScrolling();
                initCountryTagFiltering();
                initReadMoreLess();
                console.log('Harris Brief - Fallback initialization completed');
            } catch (fallbackError) {
                console.error('Fallback initialization failed:', fallbackError);
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Harris Brief - Page hidden, pausing animations');
            // Could pause expensive animations here
        } else {
            console.log('Harris Brief - Page visible, resuming animations');
            // Could resume animations here
        }
    });
    
    // Handle resize events
    window.addEventListener('resize', utils.debounce(function() {
        // Recalculate layouts if needed
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && window.innerWidth < 768) {
            searchContainer.style.display = 'none';
        }
    }, 250));
    
    // Handle connection changes
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', function() {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.body.classList.add('slow-connection');
                config.animations.duration = 0;
                config.animations.stagger = 0;
            } else {
                document.body.classList.remove('slow-connection');
            }
        });
    }
    
});