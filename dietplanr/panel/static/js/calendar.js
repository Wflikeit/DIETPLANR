console.log("Sanity check from calendar.js.");


const appointments = document.querySelectorAll("[data-appointment]");
const dialog = document.querySelector("[data-dialog]");
const dialogContent = document.querySelectorAll("[data-dialog-content]");
appointments.forEach(appointment => {
    appointment.addEventListener("click", e => {
        dialogContent.forEach(element =>{
            if(element.dataset.value === e.target.dataset.value) {
                element.classList.remove("d-none");
            }
            else element.classList.add("d-none");
        })
        dialog.showModal();
    })
})
const yearSelect = document.querySelector('select[name="year"]');

// const monthsList = JSON.parse('{{ months|safe }}');

const monthSelect = document.querySelector('select[name="month"]');
const calendar = document.querySelector('.calendar'); // Tutaj należy uzupełnić odpowiedni selektor dla elementu, w którym wyświetlasz kalendarz
const originalCalendarContent = calendar.innerHTML;
yearSelect.addEventListener('input', function() {
    // for chrome works input instead of 'change'
    var selectedYear = yearSelect.value;
    console.log('Obecnie wybrany rok:', selectedYear);
    if (selectedYear === '2023') {
        // Wyświetl listę miesięcy zamiast dni
        const yearsList = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034'];
        calendar.innerHTML = yearsList.map(year => `<div>${year}</div>`).join('');
    }else {
        // Powrót do oryginalnej zawartości diva z dniami
        calendar.innerHTML = originalCalendarContent;
    }
});
monthSelect.addEventListener('input', function() {
    var selectedMonth = monthSelect.value; // Pobierz wartość wybranego roku
    console.log('Wybrany miesiac:', selectedMonth);
    // Tutaj możesz wykonać inne operacje na wybranym roku
    if (selectedMonth === '1') {
        // Wyświetl listę miesięcy zamiast dni
        const monthsList = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        calendar.innerHTML = monthsList.map(month => `<div>${month}</div>`).join('');
    }else {
        // Powrót do oryginalnej zawartości diva z dniami
        calendar.innerHTML = originalCalendarContent;
    }});


