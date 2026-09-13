(function () {
    const NAVBAR_CACHE_KEY = 'cached_navbar_html_v1';
    let cachedHTML = sessionStorage.getItem(NAVBAR_CACHE_KEY);

    // Start fetching IMMEDIATELY on script execution (parallel network request)
    let fetchPromise = !cachedHTML ? fetch('navbar.html').then(r => r.ok ? r.text() : '').catch(() => '') : null;

    function initNavbarFunctionality() {
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
                e.stopImmediatePropagation(); // Stops duplicate toggling from old scripts
                
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
                e.stopImmediatePropagation(); // Stops duplicate toggling from old scripts
                
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
                e.stopImmediatePropagation(); // Stops duplicate toggling
                
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

        // Ensure clicking links closes the mobile menu cleanly
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

        // FIXED: Removed stopImmediatePropagation so translate-widget.js can hear the click
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
        // If placeholder DOM element isn't ready yet, observe until it appears
        const observer = new MutationObserver(() => {
            if (inject(html)) observer.disconnect();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // 1. If we have cache, render instantly (0ms)
    if (cachedHTML) {
        tryMount(cachedHTML);
        // Refresh cache in background
        fetch('navbar.html').then(r => r.ok ? r.text() : '').then(fresh => {
            if (fresh && fresh !== cachedHTML) sessionStorage.setItem(NAVBAR_CACHE_KEY, fresh);
        }).catch(() => {});
    } else if (fetchPromise) {
        // 2. If first visit, mount the millisecond the fetch completes
        fetchPromise.then(html => {
            if (html) {
                sessionStorage.setItem(NAVBAR_CACHE_KEY, html);
                tryMount(html);
            }
        });
    }
})();