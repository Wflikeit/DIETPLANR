// chat/static/chat.jsa

let chatLog = document.querySelector("#chatLog");
let chatMessageInput = document.querySelector("#chatMessageInput");
let chatMessageSend = document.querySelector("#chatMessageSend");

// const messages_container = document.getElementById("messages");
// const messages = Array.from(messages_container.querySelectorAll(".message"));
let messages_array = [];


const chatIcon = document.getElementById("chat-icon");
const chat_container = document.getElementById("chat");
const chat_settings_container = chat_container.getElementsByClassName("chat-settings")[0];
const chat_settings_dropdowns = Array.from(chat_settings_container.getElementsByClassName("option-dropdown"));
const conversations_container = document.getElementById("conversations");
let current_conversation;
let chat_links = [];
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

// const roomName = JSON.parse(document.getElementById('roomName').textContent);
// console.log(roomName)


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
        console.log("Successfully  connected to Websocket");
    }

    chatSocket.onclose = function (e) {
        console.log('Connection closed unexpectedly. Trying to reconnect in 2s...');
        setTimeout(function (e) {
            console.log("Reconnecting...");
            connect();
        }, 2000);
    };
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);

        switch (data.type) {
            case "chat_message":
                let div = document.createElement("div");
                let span = document.createElement("span");
                div.classList.add("message");
                span.innerHTML = data.message;
                div.appendChild(span);
                div.classList.add("right");
                chatLog.children.item(current_conversation.index).appendChild(div);
                break;
            case "private_message":
                div = document.createElement("div");
                span = document.createElement("span");
                div.classList.add("message");
                span.innerHTML = "PM to " + data.target + ": " + data.message;
                div.appendChild(span);
                div.classList.add("right");
                chatLog.children.item(current_conversation.index).appendChild(div);
                break;
            case "private_message_delivered":
                div = document.createElement("div");
                span = document.createElement("span");
                div.classList.add("message");
                span.innerHTML = "PM to " + data.target + ": " + data.message;
                div.appendChild(span);
                div.classList.add("right");
                chatLog.children.item(current_conversation.index).appendChild(div);
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
let user_slug = 'dietetyk-fratczak'; // Zmienna do śledzenia ofsetu wiadomości
// let user_slug2 = "dietetyk-fratczak";

async function loadConversations() {
    let conversations_array = [];
    try {
        const response = await fetch(`/chat/api/get-conversations/${user_slug}/${offset}`);
        const data = await response.json();
        let conv_messages = [];
        data.results.forEach(element => {
            conversations_array.push(element)
        })
        conversations_array.forEach(element => {
            console.log(element);
            conv_messages = [];
            const a = document.createElement("a");
            a.innerHTML = element.user2_data.name;
            a.style.display = "block";
            a.dataset.value = element.user2;
            chat_links.push(a);
            a.addEventListener("click", function (e){
                chat_links.forEach(link => link.classList.remove("active"));
                this.classList.add("active");
                current_conversation = {index: chat_links.indexOf(this), value: this.dataset.value};
                Array.from(chatLog.children).forEach(div => div.classList.remove("active"));
                chatLog.children.item(current_conversation.index).classList.add("active");
            })
            conversations_container.appendChild(a);
            element.messages.forEach(element => {
                conv_messages.push(element);
            })
            messages_array.push(conv_messages);
        })
        await loadMoreMessages(conversations_array)
        return data.results;
    } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
        return [];
    }
}


async function loadMoreMessages(conversations_array) {
    messages_array.forEach((messages, index) => {
        let div = document.createElement("div");
        chatLog.appendChild(div);
        messages.forEach(message =>{
            addMessageToChatLog(index, message, conversations_array);
        })
    });
    // offset += messages_array.length;
}

// Funkcja do dodawania wiadomości do chatLog

function addMessageToChatLog(index, message, conversations_array) {
    div = document.createElement("div");
    span = document.createElement("span");
    div.classList.add("message");
    span.innerHTML = message.content;
    div.appendChild(span);
    const Class = conversations_array.some(item => item.user2 === message.sender) ? "right" : "left";
    div.classList.add(Class);
    chatLog.children.item(index).appendChild(div);
}

// Obsługa przewijania i ładowania nowych wiadomości
chatLog.addEventListener('scroll', function () {
    if (chatLog.scrollTop === 0) {
        loadMoreMessages();
    }
});

// Inicjalne pobranie wiadomości
loadConversations()
