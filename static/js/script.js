document.addEventListener('DOMContentLoaded', function() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const selectedLanguageInput = document.getElementById('selected-language');
    const confirmLangBtn = document.getElementById('confirm-lang');
    const pickLangBtn = document.getElementById('lang-picker');
    const langBar = document.getElementById('lang-bar');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function applySemiticClass(language) {
        const semiticLanguages = ['ar', 'da', 'pe'];
        if (semiticLanguages.includes(language)) {
            document.querySelectorAll('body *').forEach(element => {
                element.classList.add('semitic');
            });
        } else {
            document.querySelectorAll('body *').forEach(element => {
                element.classList.remove('semitic');
            });
        }
    }

    // Check for cookie and apply class only on page load
    const languageCookie = getCookie('preferred_language');
    if (languageCookie && (languageCookie === 'ar' || languageCookie === 'da' || languageCookie === 'pe')) {
        applySemiticClass(languageCookie);
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('on'));
            btn.classList.add('on');
            selectedLanguageInput.value = btn.value;
            console.log("Selected Language:", btn.value);

            // Show confirmation button if language has changed
            if (btn.value !== languageCookie) {
                confirmLangBtn.classList.add('show');
                console.log("Show confirm btn");
            }
        });
    });

    pickLangBtn.addEventListener('click', function(event) {
        langBar.classList.toggle('show');
        event.stopPropagation();
    });

    langBar.addEventListener('click', function(event) {
        if (langBar.classList.contains('show')) {
            event.stopPropagation();
        }
    });

    document.addEventListener('click', function(event) {
        if (langBar.classList.contains('show')) {
            langBar.classList.remove('show');
        }
    });

    confirmLangBtn.addEventListener('click', function() {
        document.cookie = "preferred_language=" + selectedLanguageInput.value + "; path=/";
        location.reload(); // Reload the page to reapply correct classes based on new cookie
    });
});
