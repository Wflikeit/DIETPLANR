const profileSettingsButton = document.getElementById("profile-settings-btn");
console.log(profileSettingsButton);
fetch("http://127.0.0.1:8000/api/my-profile/")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                let input = document.getElementById(key);
                input.value = data[key];
            }
        }
    });

const options = {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
    },
};

profileSettingsButton.addEventListener('click', (e) => {
    e.preventDefault();

    const updatedData = {};
    const fields = Array.from(document.getElementsByClassName('long-input'));

    fields.forEach((element) => {
        updatedData[element.id] = element.value;
    });

    options.body = JSON.stringify(updatedData);

    fetch('http://127.0.0.1:8000/api/my-profile/', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
