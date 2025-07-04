// The Harris Brief - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for internal links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Country tag filtering functionality
    function initCountryTagFiltering() {
        const countryTags = document.querySelectorAll('.country-tag');
        const contentItems = document.querySelectorAll('.content-item[data-country]');
        
        countryTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Toggle active state
                if (this.classList.contains('active')) {
                    // Remove filter - show all items
                    this.classList.remove('active');
                    contentItems.forEach(item => {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                    });
                } else {
                    // Remove active class from all tags
                    countryTags.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tag
                    this.classList.add('active');
                    
                    // Filter content items
                    contentItems.forEach(item => {
                        const itemCountry = item.getAttribute('data-country');
                        if (itemCountry === filter) {
                            item.style.display = 'block';
                            item.style.opacity = '1';
                        } else {
                            item.style.display = 'none';
                            item.style.opacity = '0';
                        }
                    });
                }
            });
        });
    }
    
    // Animate sections on scroll
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }
    
    // Enhanced hover effects for content items
    function initContentItemEffects() {
        const contentItems = document.querySelectorAll('.content-item');
        
        contentItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-3px) scale(1)';
            });
        });
    }
    
    // Dynamic background color changes
    function initDynamicBackgrounds() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            section.addEventListener('mouseenter', function() {
                if (this.classList.contains('south-asia')) {
                    document.body.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                } else if (this.classList.contains('us-policy')) {
                    document.body.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
                } else if (this.classList.contains('off-record')) {
                    document.body.style.background = 'linear-gradient(135deg, #8e44ad 0%, #732d91 100%)';
                } else if (this.classList.contains('blog')) {
                    document.body.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
                }
            });
            
            section.addEventListener('mouseleave', function() {
                document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            });
        });
    }
    
    // Search functionality (for future implementation)
    function initSearchFeature() {
        // Create search input (hidden by default, can be activated later)
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search content...';
        searchInput.className = 'search-input';
        searchInput.style.display = 'none';
        
        // Add to header
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(searchInput);
        }
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const contentItems = document.querySelectorAll('.content-item');
            
            contentItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const content = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
        });
    }
    
    // Keyboard navigation
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Press 'S' to toggle search (for future use)
            if (e.key === 's' || e.key === 'S') {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    if (searchInput.style.display === 'none') {
                        searchInput.style.display = 'block';
                        searchInput.focus();
                    } else {
                        searchInput.style.display = 'none';
                        searchInput.value = '';
                        // Reset all content visibility
                        const contentItems = document.querySelectorAll('.content-item');
                        contentItems.forEach(item => {
                            item.style.display = 'block';
                            item.style.opacity = '1';
                        });
                    }
                }
            }
            
            // Press 'Escape' to clear filters
            if (e.key === 'Escape') {
                const activeTag = document.querySelector('.country-tag.active');
                if (activeTag) {
                    activeTag.classList.remove('active');
                    const contentItems = document.querySelectorAll('.content-item');
                    contentItems.forEach(item => {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                    });
                }
            }
        });
    }
    
    // Loading animation
    function initLoadingAnimation() {
        const contentItems = document.querySelectorAll('.content-item');
        
        contentItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Utility function to add content dynamically
    function addContentItem(section, type, data) {
        const contentGrid = document.querySelector(`${section} .${type} .content-grid`);
        if (!contentGrid) return;
        
        const contentItem = document.createElement('div');
        contentItem.className = 'content-item';
        if (data.country) {
            contentItem.setAttribute('data-country', data.country);
        }
        
        contentItem.innerHTML = `
            <div class="date">${data.date || 'Recently'}</div>
            <h3>${data.title}</h3>
            <p>${data.description}</p>
        `;
        
        contentGrid.appendChild(contentItem);
        
        // Re-initialize effects for new item
        initContentItemEffects();
    }
    
    // Utility function to remove placeholder content
    function removePlaceholders() {
        const placeholders = document.querySelectorAll('.content-placeholder, .subsection-placeholder');
        placeholders.forEach(placeholder => {
            placeholder.remove();
        });
    }
    
    // Theme toggle (for future dark mode implementation)
    function initThemeToggle() {
        // Create theme toggle button (hidden by default)
        const themeToggle = document.createElement('button');
        themeToggle.textContent = '🌙';
        themeToggle.className = 'theme-toggle';
        themeToggle.style.display = 'none';
        themeToggle.style.position = 'fixed';
        themeToggle.style.top = '20px';
        themeToggle.style.right = '20px';
        themeToggle.style.zIndex = '1000';
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            this.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        });
    }
    
    // Analytics tracking (placeholder for future implementation)
    function trackPageView() {
        // Placeholder for Google Analytics or other tracking
        console.log('Page viewed:', window.location.pathname);
    }
    
    // Initialize all features
    function init() {
        initSmoothScrolling();
        initCountryTagFiltering();
        initScrollAnimations();
        initContentItemEffects();
        initDynamicBackgrounds();
        initSearchFeature();
        initKeyboardNavigation();
        initLoadingAnimation();
        initThemeToggle();
        trackPageView();
        
        console.log('The Harris Brief - Interactive features initialized');
    }
    
    // Public API for adding content programmatically
    window.HarrisBrief = {
        addContent: addContentItem,
        removePlaceholders: removePlaceholders
    };
    
    // Initialize everything
    init();
});