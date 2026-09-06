// 1. Initialize the Google Translate widget
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'fr,en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

// 2. The function triggered when you click "FR"
window.triggerFrenchTranslation = function() {
    const googleDropdown = document.querySelector('.goog-te-combo');
    
    if (googleDropdown) {
        // Toggle the language
        googleDropdown.value = googleDropdown.value === 'fr' ? 'en' : 'fr';
        googleDropdown.dispatchEvent(new Event('change'));
    } else {
        alert('Translation tool is still loading (or blocked by an Ad Blocker).');
    }
};

// 3. Automatically load Google's engine when this file runs
if (!document.getElementById('google-translate-engine')) {
    const script = document.createElement('script');
    script.id = 'google-translate-engine';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
}