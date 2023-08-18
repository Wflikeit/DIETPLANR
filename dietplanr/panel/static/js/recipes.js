var personalizeButtons = document.querySelectorAll('.personalize-btn');
var getTextDiv = document.getElementById('getText');
var createdDiv = null;

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


                        data.forEach(function (info) {
                            console.log(info)
                            for (var key in info) {
                                if (info.hasOwnProperty(key)) {
                                    let nameLabel = document.createElement('label');
                                    nameLabel.id = 'name-label'
                                    nameLabel.textContent = key;
                                    form.appendChild(nameLabel);
                                    let input = document.createElement('input');
                                    input.type = 'text';
                                    input.value = info[key]
                                    input.name = key;
                                    // input.placeholder = key;
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

                                const formData = new FormData(form);
                                try {
                                    const response = await fetch('/api/personalise-reicipe/${recipeId}', {
                                        method: 'POST',
                                        body: formData
                                    });

                                    if (response.ok) {
                                        console.log('Form submitted successfully');
                                    } else {
                                        console.error('Form submission failed');
                                    }
                                } catch (error) {
                                    console.error('Error while submitting form:', error);
                                }
                            }
                        });

                    });


                div.appendChild(form);

                document.body.appendChild(div);
                createdDiv = div;
            }
        }
        ;
    }
)
;
// console.log(data[0]); // You can inspect the data in the browser's console


// var nameLabel = document.createElement('label');
// nameLabel.id = 'name-label'
// nameLabel.textContent = "Name:";
// form.appendChild(nameLabel);
//
// var inputName = document.createElement('input');
// inputName.type = "text";
// inputName.id = "inputName";
// inputName.name = "name";
// inputName.required = true;
// form.appendChild(inputName);

