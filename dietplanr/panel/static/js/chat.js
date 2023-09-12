function makeNewChatElem(name) {
    const div = document.createElement("div");
    const i = document.createElement("i");
    const chat_input = document.createElement("input")
    const chat_button = document.createElement("button");
    const chat_log_element = div.cloneNode();
    const settings_element = div.cloneNode();
    const option_dropdown_element = div.cloneNode();
    const dropdown_element = div.cloneNode();
    const settings_content_elem = div.cloneNode();
    const chat_element = div.cloneNode();
    const chat_class = div.cloneNode();
    const chat_name_wrapper = div.cloneNode();
    const chat_name_div = div.cloneNode();
    const name_user_block = div.cloneNode();
    const message_form = div.cloneNode();
    const message_input_block = div.cloneNode();
    const emote_icon = i.cloneNode();
    const file_icon = i.cloneNode();
    const image_icon = i.cloneNode();
    const down_arrow_icon = i.cloneNode();
    const closing_icon = i.cloneNode();
    const user_icon = i.cloneNode();
    chat_element.setAttribute("data-chat", '');
    chat_element.classList.add("chat-wrapper");
    chat_element.append(settings_element, chat_class);
    chat_log_element.setAttribute("data-chat-log", "");
    chat_log_element.classList.add("custom-chat-log");
    name_user_block.append(user_icon, chat_name_div);
    name_user_block.classList.add("name-user-block");
    chat_name_wrapper.append(name_user_block, closing_icon);
    chat_name_wrapper.classList.add("chat-name-wrapper");
    chat_name_div.classList.add("chat-name");
    chat_name_div.innerHTML = name;
    message_form.classList.add("message-form");
    message_input_block.classList.add("message-input")
    message_input_block.append(chat_input, chat_button, emote_icon);
    chat_input.setAttribute("type", "text");
    chat_input.setAttribute("placeholder", "Enter your chat message here");
    chat_input.classList.add("chatMessageInput");
    chat_input.setAttribute("data-chat-message-input", "");
    chat_button.setAttribute("data-chat-message-send", "");
    chat_button.classList.add("d-none");
    message_form.append(file_icon, image_icon, message_input_block);
    closing_icon.classList.add("fa-solid", "fa-xmark");
    user_icon.classList.add("fa-regular", "fa-user", "fa-xl");
    closing_icon.addEventListener("click", function (e){
        chat_element.classList.remove("active");
        const link = chat_links.find(link => link.dataset.value == chat_element.dataset.value);
        link.classList.remove("active");
    })
    emote_icon.classList.add("fa-solid", "fa-smile");
    file_icon.classList.add("fa-solid", "fa-file");
    image_icon.classList.add("fa-regular", "fa-image");
    chat_class.classList.add("chat");
    chat_class.append(chat_name_wrapper, chat_log_element, message_form);
    settings_element.classList.add("chat-settings");
    settings_element.append(option_dropdown_element);
    option_dropdown_element.classList.add("option-dropdown");
    option_dropdown_element.append(dropdown_element, settings_content_elem);
    dropdown_element.classList.add("dropdown");
    down_arrow_icon.classList.add("fa-solid", "fa-angle-down");
    dropdown_element.append("Adjust chat", down_arrow_icon);
    settings_content_elem.classList.add("content");
    return chat_element;
}

function createChatMessage(message) {
    let message_div = document.createElement("div");
    let span = document.createElement("span");
    message_div.classList.add("message");
    span.innerHTML = message;
    message_div.appendChild(span);
    return message_div;
}

function createConvLink(last_message_text, element, id) {
    const conv_wrapper = document.createElement("div");
    const icon = document.createElement("i");
    const last_message = document.createElement("div");
    const name = document.createElement("div");
    const message_name_wrapper = document.createElement("div");
    message_name_wrapper.classList.add("wrapper");
    conv_wrapper.classList.add("conversation");
    conv_wrapper.dataset.value = id;
    icon.classList.add("fa-regular", "fa-user");
    last_message.classList.add("last-message");
    name.classList.add("name");
    name.innerHTML = element.user2_data.name;
    if (last_message_text != null) {
        const who = element.user2_data.id === last_message_text.sender ? element.user2_data.name + ": " : "Ty: ";
        if (element.user2_data.id === last_message_text.sender) last_message.classList.add("unread");
        last_message.innerHTML = who + last_message_text.content;
    }
    message_name_wrapper.append(name, last_message);
    conv_wrapper.append(icon, message_name_wrapper);
    return conv_wrapper;
}
let chatLog = document.querySelector("[data-chat_log]");
let messages_array = [];
let conversations_array = [];
let chat_containers = [];
let chat_inputs = [];
let chat_buttons = [];
let chat_links = [];

const user_action = document.getElementById("user-action");
const chatIcon = document.getElementById("chat-icon");
const conversations_container = document.getElementById("conversations");
const bars = document.getElementById("bars");
const listWrapper = document.getElementById("list-wrapper");
let current_conversation;
let user_id = null;
if (document.getElementById("user_id")) {
    user_id = document.getElementById("user_id").innerHTML;
}
if (chatIcon !== null) {
    chatIcon.addEventListener("click", function () {
        this.classList.toggle("active");
        conversations_container.classList.toggle("d-none");
        user_action.querySelector(".action-list").classList.add("d-none");
    })
}
user_action.addEventListener("click", function () {
    this.querySelector(".action-list").classList.toggle("d-none");
    conversations_container.classList.add("d-none");
})

bars.addEventListener("click", function (e){
    listWrapper.classList.toggle("active");
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
            case "chat_message":
                let Class = null
                let who = null;
                let message_div = createChatMessage(data.message);
                // console.log(data.user_id);
                if (data.user_id !== user_id) {
                    Class = "left";
                    const chat_link = chat_links.find(item => item.dataset.value === data.user_id);
                    chat_containers.find(container => container.dataset.value === data.user_id).querySelector("[data-chat-log]").append(message_div);
                    who = data.user + ": ";
                    chat_link.querySelector(".last-message").innerHTML = who + data.message;
                    if (!chat_link.classList.contains("active"))
                        chat_link.querySelector(".last-message").classList.add("unread");
                } else {
                    Class = "right";
                    // chatLog.children.item(current_conversation.index).appendChild(message_div)
                    chat_containers.find(container => container.dataset.value === current_conversation.id).querySelector("[data-chat-log]").append(message_div);
                    who = "Ty: "
                    chat_links[current_conversation.index].querySelector(".last-message").innerHTML = who + data.message;
                }
                message_div.classList.add(Class);
                break;
            case "private_message":
                // span.innerHTML = "PM to " + data.target + ": " + data.message;
                message_div = createChatMessage("PM to " + data.target + ": " + data.message);
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
        // chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onerror = function (err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }
}

connect();

let offset = 0; // Zmienna do śledzenia ofsetu wiadomości

async function loadConversations() {
    try {
        const response = await fetch(`/chat/api/get-conversations/${offset}`);
        const data = await response.json();
        let conv_messages = [];
        let last_message_text = null;
        data.results.forEach(element => {
            conversations_array.push(element)
        })
        conversations_array.forEach((element, index) => {
            conv_messages = [];
            last_message_text = null;
            const id = element.user2_data.id;
            element.messages.forEach((message, index) => {
                conv_messages.push(message);
                if (index === element.messages.length - 1) last_message_text = message;
            })
            messages_array.push(conv_messages);
            const conv_wrapper = createConvLink(last_message_text, element, id);
            chat_links.push(conv_wrapper);
            conv_wrapper.addEventListener("click", function (e) {
                chat_links.forEach(link => link.classList.remove("active"));
                this.classList.add("active");
                this.querySelector(".last-message").classList.remove("unread");
                const index = chat_links.indexOf(this);
                current_conversation = {index: chat_links.indexOf(this), id: id};
                chat_containers.forEach(container => container.classList.remove("active"));
                chat_containers.find(container => container.dataset.value === this.dataset.value).classList.add("active");
            })
            conversations_container.appendChild(conv_wrapper);
        })
        await loadMoreMessages();
        chat_inputs.forEach((input, index) => {
            input.onkeyup = function (e) {
                if (e.keyCode === 13) {  // enter key
                    chat_buttons[index].click();
                }
            };
        })
        chat_buttons.forEach((button, index) => {
            button.onclick = function () {
                if (chat_inputs[index].value.length === 0) return;
                chatSocket.send(JSON.stringify({
                    "message": chat_inputs[index].value,
                    "user_inbox": chat_links[current_conversation.index].dataset.value,  // Twój typ komunikatu

                }));
                chat_inputs[index].value = "";
            };
        })
        const chat_settings_dropdowns = chat_containers.map(container => {
            return container.querySelectorAll(".option-dropdown");
        });
        chat_settings_dropdowns.forEach((list) => {
            list.forEach(option_dropdown => {
                option_dropdown.querySelector(".dropdown").addEventListener("click", function () {
                    option_dropdown.querySelector(".content").classList.toggle("active");
                })
            })
        })
        return data.results;
    } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
        return [];
    }

}


async function loadMoreMessages() {
    messages_array.forEach((messages, index) => {
        const chatblock = makeNewChatElem(conversations_array[index].user2_data.name);
        chatblock.dataset.value = conversations_array[index].user2_data.id;
        document.body.append(chatblock);
        chat_containers.push(chatblock);
        chat_buttons.push(chatblock.querySelector("[data-chat-message-send]"));
        chat_inputs.push(chatblock.querySelector("[data-chat-message-input]"));
        messages.forEach(message => {
            addMessageToChatLog(index, message, chatblock);
        })
    });
}

function addMessageToChatLog(index, message, chatblock) {
    const message_div = document.createElement("div");
    const span = document.createElement("span");
    message_div.classList.add("message");
    span.innerHTML = message.content;
    message_div.appendChild(span);
    const Class = message.sender === user_id ? "right" : "left";
    message_div.classList.add(Class);
    chatblock.querySelector("[data-chat-log]").append(message_div);
}

loadConversations()