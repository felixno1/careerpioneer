document.addEventListener('DOMContentLoaded', function() {
    const langBtns = document.querySelectorAll('.lang-btn');
    const selectedLanguageInput = document.getElementById('selected-language');
    const confirmLangBtn = document.getElementById('confirm-lang');
    const pickLangBtn = document.getElementById('lang-picker');
    const langBar = document.getElementById('lang-bar');

    // Function to get cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Get preferred language from cookie
    const preferredLanguage = getCookie('preferred_language');
    console.log("Preferred Language from Cookie:", preferredLanguage); // Debug: Check cookie value

    // Set the 'on' class for the preferred language, if it exists
    langBtns.forEach(btn => {
        if (btn.value === preferredLanguage) {
            btn.classList.add('on');
            selectedLanguageInput.value = btn.value; // Ensure the pre-selected language is captured
        }
    });

    // Add click event listener to each language btn
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('on'));
            btn.classList.add('on');
            selectedLanguageInput.value = btn.value; // Update selected language on click
            console.log("Selected Language:", btn.value); // Debug: Check btn value

            // Check if selected language is different from preferred language
            if (btn.value !== preferredLanguage) {
                confirmLangBtn.classList.add('show');
                console.log("Show confirm btn"); // Debug: Condition met
            }
        });
    });

    // Toggle the language selection bar visibility
    pickLangBtn.addEventListener('click', function() {
        langBar.classList.toggle('show');
    });

    // Additional logic might be needed here to handle form submission, if necessary.
    confirmLangBtn.addEventListener('click', function() {
        // The form will be submitted with the hidden input which now contains the selected language
    });
});
