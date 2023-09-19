const createRecipeButton = document.querySelectorAll('.create-recipe');
const personalizeButtons = document.querySelectorAll('.personalize-btn');
const recipeButtons = Array.from(createRecipeButton).concat(Array.from(personalizeButtons));
const recipeForm = document.getElementById('recipe-form-wrapper');
const recipeTable = document.getElementById('recipes-table');


recipeForm.addEventListener("click", (event) => {
    if (event.target === recipeForm) {
        closeModal();
    }
});
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let recipeTitle = recipeForm.getElementsByClassName('recipe-form-title')[0].textContent;
    let recipeRow = document.createElement('tr')
    for (let i = 0; i < 6; i++) {
        let recipeInfo = document.createElement('td');
        switch (i) {
            case 0:
                recipeInfo.innerHTML = recipeTitle;
                break;
            case 1:
                recipeInfo.innerHTML = "20g";
                break;
            case 2:
                recipeInfo.innerHTML = "45g";
                break;
            case 3:
                recipeInfo.innerHTML = "24g";
                break;
            case 4:
                recipeInfo.innerHTML = "xxx";
                break;
            case 5: {
                let button = document.createElement('button');
                button.classList.add('personalize-btn');
                button.textContent = 'Personalize';
                recipeInfo.appendChild(button);
                break;
            }
        }
        recipeRow.appendChild(recipeInfo);
    }
    recipeTable.appendChild(recipeRow);


    closeModal();
})
recipeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (recipeForm.hasAttribute('open')) {
            closeModal();
        } else {
            openModal(button.getAttribute('data-recipe-id'));
        }
    });
});

function closeModal() {
    recipeForm.classList.remove("modal");
    recipeForm.close();

}

function openModal(recipeId) {
    recipeForm.showModal();

    if (recipeId) {
        fetchRecipe(`/api/recipes/${recipeId}/personalize/`, false);
    } else {
        const randomRecipeId = getRandomRecipeId();
        fetchRecipe(`https://api.spoonacular.com/recipes/${randomRecipeId}/information?apiKey=2b74ec79341f45c2a24fa427b5e79fcf&includeNutrition=true`, true);
        // let {cheap, dairyFree, vegetarian, vegan, instructions, summary, nutrition, title} = recipeExample;
        // recipeExample = {cheap, dairyFree, vegetarian, vegan, instructions, summary, nutrition, title}
        // updateExternalApiFields(recipeExample);
        // let nutrients = nutrition['nutrients'].filter(nutrient => {
        //     return nutrient.name === "Protein" || nutrient.name === "Fat" || nutrient.name === "Calories";
        // });
        // updateMacroFields(nutrients);
        // console.log(nutrients);
    }
}

function fetchRecipe(url, extendApi) {
    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (extendApi) {
                    let {cheap, dairyFree, vegetarian, vegan, instructions, summary, nutrition, title} = data;
                    data = {cheap, dairyFree, vegetarian, vegan, instructions, summary, nutrition, title}
                    updateExternalApiFields(data)
                } else updateFormFields(data);
                const nutrients = getRequiredNutrients(data['nutrition']['nutrients']);
                updateMacroFields(nutrients);
            });
    } catch (e) {
        console.log(e.message);
    }
}

function getRandomRecipeId() {
    const minId = 1;
    const maxId = 5000; 
    return Math.floor(Math.random() * (maxId - minId + 1)) + minId;
}


function getRequiredNutrients(nutrients) {
    return nutrients.filter(nutrient => ["Protein", "Fat", "Calories"].includes(nutrient.name));
}


function updateFormFields(data) {
    ingredientsBox.innerHTML = "";

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            console.log(key);
            try {
                switch (key) {
                    case 'title':
                        document.getElementsByClassName('recipe-form-title')[0].textContent = data[key];
                        break;
                    case 'assigned_to_full_name':
                        updateDropdownField(key, data[key]);
                        break;
                    case 'instructions':
                    case 'summary':
                        updateTextField(key, data[key]);
                        break;
                    case 'ingredients':
                        updateIngredientsField(data[key]);
                        break;
                    case "cheap":
                    case "vegetarian" :
                    case "vegan" :
                    case "dairyFree" :
                    case "is_personalized" :
                    case "finished" :
                        updateCheckboxField(key, data[key]);
                        break;
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    }
}

function updateExternalApiFields(data) {
    ingredientsBox.innerHTML = "";
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            try {
                console.log(key)
                switch (key) {
                    case 'title':
                        document.getElementsByClassName('recipe-form-title')[0].textContent = data[key];
                        break;
                    case 'assigned_to':
                        updateDropdownField(key, data[key]);
                        break;
                    case 'instructions':
                    case 'summary':
                        updateTextField(key, data[key]);
                        break;
                    case 'nutrition':
                        let ingredients = data[key]['ingredients']
                        console.log(ingredients)
                        updateIngredientsField(ingredients);

                        break;
                    case "cheap":
                    case "vegetarian" :
                    case "vegan" :
                    case "dairyFree" :
                        updateCheckboxField(key, data[key]);
                        break;
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    }
}

function updateMacroFields(macrosData) {
    const macros = document.getElementById('recipe-macros');
    macros.innerHTML = '';
    macrosData.forEach((macro) => {
        macros.textContent += `${macro.name[0]}:${Math.floor(macro.amount)}${macro.unit}\n`;
    });
}

function updateDropdownField(key, values) {
    const selectElement = document.getElementById('dropdown-input');
    selectElement.innerHTML = '';

    const uniqueValues = new Set();

    values.forEach((value) => {
        if (!uniqueValues.has(value)) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
            uniqueValues.add(value); 
        }
    });

    fetch("http://127.0.0.1:8000/api/clients/")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach((value) => {
                const name = value['client_data'].name;
                if (!uniqueValues.has(name)) { 
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    selectElement.appendChild(option);
                    uniqueValues.add(name); 
                }
            });
        });
}


function updateTextField(key, value) {
    const input = document.getElementById(`input-${key}`);
    const label = document.querySelector(`label[for="${input.id}"]`);
    label.style.display = 'inline';
    input.style.display = 'inline';
    input.value = value;
}

// function updateIngredientsField(ingredientsData) {
//     const box = document.querySelector('.input-ingredients');
//     ingredientsData.ingredients.forEach((ingredient) => {
//         const outerSpan = document.createElement('span');
//         const textSpan = document.createElement('span');
//         const iconSpan = document.createElement('span');
//         iconSpan.className = 'icon';
//         textSpan.className = 'text';
//         textSpan.textContent = ingredient;
//         outerSpan.appendChild(textSpan);
//         outerSpan.appendChild(iconSpan);
//         box.appendChild(outerSpan);
//     });
// }

function updateCheckboxField(key, value) {
    const shortInput = document.getElementById(`input-${key}`);
    const label = document.querySelector(`label[for="${shortInput.id}"]`);
    label.style.display = 'inline';
    shortInput.checked = value;
}

const ingredientsInput = document.getElementById('input-ingredients');
const ingredientsBox = document.querySelector('.ingredients-container');

ingredientsInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission

        const inputValue = ingredientsInput.value.trim();
        if (inputValue !== '') {
            const ingredient = createIngredient(inputValue);
            prependToContainer(ingredientsBox, ingredient);
            ingredientsInput.value = '';
        }
    }
});

function createIngredient(name) {
    const outerSpan = document.createElement('span');
    outerSpan.className = 'ingredient';

    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = name;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';
    iconSpan.addEventListener('click', () => {
        outerSpan.remove();
    })

    const svgIcon = createSvgIcon();
    iconSpan.appendChild(svgIcon);

    outerSpan.appendChild(textSpan);
    outerSpan.appendChild(iconSpan);

    return outerSpan;
}

function createSvgIcon() {
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgIcon.setAttribute("width", "20");
    svgIcon.setAttribute("height", "24");
    svgIcon.setAttribute("viewBox", "0 0 34 24");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203");
    path.setAttribute('preserveAspectRatio', "xMidYMid meet");

    svgIcon.appendChild(path);

    return svgIcon;
}

function prependToContainer(container, element) {
    const firstChild = container.firstChild;
    if (firstChild) {
        container.insertBefore(element, firstChild);
    } else {
        container.appendChild(element);
    }
}

// Function to update ingredients based on data (you can call this when needed)
function updateIngredientsField(ingredientsData) {
    ingredientsBox.innerHTML = "";
    if (ingredientsData.ingredients) {
        ingredientsData.ingredients.forEach((ingredient) => {
            const ingredientElement = createIngredient(ingredient);
            prependToContainer(ingredientsBox, ingredientElement);
        });
    } else {
        ingredientsData.forEach((ingredient) => {
            const ingredientElement = createIngredient(ingredient.name);
            prependToContainer(ingredientsBox, ingredientElement);

        })

    }


}
