const sidebar = document.querySelector("[data-sidebar]");
const links = sidebar.querySelectorAll("[data-sidebar-link]");
links.forEach(link => {
    if (link.href == window.location.href) link.classList.add("active");
})
fetch("http://127.0.0.1:8000/api/notifications/")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });