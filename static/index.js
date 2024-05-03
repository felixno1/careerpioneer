document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.lang-btn');

    if (buttons.length > 0) {
        buttons[0].classList.add('on');
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('on'));

            button.classList.add('on');
        });
    });
});