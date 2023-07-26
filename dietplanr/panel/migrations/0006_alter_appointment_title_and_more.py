# Generated by Django 4.2.3 on 2023-07-25 22:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("panel", "0005_userprofile_dietitian_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="appointment",
            name="title",
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name="dietitianprofile",
            name="experience",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name="dietitianprofile",
            name="nutritional_philosophy",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AlterField(
            model_name="dietitianprofile",
            name="some_more",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AlterField(
            model_name="dietitianprofile",
            name="specialty",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="City",
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="Country",
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="full_name",
            field=models.CharField(max_length=40),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="gender",
            field=models.CharField(
                choices=[("M", "Male"), ("F", "Female"), ("O", "Other")], max_length=1
            ),
        ),
        migrations.CreateModel(
            name="Notification",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField(auto_now_add=True)),
                ("title", models.CharField(max_length=40)),
                ("seen", models.BooleanField(default=False)),
                ("sent", models.BooleanField(default=False)),
                ("url", models.URLField(blank=True, null=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]