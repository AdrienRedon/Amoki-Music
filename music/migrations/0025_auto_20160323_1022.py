# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-23 10:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0024_auto_20160223_1120'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='playlisttrack',
            options={'ordering': ('room', 'order')},
        ),
    ]
