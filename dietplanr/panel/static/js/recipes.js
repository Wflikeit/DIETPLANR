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
        fetchRecipe(`/api/personalise-reicipe/${recipeId}`, false);
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
    const maxId = 5000; // Ustal maksymalny dostępny zakres ID
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

let recipeExample = {
    "vegetarian": false,
    "vegan": false,
    "glutenFree": true,
    "dairyFree": false,
    "veryHealthy": false,
    "cheap": false,
    "veryPopular": false,
    "sustainable": false,
    "lowFodmap": false,
    "weightWatcherSmartPoints": 7,
    "gaps": "no",
    "preparationMinutes": -1,
    "cookingMinutes": -1,
    "aggregateLikes": 0,
    "healthScore": 1,
    "creditsText": "Epicurious",
    "sourceName": "Epicurious",
    "pricePerServing": 44.87,
    "extendedIngredients": [{
        "id": 2002,
        "aisle": "Spices and Seasonings",
        "image": "aniseed-or-anise.jpg",
        "consistency": "SOLID",
        "name": "anise seeds",
        "nameClean": "anise",
        "original": "1 teaspoon anise seeds",
        "originalName": "anise seeds",
        "amount": 1,
        "unit": "teaspoon",
        "meta": [],
        "measures": {
            "us": {
                "amount": 1, "unitShort": "tsp", "unitLong": "teaspoon"
            }, "metric": {
                "amount": 1, "unitShort": "tsp", "unitLong": "teaspoon"
            }
        }
    }, {
        "id": 10219903,
        "aisle": "Baking",
        "image": "chocolate-curls.jpg",
        "consistency": "SOLID",
        "name": "chocolate shavings",
        "nameClean": "chocolate shavings",
        "original": "Garnish: chopped shelled pistachios (not dyed red); white or dark chocolate shavings, removed with a vegetable peeler",
        "originalName": "Garnish: chopped shelled pistachios (not dyed red); white or dark chocolate shavings, removed with a vegetable peeler",
        "amount": 6,
        "unit": "servings",
        "meta": ["dark", "white", "red", "with a vegetable peeler", "shelled", "chopped", "(not dyed )"],
        "measures": {
            "us": {
                "amount": 6, "unitShort": "servings", "unitLong": "servings"
            }, "metric": {
                "amount": 6, "unitShort": "servings", "unitLong": "servings"
            }
        }
    }, {
        "id": 20027,
        "aisle": "Baking",
        "image": "white-powder.jpg",
        "consistency": "SOLID",
        "name": "cornstarch",
        "nameClean": "corn starch",
        "original": "1/4 cup cornstarch",
        "originalName": "cornstarch",
        "amount": 0.25,
        "unit": "cup",
        "meta": [],
        "measures": {
            "us": {
                "amount": 0.25, "unitShort": "cups", "unitLong": "cups"
            }, "metric": {
                "amount": 32, "unitShort": "g", "unitLong": "grams"
            }
        }
    }, {
        "id": 1053,
        "aisle": "Milk, Eggs, Other Dairy",
        "image": "fluid-cream.jpg",
        "consistency": "LIQUID",
        "name": "heavy cream",
        "nameClean": "cream",
        "original": "1/3 cup heavy cream",
        "originalName": "heavy cream",
        "amount": 0.33333334,
        "unit": "cup",
        "meta": [],
        "measures": {
            "us": {
                "amount": 0.33333334, "unitShort": "cups", "unitLong": "cups"
            }, "metric": {
                "amount": 79.333, "unitShort": "ml", "unitLong": "milliliters"
            }
        }
    }, {
        "id": 9152,
        "aisle": "Produce",
        "image": "lemon-juice.jpg",
        "consistency": "LIQUID",
        "name": "lemon juice",
        "nameClean": "lemon juice",
        "original": "2 teaspoons fresh lemon juice, or to taste",
        "originalName": "fresh lemon juice, or to taste",
        "amount": 2,
        "unit": "teaspoons",
        "meta": ["fresh", "to taste"],
        "measures": {
            "us": {
                "amount": 2, "unitShort": "tsps", "unitLong": "teaspoons"
            }, "metric": {
                "amount": 2, "unitShort": "tsps", "unitLong": "teaspoons"
            }
        }
    }, {
        "id": 19335,
        "aisle": "Baking",
        "image": "sugar-in-bowl.png",
        "consistency": "SOLID",
        "name": "sugar",
        "nameClean": "sugar",
        "original": "1/2 cup plus 1 teaspoon sugar",
        "originalName": "sugar",
        "amount": 0.5,
        "unit": "cup",
        "meta": [],
        "measures": {
            "us": {
                "amount": 0.5, "unitShort": "cups", "unitLong": "cups"
            }, "metric": {
                "amount": 100, "unitShort": "g", "unitLong": "grams"
            }
        }
    }, {
        "id": 9326,
        "aisle": "Produce",
        "image": "watermelon.png",
        "consistency": "SOLID",
        "name": "watermelon",
        "nameClean": "watermelon",
        "original": "6 cups coarsely chopped seeded watermelon (from a 4 1/2-lb piece, rind discarded)",
        "originalName": "coarsely chopped seeded watermelon (from a 4 1/2-lb piece, rind discarded)",
        "amount": 6,
        "unit": "cups",
        "meta": ["seeded", "coarsely chopped", "(from a)"],
        "measures": {
            "us": {
                "amount": 6, "unitShort": "cups", "unitLong": "cups"
            }, "metric": {
                "amount": 912, "unitShort": "g", "unitLong": "grams"
            }
        }
    }],
    "id": 27929,
    "title": "Watermelon Pudding",
    "readyInMinutes": 45,
    "servings": 6,
    "sourceUrl": "http://www.epicurious.com/recipes/food/views/Watermelon-Pudding-109664",
    "image": "https://spoonacular.com/recipeImages/27929-556x370.jpg",
    "imageType": "jpg",
    "nutrition": {
        "nutrients": [{
            "name": "Calories", "amount": 182.32, "unit": "kcal", "percentOfDailyNeeds": 9.12
        }, {
            "name": "Fat", "amount": 5.5, "unit": "g", "percentOfDailyNeeds": 8.46
        }, {
            "name": "Saturated Fat", "amount": 3.29, "unit": "g", "percentOfDailyNeeds": 20.56
        }, {
            "name": "Carbohydrates", "amount": 34.13, "unit": "g", "percentOfDailyNeeds": 11.38
        }, {
            "name": "Net Carbohydrates", "amount": 33.34, "unit": "g", "percentOfDailyNeeds": 12.12
        }, {
            "name": "Sugar", "amount": 26.85, "unit": "g", "percentOfDailyNeeds": 29.84
        }, {
            "name": "Cholesterol", "amount": 15, "unit": "mg", "percentOfDailyNeeds": 5
        }, {
            "name": "Sodium", "amount": 5.91, "unit": "mg", "percentOfDailyNeeds": 0.26
        }, {
            "name": "Protein", "amount": 1.44, "unit": "g", "percentOfDailyNeeds": 2.88
        }, {
            "name": "Vitamin A", "amount": 1060.88, "unit": "IU", "percentOfDailyNeeds": 21.22
        }, {
            "name": "Vitamin C", "amount": 13.11, "unit": "mg", "percentOfDailyNeeds": 15.89
        }, {
            "name": "Potassium", "amount": 195.48, "unit": "mg", "percentOfDailyNeeds": 5.59
        }, {
            "name": "Magnesium", "amount": 18.71, "unit": "mg", "percentOfDailyNeeds": 4.68
        }, {
            "name": "Copper", "amount": 0.08, "unit": "mg", "percentOfDailyNeeds": 4.25
        }, {
            "name": "Manganese", "amount": 0.08, "unit": "mg", "percentOfDailyNeeds": 4.13
        }, {
            "name": "Vitamin B6", "amount": 0.08, "unit": "mg", "percentOfDailyNeeds": 3.82
        }, {
            "name": "Vitamin B5", "amount": 0.38, "unit": "mg", "percentOfDailyNeeds": 3.77
        }, {
            "name": "Vitamin B1", "amount": 0.05, "unit": "mg", "percentOfDailyNeeds": 3.64
        }, {
            "name": "Vitamin B2", "amount": 0.06, "unit": "mg", "percentOfDailyNeeds": 3.63
        }, {
            "name": "Iron", "amount": 0.6, "unit": "mg", "percentOfDailyNeeds": 3.33
        }, {
            "name": "Fiber", "amount": 0.79, "unit": "g", "percentOfDailyNeeds": 3.16
        }, {
            "name": "Phosphorus", "amount": 29.28, "unit": "mg", "percentOfDailyNeeds": 2.93
        }, {
            "name": "Calcium", "amount": 22.51, "unit": "mg", "percentOfDailyNeeds": 2.25
        }, {
            "name": "Selenium", "amount": 1.36, "unit": "µg", "percentOfDailyNeeds": 1.94
        }, {
            "name": "Zinc", "amount": 0.23, "unit": "mg", "percentOfDailyNeeds": 1.56
        }, {
            "name": "Vitamin B3", "amount": 0.3, "unit": "mg", "percentOfDailyNeeds": 1.5
        }, {
            "name": "Vitamin D", "amount": 0.21, "unit": "µg", "percentOfDailyNeeds": 1.41
        }, {
            "name": "Vitamin E", "amount": 0.21, "unit": "mg", "percentOfDailyNeeds": 1.37
        }, {
            "name": "Folate", "amount": 5.46, "unit": "µg", "percentOfDailyNeeds": 1.36
        }], "properties": [{
            "name": "Glycemic Index", "amount": 24.96, "unit": ""
        }, {
            "name": "Glycemic Load", "amount": 19.76, "unit": ""
        }, {
            "name": "Nutrition Score", "amount": 4.018695652173912, "unit": "%"
        }], "flavonoids": [{
            "name": "Cyanidin", "amount": 0, "unit": "mg"
        }, {
            "name": "Petunidin", "amount": 0, "unit": "mg"
        }, {
            "name": "Delphinidin", "amount": 0, "unit": "mg"
        }, {
            "name": "Malvidin", "amount": 0, "unit": "mg"
        }, {
            "name": "Pelargonidin", "amount": 0, "unit": "mg"
        }, {
            "name": "Peonidin", "amount": 0, "unit": "mg"
        }, {
            "name": "Catechin", "amount": 0, "unit": "mg"
        }, {
            "name": "Epigallocatechin", "amount": 0, "unit": "mg"
        }, {
            "name": "Epicatechin", "amount": 0, "unit": "mg"
        }, {
            "name": "Epicatechin 3-gallate", "amount": 0, "unit": "mg"
        }, {
            "name": "Epigallocatechin 3-gallate", "amount": 0, "unit": "mg"
        }, {
            "name": "Theaflavin", "amount": 0, "unit": ""
        }, {
            "name": "Thearubigins", "amount": 0, "unit": ""
        }, {
            "name": "Eriodictyol", "amount": 0.08, "unit": "mg"
        }, {
            "name": "Hesperetin", "amount": 0.24, "unit": "mg"
        }, {
            "name": "Naringenin", "amount": 0.02, "unit": "mg"
        }, {
            "name": "Apigenin", "amount": 0, "unit": "mg"
        }, {
            "name": "Luteolin", "amount": 0.7, "unit": "mg"
        }, {
            "name": "Isorhamnetin", "amount": 0, "unit": ""
        }, {
            "name": "Kaempferol", "amount": 0.68, "unit": "mg"
        }, {
            "name": "Myricetin", "amount": 0, "unit": "mg"
        }, {
            "name": "Quercetin", "amount": 0.01, "unit": "mg"
        }, {
            "name": "Theaflavin-3,3'-digallate", "amount": 0, "unit": ""
        }, {
            "name": "Theaflavin-3'-gallate", "amount": 0, "unit": ""
        }, {
            "name": "Theaflavin-3-gallate", "amount": 0, "unit": ""
        }, {
            "name": "Gallocatechin", "amount": 0, "unit": "mg"
        }], "ingredients": [{
            "id": 2002, "name": "anise seeds", "amount": 0.17, "unit": "teaspoon", "nutrients": [{
                "name": "Calories", "amount": 1.12, "unit": "kcal", "percentOfDailyNeeds": 9.12
            }, {
                "name": "Copper", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.25
            }, {
                "name": "Zinc", "amount": 0.02, "unit": "mg", "percentOfDailyNeeds": 1.56
            }, {
                "name": "Alcohol", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Iron", "amount": 0.12, "unit": "mg", "percentOfDailyNeeds": 3.33
            }, {
                "name": "Vitamin B2", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.63
            }, {
                "name": "Sodium", "amount": 0.05, "unit": "mg", "percentOfDailyNeeds": 0.26
            }, {
                "name": "Carbohydrates", "amount": 0.17, "unit": "g", "percentOfDailyNeeds": 11.38
            }, {
                "name": "Protein", "amount": 0.06, "unit": "g", "percentOfDailyNeeds": 2.88
            }, {
                "name": "Vitamin A", "amount": 1.04, "unit": "IU", "percentOfDailyNeeds": 21.22
            }, {
                "name": "Net Carbohydrates", "amount": 0.12, "unit": "g", "percentOfDailyNeeds": 12.12
            }, {
                "name": "Saturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 20.56
            }, {
                "name": "Magnesium", "amount": 0.57, "unit": "mg", "percentOfDailyNeeds": 4.68
            }, {
                "name": "Vitamin B6", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.82
            }, {
                "name": "Phosphorus", "amount": 1.47, "unit": "mg", "percentOfDailyNeeds": 2.93
            }, {
                "name": "Vitamin B1", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.64
            }, {
                "name": "Fiber", "amount": 0.05, "unit": "g", "percentOfDailyNeeds": 3.16
            }, {
                "name": "Mono Unsaturated Fat", "amount": 0.03, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Folic Acid", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Poly Unsaturated Fat", "amount": 0.01, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Selenium", "amount": 0.02, "unit": "µg", "percentOfDailyNeeds": 1.94
            }, {
                "name": "Vitamin B3", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 1.5
            }, {
                "name": "Manganese", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 4.13
            }, {
                "name": "Fat", "amount": 0.05, "unit": "g", "percentOfDailyNeeds": 8.46
            }, {
                "name": "Calcium", "amount": 2.15, "unit": "mg", "percentOfDailyNeeds": 2.25
            }, {
                "name": "Vitamin D", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.41
            }, {
                "name": "Caffeine", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0.29
            }, {
                "name": "Vitamin B5", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.77
            }, {
                "name": "Cholesterol", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 5
            }, {
                "name": "Potassium", "amount": 4.8, "unit": "mg", "percentOfDailyNeeds": 5.59
            }, {
                "name": "Vitamin B12", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.38
            }, {
                "name": "Folate", "amount": 0.03, "unit": "µg", "percentOfDailyNeeds": 1.36
            }, {
                "name": "Vitamin C", "amount": 0.07, "unit": "mg", "percentOfDailyNeeds": 15.89
            }]
        }, {
            "id": 10219903, "name": "chocolate shavings", "amount": 1, "unit": "servings", "nutrients": [{
                "name": "Trans Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 7.9
            }, {
                "name": "Calories", "amount": 5.79, "unit": "kcal", "percentOfDailyNeeds": 9.12
            }, {
                "name": "Copper", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 4.25
            }, {
                "name": "Zinc", "amount": 0.03, "unit": "mg", "percentOfDailyNeeds": 1.56
            }, {
                "name": "Vitamin K", "amount": 0.07, "unit": "µg", "percentOfDailyNeeds": 0.62
            }, {
                "name": "Iron", "amount": 0.06, "unit": "mg", "percentOfDailyNeeds": 3.33
            }, {
                "name": "Vitamin B2", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.63
            }, {
                "name": "Sodium", "amount": 0.1, "unit": "mg", "percentOfDailyNeeds": 0.26
            }, {
                "name": "Net Carbohydrates", "amount": 0.44, "unit": "g", "percentOfDailyNeeds": 12.12
            }, {
                "name": "Carbohydrates", "amount": 0.52, "unit": "g", "percentOfDailyNeeds": 11.38
            }, {
                "name": "Protein", "amount": 0.06, "unit": "g", "percentOfDailyNeeds": 2.88
            }, {
                "name": "Vitamin A", "amount": 0.5, "unit": "IU", "percentOfDailyNeeds": 21.22
            }, {
                "name": "Lycopene", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Saturated Fat", "amount": 0.22, "unit": "g", "percentOfDailyNeeds": 20.56
            }, {
                "name": "Magnesium", "amount": 1.76, "unit": "mg", "percentOfDailyNeeds": 4.68
            }, {
                "name": "Vitamin B6", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.82
            }, {
                "name": "Phosphorus", "amount": 2.6, "unit": "mg", "percentOfDailyNeeds": 2.93
            }, {
                "name": "Vitamin B1", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.64
            }, {
                "name": "Fiber", "amount": 0.08, "unit": "g", "percentOfDailyNeeds": 3.16
            }, {
                "name": "Mono Unsaturated Fat", "amount": 0.12, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Poly Unsaturated Fat", "amount": 0.01, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Selenium", "amount": 0.08, "unit": "µg", "percentOfDailyNeeds": 1.94
            }, {
                "name": "Vitamin B3", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 1.5
            }, {
                "name": "Manganese", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 4.13
            }, {
                "name": "Fat", "amount": 0.38, "unit": "g", "percentOfDailyNeeds": 8.46
            }, {
                "name": "Calcium", "amount": 0.62, "unit": "mg", "percentOfDailyNeeds": 2.25
            }, {
                "name": "Vitamin E", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 1.37
            }, {
                "name": "Caffeine", "amount": 0.86, "unit": "mg", "percentOfDailyNeeds": 0.29
            }, {
                "name": "Vitamin B5", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.77
            }, {
                "name": "Cholesterol", "amount": 0.06, "unit": "mg", "percentOfDailyNeeds": 5
            }, {
                "name": "Potassium", "amount": 5.67, "unit": "mg", "percentOfDailyNeeds": 5.59
            }, {
                "name": "Vitamin B12", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.38
            }, {
                "name": "Sugar", "amount": 0.37, "unit": "g", "percentOfDailyNeeds": 29.84
            }]
        }, {
            "id": 20027, "name": "cornstarch", "amount": 0.04, "unit": "cup", "nutrients": [{
                "name": "Calories", "amount": 20.32, "unit": "kcal", "percentOfDailyNeeds": 9.12
            }, {
                "name": "Copper", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.25
            }, {
                "name": "Zinc", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.56
            }, {
                "name": "Vitamin K", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.62
            }, {
                "name": "Alcohol", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Iron", "amount": 0.03, "unit": "mg", "percentOfDailyNeeds": 3.33
            }, {
                "name": "Vitamin B2", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.63
            }, {
                "name": "Sodium", "amount": 0.48, "unit": "mg", "percentOfDailyNeeds": 0.26
            }, {
                "name": "Net Carbohydrates", "amount": 4.82, "unit": "g", "percentOfDailyNeeds": 12.12
            }, {
                "name": "Carbohydrates", "amount": 4.87, "unit": "g", "percentOfDailyNeeds": 11.38
            }, {
                "name": "Protein", "amount": 0.01, "unit": "g", "percentOfDailyNeeds": 2.88
            }, {
                "name": "Vitamin A", "amount": 0, "unit": "IU", "percentOfDailyNeeds": 21.22
            }, {
                "name": "Lycopene", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Saturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 20.56
            }, {
                "name": "Vitamin B6", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.82
            }, {
                "name": "Magnesium", "amount": 0.16, "unit": "mg", "percentOfDailyNeeds": 4.68
            }, {
                "name": "Phosphorus", "amount": 0.69, "unit": "mg", "percentOfDailyNeeds": 2.93
            }, {
                "name": "Vitamin B1", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.64
            }, {
                "name": "Fiber", "amount": 0.05, "unit": "g", "percentOfDailyNeeds": 3.16
            }, {
                "name": "Mono Unsaturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Folic Acid", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Poly Unsaturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Selenium", "amount": 0.15, "unit": "µg", "percentOfDailyNeeds": 1.94
            }, {
                "name": "Vitamin B3", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.5
            }, {
                "name": "Manganese", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.13
            }, {
                "name": "Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 8.46
            }, {
                "name": "Calcium", "amount": 0.11, "unit": "mg", "percentOfDailyNeeds": 2.25
            }, {
                "name": "Vitamin E", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.37
            }, {
                "name": "Choline", "amount": 0.02, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Vitamin D", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.41
            }, {
                "name": "Vitamin B5", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.77
            }, {
                "name": "Caffeine", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0.29
            }, {
                "name": "Cholesterol", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 5
            }, {
                "name": "Vitamin B12", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.38
            }, {
                "name": "Potassium", "amount": 0.16, "unit": "mg", "percentOfDailyNeeds": 5.59
            }, {
                "name": "Folate", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.36
            }, {
                "name": "Sugar", "amount": 0, "unit": "g", "percentOfDailyNeeds": 29.84
            }, {
                "name": "Vitamin C", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 15.89
            }]
        }, {
            "id": 1053, "name": "heavy cream", "amount": 0.06, "unit": "cup", "nutrients": [{
                "name": "Calories", "amount": 44.96, "unit": "kcal", "percentOfDailyNeeds": 9.12
            }, {
                "name": "Copper", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.25
            }, {
                "name": "Zinc", "amount": 0.03, "unit": "mg", "percentOfDailyNeeds": 1.56
            }, {
                "name": "Vitamin K", "amount": 0.42, "unit": "µg", "percentOfDailyNeeds": 0.62
            }, {
                "name": "Alcohol", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Iron", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 3.33
            }, {
                "name": "Vitamin B2", "amount": 0.02, "unit": "mg", "percentOfDailyNeeds": 3.63
            }, {
                "name": "Sodium", "amount": 3.57, "unit": "mg", "percentOfDailyNeeds": 0.26
            }, {
                "name": "Net Carbohydrates", "amount": 0.38, "unit": "g", "percentOfDailyNeeds": 12.12
            }, {
                "name": "Carbohydrates", "amount": 0.38, "unit": "g", "percentOfDailyNeeds": 11.38
            }, {
                "name": "Protein", "amount": 0.38, "unit": "g", "percentOfDailyNeeds": 2.88
            }, {
                "name": "Vitamin A", "amount": 194.37, "unit": "IU", "percentOfDailyNeeds": 21.22
            }, {
                "name": "Lycopene", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Saturated Fat", "amount": 3.04, "unit": "g", "percentOfDailyNeeds": 20.56
            }, {
                "name": "Vitamin B6", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.82
            }, {
                "name": "Magnesium", "amount": 0.93, "unit": "mg", "percentOfDailyNeeds": 4.68
            }, {
                "name": "Phosphorus", "amount": 7.67, "unit": "mg", "percentOfDailyNeeds": 2.93
            }, {
                "name": "Vitamin B1", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.64
            }, {
                "name": "Fiber", "amount": 0, "unit": "g", "percentOfDailyNeeds": 3.16
            }, {
                "name": "Mono Unsaturated Fat", "amount": 1.2, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Folic Acid", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Poly Unsaturated Fat", "amount": 0.21, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Selenium", "amount": 0.4, "unit": "µg", "percentOfDailyNeeds": 1.94
            }, {
                "name": "Vitamin B3", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 1.5
            }, {
                "name": "Manganese", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.13
            }, {
                "name": "Fat", "amount": 4.77, "unit": "g", "percentOfDailyNeeds": 8.46
            }, {
                "name": "Calcium", "amount": 8.73, "unit": "mg", "percentOfDailyNeeds": 2.25
            }, {
                "name": "Vitamin E", "amount": 0.12, "unit": "mg", "percentOfDailyNeeds": 1.37
            }, {
                "name": "Choline", "amount": 2.22, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Vitamin D", "amount": 0.21, "unit": "µg", "percentOfDailyNeeds": 1.41
            }, {
                "name": "Vitamin B5", "amount": 0.03, "unit": "mg", "percentOfDailyNeeds": 3.77
            }, {
                "name": "Caffeine", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0.29
            }, {
                "name": "Cholesterol", "amount": 14.94, "unit": "mg", "percentOfDailyNeeds": 5
            }, {
                "name": "Vitamin B12", "amount": 0.02, "unit": "µg", "percentOfDailyNeeds": 0.38
            }, {
                "name": "Fluoride", "amount": 0.4, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Potassium", "amount": 12.56, "unit": "mg", "percentOfDailyNeeds": 5.59
            }, {
                "name": "Folate", "amount": 0.53, "unit": "µg", "percentOfDailyNeeds": 1.36
            }, {
                "name": "Sugar", "amount": 0.39, "unit": "g", "percentOfDailyNeeds": 29.84
            }, {
                "name": "Vitamin C", "amount": 0.08, "unit": "mg", "percentOfDailyNeeds": 15.89
            }]
        }, {
            "id": 9152, "name": "lemon juice", "amount": 0.33, "unit": "teaspoons", "nutrients": [{
                "name": "Trans Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 7.9
            }, {
                "name": "Calories", "amount": 0.37, "unit": "kcal", "percentOfDailyNeeds": 9.12
            }, {
                "name": "Copper", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.25
            }, {
                "name": "Zinc", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.56
            }, {
                "name": "Vitamin K", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.62
            }, {
                "name": "Alcohol", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Iron", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.33
            }, {
                "name": "Vitamin B2", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.63
            }, {
                "name": "Sodium", "amount": 0.02, "unit": "mg", "percentOfDailyNeeds": 0.26
            }, {
                "name": "Net Carbohydrates", "amount": 0.11, "unit": "g", "percentOfDailyNeeds": 12.12
            }, {
                "name": "Carbohydrates", "amount": 0.12, "unit": "g", "percentOfDailyNeeds": 11.38
            }, {
                "name": "Protein", "amount": 0.01, "unit": "g", "percentOfDailyNeeds": 2.88
            }, {
                "name": "Vitamin A", "amount": 0.1, "unit": "IU", "percentOfDailyNeeds": 21.22
            }, {
                "name": "Lycopene", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Saturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 20.56
            }, {
                "name": "Vitamin B6", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.82
            }, {
                "name": "Magnesium", "amount": 0.1, "unit": "mg", "percentOfDailyNeeds": 4.68
            }, {
                "name": "Phosphorus", "amount": 0.13, "unit": "mg", "percentOfDailyNeeds": 2.93
            }, {
                "name": "Vitamin B1", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.64
            }, {
                "name": "Fiber", "amount": 0, "unit": "g", "percentOfDailyNeeds": 3.16
            }, {
                "name": "Mono Unsaturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Folic Acid", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Poly Unsaturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Selenium", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.94
            }, {
                "name": "Vitamin B3", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.5
            }, {
                "name": "Manganese", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.13
            }, {
                "name": "Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 8.46
            }, {
                "name": "Calcium", "amount": 0.1, "unit": "mg", "percentOfDailyNeeds": 2.25
            }, {
                "name": "Vitamin E", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.37
            }, {
                "name": "Choline", "amount": 0.09, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Vitamin D", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.41
            }, {
                "name": "Vitamin B5", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.77
            }, {
                "name": "Caffeine", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0.29
            }, {
                "name": "Cholesterol", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 5
            }, {
                "name": "Vitamin B12", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.38
            }, {
                "name": "Potassium", "amount": 1.72, "unit": "mg", "percentOfDailyNeeds": 5.59
            }, {
                "name": "Folate", "amount": 0.33, "unit": "µg", "percentOfDailyNeeds": 1.36
            }, {
                "name": "Sugar", "amount": 0.04, "unit": "g", "percentOfDailyNeeds": 29.84
            }, {
                "name": "Vitamin C", "amount": 0.64, "unit": "mg", "percentOfDailyNeeds": 15.89
            }]
        }, {
            "id": 19335, "name": "sugar", "amount": 0.08, "unit": "cup", "nutrients": [{
                "name": "Calories", "amount": 64.17, "unit": "kcal", "percentOfDailyNeeds": 9.12
            }, {
                "name": "Copper", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.25
            }, {
                "name": "Zinc", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.56
            }, {
                "name": "Vitamin K", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.62
            }, {
                "name": "Alcohol", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Iron", "amount": 0.01, "unit": "mg", "percentOfDailyNeeds": 3.33
            }, {
                "name": "Vitamin B2", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.63
            }, {
                "name": "Sodium", "amount": 0.17, "unit": "mg", "percentOfDailyNeeds": 0.26
            }, {
                "name": "Net Carbohydrates", "amount": 16.6, "unit": "g", "percentOfDailyNeeds": 12.12
            }, {
                "name": "Carbohydrates", "amount": 16.6, "unit": "g", "percentOfDailyNeeds": 11.38
            }, {
                "name": "Protein", "amount": 0, "unit": "g", "percentOfDailyNeeds": 2.88
            }, {
                "name": "Vitamin A", "amount": 0, "unit": "IU", "percentOfDailyNeeds": 21.22
            }, {
                "name": "Lycopene", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Saturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 20.56
            }, {
                "name": "Vitamin B6", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.82
            }, {
                "name": "Magnesium", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.68
            }, {
                "name": "Phosphorus", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 2.93
            }, {
                "name": "Vitamin B1", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.64
            }, {
                "name": "Fiber", "amount": 0, "unit": "g", "percentOfDailyNeeds": 3.16
            }, {
                "name": "Mono Unsaturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Folic Acid", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Poly Unsaturated Fat", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Selenium", "amount": 0.1, "unit": "µg", "percentOfDailyNeeds": 1.94
            }, {
                "name": "Vitamin B3", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.5
            }, {
                "name": "Manganese", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 4.13
            }, {
                "name": "Fat", "amount": 0.05, "unit": "g", "percentOfDailyNeeds": 8.46
            }, {
                "name": "Calcium", "amount": 0.17, "unit": "mg", "percentOfDailyNeeds": 2.25
            }, {
                "name": "Vitamin E", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 1.37
            }, {
                "name": "Choline", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Vitamin D", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.41
            }, {
                "name": "Vitamin B5", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 3.77
            }, {
                "name": "Caffeine", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0.29
            }, {
                "name": "Cholesterol", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 5
            }, {
                "name": "Vitamin B12", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.38
            }, {
                "name": "Fluoride", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Potassium", "amount": 0.33, "unit": "mg", "percentOfDailyNeeds": 5.59
            }, {
                "name": "Folate", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.36
            }, {
                "name": "Sugar", "amount": 16.63, "unit": "g", "percentOfDailyNeeds": 29.84
            }, {
                "name": "Vitamin C", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 15.89
            }]
        }, {
            "id": 9326, "name": "watermelon", "amount": 1, "unit": "cups", "nutrients": [{
                "name": "Calories", "amount": 45.6, "unit": "kcal", "percentOfDailyNeeds": 9.12
            }, {
                "name": "Copper", "amount": 0.06, "unit": "mg", "percentOfDailyNeeds": 4.25
            }, {
                "name": "Zinc", "amount": 0.15, "unit": "mg", "percentOfDailyNeeds": 1.56
            }, {
                "name": "Vitamin K", "amount": 0.15, "unit": "µg", "percentOfDailyNeeds": 0.62
            }, {
                "name": "Alcohol", "amount": 0, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Iron", "amount": 0.36, "unit": "mg", "percentOfDailyNeeds": 3.33
            }, {
                "name": "Vitamin B2", "amount": 0.03, "unit": "mg", "percentOfDailyNeeds": 3.63
            }, {
                "name": "Sodium", "amount": 1.52, "unit": "mg", "percentOfDailyNeeds": 0.26
            }, {
                "name": "Net Carbohydrates", "amount": 10.87, "unit": "g", "percentOfDailyNeeds": 12.12
            }, {
                "name": "Carbohydrates", "amount": 11.48, "unit": "g", "percentOfDailyNeeds": 11.38
            }, {
                "name": "Protein", "amount": 0.93, "unit": "g", "percentOfDailyNeeds": 2.88
            }, {
                "name": "Vitamin A", "amount": 864.88, "unit": "IU", "percentOfDailyNeeds": 21.22
            }, {
                "name": "Lycopene", "amount": 6885.6, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Saturated Fat", "amount": 0.02, "unit": "g", "percentOfDailyNeeds": 20.56
            }, {
                "name": "Vitamin B6", "amount": 0.07, "unit": "mg", "percentOfDailyNeeds": 3.82
            }, {
                "name": "Magnesium", "amount": 15.2, "unit": "mg", "percentOfDailyNeeds": 4.68
            }, {
                "name": "Phosphorus", "amount": 16.72, "unit": "mg", "percentOfDailyNeeds": 2.93
            }, {
                "name": "Vitamin B1", "amount": 0.05, "unit": "mg", "percentOfDailyNeeds": 3.64
            }, {
                "name": "Fiber", "amount": 0.61, "unit": "g", "percentOfDailyNeeds": 3.16
            }, {
                "name": "Mono Unsaturated Fat", "amount": 0.06, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Folic Acid", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0
            }, {
                "name": "Poly Unsaturated Fat", "amount": 0.08, "unit": "g", "percentOfDailyNeeds": 0
            }, {
                "name": "Selenium", "amount": 0.61, "unit": "µg", "percentOfDailyNeeds": 1.94
            }, {
                "name": "Vitamin B3", "amount": 0.27, "unit": "mg", "percentOfDailyNeeds": 1.5
            }, {
                "name": "Manganese", "amount": 0.06, "unit": "mg", "percentOfDailyNeeds": 4.13
            }, {
                "name": "Fat", "amount": 0.23, "unit": "g", "percentOfDailyNeeds": 8.46
            }, {
                "name": "Calcium", "amount": 10.64, "unit": "mg", "percentOfDailyNeeds": 2.25
            }, {
                "name": "Vitamin E", "amount": 0.08, "unit": "mg", "percentOfDailyNeeds": 1.37
            }, {
                "name": "Choline", "amount": 6.23, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Vitamin D", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 1.41
            }, {
                "name": "Vitamin B5", "amount": 0.34, "unit": "mg", "percentOfDailyNeeds": 3.77
            }, {
                "name": "Caffeine", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 0.29
            }, {
                "name": "Cholesterol", "amount": 0, "unit": "mg", "percentOfDailyNeeds": 5
            }, {
                "name": "Vitamin B12", "amount": 0, "unit": "µg", "percentOfDailyNeeds": 0.38
            }, {
                "name": "Fluoride", "amount": 2.28, "unit": "mg", "percentOfDailyNeeds": 0
            }, {
                "name": "Potassium", "amount": 170.24, "unit": "mg", "percentOfDailyNeeds": 5.59
            }, {
                "name": "Folate", "amount": 4.56, "unit": "µg", "percentOfDailyNeeds": 1.36
            }, {
                "name": "Sugar", "amount": 9.42, "unit": "g", "percentOfDailyNeeds": 29.84
            }, {
                "name": "Vitamin C", "amount": 12.31, "unit": "mg", "percentOfDailyNeeds": 15.89
            }]
        }], "caloricBreakdown": {
            "percentProtein": 3.01, "percentFat": 25.8, "percentCarbs": 71.19
        }, "weightPerServing": {
            "amount": 190, "unit": "g"
        }
    },
    "summary": "Watermelon Pudding is a <b>gluten free</b> dessert. This recipe serves 6. For <b>45 cents per serving</b>, this recipe <b>covers 4%</b> of your daily requirements of vitamins and minerals. One serving contains <b>182 calories</b>, <b>1g of protein</b>, and <b>5g of fat</b>. A mixture of anise seeds, lemon juice, sugar, and a handful of other ingredients are all it takes to make this recipe so scrumptious. This recipe from Epicurious has 1 fans. It can be enjoyed any time, but it is especially good for <b>Summer</b>. From preparation to the plate, this recipe takes around <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 19%</b>. This score is rather bad. Try <a href=\"https://spoonacular.com/recipes/watermelon-pudding-or-sauce-127748\">Watermelon Pudding or Sauce</a>, <a href=\"https://spoonacular.com/recipes/watermelon-fros-frozen-watermelon-and-ros-wine-910842\">Watermelon Frosé – Frozen Watermelon and Rosé Wine</a>, and <a href=\"https://spoonacular.com/recipes/watermelon-mint-shrub-with-watermelon-spoom-202553\">Watermelon-Mint Shrub with Watermelon Spoom</a> for similar recipes.",
    "cuisines": [],
    "dishTypes": ["dessert"],
    "diets": ["gluten free"],
    "occasions": ["summer"],
    "winePairing": {
        "pairedWines": ["cream sherry", "port", "moscato dasti"],
        "pairingText": "Pudding works really well with Cream Sherry, Port, and Moscato d'Asti. A common wine pairing rule is to make sure your wine is sweeter than your food. Delicate desserts go well with Moscato d'Asti, nutty desserts with cream sherry, and caramel or chocolate desserts pair well with port. The Famille Vincent Cremant de Bourgogne with a 4 out of 5 star rating seems like a good match. It costs about 24 dollars per bottle.",
        "productMatches": [{
            "id": 13029551,
            "title": "Famille Vincent Cremant de Bourgogne",
            "description": "From the Chardonnay grapes this sparkler allies freshness, body, and smoothness. The Cremant Brut is dry and offers fine bubbles (1.5 Million/30 minutes - we counted them but you do not have to believe me for this!), hints of flowers at the nose, crisp and fruity on the palate. It is a great Classic for all festive occasions.",
            "price": "$23.989999771118164",
            "imageUrl": "https://spoonacular.com/productImages/13029551-312x231.jpg",
            "averageRating": 0.800000011920929,
            "ratingCount": 88,
            "score": 0.7962264270152686,
            "link": "https://click.linksynergy.com/deeplink?id=*QCiIS6t4gA&mid=2025&murl=https%3A%2F%2Fwww.wine.com%2Fproduct%2Ffamille-vincent-cremant-de-bourgogne%2F166470"
        }]
    },
    "instructions": "Preparation                                                        Purée watermelon in a blender until smooth, then pour through a fine-mesh sieve into a 2-quart saucepan, pressing on pulp and then discarding any remaining solids.                                                                Ladle about 1/4 cup watermelon juice into a small bowl and stir in cornstarch until smooth.                                                                Bring remaining watermelon juice to a boil with 1/2 cup sugar and anise seeds, stirring until sugar is dissolved. Stir cornstarch mixture again, then whisk into boiling juice. Reduce heat and simmer, whisking occasionally, 3 minutes. Whisk in lemon juice.                                                                Pour pudding through cleaned sieve into a bowl, then transfer to a wide 1-quart serving dish or 6 (2/3-cup) ramekins and chill, uncovered, until cold, about 30 minutes. Cover loosely and chill until set, at least 3 hours.                                                                Just before serving, beat cream with remaining 1 teaspoon sugar in another bowl with an electric mixer until it just holds stiff peaks. Top pudding with whipped cream.                                                Cooks' note:            Pudding can be chilled up to 1 day.",
    "analyzedInstructions": [{
        "name": "", "steps": [{
            "number": 1,
            "step": "Purée watermelon in a blender until smooth, then pour through a fine-mesh sieve into a 2-quart saucepan, pressing on pulp and then discarding any remaining solids.",
            "ingredients": [{
                "id": 9326, "name": "watermelon", "localizedName": "watermelon", "image": "watermelon.png"
            }],
            "equipment": [{
                "id": 404669, "name": "sauce pan", "localizedName": "sauce pan", "image": "sauce-pan.jpg"
            }, {
                "id": 404726, "name": "blender", "localizedName": "blender", "image": "blender.png"
            }, {
                "id": 405600, "name": "sieve", "localizedName": "sieve", "image": "strainer.png"
            }]
        }, {
            "number": 2,
            "step": "Ladle about 1/4 cup watermelon juice into a small bowl and stir in cornstarch until smooth.",
            "ingredients": [{
                "id": 20027, "name": "corn starch", "localizedName": "corn starch", "image": "white-powder.jpg"
            }, {
                "id": 9326, "name": "watermelon", "localizedName": "watermelon", "image": "watermelon.png"
            }, {
                "id": 1019016, "name": "juice", "localizedName": "juice", "image": "apple-juice.jpg"
            }],
            "equipment": [{
                "id": 404630, "name": "ladle", "localizedName": "ladle", "image": "ladle.jpg"
            }, {
                "id": 404783, "name": "bowl", "localizedName": "bowl", "image": "bowl.jpg"
            }]
        }, {
            "number": 3,
            "step": "Bring remaining watermelon juice to a boil with 1/2 cup sugar and anise seeds, stirring until sugar is dissolved. Stir cornstarch mixture again, then whisk into boiling juice. Reduce heat and simmer, whisking occasionally, 3 minutes.",
            "ingredients": [{
                "id": 2002, "name": "anise", "localizedName": "anise", "image": "aniseed-or-anise.jpg"
            }, {
                "id": 20027, "name": "corn starch", "localizedName": "corn starch", "image": "white-powder.jpg"
            }, {
                "id": 9326, "name": "watermelon", "localizedName": "watermelon", "image": "watermelon.png"
            }, {
                "id": 1019016, "name": "juice", "localizedName": "juice", "image": "apple-juice.jpg"
            }, {
                "id": 19335, "name": "sugar", "localizedName": "sugar", "image": "sugar-in-bowl.png"
            }],
            "equipment": [{
                "id": 404661, "name": "whisk", "localizedName": "whisk", "image": "whisk.png"
            }],
            "length": {
                "number": 3, "unit": "minutes"
            }
        }, {
            "number": 4, "step": "Whisk in lemon juice.", "ingredients": [{
                "id": 9152, "name": "lemon juice", "localizedName": "lemon juice", "image": "lemon-juice.jpg"
            }], "equipment": [{
                "id": 404661, "name": "whisk", "localizedName": "whisk", "image": "whisk.png"
            }]
        }, {
            "number": 5,
            "step": "Pour pudding through cleaned sieve into a bowl, then transfer to a wide 1-quart serving dish or 6 (2/3-cup) ramekins and chill, uncovered, until cold, about 30 minutes. Cover loosely and chill until set, at least 3 hours.",
            "ingredients": [],
            "equipment": [{
                "id": 404781, "name": "ramekin", "localizedName": "ramekin", "image": "ramekin.jpg"
            }, {
                "id": 405600, "name": "sieve", "localizedName": "sieve", "image": "strainer.png"
            }, {
                "id": 404783, "name": "bowl", "localizedName": "bowl", "image": "bowl.jpg"
            }],
            "length": {
                "number": 210, "unit": "minutes"
            }
        }, {
            "number": 6,
            "step": "Just before serving, beat cream with remaining 1 teaspoon sugar in another bowl with an electric mixer until it just holds stiff peaks. Top pudding with whipped cream.",
            "ingredients": [{
                "id": 1054, "name": "whipped cream", "localizedName": "whipped cream", "image": "whipped-cream.jpg"
            }, {
                "id": 1053, "name": "cream", "localizedName": "cream", "image": "fluid-cream.jpg"
            }, {
                "id": 19335, "name": "sugar", "localizedName": "sugar", "image": "sugar-in-bowl.png"
            }],
            "equipment": [{
                "id": 404628, "name": "hand mixer", "localizedName": "hand mixer", "image": "hand-mixer.png"
            }, {
                "id": 404783, "name": "bowl", "localizedName": "bowl", "image": "bowl.jpg"
            }]
        }]
    }, {
        "name": "Cooks' note", "steps": [{
            "number": 1, "step": "Pudding can be chilled up to 1 day.", "ingredients": [], "equipment": []
        }]
    }],
    "originalId": null
}