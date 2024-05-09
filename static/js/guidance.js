document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initializeListButtons();
    initializeSendButton();
    initializeMessageArea();
    initializeCompassButton();
    initializeExplainButtons();
});

function initializeListButtons() {
    const listBtns = document.querySelectorAll('.list-btn');
    listBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const explanation = this.nextElementSibling;
            const allExplanations = document.querySelectorAll('.list-explanation');
            allExplanations.forEach(ex => {
                if (ex !== explanation) {
                    ex.classList.remove('show');
                }
            });
            explanation.classList.toggle('show');
        });
    });
}

function initializeSendButton() {
    const messageArea = document.getElementById('message-area');
    const sendBtn = document.getElementById('send-btn');
    sendBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const message = messageArea.value;
        const messagesDiv = document.getElementById('convo-field');
        if (message.trim() !== '') {
            messageArea.value = '';
            sendMessage(message);
        }
        if (messagesDiv.lastElementChild) {
            messagesDiv.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function initializeMessageArea() {
    const messageArea = document.getElementById('message-area');
    const sendBtn = document.getElementById('send-btn');
    messageArea.addEventListener('input', function() {
        sendBtn.disabled = messageArea.value.trim() === '';
    });
}

function initializeCompassButton() {
    const compassBtn = document.getElementById('compass-btn');
    compassBtn.addEventListener('click', function(event) {
        event.preventDefault();
        this.form.submit();
    });
}

function initializeExplainButtons() {
    const explainBtns = document.querySelectorAll('.explain-btn');
    explainBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const description = this.getAttribute('data-description');
            const title = this.getAttribute('data-title');
            const elaborate = this.getAttribute('data-elaborate');
            sendDescription(description, title, elaborate)
                .then(chatLogs => {
                    console.log('Chat logs updated:', chatLogs);
                    updateMessages(chatLogs);
                })
                .catch(error => console.error('Failed to send description or update messages:', error));
        });
    });
}

function displayUserMessage(message) {
    const messagesDiv = document.getElementById('convo-field');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg user';
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    const responseDiv = document.createElement('div');
    responseDiv.className = 'msg gpt';
    responseDiv.textContent = ' • • • ';
    messagesDiv.appendChild(responseDiv);
}

function sendMessage(message) {
    displayUserMessage(message);

    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: message })
    })
    .then(response => response.json())
    .then(chatLogs => updateMessages(chatLogs))
    .catch(error => console.error('Error:', error));
}

function sendDescription(description, title, elaborate) {
    displayUserMessage(`${elaborate} ${title}`);

    return fetch('/explain', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: description, title: title, elaborate: elaborate })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error; // Rethrow after logging to ensure downstream .catch handles it
    });
}

function updateMessages(chatLogs) {
    const messagesDiv = document.getElementById('convo-field');
    messagesDiv.innerHTML = '';
    chatLogs.forEach(log => {
        if (log.user) {
            const newUserMessage = document.createElement('div');
            newUserMessage.className = 'msg user old';
            newUserMessage.textContent = log.user;
            messagesDiv.appendChild(newUserMessage);
        }
        if (log.gpt) {
            const newGptMessage = document.createElement('div');
            newGptMessage.className = 'msg gpt old';
            newGptMessage.textContent = log.gpt;
            messagesDiv.appendChild(newGptMessage);
        }
    });
    if (messagesDiv.lastElementChild) {
        messagesDiv.lastElementChild.scrollIntoView({ behavior: 'smooth' });
        messagesDiv.lastElementChild.classList.remove('old')
    }
}

function autoGrow(element) {
    element.style.height = 'auto';
    const maxLines = 4;
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * maxLines;
    element.style.height = Math.min(element.scrollHeight, maxHeight) + 'px';
}
