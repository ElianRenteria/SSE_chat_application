let username = '';


const eventSource = new EventSource('http://192.168.1.25:3000/events');


eventSource.onmessage = function(event) {
    const messages = JSON.parse(event.data); 
    const chatDiv = document.getElementById('chat');
    

    chatDiv.innerHTML = messages.map(msg => `
        <div class="message">
            <img src='https://api.dicebear.com/9.x/fun-emoji/svg?seed=${msg.username}' alt='Profile Image'>
            <p>${msg.username}: ${msg.message}</p>
        </div>
    `).join('');
    

    chatDiv.scrollTop = chatDiv.scrollHeight; 
};


document.getElementById('send').addEventListener('click', function() {
    const message = document.getElementById('message').value;
    if (message) {
        fetch('http://192.168.1.25:3000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message, username: username }),
        }).then(response => {
            if (response.ok) {
                document.getElementById('message').value = ''; 
            }
        }).catch(error => {
            console.error('Error sending message:', error);
        });
    }
});

function login(){
    username = $('#username').val(); 
    if(username){
        localStorage.setItem('username', username); 
        $('#portal').hide(); 
        $('#app').show(); 
        $('#header').show(); 
    }
}

function setup() {
    $('#header').hide(); 
    $('#app').hide(); 
    $('#portal').show(); 
}

function logout() {
    localStorage.removeItem('username'); 
    setup(); 
}


if (localStorage.getItem('username')) {
    username = localStorage.getItem('username'); 
    $('#portal').hide(); 
    $('#message').focus();
    $('#app').show(); 
    $('#header').show(); 
}
else {
    setup(); 
}