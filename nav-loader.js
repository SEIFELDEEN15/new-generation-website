// Loads the shared navbar.html into #navbar-placeholder and re-binds the
// mobile menu + dark mode toggle logic once it's injected. Included via
// <script src="nav-loader.js"></script> on every page.

fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        // Re-bind Mobile Menu & Dark Mode logic after injection
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileBtn && mobileMenu) {
            const mobileMenuIcon = mobileBtn.querySelector('i');
            const mobileLinks = document.querySelectorAll('.mobile-link');
            const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');

            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                mobileMenuIcon.classList.toggle('fa-bars');
                mobileMenuIcon.classList.toggle('fa-xmark');
            });

            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenuIcon.classList.remove('fa-xmark');
                    mobileMenuIcon.classList.add('fa-bars');
                });
            });

            mobileDropdownBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const icon = this.querySelector('i.fa-caret-down');
                    content.classList.toggle('hidden');
                    content.classList.toggle('flex');
                    icon.style.transform = content.classList.contains('hidden') ? "rotate(0deg)" : "rotate(180deg)";
                });
            });
        }

        // Theme Toggle Re-bind
        const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
        const themeIcons = document.querySelectorAll('.theme-icon');
        function updateIcons() {
            const isDark = document.documentElement.classList.contains('dark');
            themeIcons.forEach(icon => {
                icon.classList.remove(isDark ? 'fa-moon' : 'fa-sun');
                icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
            });
        }
        updateIcons();
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                updateIcons();
            });
        });
    });
