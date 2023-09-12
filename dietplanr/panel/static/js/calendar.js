const appointments = document.querySelectorAll("[data-appointment]");
const dialog = document.querySelector("[data-appointment-dialog]");
const dialogContent = dialog.querySelectorAll("[data-dialog-content]");
const dialog_content_div = dialog.querySelector(".content");
appointments.forEach(appointment => {
    appointment.addEventListener("click", () => {
        dialogContent.forEach(element => {
            if (element.dataset.dialogContent === appointment.dataset.appointment) {
                element.classList.remove("d-none");
            } else element.classList.add("d-none");
        })
        dialog.showModal();
    })
})

let dragged_elem;
let calendar = document.querySelector('.calendar');
let calendar_container = document.querySelector('.calendar-container');
let originalCalendarContent = calendar.innerHTML;
let selectedMonth = parseInt(document.getElementById("selected_month").innerHTML);
let selectedYear = parseInt(document.getElementById("selected_year").innerHTML);
const monthButton = document.getElementById("month-button");
const yearButton = document.getElementById("year-button");
const tenYearsButton = document.getElementById("ten-years-button");
const arrowUp = document.getElementById("arrow-up");
const arrowDown = document.getElementById("arrow-down");
const monthsList = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
monthButton.style.display = "block";
yearButton.style.display = "none";

function makeCalendar(year, month_num) {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const calendar = document.createElement("div");
    calendar.classList.add("calendar");
    const last_day_prev_month = new Date(new Date(year, month_num - 1, 1));
    last_day_prev_month.setDate(0);
    const prev_days = last_day_prev_month.getDay();
    const days_count = new Date(year, month_num, 0).getDate();
    const days_count_prev_month = new Date(year, month_num - 1, 0).getDate();
    const current_date = new Date();
    weekdays.forEach(day => {
        const weekday = document.createElement("div");
        weekday.classList.add("weekday");
        weekday.innerHTML = `${day}`;
        calendar.append(weekday);
    });
    for (let i = days_count_prev_month + 1 - prev_days; i <= days_count_prev_month; i++) {
        const prev_day = document.createElement("div");
        prev_day.classList.add("diff_day");
        prev_day.innerHTML = `${i}`;
        calendar.append(prev_day);
    }
    for (let i = 1; i <= days_count; i++) {
        const day = document.createElement("div");
        day.classList.add("day");
        day.addEventListener("dragover", e => {
            e.preventDefault();
        })
        day.addEventListener("drop", () => {
            let appointment_count = Array.from(document.querySelectorAll(".appointment-count-container")).find(appointment_count => day.contains(appointment_count))
            if (appointment_count) {
                dragged_elem.remove();
                dragged_elem = null;
                const count = parseInt(appointment_count.dataset.count) + 1;
                appointment_count.setAttribute("data-count", count);
                appointment_count.innerHTML = `Appointment count: ${count}`;
            } else {
                day.append(dragged_elem);
            }

        })
        if (i === current_date.getDate() && year === current_date.getFullYear() && month_num - 1 === current_date.getMonth()) day.classList.add("current_day");
        day.innerHTML = `${i}`;
        calendar.append(day);
    }
    for (let i = 1; i <= 42 - days_count - prev_days; i++) {
        const next_day = document.createElement("div");
        next_day.classList.add("diff_day");
        next_day.innerHTML = `${i}`;
        calendar.append(next_day);
    }
    return calendar;
}

function makeAppointment(appointment, key) {
    const calendar_rect = calendar.getBoundingClientRect();
    const appointmentDate = new Date(appointment.date);
    const appointment_div = document.createElement("div");
    appointment_div.classList.add("appointment");
    const time_div = document.createElement("div");
    time_div.classList.add("time");
    const duration_div = document.createElement("div");
    duration_div.classList.add("duration");
    const title_div = document.createElement("div");
    title_div.classList.add("title");
    title_div.innerHTML = appointment.title;
    time_div.innerHTML = `${appointmentDate.getHours().toString().padStart(2, '0')}:${appointmentDate.getMinutes().toString().padStart(2, '0')}`;
    const totalSeconds = parseInt(appointment.event_duration);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    duration_div.innerHTML = `Duration: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    appointment_div.append(time_div, title_div, duration_div);
    appointment_div.setAttribute("data-appointment", key);
    appointment_div.setAttribute("draggable", "true");
    const dialog_appointment = document.createElement("div");
    dialog_appointment.setAttribute("data-dialog-content", key);
    dialog_appointment.classList.add("d-none");
    dialog_appointment.innerHTML = appointment.title;
    dialog_content_div.append(dialog_appointment);
    appointment_div.addEventListener("click", () => {
        dialog.querySelectorAll("[data-dialog-content]").forEach(element => {
            if (element.dataset.dialogContent === appointment_div.dataset.appointment) {
                element.classList.remove("d-none");
            } else element.classList.add("d-none");
        })
        dialog.showModal();
    })
    appointment_div.addEventListener("dragstart", function () {
        this.classList.add("dragging");
        dragged_elem = this;
    })
    let timeoutId = null;
    appointment_div.addEventListener("drag", function (e) {
        if (e.clientY < calendar_rect.top) {
            if (!this.dragging) {
                clearTimeout(timeoutId);
                this.dragging = true;
                timeoutId = setTimeout(() => {
                    arrowUp.click();
                    this.dragging = false;
                }, 600);
            }
        } else if (e.clientY > calendar_rect.bottom) {
            if (!this.dragging) {
                clearTimeout(timeoutId);
                this.dragging = true;
                timeoutId = setTimeout(() => {
                    arrowDown.click();
                    this.dragging = false;
                }, 600);
            }
        } else {
            clearTimeout(timeoutId);
            this.dragging = false;
        }
    });
    appointment_div.addEventListener("dragend", function () {
        this.classList.remove("dragging");
        dragged_elem = null;
    })
    return appointment_div;
}

monthButton.addEventListener("click", function () {
    calendar.innerHTML = monthsList.map((month, index) => `<div class="month" data-number="${index + 1}">${month}</div>`).join('');
    calendar.classList.add("different-form");
    calendar.querySelectorAll(".month").forEach(month => {
        month.addEventListener("click", function () {
            let calendar_elem = null;
            fetch(`/api/get-appointments`)
                .then(response => response.json())
                .then(data => {
                    const groupedAppointments = {};
                    for (const appointment of data) {
                        const appointmentDate = new Date(appointment.date);
                        const key = appointmentDate.toISOString().split('T')[0];
                        if (!groupedAppointments[key]) {
                            groupedAppointments[key] = [];
                        }
                        groupedAppointments[key].push(appointment);
                    }
                    calendar_elem = makeCalendar(selectedYear, this.dataset.number);
                    selectedMonth = parseInt(this.dataset.number);
                    dialog_content_div.innerHTML = "";
                    const days = calendar_elem.querySelectorAll(".day");
                    for (const key in groupedAppointments) {
                        const groupDate = new Date(key);
                        const group = groupedAppointments[key];
                        for (const appointment of group) {
                            const day = Array.from(days).find(day => selectedYear === groupDate.getFullYear() && selectedMonth - 1 === groupDate.getMonth() && parseInt(day.innerHTML) === groupDate.getDate());
                            if (day) {
                                if (group.length === 1) {
                                    const appointment_div = makeAppointment(appointment, key);
                                    day.append(appointment_div);
                                } else if (group.indexOf(appointment) === 0) {
                                    const count_container = document.createElement("div");
                                    count_container.classList.add("appointment-count-container");
                                    count_container.setAttribute("data-count", group.length);
                                    const appointment_count_div = document.createElement("div");
                                    appointment_count_div.innerHTML = `Appointment count: ${group.length}`;
                                    appointment_count_div.classList.add("appointment-count");
                                    appointment_count_div.addEventListener("click", function () {
                                        content_div.classList.remove("d-none");
                                    })
                                    const content_div = document.createElement("div");
                                    content_div.classList.add("content", "d-none");
                                    for (const appointment_item of group) {
                                        const appointment_div = makeAppointment(appointment_item, key);
                                        content_div.append(appointment_div);
                                    }
                                    count_container.append(appointment_count_div, content_div);
                                    day.append(count_container);
                                    break;
                                }
                            }
                        }
                    }
                    calendar_elem.classList.add("from-up");
                    calendar.remove();
                    calendar = calendar_elem;
                    calendar_container.append(calendar);
                    originalCalendarContent = calendar.innerHTML;
                    yearButton.style.display = "none";
                    tenYearsButton.style.display = "none";
                    monthButton.innerHTML = `${monthsList[selectedMonth - 1]}-${selectedYear}`;
                    yearButton.innerHTML = `${selectedYear}`;
                    monthButton.style.display = "block";
                });

        });
    });
    monthButton.style.display = "none";
    tenYearsButton.style.display = "none";
    monthButton.innerHTML = `${monthsList[selectedMonth - 1]}-${selectedYear}`;
    yearButton.innerHTML = `${selectedYear}`;
    yearButton.style.display = "block";
});
tenYearsButton.addEventListener("click", function () {
    calendar.innerHTML = originalCalendarContent;
    calendar.classList.remove("different-form");
    yearButton.style.display = "none";
    monthButton.style.display = "block";
    tenYearsButton.style.display = "none";
});
yearButton.addEventListener("click", function () {
    const yearsList = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031'];
    calendar.innerHTML = yearsList.map(year => `<div class="year" data-number="${year}">${year}</div>`).join('');
    calendar.classList.add("different-form");
    calendar.querySelectorAll(".year").forEach(year => {
        year.addEventListener("click", function () {
            selectedYear = parseInt(this.dataset.number);
            monthButton.click();
        });
    });
    yearButton.style.display = "none";
    monthButton.display = "none"
    tenYearsButton.style.display = "block";
});
arrowUp.addEventListener("click", function () {
    let direction = 'up'
    prepareCalendarContainer(direction);
})
arrowDown.addEventListener("click", function () {
    let direction = 'down'
    prepareCalendarContainer(direction);

})


function prepareCalendarContainer(direction) {
    let calendar_elem = null;

    fetch(`/api/get-appointments`)
        .then(response => response.json())
        .then(data => {
            const groupedAppointments = {};
            for (const appointment of data) {
                const appointmentDate = new Date(appointment.date);
                const key = appointmentDate.toISOString().split('T')[0];
                if (!groupedAppointments[key]) {
                    groupedAppointments[key] = [];
                }
                groupedAppointments[key].push(appointment);
            }
            let newMonth;
            let newYear;
            if (direction === 'up') {
                newYear = selectedMonth < 12 ? selectedYear : selectedYear + 1;
                newMonth = selectedMonth < 12 ? selectedMonth + 1 : 1;
            } else if (direction === 'down') {
                newYear = selectedMonth > 1 ? selectedYear : selectedYear - 1;
                newMonth = selectedMonth > 1 ? selectedMonth - 1 : 12;
            }

            calendar_elem = makeCalendar(newYear, newMonth);
            selectedYear = newYear;
            selectedMonth = newMonth;
            dialog_content_div.innerHTML = "";
            const days = calendar_elem.querySelectorAll(".day");
            for (const key in groupedAppointments) {
                const groupDate = new Date(key);
                const group = groupedAppointments[key];
                for (const appointment of group) {
                    const day = Array.from(days).find(day => selectedYear === groupDate.getFullYear() && selectedMonth - 1 === groupDate.getMonth() && parseInt(day.innerHTML) === groupDate.getDate());
                    if (day) {
                        if (group.length === 1) {
                            const appointment_div = makeAppointment(appointment, key);
                            day.append(appointment_div);
                        } else if (group.indexOf(appointment) === 0) {
                            const count_container = document.createElement("div");
                            count_container.classList.add("appointment-count-container");
                            count_container.setAttribute("data-count", group.length);
                            const appointment_count_div = document.createElement("div");
                            appointment_count_div.innerHTML = `Appointment count: ${group.length}`;
                            appointment_count_div.classList.add("appointment-count");
                            appointment_count_div.addEventListener("click", function () {
                                content_div.classList.remove("d-none");
                            })
                            const content_div = document.createElement("div");
                            content_div.classList.add("content", "d-none");
                            for (const appointment_item of group) {
                                const appointment_div = makeAppointment(appointment_item, key);
                                content_div.append(appointment_div);
                            }
                            count_container.append(appointment_count_div, content_div);
                            day.append(count_container);
                            break;
                        }
                    }
                }
            }
            calendar_elem.classList.add("from-down");
            calendar.remove();
            calendar = calendar_elem;
            calendar_container.append(calendar);
            originalCalendarContent = calendar.innerHTML;
            yearButton.style.display = "none";
            tenYearsButton.style.display = "none";
            monthButton.innerHTML = `${monthsList[selectedMonth - 1]}-${selectedYear}`;
            yearButton.innerHTML = `${selectedYear}`;
            monthButton.style.display = "block";
        });
}


