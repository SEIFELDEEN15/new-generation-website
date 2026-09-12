// Universal EN <-> FR translation toggle, powered by Google Website Translator.
// Include this file on every page (it drives any button with class="lang-toggle-btn").
// Note: the #google_translate_element mount point must live in each page's own
// static HTML (not inside the fetched navbar.html) so it exists before Google's
// script tries to attach the widget to it.

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,fr', autoDisplay: false },
        'google_translate_element'
    );
}

function currentLang() {
    var match = document.cookie.match(/googtrans=\/en\/(\w+)/);
    return match ? match[1] : 'en';
}

function setSiteLanguage(lang) {
    // Toggling the live Google dropdown repeatedly (en -> fr -> en -> fr ...)
    // leaves Google's widget in a broken internal state after the first
    // revert. Setting the cookie and reloading is the reliable path --
    // Google's widget reads this cookie fresh on every page load.
    if (lang === 'en') {
        document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    } else {
        document.cookie = 'googtrans=/en/' + lang + ';path=/;max-age=31536000';
    }
    location.reload();
}

function updateLangButtons(lang) {
    document.querySelectorAll('.lang-toggle-btn').forEach(function (btn) {
        var target = lang === 'fr' ? 'en' : 'fr';
        btn.textContent = target.toUpperCase();
        btn.dataset.target = target;
        btn.setAttribute('aria-label', 'Switch site language to ' + (target === 'fr' ? 'French' : 'English'));
    });
}

function hideGoogleBanner() {
    var banner = document.querySelector('.goog-te-banner-frame');
    if (banner) banner.style.display = 'none';
    document.body.style.top = '0px';

    // Also nuke the "Original text" hover/click card Google shows when you
    // interact with translated text.
    var tooltip = document.getElementById('goog-gt-tt');
    if (tooltip) tooltip.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    updateLangButtons(currentLang());

    // Belt-and-suspenders: also force the banner away via JS, in case the
    // CSS rule loses a race with Google injecting it.
    setInterval(hideGoogleBanner, 500);

    // navbar.html (and its FR/EN button) is injected asynchronously after this
    // point on most pages, so watch for it and sync the label once it appears.
    var observer = new MutationObserver(function () {
        if (document.querySelector('.lang-toggle-btn')) {
            updateLangButtons(currentLang());
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Delegated click handler works regardless of when the button shows up.
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.lang-toggle-btn');
        if (!btn) return;
        var target = btn.dataset.target || 'fr';
        setSiteLanguage(target);
    });
});