# Generated by Django 2.0.2 on 2018-06-01 09:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Export',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_preview', models.BooleanField(default=False)),
                ('title', models.CharField(blank=True, max_length=255)),
                ('format', models.CharField(blank=True, choices=[('xlsx', 'xlsx'), ('docx', 'docx'), ('pdf', 'pdf'), ('json', 'json')], max_length=100)),
                ('mime_type', models.CharField(blank=True, max_length=200)),
                ('file', models.FileField(blank=True, default=None, max_length=255, null=True, upload_to='export/')),
                ('exported_at', models.DateTimeField(auto_now_add=True)),
                ('pending', models.BooleanField(default=True)),
                ('exported_by', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
