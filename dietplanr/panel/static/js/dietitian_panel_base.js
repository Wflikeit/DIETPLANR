const sidebar = document.querySelector("[data-sidebar]");
const links = sidebar.querySelectorAll("[data-sidebar-link]");
links.forEach(link => {
    if(link.href == window.location.href) link.classList.add("active");
})