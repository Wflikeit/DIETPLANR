const messages_container = document.getElementById("messages");
const messages = Array.from(messages_container.querySelectorAll(".message"));
let messages_array = [];
const chatIcon = document.getElementById("chat-icon");
const chat_container = document.getElementById("chat");
const chat_settings_container = chat_container.getElementsByClassName("chat-settings")[0];
const chat_settings_dropdowns = Array.from(chat_settings_container.getElementsByClassName("option-dropdown"));

chat_settings_dropdowns.forEach(dropdown =>{
    dropdown.getElementsByClassName("dropdown")[0].addEventListener("click", function (){
        dropdown.getElementsByClassName("content")[0].classList.toggle("active");
    })
})
chatIcon.addEventListener("click", function (){
    this.classList.toggle("active");
    chat_container.classList.toggle("active");
})
messages.forEach(message =>{
    if(messages_array.length == 0) {
        messages_array.push(message);
        return;
    }
    if(messages_array[messages_array.length - 1].classList.toString() != message.classList.toString()){
        if(messages_array.length > 1){
            if(messages_array[messages_array.length - 1].classList.contains("left")){
                messages_array.forEach(message => {
                    if(messages_array.indexOf(message) == 0) message.querySelector("span").style.borderRadius = "1rem 1rem 1rem 0";
                    else if(messages_array[messages_array.length - 1] == message){
                        message.style.marginTop = "0.1rem";
                        message.querySelector("span").style.borderRadius = "0 1rem 1rem 1rem";
                    }
                    else{
                        message.style.marginTop = "0.1rem";
                        message.querySelector("span").style.borderRadius = "0 1rem 1rem 0";
                    }
                })
            }
            else{
                messages_array.forEach(message => {
                    if(messages_array.indexOf(message) == 0) message.querySelector("span").style.borderRadius = "1rem 1rem 0 1rem";
                    else if(messages_array[messages_array.length - 1] == message){
                        message.style.marginTop = "0.1rem";
                        message.querySelector("span").style.borderRadius = "1rem 0 1rem 1rem";
                    }
                    else{
                        message.style.marginTop = "0.1rem";
                        message.querySelector("span").style.borderRadius = "1rem 0 0 1rem";
                    }
                })
            }
        }
        messages_array = [];
    }
    messages_array.push(message);

})
