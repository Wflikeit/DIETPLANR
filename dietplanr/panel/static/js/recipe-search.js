const input = document.getElementById("search-recipe");
const recipe_records = document.querySelectorAll("[data-recipe]");
const search_icon = document.querySelector("[data-search-icon]");
input.addEventListener("input", () =>{
    const value = input.value.toLowerCase();
    search_icon.classList.toggle("d-none", value.length >= 20);
    recipe_records.forEach(record => {
        const name = record.dataset.recipe.toLowerCase();
        console.log(name);
        record.classList.toggle("d-none", !name.includes(value));
    })
})