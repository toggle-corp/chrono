# Generated by Django 2.0.2 on 2018-09-10 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0008_auto_20180910_1323'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='tags',
            field=models.ManyToManyField(blank=True, to='project.Tag'),
        ),
    ]
