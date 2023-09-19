const input = document.getElementById("search-client");
const client_records = document.querySelectorAll("[data-client]");
const search_icon = document.querySelector("[data-search-icon]");
input.addEventListener("input", () =>{
    const value = input.value.toLowerCase();
    console.log(value);
    search_icon.classList.toggle("d-none", value.length >= 20);
    client_records.forEach(record => {
        const name = record.dataset.client.toLowerCase();
        record.classList.toggle("d-none", !name.includes(value));
    })
})