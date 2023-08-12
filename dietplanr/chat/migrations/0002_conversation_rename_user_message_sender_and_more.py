# Generated by Django 4.2.3 on 2023-08-12 20:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("chat", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Conversation",
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
                (
                    "user1",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="conversations_as_user1",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "user2",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="conversations_as_user2",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.RenameField(
            model_name="message",
            old_name="user",
            new_name="sender",
        ),
        migrations.RemoveField(
            model_name="message",
            name="room",
        ),
        migrations.AddField(
            model_name="message",
            name="is_private",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="message",
            name="content",
            field=models.TextField(),
        ),
        migrations.DeleteModel(
            name="Room",
        ),
        migrations.AddField(
            model_name="message",
            name="conversation",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="chat.conversation",
            ),
        ),
    ]
