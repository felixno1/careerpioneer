document.addEventListener('DOMContentLoaded', function() {
    const btns = document.querySelectorAll('.skill-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const userBehaviourDisplay = document.getElementById('user-behaviour-display');
    const loadingContainer = document.getElementById('loading-container');
    const skillContainer = document.getElementById('skill-container');
    const refreshBtn = document.getElementById('refresh-btn');
    const progressBar = document.getElementById('progress-bar');

    let onCount = 0;
    let minSkills = 5;
    let userBehaviour = {};

    // Hide all skills except the first 30 initially
    const allSkills = document.querySelectorAll('.skill-btn');
    allSkills.forEach((skill, index) => {
        if (index >= 30) {
            skill.style.display = 'none';
        }
    });

    function findNextHiddenSkill() {
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].style.display === 'none' && !btns[i].classList.contains('on') && !btns[i].classList.contains('refreshed')) {
                return btns[i];
            }
        }
        return null;
    }

    function findNextHiddenSkillWithId(id) {
        for (let i = 0; i < btns.length; i++) {
            const btnId = btns[i].getAttribute('data-id');
            if (btns[i].style.display === 'none' && btnId === id && !btns[i].classList.contains('on') && !btns[i].classList.contains('refreshed')) {
                return btns[i];
            }
        }
        return null;
    }

    function findTopUserBehaviourKey() {
        let maxKey = '';
        let maxValue = 0;
        for (const [key, value] of Object.entries(userBehaviour)) {
            if (value > maxValue) {
                maxKey = key;
                maxValue = value;
            }
        }
        return maxKey;
    }

    function updateSameFieldClasses() {
        const topKey = findTopUserBehaviourKey();
        btns.forEach(btn => {
            const btnId = btn.getAttribute('data-id');
            if (btnId !== topKey) {
                btn.classList.remove('same-field');
            } else {
                btn.classList.add('same-field');
            }
        });
    }

    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            btn.classList.toggle('on');
            const skillId = btn.getAttribute('data-id');
            if (btn.classList.contains('on')) {
                onCount++;
                // Hide the clicked skill
                btn.style.display = 'none';
                // Show the next hidden skill with the same id as the top key in userBehaviour
                const nextSkillId = findTopUserBehaviourKey();
                const nextSkill = findNextHiddenSkillWithId(nextSkillId);
                if (nextSkill) {
                    nextSkill.style.display = '';
                }
                // Update userBehaviour dictionary
                if (userBehaviour[skillId]) {
                    userBehaviour[skillId]++;
                } else {
                    userBehaviour[skillId] = 1;
                }
            } else {
                onCount--;
                // Show the clicked skill
                btn.style.display = '';
                // Update userBehaviour dictionary
                if (userBehaviour[skillId]) {
                    userBehaviour[skillId]--;
                }
            }
            updateSameFieldClasses();
            if (onCount >= minSkills) {
                confirmBtn.disabled = false;
            } else {
                confirmBtn.disabled = true;
            }
            if (onCount <= minSkills) {
                progressBar.style.width = `${(onCount / minSkills) * 100}%`;
            }
        });
    });

    refreshBtn.addEventListener('click', function() {
        const maxRefreshCount = 30; // Maximum number of skills to refresh

        if (!refreshBtn.classList.contains('refreshing')) {
            // Hide all currently visible skills
            btns.forEach(btn => {
                if (btn.style.display !== 'none') {
                    btn.classList.add('refreshed');
                    btn.style.display = 'none';
                }
            });

            let refreshedCount = 0;
            // Show the next 30 buttons that don't have the new class
            btns.forEach(btn => {
                if (refreshedCount < maxRefreshCount && !btn.classList.contains('refreshed') && !btn.classList.contains('on')) {
                    btn.style.display = '';
                    refreshedCount++;
                }
            });

            // Remove the 'refreshed' class from previously hidden buttons
            btns.forEach(btn => {
                if (btn.style.display === 'none' && btn.classList.contains('refreshed')) {
                    //btn.classList.remove('refreshed');
                }
            });

            refreshBtn.classList.add('refreshing');
            setTimeout(() => {
                refreshBtn.classList.remove('refreshing');
            }, 3000); // Animation duration
        }
    });


    confirmBtn.addEventListener('click', function() {
        const selectedSkills = [];

        confirmBtn.style.display = 'none';
        skillContainer.style.display = 'none';
        loadingContainer.style.display = 'flex';

        btns.forEach(btn => {
            if (btn.classList.contains('on')) {
                selectedSkills.push(btn.getAttribute('data-name'));
            }
        });
        fetch('/update-skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedSkills)
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/show-recommendations';
                } else {
                    console.error('Error:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
