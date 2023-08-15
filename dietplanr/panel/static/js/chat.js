// chat/static/chat.js

let chatLog = document.querySelector("#chatLog");
let chatMessageInput = document.querySelector("#chatMessageInput");
let chatMessageSend = document.querySelector("#chatMessageSend");

// const messages_container = document.getElementById("messages");
// const messages = Array.from(messages_container.querySelectorAll(".message"));
let messages_array = [];
let conversations_array = [];
let last_message_of_conversation_array = [];
// let counts = [];


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
                console.log(data);
                let message_div = document.createElement("div");
                let span = document.createElement("span");
                message_div.classList.add("message");
                span.innerHTML = data.message;
                message_div.appendChild(span);
                console.log(conversations_array);
                const Class = conversations_array.some(item => item.user2_data.name === data.user) ? "left" : "right";
                // console.log(data.user_id);
                message_div.classList.add(Class);
                try{
                    chatLog.children.item(current_conversation.index).appendChild(message_div);
                }
                catch (error){
                    console.log(error);
                }
                break;
            case "private_message":
                message_div = document.createElement("div");
                span = document.createElement("span");
                message_div.classList.add("message");
                span.innerHTML = "PM to " + data.target + ": " + data.message;
                message_div.appendChild(span);
                message_div.classList.add("right");
                chatLog.children.item(current_conversation.index).appendChild(message_div);
                break;
            case "private_message_delivered":
                message_div = document.createElement("div");
                span = document.createElement("span");
                message_div.classList.add("message");
                span.innerHTML = "PM to " + data.target + ": " + data.message;
                message_div.appendChild(span);
                message_div.classList.add("right");
                chatLog.children.item(current_conversation.index).appendChild(message_div);
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
    try {
        const response = await fetch(`/chat/api/get-conversations/${user_slug}/${offset}`);
        const data = await response.json();
        let conv_messages = [];
        data.results.forEach(element => {
            conversations_array.push(element)
        })
        conversations_array.forEach((element, index) => {
            conv_messages = [];
            element.messages.forEach((message, index) => {
                conv_messages.push(message);
                if(index === element.messages.length - 1) last_message_of_conversation_array.push(message);
            })
            messages_array.push(conv_messages);
            const conv_wrapper = document.createElement("div");
            const icon = document.createElement("i");
            const last_message = document.createElement("div");
            const name = document.createElement("div");
            const message_name_wrapper = document.createElement("div");
            conv_wrapper.classList.add("conversation");
            icon.classList.add("fa-regular", "fa-user");
            last_message.classList.add("last-message");
            name.classList.add("name");
            name.innerHTML = element.user2_data.name;
            last_message.innerHTML = "Wiadomość";
            message_name_wrapper.append(name, last_message);
            conv_wrapper.append(icon, message_name_wrapper);
            chat_links.push(conv_wrapper);
            conv_wrapper.addEventListener("click", function (e){
                chat_links.forEach(link => link.classList.remove("active"));
                this.classList.add("active");
                const index = chat_links.indexOf(this);
                current_conversation = {index: chat_links.indexOf(this)};
                Array.from(chatLog.children).forEach(div => div.classList.remove("active"));
                chatLog.children.item(index).classList.add("active");
            })
            conversations_container.appendChild(conv_wrapper);
        })
        await loadMoreMessages()
        return data.results;
    } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
        return [];
    }

}


async function loadMoreMessages() {
    messages_array.forEach((messages, index) => {
        // let counter = 0;
        let messages_block = document.createElement("div");
        chatLog.appendChild(messages_block);
        messages.forEach(message =>{
            addMessageToChatLog(index, message);
            // counter++;
        })
        // counts.push({"count": counter, "index": index});
    });
    // offset += messages_array.length;
    // console.log(counts);
}

// Funkcja do dodawania wiadomości do chatLog

function addMessageToChatLog(index, message) {
    const message_div = document.createElement("div");
    const span = document.createElement("span");
    message_div.classList.add("message");
    span.innerHTML = message.content;
    message_div.appendChild(span);
    const Class = conversations_array.some(item => item.user2_data.id === message.sender) ? "left" : "right";
    message_div.classList.add(Class);
    chatLog.children.item(index).appendChild(message_div);
}

// Obsługa przewijania i ładowania nowych wiadomości

// chatLog.addEventListener('scroll', function () {
//     if (chatLog.scrollTop === 0) {
//         loadMoreMessages();
//     }
// });
// Inicjalne pobranie wiadomości
loadConversations()
