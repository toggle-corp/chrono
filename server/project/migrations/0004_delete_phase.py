# Generated by Django 2.0.2 on 2018-03-22 07:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0003_auto_20180322_0727'),
        ('task', '0002_auto_20180322_0727'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Phase',
        ),
    ]
