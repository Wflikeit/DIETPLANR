import {client_textables} from "./clients.js";

let messages_array = [];
let conversations_array = [];
let chat_containers = [];
let chat_links = [];

const chat_list = document.querySelector("[data-chat-list]");
const chat_template = document.querySelector("[data-chat-template]").content.children[0];
const user_action = document.getElementById("user-action");
const chat_icon = document.getElementById("chat-icon");
const conversations_container = document.getElementById("conversations");
const bars = document.getElementById("bars");
const listWrapper = document.getElementById("list-wrapper");
let current_conversation;
let user_id = null;
if (document.getElementById("user_id")) {
    user_id = document.getElementById("user_id").innerHTML;
}
if (chat_icon !== null) {
    chat_icon.addEventListener("click", function () {
        this.classList.toggle("active");
        conversations_container.classList.toggle("d-none");
        user_action.querySelector(".action-list").classList.add("d-none");
        chat_list.setAttribute("data-notification-count", "0");
    })
}
user_action.addEventListener("click", function () {
    this.querySelector(".action-list").classList.toggle("d-none");
    conversations_container.classList.add("d-none");
})

bars.addEventListener("click", function (e) {
    listWrapper.classList.toggle("active");
})
client_textables.forEach(button => {
    button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const id = button.getAttribute("data-text-client");
        const pre_exist_conv = chat_links.find(link => link.getAttribute("data-value") === id);
        if (!pre_exist_conv) {
            makeNewChatElem(name, id);
            const chat_link = makeConversationLink(null, name, id);
            conversations_container.prepend(chat_link);
            chat_link.click();
        } else {
            pre_exist_conv.click();
        }
    })
})
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
            case "private_message":
                let Class = null
                let who = null;
                let message_div = createChatMessage(data.message);
                if (data.user_id !== user_id) {
                    Class = "left";
                    let chat_link = chat_links.find(item => item.dataset.value === data.user_id);
                    if (chat_link) {
                        const chat_container = chat_containers.find(container => container.dataset.chat === data.user_id);
                        chat_container.querySelector("[data-chat-log]").append(message_div);
                        who = data.user + ": ";
                        if (!chat_icon.classList.contains("active") && !chat_container.classList.contains("active")) {
                            chat_link.querySelector(".last-message").classList.add("unread");
                            const count = chat_links.reduce((count, link) => {
                                return link.querySelector(".last-message").classList.contains("unread") ? count + 1 : count;
                            }, 0);
                            chat_list.setAttribute("data-notification-count", count);
                        }
                    } else {
                        const chat_container = makeNewChatElem(data.user, data.user_id);
                        chat_container.querySelector("[data-chat-log]").append(message_div);
                        chat_link = makeConversationLink(data.message, data.user, data.user_id);
                        conversations_container.prepend(chat_link);
                        who = data.user + ": ";
                        chat_link.click();
                    }
                    chat_link.querySelector(".last-message").innerHTML = who + data.message;
                } else {
                    Class = "right";
                    // chatLog.children.item(current_conversation.index).appendChild(message_div)
                    chat_containers.find(container => container.dataset.chat === current_conversation.id).querySelector("[data-chat-log]").append(message_div);
                    who = "Ty: "
                    chat_links[current_conversation.index].querySelector(".last-message").innerHTML = who + data.message;
                }
                message_div.classList.add(Class);
                break;

            default:
                console.error("Unknown message type!");
                break;
        }
        // scroll 'chatLog' to the bottom
        // chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onerror = function (err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }
}

function makeNewChatElem(name, id) {
    const chat_elem = chat_template.cloneNode(true);
    chat_elem.querySelector(".chat-name").innerHTML = name;
    chat_elem.querySelector(".fa-xmark").addEventListener("click", function () {
        chat_elem.classList.remove("active");
        const link = chat_links.find(link => link.dataset.value == chat_elem.dataset.chat);
        link.classList.remove("active");
    })
    chat_elem.dataset.chat = id;
    const chat_button = chat_elem.querySelector("[data-chat-message-send]");
    const chat_input = chat_elem.querySelector("[data-chat-message-input]");
    document.body.append(chat_elem);
    chat_containers.push(chat_elem);
    chat_input.onkeyup = function (e) {
        if (e.keyCode === 13) {  // enter key
            chat_button.click();
        }
    };
    chat_button.onclick = function () {
        if (chat_input.value.length === 0) return;
        chatSocket.send(JSON.stringify({
            "message": chat_input.value,
            "user_inbox": chat_links[current_conversation.index].dataset.value,

        }));
        chat_input.value = "";
    };
    return chat_elem;
}

function createChatMessage(message) {
    let message_div = document.createElement("div");
    let span = document.createElement("span");
    message_div.classList.add("message");
    span.innerHTML = message;
    message_div.appendChild(span);
    return message_div;
}

function makeConversationLink(last_message_text, user_name, id) {
    const conv_wrapper = document.createElement("div");
    const icon = document.createElement("i");
    const last_message = document.createElement("div");
    const name_div = document.createElement("div");
    const message_name_wrapper = document.createElement("div");
    message_name_wrapper.classList.add("wrapper");
    conv_wrapper.classList.add("conversation");
    conv_wrapper.dataset.value = id;
    icon.classList.add("fa-regular", "fa-user");
    last_message.classList.add("last-message");
    name_div.classList.add("name");
    name_div.innerHTML = user_name;
    if (last_message_text != null) {
        const who = id === last_message_text.sender ? user_name + ": " : "Ty: ";
        if (id === last_message_text.sender) last_message.classList.add("unread");
        last_message.innerHTML = who + last_message_text.content;
    }
    message_name_wrapper.append(name_div, last_message);
    conv_wrapper.append(icon, message_name_wrapper);
    conv_wrapper.addEventListener("click", function (e) {
        chat_links.forEach(link => link.classList.remove("active"));
        this.classList.add("active");
        this.querySelector(".last-message").classList.remove("unread");
        current_conversation = {index: chat_links.indexOf(this), id: id};
        chat_containers.forEach(container => container.classList.remove("active"));
        chat_containers.find(container => container.dataset.chat === this.dataset.value).classList.add("active");
    })
    chat_links.push(conv_wrapper);
    return conv_wrapper;
}

function createConvLink(last_message_text, user_name, id) {
    const conv_wrapper = makeConversationLink(last_message_text, user_name, id);
    conversations_container.appendChild(conv_wrapper);
}

let offset = 0; // Zmienna do śledzenia ofsetu wiadomości

async function loadConversations() {
    try {
        const response = await fetch(`/chat/api/get-conversations/${offset}`);
        const data = await response.json();
        data.results.forEach(element => {
            conversations_array.push(element)
        })
        conversations_array.forEach((conversation, index) => {
            let conv_messages = [];
            let last_message_text;
            conversation.messages.forEach((message, index) => {
                conv_messages.push(message);
                if (index === conversation.messages.length - 1) last_message_text = message;
            })
            messages_array.push(conv_messages);
            const id = conversation.user2_data.id;
            const user_name = conversation.user2_data.name;
            createConvLink(last_message_text, user_name, id);
        })
        await loadMoreMessages();
        return data.results;
    } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
        return [];
    }

}


async function loadMoreMessages() {
    messages_array.forEach((messages, index) => {
        const chat_block = makeNewChatElem(conversations_array[index].user2_data.name, conversations_array[index].user2_data.id);
        messages.forEach(message => {
            addMessageToChatLog(message, chat_block);
        })
    });
}

function addMessageToChatLog(message, chatblock) {
    const message_div = document.createElement("div");
    const span = document.createElement("span");
    message_div.classList.add("message");
    span.innerHTML = message.content;
    message_div.appendChild(span);
    const Class = message.sender === user_id ? "right" : "left";
    message_div.classList.add(Class);
    chatblock.querySelector("[data-chat-log]").append(message_div);
}

if (user_id) {
    connect();
    loadConversations();
}