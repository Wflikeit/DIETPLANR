import uuid
from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.utils.text import slugify
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _


class UserProfileManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Adres email jest wymagany')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password:
            user.password = make_password(password)
        user.set_password(user.password)

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser musi mieć is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser musi mieć is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_dietitian = models.BooleanField(default=False)
    is_client = models.BooleanField(default=True)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=1)
    City = models.CharField(max_length=40)
    Country = models.CharField(max_length=40)
    photo = models.ImageField(upload_to='user/%Y/%m/%d/',
                              blank=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    full_name = models.CharField(max_length=40, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Tworzenie unikalnego sluga na podstawie pola full_name
        if not self.slug:
            self.slug = slugify(self.full_name)
        if not self.full_name:
            self.full_name = f'{self.first_name}+{self.last_name}'
        super(CustomUser, self).save(*args, **kwargs)

    def get_user_data(self):
        user_data = {
            'name': self.full_name,
            'photo': self.photo.url if self.photo else None,
            'city': self.City,
            'country': self.Country,
        }
        return user_data

    def get_user_appointments(self):
        return Appointment.objects.filter(user_profile=self)

    objects = UserProfileManager()
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        related_name='custom_users'  # Unikalna nazwa dla odwrotnego dostępu do groups
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        related_name='custom_users'  # Unikalna nazwa dla odwrotnego dostępu do user_permissions
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.email


class DietitianProfile(models.Model):
    user = models.OneToOneField(CustomUser,
                                on_delete=models.CASCADE,
                                primary_key=True)
    specialty = models.CharField(max_length=40, blank=True)
    experience = models.CharField(max_length=100, blank=True)
    nutritional_philosophy = models.CharField(max_length=40, blank=True)
    some_more = models.CharField(max_length=40, blank=True)

    # TODO Payment info
    # TODO change speciality to ArrayField in PostgresSQL
    def __str__(self):
        return self.user.full_name

    def get_dietitian_appointments(self):
        return Appointment.objects.filter(dietitian_profile=self)


class ClientProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)

    # age = models.PositiveSmallIntegerField()
    dietitian = models.ForeignKey(DietitianProfile,
                                  on_delete=models.SET_NULL,
                                  null=True, blank=True,
                                  related_name='dietitian_profile')

    # @receiver(post_save, sender=CustomUser)  # add this
    # def create_user_profile(sender, instance, created, **kwargs):
    #     if created:
    #         ClientProfile.objects.create(user=instance)
    #
    # @receiver(post_save, sender=CustomUser)  # add this
    # def save_user_profile(sender, instance, **kwargs):
    #     instance.Clk.save()
    def __str__(self):
        return self.user.full_name

    def get_client_appointments(self):
        return Appointment.objects.filter(user_profile=self)


class Appointment(models.Model):
    APPOINTMENT_CHOICES = [
        ('diet_consultation', 'Diet_consultation'),
        ('deep_analyse_of_activity', 'Deep_analyse_of_activity'),
        ('swimming', 'Swimming'),
    ]
    DURATION_CHOICES = [
        (timedelta(minutes=30), '30 minutes'),
        (timedelta(minutes=60), '60 minutes'),
    ]
    title = models.CharField(max_length=40)
    event_duration = models.DurationField(choices=DURATION_CHOICES)
    date = models.DateTimeField()
    user_profile = models.ForeignKey(CustomUser,
                                     on_delete=models.CASCADE,
                                     related_name='user_appointments')
    dietitian_profile = models.ForeignKey(DietitianProfile,
                                          on_delete=models.CASCADE,
                                          related_name='dietitian_appointments')
    published_time = models.DateTimeField(default=now, editable=False)

    def __str__(self):
        return self.title


class Notification(models.Model):
    date = models.DateField(auto_now_add=True)
    title = models.CharField(max_length=40)  # TODO to every TEXTFIELD add a method
    # for checking the lenght
    seen = models.BooleanField(default=False)
    sent = models.BooleanField(default=False)
    url = models.URLField(null=True, blank=True, )
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE)
# Create your models here.
