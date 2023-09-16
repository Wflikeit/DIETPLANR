const appointments = document.querySelectorAll("[data-appointment]");
const appointment_counts = document.querySelectorAll("[data-appointment-count]");
const dialog = document.querySelector("[data-appointment-dialog]");
const dialog_content_div = dialog.querySelector(".content");
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
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
monthButton.style.display = "block";
yearButton.style.display = "none";
appointments.forEach(appointment => {
    setTimeout(() => {
        addEventsToAppointment(appointment);
    }, 500);
})
appointment_counts.forEach(count_elem => {
    setTimeout(() => {
        addEventsToAppointmentCount(count_elem);
    }, 500);
})
document.querySelectorAll("[data-day]").forEach(day => {
    setTimeout(() => {
        addDropEventToDay(day);
    }, 500);
})

function makeCalendar(year, month_num) {
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
        addDropEventToDay(day);
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
    const appointmentDate = new Date(appointment.date);
    const appointment_div = document.createElement("div");
    const time_div = document.createElement("div");
    const duration_div = document.createElement("div");
    const title_div = document.createElement("div");
    const dialog_appointment_form = makeDialogContentForm(appointment);

    appointment_div.classList.add("appointment");
    time_div.classList.add("time");
    duration_div.classList.add("duration");
    title_div.classList.add("title");
    dialog_appointment_form.classList.add("d-none", "dialog-form");
    dialog_appointment_form.method = "POST";
    appointment_div.setAttribute("data-appointment", key);
    appointment_div.setAttribute("draggable", "true");
    dialog_appointment_form.setAttribute("data-dialog-content", key);
    const totalSeconds = parseInt(appointment.event_duration);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    title_div.innerHTML = appointment.title;
    time_div.innerHTML = `${appointmentDate.getHours().toString().padStart(2, '0')}:${appointmentDate.getMinutes().toString().padStart(2, '0')}`;
    duration_div.innerHTML = `Duration: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    appointment_div.append(time_div, title_div, duration_div);
    dialog_content_div.append(dialog_appointment_form);
    addEventsToAppointment(appointment_div);
    return appointment_div;
}

function makeDialogContentForm(appointment){
    if(!appointment.hasOwnProperty('title')) appointment = {
                    title: dragged_elem.querySelector(".title").innerHTML.replace(/\s/g, ""),
                    time: dragged_elem.querySelector(".time").innerHTML.replace(/\s/g, "")
                }
    const dialog_appointment_form = document.createElement("form");
    const title_input = document.createElement("input");
    const duration_select = document.createElement("select");
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    const time_input = document.createElement("input");
    const submit_button = document.createElement("button");
    const title_div = document.createElement("div");
    title_div.innerHTML = appointment.title;
    title_input.value = appointment.title;
    time_input.value = appointment.time;
    option1.value = "30:00";
    option2.value = "60:00";
    title_input.type = "text";
    time_input.type = "time";
    duration_select.name = "duration";
    time_input.name = "time";
    title_input.name = "title";
    submit_button.setAttribute("data-dialog-form-button", "");
    option1.innerHTML = "30:00";
    option2.innerHTML = "60:00";
    submit_button.innerHTML = "SUBMIT";
    duration_select.append(option1, option2);
    dialog_appointment_form.append(title_div, title_input, duration_select, time_input, submit_button);
    return dialog_appointment_form;
}
function addEventsToAppointment(appointment_div) {
    const calendar_rect = calendar.getBoundingClientRect();
    appointment_div.addEventListener("dragstart", function (e) {
        e.dataTransfer.setDragImage(this, 0, 0);
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
    appointment_div.addEventListener("dragend", (e) => {
        appointment_div.classList.remove("dragging");
    })
    appointment_div.addEventListener("click", () => {
        dialog.querySelectorAll("[data-dialog-content]").forEach(element => {
            if (element.dataset.dialogContent === appointment_div.dataset.appointment) {
                element.classList.remove("d-none");
            } else element.classList.add("d-none");
        })
        dialog.showModal();
    })
}

function addDropEventToDay(day) {
    day.addEventListener("dragover", e => {
        e.preventDefault();
    })
    day.addEventListener("drop", () => {
        const appointment_count = day.querySelector("[data-appointment-count]");
        if(dragged_elem && day.querySelector("[data-appointment]") != dragged_elem){
            if (appointment_count) {
                const count = parseInt(appointment_count.dataset.appointmentCount) + 1;
                appointment_count.setAttribute("data-appointment-count", count);
                appointment_count.innerHTML = `Appointment count: ${count}`;
                const dialog_appointment_form = makeDialogContentForm(dragged_elem);
                dialog_content_div.querySelector(`[data-dialog-content="${dragged_elem.dataset.appointment}"]`).remove();
                dialog_content_div.querySelector(`[data-dialog-content="${appointment_count.dataset.value}"]`).append(dialog_appointment_form);
                dragged_elem.remove();
                dragged_elem = null;
            } else if (day.querySelector("[data-appointment]")) {
                const first_app_div = day.querySelector("[data-appointment]");
                const app_count_div = document.createElement("div");
                app_count_div.classList.add("appointment-count");
                app_count_div.setAttribute("data-appointment-count", "2");
                app_count_div.setAttribute("data-value", first_app_div.dataset.appointment);
                app_count_div.innerHTML = "Appointment count: 2";
                first_app_div.remove();
                dialog_content_div.querySelector(`[data-dialog-content="${dragged_elem.dataset.appointment}"]`).setAttribute("data-dialog-content", first_app_div.dataset.appointment);
                addEventsToAppointmentCount(app_count_div);
                day.append(app_count_div);
                dragged_elem.remove();
                dragged_elem = null;
            }else{
                day.append(dragged_elem);
                dragged_elem = null;
            }
        }

    })
}

function addEventsToAppointmentCount(appointment_count) {
    appointment_count.addEventListener("click", () => {
        dialog.querySelectorAll("[data-dialog-content]").forEach(element => {
            if (element.dataset.dialogContent === appointment_count.dataset.value || element.dataset.dialogContent === appointment_count.dataset.appointment) {
                element.classList.remove("d-none");
            } else element.classList.add("d-none");
        })
        dialog.showModal();
    })
}

monthButton.addEventListener("click", function () {
    calendar.innerHTML = monthsList.map((month, index) => `<div class="month" data-number="${index + 1}">${month}</div>`).join('');
    calendar.classList.add("different-form");
    calendar.querySelectorAll(".month").forEach(month => {
        month.addEventListener("click", function () {
            prepareCalendarContainer(this, 1)
        });
    });
    monthButton.innerHTML = `${monthsList[selectedMonth - 1]}-${selectedYear}`;
    yearButton.innerHTML = `${selectedYear}`;
    monthButton.style.display = "none";
    tenYearsButton.style.display = "none";
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
    let direction = 'up';
    prepareCalendarContainer(direction, 0);
})
arrowDown.addEventListener("click", function () {
    let direction = 'down';
    prepareCalendarContainer(direction, 0);

})


function prepareCalendarContainer(param, is_month) {
    let calendar_elem = null;
    fetch(`/api/appointments/`)
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
            if (!is_month) {
                let newMonth;
                let newYear;
                if (param === 'up') {
                    newYear = selectedMonth < 12 ? selectedYear : selectedYear + 1;
                    newMonth = selectedMonth < 12 ? selectedMonth + 1 : 1;
                    calendar_elem = makeCalendar(newYear, newMonth);
                    calendar_elem.classList.add("from-down");
                } else if (param === 'down') {
                    newYear = selectedMonth > 1 ? selectedYear : selectedYear - 1;
                    newMonth = selectedMonth > 1 ? selectedMonth - 1 : 12;
                    calendar_elem = makeCalendar(newYear, newMonth);
                    calendar_elem.classList.add("from-up");
                }
                selectedYear = newYear;
                selectedMonth = newMonth;
            } else {
                calendar_elem = makeCalendar(selectedYear, param.dataset.number);
                calendar_elem.classList.add("from-up");
                selectedMonth = parseInt(param.dataset.number);
            }
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
                            const appointment_count_div = document.createElement("div");
                            appointment_count_div.setAttribute("data-appointment-count", group.length);
                            appointment_count_div.setAttribute("data-value", key);
                            addEventsToAppointmentCount(appointment_count_div);
                            dialog_content_div.append(makeDialogContentForm(appointment));
                            appointment_count_div.innerHTML = `Appointment count: ${group.length}`;
                            appointment_count_div.classList.add("appointment-count");
                            day.append(appointment_count_div);
                            break;
                        }
                    }
                }
            }
            if (dragged_elem) {
                const dragged_date = new Date(dragged_elem.dataset.appointment);
                if (dragged_date.getFullYear() === selectedYear && dragged_date.getMonth() === selectedMonth - 1)
                    dragged_elem.remove();
                dragged_elem = null;
            }
            calendar.remove();
            calendar = calendar_elem;
            calendar_container.append(calendar);
            originalCalendarContent = calendar.innerHTML;
            monthButton.innerHTML = `${monthsList[selectedMonth - 1]}-${selectedYear}`;
            yearButton.innerHTML = `${selectedYear}`;
            yearButton.style.display = "none";
            tenYearsButton.style.display = "none";
            monthButton.style.display = "block";
        });
}


