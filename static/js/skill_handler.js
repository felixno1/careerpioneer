
const progressBar = document.getElementById('progress-bar');
let counter = 0; // Initialize counter


function weightedShuffle(array) {
    let listCopy = array.slice();
    let totalWeight = listCopy.reduce((sum, item) => sum + item.count, 0);
    let shuffledList = [];

    while (listCopy.length > 0) {
        let probabilities = listCopy.map(item => item.count / totalWeight);
        let randomIndex = getRandomWeightedIndex(probabilities);
        let selectedItem = listCopy.splice(randomIndex, 1)[0];
        shuffledList.push(selectedItem);
        totalWeight -= selectedItem.count;
    }

    return shuffledList;
}

function getRandomWeightedIndex(probabilities) {
    let randomValue = Math.random();
    let cumulativeProbability = 0;
    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (randomValue < cumulativeProbability) {
            return i;
        }
    }
    return probabilities.length - 1;
}

function displaySkills(data) {
    const container = document.getElementById('skills-container');

    const list = document.createElement('div');
    list.id = 'skill-list';

    data.forEach(skill => {
        const listItem = document.createElement('button');
        listItem.classList.add('skill-btn');
        listItem.id = skill.skill || 'No skill';  // Fallback if skill is missing
        listItem.textContent = skill.translation || 'No translation';  // Fallback if translation is missing
        list.appendChild(listItem);
    });

    container.appendChild(list);

    // Hide all buttons except the first 30
    const allButtons = document.querySelectorAll('.skill-btn');
    allButtons.forEach((button, index) => {
        if (index >= 30) {
            button.classList.add('hidden');
        }
    });
}

function addNewSkillButton(skillText) {
    const newSkill = document.createElement('button');
    newSkill.classList.add('skill-btn');
    newSkill.textContent = skillText;
    const list = document.getElementById('skill-list');
    list.appendChild(newSkill);
}

// Function to load and display JSON data
function loadAndDisplaySkills() {
    const lang = getCookie('lang');
    const langFilename = `locales/${lang}/skills.jsonl`;
    loadJSON(langFilename, function (data) {
        const shuffledData = weightedShuffle(data);
        displaySkills(shuffledData);
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return 'en'; // Default to 'en' if cookie not found
}

// Load JSON based on the language from the cookie
loadAndDisplaySkills();

// Click event listener to detect clicks on skill buttons
document.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('skill-btn')) {
        counter++; // Increment the counter
        if (counter <= 5) {
            progressBar.style.width = `${(counter / 5) * 100}%`; // Update the progress bar
        }
        if (counter >= 5) {
            const searchButton = document.getElementById('search-btn');
            searchButton.classList.add('active');
        }

        const nextHiddenButton = document.querySelector('.skill-btn.hidden');
        if (nextHiddenButton) {
            nextHiddenButton.classList.remove('hidden');
        }
    }
});

// Click event listener for the search button
const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', function() {
    // Gather IDs of all skill buttons that have the class .picked
    const pickedSkillButtons = document.querySelectorAll('.skill-btn.picked');
    const skillIds = Array.from(pickedSkillButtons).map(button => button.id);
    const combinedIds = skillIds.join(' '); // Combine IDs into a string
    const aiContainer = document.getElementById('ai-container');
    const loadingContainer = document.getElementById('loading-container');
    aiContainer.style.display = 'none';
    loadingContainer.style.display = 'block';
    // Call the predictJobs function with the combined IDs string as an argument
    //console.log(combinedIds);
    predictJobs(combinedIds);
});

// Add event listener for the refresh button
const refreshButton = document.getElementById('refresh-btn');
refreshButton.addEventListener('click', function() {
    refreshButton.classList.add('refreshing');

    // Remove the next 30 skill buttons
    const skillButtons = document.querySelectorAll('.skill-btn');
    for (let i = 0; i < 30 && i < skillButtons.length; i++) {
        skillButtons[i].remove();
    }

    // Unhide the next 30 hidden skill buttons
    const hiddenButtons = document.querySelectorAll('.skill-btn.hidden');
    for (let i = 0; i < 30 && i < hiddenButtons.length; i++) {
        hiddenButtons[i].classList.remove('hidden');
    }

    setTimeout(() => {
        refreshButton.classList.remove('refreshing');
    }, 8000); // 10 seconds
});

