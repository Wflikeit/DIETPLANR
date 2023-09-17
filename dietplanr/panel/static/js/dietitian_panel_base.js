const sidebar = document.querySelector("[data-sidebar]");
const links = sidebar.querySelectorAll("[data-sidebar-link]");
links.forEach(link => {
    if (link.href == window.location.href) link.classList.add("active");
});

const clientsActivitySpan = document.getElementsByClassName("clients-span")[0];
const messagesSpan = document.getElementsByClassName("messages-span")[0];
const appointmentsSpan = document.getElementsByClassName("appointments-span")[0];
// const overviewWrappers = document.getElementsByClassName("overview-container")[0]
//     .querySelectorAll('[class$="-wrapper"]');
// console.log(overviewWrappers)
fetch("http://127.0.0.1:8000/api/notifications/")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach((element)=>{
            const span = document.createElement('span')
            switch (element["type"]){
                case 'message':

                    console.log(element['title']);
                    span.textContent = element['title'];
                    span.classList.add('message')
                    messagesSpan.appendChild(span);
                    break;
            }
            // span
        })
    });
// console.log(overviewWrappers)