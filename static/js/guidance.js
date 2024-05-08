document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons with the class 'list-btn'
    var listBtns = document.querySelectorAll('.list-btn');

    // Add click event listener to each button
    listBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Get the next sibling element, which is the .list-explanation div
            var explanation = this.nextElementSibling;

            // First, remove the 'show' class from all explanations except the current one
            var allExplanations = document.querySelectorAll('.list-explanation');
            allExplanations.forEach(function(ex) {
                if (ex !== explanation) {
                    ex.classList.remove('show');
                }
            });

            // Then, toggle the 'show' class on the clicked element's explanation
            explanation.classList.toggle('show');
        });
    });

    // Existing code for the compass button
    document.getElementById('compass-btn').addEventListener('click', function(event) {
        event.preventDefault();
        this.form.submit();
    });
});

function autoGrow(element) {
    element.style.height = 'auto'; // Reset the height to shrink to content
    const maxLines = 4; // Maximum lines you want to allow
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * maxLines; // Calculate maximum height
    element.style.height = Math.min(element.scrollHeight, maxHeight) + 'px'; // Set height, not exceeding max
}