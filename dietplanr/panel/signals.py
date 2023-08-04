from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import DietitianProfile, CustomUser


# @receiver(post_save, sender=CustomUser)
# def create_dietitian_profile(sender, instance, created, **kwargs):
#     if created and instance.is_dietitian:
#         DietitianProfile.objects.create(user=instance)
#
#
# @receiver(post_save, sender=CustomUser)
# def save_dietitian_profile(sender, instance, **kwargs):
#     if instance.is_dietitian:
#         instance.dietitianprofile.save()
