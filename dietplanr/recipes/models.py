import requests
from django.db import models

from panel.models import CustomUser


class Recipe(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    image = models.URLField()
    imageType = models.CharField(max_length=10)
    servings = models.PositiveIntegerField()
    readyInMinutes = models.PositiveIntegerField()
    pricePerServing = models.FloatField()
    instructions = models.TextField()
    cheap = models.BooleanField()
    dairyFree = models.BooleanField()
    ketogenic = models.BooleanField()
    vegan = models.BooleanField()
    vegetarian = models.BooleanField()

    summary = models.TextField()
    finished = models.BooleanField(default=False)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_personalised = models.BooleanField(default=False)
    assigned_to = models.ManyToManyField(CustomUser, related_name='assigned_recipes', blank=True)

    ingredients = models.JSONField()  # Przechowuje listę składników jako JSON
    dish_type = models.JSONField()  # Przechowuje listę rodzajów jako JSON
    macros = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.title

    def get_info_for_filters(self):
        info = {
            'ingredients': self.ingredients,
            'dish_type': self.dish_type,
            'assigned_to': self.assigned_to,
            'is_personalised': self.is_personalised,
            'readyInMinutes': self.readyInMinutes,
            'pricePerServing': self.pricePerServing,
            'instructions': self.instructions,
            'cheap': self.cheap,
            'dairyFree': self.dairyFree,
            'ketogenic': self.ketogenic,
            'vegan': self.vegan,
            'vegetarian': self.vegetarian
        }
        return info

    # def get_nutrients(self, URL):
    #     url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients"
    #     headers = {
    #         "X-RapidAPI-Key": "b95707b184mshf29326a66474ca1p1d9cb7jsnec7e10ec4dc5",
    #         "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    #     }
    #     querystring = {"limitLicense": "false", "minProtein": "0", "minVitaminC": "0", "minSelenium": "0",
    #                    "maxFluoride": "50", "maxVitaminB5": "50", "maxVitaminB3": "50", "maxIodine": "50",
    #                    "minCarbs": "0", "maxCalories": "250", "minAlcohol": "0", "maxCopper": "50", "maxCholine": "50",
    #                    "maxVitaminB6": "50", "minIron": "0", "maxManganese": "50", "minSodium": "0", "minSugar": "0",
    #                    "maxFat": "20", "minCholine": "0", "maxVitaminC": "50", "maxVitaminB2": "50",
    #                    "minVitaminB12": "0", "maxFolicAcid": "50", "minZinc": "0", "offset": "0", "maxProtein": "100",
    #                    "minCalories": "0", "minCaffeine": "0", "minVitaminD": "0", "maxVitaminE": "50",
    #                    "minVitaminB2": "0", "minFiber": "0", "minFolate": "0", "minManganese": "0",
    #                    "maxPotassium": "50", "maxSugar": "50", "maxCaffeine": "50", "maxCholesterol": "50",
    #                    "maxSaturatedFat": "50", "minVitaminB3": "0", "maxFiber": "50", "maxPhosphorus": "50",
    #                    "minPotassium": "0", "maxSelenium": "50", "maxCarbs": "100", "minCalcium": "0",
    #                    "minCholesterol": "0", "minFluoride": "0", "maxVitaminD": "50", "maxVitaminB12": "50",
    #                    "minIodine": "0", "maxZinc": "50", "minSaturatedFat": "0", "minVitaminB1": "0",
    #                    "maxFolate": "50", "minFolicAcid": "0", "maxMagnesium": "50", "minVitaminK": "0",
    #                    "maxSodium": "50", "maxAlcohol": "50", "maxCalcium": "50", "maxVitaminA": "50",
    #                    "maxVitaminK": "50", "minVitaminB5": "0", "maxIron": "50", "minCopper": "0",
    #                    "maxVitaminB1": "50", "number": "10", "minVitaminA": "0", "minPhosphorus": "0",
    #                    "minVitaminB6": "0", "minFat": "5", "minVitaminE": "0"}
    #
    #     response = requests.get(url, headers=headers, params=querystring)
    #     nutrients = {
    #         "name": "Calories",
    #         "amount": 316.49,
    #         "unit": "kcal",
    #         "percentOfDailyNeeds": 15.82
    #     }
    #     return nutrients
