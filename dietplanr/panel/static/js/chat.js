// chat/static/chat.js

console.log("Sanity check from chat.js.");

let chatLog = document.querySelector("#chatLog");
let chatMessageInput = document.querySelector("#chatMessageInput input");
let chatMessageSend = document.querySelector("#chatMessageSend");

// const messages_container = document.getElementById("messages");
// const messages = Array.from(messages_container.querySelectorAll(".message"));
let messages_array = [];


const chatIcon = document.getElementById("chat-icon");
const chat_container = document.getElementById("chat");
const chat_settings_container = chat_container.getElementsByClassName("chat-settings")[0];
const chat_settings_dropdowns = Array.from(chat_settings_container.getElementsByClassName("option-dropdown"));


let user_inbox = "ced270ee-1f3d-4f9a-93c0-836736e81c7b"
chat_settings_dropdowns.forEach(dropdown => {
    dropdown.getElementsByClassName("dropdown")[0].addEventListener("click", function () {
        dropdown.getElementsByClassName("content")[0].classList.toggle("active");
    })
})
chatIcon.addEventListener("click", function () {
    this.classList.toggle("active");
    chat_container.classList.toggle("active");

})


// focus 'chatMessageInput' when user opens the page
chatMessageInput.focus();

// submit if the user presses the enter key
chatMessageInput.onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter key
        chatMessageSend.click();
    }
};
// clear the 'chatMessageInput' and forward the message
chatMessageSend.onclick = function () {
    if (chatMessageInput.value.length === 0) return;
    chatSocket.send(JSON.stringify({
        "message": chatMessageInput.value, "user_inbox": user_inbox,  // Twój typ komunikatu

    }));
    chatMessageInput.value = "";
};

let chatSocket = null;

function connect() {
    chatSocket = new WebSocket("ws://" + window.location.host + "/ws/chat_active/");
    chatSocket.onopen = function (e) {
        console.log("Successfully  connected to Websocket")
    }

    chatSocket.onclose = function (e) {
        console.log('Connection closed unexpectedly. Trying to reconnect in 2s...')
        setTimeout(function (e) {
            console.log("Reconnecting...")
            connect()
        }, 2000);
    };
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(data);


        switch (data.type) {
            case "chat_message":
                chatLog.value += data.message + "\n";
                console.log(chatLog.value)
                break;
            case "private_message":
                chatLog.value += "PM from " + data.user + ": " + data.message + "\n";
                break;
            case "private_message_delivered":
                chatLog.value += "PM to " + data.target + ": " + data.message + "\n";
                break;
            default:
                console.error("Unknown message type!");
                break;
        }
        // scroll 'chatLog' to the bottom
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onerror = function (err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }
}

connect();

let offset = 0; // Zmienna do śledzenia ofsetu wiadomości
// let user_slug = 'admin-admin'; // Zmienna do śledzenia ofsetu wiadomości


async function loadConversations() {
    let conversations_array = [];
    try {
        const response = await fetch(`/chat/api/get-conversations/${offset}`, {
            credentials: 'same-origin' // lub 'include'
        });
        const data = await response.json();
        console.log('hiiiiiiiii')
        console.log(data.results)
        data.results.forEach(element => {
            conversations_array.push(element)
        })
        console.log('petla')
        conversations_array.forEach(element => {
            console.log(element)
            element.messages.forEach(element => {
                messages_array.push(element)
            })
        })

        console.log('messages.array')

        messages_array.forEach(element => {
            console.log(element)
        })
        await loadMoreMessages()
        return data.results;
    } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
        return [];
    }

}


async function loadMoreMessages() {
    messages_array.forEach(message => {
        addMessageToChatLog(message.content);
        console.log(message)
    });
    // offset += messages_array.length;
}

// Funkcja do dodawania wiadomości do chatLog

function addMessageToChatLog(message) {
    chatLog.value += message + "\n";
}

// Obsługa przewijania i ładowania nowych wiadomości

chatLog.addEventListener('scroll', function () {
    if (chatLog.scrollTop === 0) {
        loadMoreMessages();
    }
});
// Inicjalne pobranie wiadomości
loadConversations()
