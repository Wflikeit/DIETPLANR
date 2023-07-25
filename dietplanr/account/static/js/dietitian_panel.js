const tabs = document.querySelectorAll('[data-tab]');
const tabsArray = Array.from(tabs);
const containers = document.querySelectorAll('[data-container]');
var r = document.querySelector(':root');
var rStyle = getComputedStyle(r);
const displays = [rStyle.getPropertyValue("--clients-display"), rStyle.getPropertyValue("--calendar-display"), rStyle.getPropertyValue("--my-recipes-display"), rStyle.getPropertyValue("--settings-display")];
tabs.forEach(tab => {
    tab.addEventListener('click', (e) =>{
        e.target.classList.add('active');
        tabs.forEach(tab => {
            if(tab != e.target)
            tab.classList.remove('active');
        })
        containers.forEach(container => {
            container.style.display = 'none';
        })
        const index = tabsArray.indexOf(e.target);
        containers[index].style.display = displays[index];
    })
})