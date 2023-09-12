const personalizeButtons = document.querySelectorAll('.personalize-btn');
const recipeForm = document.getElementById('recipe-form-wrapper');

recipeForm.addEventListener("click", (event) => {
    if (event.target === recipeForm) {
        closeModal();
    }
});

personalizeButtons.forEach((button) => {
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
    fetch(`/api/personalise-reicipe/${recipeId}`)
        .then(response => response.json())
        .then(data => {
            updateFormFields(data);
        });
}

function updateFormFields(data) {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            try {
                switch (key) {
                    case 'title':
                        document.getElementById('recipe-form-title').textContent = data[key];
                        break;
                    case 'macros':
                        updateMacroFields(data[key]);
                        break;
                    case 'assigned_to':
                        updateDropdownField(key, data[key]);
                        break;
                    case 'instructions':
                    case 'summary':
                        updateTextField(key, data[key]);
                        break;
                    case 'ingredients':
                        updateIngredientsField(data[key]);
                        break;
                    default:
                        updateCheckboxField(key, data[key]);
                        break;
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    }
    addSubmitButton();
}

function updateMacroFields(macrosData) {
    const macros = document.getElementById('recipe-macros');
    const indicesToShow = ['Calories', 'Protein', 'Fat', 'Carbohydrates'];
    macros.textContent = "";
    indicesToShow.forEach((indice) => {
        const macro = macrosData.nutrients.find(nutrient => nutrient.name === indice);
        if (macro) {
            macros.textContent += `${macro.name[0]}:${Math.floor(macro.amount)}${macro.unit}\n`;
        }
    });
}

function updateDropdownField(key, values) {
    const selectElement = document.getElementById('dropdown-input');
    selectElement.innerHTML = '';
    values.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
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
    const div = document.querySelector(`.checkbox-wrapper-${key}`);
    const shortInput = document.getElementById(`input-${key}`);
    const label = document.querySelector(`label[for="${shortInput.id}"]`);
    label.style.display = 'inline';
    shortInput.checked = value;
    const element = document.createElement('span');
    element.textContent = key;
    if (div.querySelector("span"))
        div.querySelector("span").remove();
    div.appendChild(element);
}

function addSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
}

const input = document.getElementById('input-ingredients');
const box = document.querySelector('.ingredients-container');

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission

        const inputValue = input.value.trim();
        if (inputValue !== '') {
            const ingredient = createIngredient(inputValue);
            prependToContainer(box, ingredient);
            input.value = '';
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
    box.innerHTML = "";
    ingredientsData.ingredients.forEach((ingredient) => {
        const ingredientElement = createIngredient(ingredient);
        prependToContainer(box, ingredientElement);
    });
}

