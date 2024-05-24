document.addEventListener('DOMContentLoaded', function() {

    const sendBtn = document.getElementById('send-btn');
    const inputBox = document.getElementById('input-box');
    const msgBox = document.getElementById('msg-box');
    var lang = getCookie('lang') || 'en';
    var jsonFile = 'locales/' + lang + '/lang.json';

    sendBtn.addEventListener('click', function() {
        const userMessage = inputBox.value.trim();
        if (userMessage !== "") {
            // Append user's message to msg-box
            appendMessage('user', userMessage);
            appendMessage('bot', '• • •');
            // Clear input box
            inputBox.value = '';
            // Send message to Flask backend
            sendChatMessage(userMessage);
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `${sender} msg`;
        messageElement.classList.add(sender.toLowerCase());
        messageElement.textContent = `${message}`;
        msgBox.appendChild(messageElement);
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' }); // Scroll smoothly to the new message
    }

    function sendChatMessage(message) {
        fetch('http://careerpioneer.pythonanywhere.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: message, chat_logs: [] })
        })
        .then(response => response.json())
        .then(data => {
            msgBox.removeChild(msgBox.lastElementChild);
            appendMessage('bot', data.response);
        })
        .catch(error => console.error('Error:', error));
    }

    function requestExplanation(message, explanation) {
        console.log(explanation);
        console.log(message);
        fetch('http://careerpioneer.pythonanywhere.com/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: message, explanation: explanation })
        })
        .then(response => response.json())
        .then(data => {
            msgBox.removeChild(msgBox.lastElementChild);
            appendMessage('bot', data.response);
        })
        .catch(error => console.error('Error:', error));
    }

    // Event delegation for .chat-elaborate buttons
    document.querySelector('#main-container').addEventListener('click', function (event) {
        if (event.target.matches('.chat-elaborate') || event.target.closest('.chat-elaborate')) {
            // Perform actions for .chat-elaborate buttons here
            var btn = event.target.closest('.chat-elaborate');
            word = btn.parentNode.children[0].textContent;
            explanation = btn.parentNode.children[1].textContent;
            fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                var elaborateString = data['elaborate'];
                appendMessage('user', elaborateString + ' ' + word);
                appendMessage('bot', '• • •');
                requestExplanation(elaborateString + ' ' + word, explanation);
            });
        }
    });
});
