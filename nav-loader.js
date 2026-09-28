(function () {
    const NAVBAR_CACHE_KEY = 'cached_navbar_html_v1';
    let cachedHTML = sessionStorage.getItem(NAVBAR_CACHE_KEY);

    let fetchPromise = !cachedHTML ? fetch('navbar.html').then(r => r.ok ? r.text() : '').catch(() => '') : null;

    function initNavbarFunctionality() {
        
        // --- DIVISION CONTEXT LOGIC ---
        const path = window.location.pathname.toLowerCase();
        
        // Lists of words that identify which division a page belongs to
        const dairyKeywords = ['dairy', 'bakery', 'chocolate', 'ice-cream', 'fruit-fillings', 'retail-powders', 'flavored-powders'];
        const pharmaKeywords = ['dental', 'bona-aid', 'restorative', 'endodontics', 'orthodontics', 'implant', 'prosthetics', 'perio-surgery'];
        
        // If user is on the main Gateway Index, reset the memory. Otherwise, record which division they enter.
        if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
            sessionStorage.removeItem('active_division');
        } else if (dairyKeywords.some(keyword => path.includes(keyword))) {
            sessionStorage.setItem('active_division', 'dairy');
        } else if (pharmaKeywords.some(keyword => path.includes(keyword))) {
            sessionStorage.setItem('active_division', 'pharma');
        }

        const activeDivision = sessionStorage.getItem('active_division');
        
        // Hide the irrelevant menu items using CSS !important to ensure it overrides Tailwind
        if (activeDivision === 'dairy') {
            document.querySelectorAll('.nav-pharma-item').forEach(el => el.style.setProperty('display', 'none', 'important'));
        } else if (activeDivision === 'pharma') {
            document.querySelectorAll('.nav-dairy-item').forEach(el => el.style.setProperty('display', 'none', 'important'));
        }
        // ------------------------------

        const themeToggles = document.querySelectorAll('.theme-toggle-btn');
        const themeIcons = document.querySelectorAll('.theme-icon');

        function updateIcons(isDark) {
            themeIcons.forEach(icon => {
                if (isDark) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            });
        }

        updateIcons(document.documentElement.classList.contains('dark'));

        themeToggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation(); 
                
                const willBeDark = !document.documentElement.classList.contains('dark');
                if (willBeDark) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }
                updateIcons(willBeDark);
            });
        });

        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation(); 
                
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-xmark');
                }
            });
        }

        const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        mobileDropdownBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation(); 
                
                const content = btn.nextElementSibling;
                const caret = btn.querySelector('.fa-caret-down');
                if (content) {
                    content.classList.toggle('hidden');
                    content.classList.toggle('flex');
                }
                if (caret) {
                    caret.classList.toggle('rotate-180');
                }
            });
        });

        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if(!link.classList.contains('mobile-dropdown-btn')) {
                    e.stopImmediatePropagation();
                    if (mobileMenu) mobileMenu.classList.add('hidden');
                    if (mobileMenuBtn) {
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-xmark');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            });
        });

        const langBtns = document.querySelectorAll('.lang-toggle-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.toggleLanguage === 'function') {
                    window.toggleLanguage();
                }
            });
        });
    }

    function inject(html) {
        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
            placeholder.innerHTML = html;
            initNavbarFunctionality();
            return true;
        }
        return false;
    }

    function tryMount(html) {
        if (inject(html)) return;
        const observer = new MutationObserver(() => {
            if (inject(html)) observer.disconnect();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (cachedHTML) {
        tryMount(cachedHTML);
        fetch('navbar.html').then(r => r.ok ? r.text() : '').then(fresh => {
            if (fresh && fresh !== cachedHTML) sessionStorage.setItem(NAVBAR_CACHE_KEY, fresh);
        }).catch(() => {});
    } else if (fetchPromise) {
        fetchPromise.then(html => {
            if (html) {
                sessionStorage.setItem(NAVBAR_CACHE_KEY, html);
                tryMount(html);
            }
        });
    }
})();