(async function() {
    try {
        const response = await loadJSONL('locales/locales.jsonl');
        const languages = parseJSONL(response);
        const jsonlOutput = document.getElementById('lang-list');
        const langSidebar = document.getElementById('lang-sidebar');
        const langPicker = document.getElementById('lang-picker');
        const confirmLangBtn = document.getElementById('confirm-lang');

        let currentLang = getCookie('lang');

        // Function to switch language
        function switchLanguage(language) {
            confirmLangBtn.classList.add('confirm');
            currentLang = language.code;
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('current');
                if (btn.id === currentLang) {
                    btn.classList.add('current');
                }
            });
            loadAndDisplayLanguage();
        }

        // Function to load and display language-specific content
        async function loadAndDisplayLanguage() {
            try {
                const langData = await loadAndDisplayJSON(`locales/${currentLang}/lang.json`);
                // Display language-specific content
            } catch (error) {
                console.error(error);
            }
        }

        // Display language buttons
        languages.forEach(language => {
            const btn = document.createElement('button');
            btn.classList.add('lang-btn');
            btn.textContent = language.name;
            btn.id = language.code;
            if (language.code === currentLang) {
                btn.classList.add('current');
            }
            btn.addEventListener('click', () => switchLanguage(language));
            jsonlOutput.appendChild(btn);
        });

        // Toggle language sidebar
        langPicker.addEventListener('click', () => {
            langSidebar.classList.toggle('show');
        });

        // Close language sidebar on click outside
        window.addEventListener('click', event => {
            if (!event.target.closest('#lang-sidebar') && !event.target.closest('#lang-picker')) {
                langSidebar.classList.remove('show');
            }
        });

        // Confirm language selection
        confirmLangBtn.addEventListener('click', () => {
            setCookie('lang', currentLang);
            if (['ar', 'pe', 'da', 'yi'].includes(currentLang)) {
                document.querySelectorAll('*').forEach(element => {
                    element.classList.add('semitic');
                });
            }
            location.reload();
        });
    } catch (error) {
        console.error(error);
    }
})();

document.addEventListener("DOMContentLoaded", function() {
    var lang = getCookie('lang');
    if (['ar', 'da', 'pe', 'yi'].includes(lang)) {
        const mainContainer = document.getElementById('main-container');
        var elements = Array.from(mainContainer.childNodes).filter(node => node.nodeType === 1);
        elements.forEach(function(element) {
            element.classList.add('semitic');
        });
    }
});

function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return '';
}
