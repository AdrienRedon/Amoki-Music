# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-09-19 17:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0028_auto_20160919_1641'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlisttrack',
            name='track_type',
            field=models.CharField(choices=[('NORMAL', '"NORMAL" : Selected by an user request'), ('SHUFFLE', '"SHUFFLE" : Randomly selected')], default='NORMAL', max_length=20),
        ),
    ]
