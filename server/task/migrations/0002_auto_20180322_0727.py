# Generated by Django 2.0.2 on 2018-03-22 07:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0003_auto_20180322_0727'),
        ('task', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='timeslot',
            options={},
        ),
        migrations.RemoveField(
            model_name='task',
            name='phase',
        ),
        migrations.RemoveField(
            model_name='timeslot',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='timeslot',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='timeslot',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='timeslot',
            name='modified_at',
        ),
        migrations.RemoveField(
            model_name='timeslot',
            name='modified_by',
        ),
        migrations.RemoveField(
            model_name='timeslot',
            name='start_date',
        ),
        migrations.AddField(
            model_name='task',
            name='project',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='project.Project'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timeslot',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timeslot',
            name='end_time',
            field=models.TimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='timeslot',
            name='start_time',
            field=models.TimeField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timeslot',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
