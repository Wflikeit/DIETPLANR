let personalizeButtons = document.querySelectorAll('.personalize-btn');
let getTextDiv = document.getElementById('getText');
let createdDiv = null;

personalizeButtons.forEach(function (button) {
        button.onclick = function () {
            console.log('echo2');

            // const data = response.json();
            // console.log(data)
            if (createdDiv !== null) {
                createdDiv.remove();
                createdDiv = null;
            } else {
                let div = document.createElement('div');
                div.innerText = getTextDiv.innerText;

                // Dodaj klasę do diva
                div.classList.add('created-div');

                // Dodaj formularz do diva
                var form = document.createElement('form');
                var recipeId = this.getAttribute('data-recipe-id');
                console.log('Recipe ID:', recipeId);
                // const response = fetch(`http://127.0.0.1:8000/api/personalise-reicipe/${recipeId}`);
                const response = fetch(`/api/personalise-reicipe/${recipeId}`)
                    .then(response => response.json())
                    .then(data => {
                        // Handle the data here


                        for (let key in data) {
                            if (data.hasOwnProperty(key)) {
                                let nameLabel = document.createElement('label');
                                nameLabel.id = 'name-label'
                                nameLabel.textContent = key;
                                nameLabel.style.display = 'block'
                                form.appendChild(nameLabel);

                                let input = document.createElement('input');
                                input.type = 'text';
                                input.value = data[key]; // Set the value from the data object
                                input.name = key;
                                input.style.display = 'block'
                                form.appendChild(input);
                            }
                        }
                        // console.log(inputName)
                        let submitButton = document.createElement('button');
                        submitButton.type = "submit";
                        submitButton.textContent = "Submit";
                        form.appendChild(submitButton);
                        form.onsubmit = async function (event) {
                            event.preventDefault(); // Prevent default form submission
                            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                            const headers = new Headers();
                            headers.append('X-CSRFToken', csrfToken);
                            const formData = new FormData(form);
                            try {
                                const response = await fetch(`/api/personalise-reicipe/${recipeId}`, {
                                    method: 'PATCH',
                                    headers: headers,
                                    body: formData
                                });

                                if (response.ok) {
                                    console.log('Form submitted successfully');
                                } else {
                                    console.error('Form submission failed');
                                }
                            } catch (error) {
                                console.error('Error while submitting form:', error.message);
                            }
                        }
                    });


                div.appendChild(form);

                document.body.appendChild(div);
                createdDiv = div;
            }
        };
    }
)
;

