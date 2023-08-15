# Generated by Django 4.2.3 on 2023-08-02 20:03

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("panel", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Activity",
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
                ("activity_duration", models.PositiveSmallIntegerField(default=15)),
                ("video", models.URLField(null=True, unique=True)),
                (
                    "activity_date",
                    models.DateField(default=django.utils.timezone.now, unique=True),
                ),
                (
                    "title",
                    models.TextField(
                        choices=[
                            ("running", "Running"),
                            ("riding_on_bike", "Cycling"),
                            ("swimming", "Swimming"),
                            ("walking", "Walking"),
                            ("fitness", "Fitness"),
                            ("gymnastics", "Gymnastics"),
                            ("yoga", "Yoga"),
                            ("strength training", "Strength training"),
                            ("dance", "Dance"),
                            ("skipping", "Skipping"),
                        ],
                        max_length=40,
                        unique_for_date=models.DateField(
                            default=django.utils.timezone.now, unique=True
                        ),
                    ),
                ),
                (
                    "user_profile",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="panel.clientprofile",
                    ),
                ),
            ],
        ),
    ]