document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.lang-btn');
    const selectedLanguageInput = document.getElementById('selected-language');
    const confirmLangButton = document.getElementById('confirm-lang');
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
    buttons.forEach(button => {
        if (button.value === preferredLanguage) {
            button.classList.add('on');
            selectedLanguageInput.value = button.value; // Ensure the pre-selected language is captured
        }
    });

    // Add click event listener to each language button
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('on'));
            button.classList.add('on');
            selectedLanguageInput.value = button.value; // Update selected language on click
            console.log("Selected Language:", button.value); // Debug: Check button value

            // Check if selected language is different from preferred language
            if (button.value !== preferredLanguage) {
                confirmLangButton.classList.add('show');
                console.log("Show confirm button"); // Debug: Condition met
            }
        });
    });

    // Toggle the language selection bar visibility
    pickLangBtn.addEventListener('click', function() {
        langBar.classList.toggle('show');
    });

    // Additional logic might be needed here to handle form submission, if necessary.
    confirmLangButton.addEventListener('click', function() {
        // The form will be submitted with the hidden input which now contains the selected language
    });
});
