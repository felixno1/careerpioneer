const buttons = document.querySelectorAll('.job-btn');
const jobBoxes = document.querySelectorAll('.job-box');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const jobBox = button.parentElement; // Get the parent job-box element

        // Remove 'on' class from all job-box elements
        jobBoxes.forEach(box => {
            if (box !== jobBox) {
                box.classList.remove('on');
            }
        });

        // Toggle the 'on' class on the clicked job-box
        jobBox.classList.toggle('on');
        jobBox.scrollIntoView({behavior: "smooth", block: "center"})
    });
});
