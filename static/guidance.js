document.addEventListener('DOMContentLoaded', function() {
    // Get all b.uttons with the class 'list-btn'
    var listBtns = document.querySelectorAll('.list-btn');

    // Add click event listener to each btn
    listBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Get the next sibling element, which is the .list-explanation div
            var explanation = this.nextElementSibling;

            // Toggle the 'show' class on the explanation div
            explanation.classList.toggle('show');
        });
    });

    document.getElementById('compass-btn').addEventListener('click', function(event) {
        event.preventDefault();
        this.form.submit();
    });
});
