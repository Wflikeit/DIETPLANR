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

    def get_assigned_to_username(self):
        user_ids = self.assigned_to.values_list('id', flat=True)  # Get a list of user IDs
        usernames = CustomUser.objects.filter(id__in=user_ids).values_list('full_name',
                                                                           flat=True)  # Get usernames for the user IDs
        return list(usernames)  # Return the list of usernames
