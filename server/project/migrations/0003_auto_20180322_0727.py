# Generated by Django 2.0.2 on 2018-03-22 07:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0002_phase'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='phase',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='phase',
            name='modified_by',
        ),
        migrations.RemoveField(
            model_name='phase',
            name='project',
        ),
        migrations.RemoveField(
            model_name='project',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='project',
            name='start_date',
        ),
    ]
