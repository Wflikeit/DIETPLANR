const buttons = Array.from(document.querySelectorAll("[data-carousel-button]"));
buttons.forEach(button =>{
    button.addEventListener("click", () =>{
        let slides = button.closest(".carousel").getElementsByClassName("slide");
        let offset = button.dataset.carouselButton == "next" ? 1 : -1;
        let activeSlide = button.closest(".carousel").querySelector("[data-active]");
        let newIndex = Array.from(slides).indexOf(activeSlide) + offset;
        if(newIndex < 0) newIndex = slides.length - 1;
        if(newIndex >= slides.length) newIndex = 0;
        delete activeSlide.dataset.active;
        Array.from(slides)[newIndex].dataset.active = "true";
    })
})