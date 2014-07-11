from django.db import models

import webbrowser
from datetime import datetime
from threading import Timer
from browser import helpers


class Music(models.Model):
    # Youtube ID
    video_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255, editable=False)
    date = models.DateTimeField(auto_now_add=True)
    # Duration in second
    duration = models.PositiveIntegerField(editable=False)
    # thumbnail in 480 * 360
    thumbnail = models.CharField(max_length=255, editable=False)
    count = models.PositiveIntegerField(default=0, editable=False)

    @classmethod
    def add(cls, **kwargs):
        existing_music = Music.objects.filter(video_id=kwargs['video_id']).first()
        if existing_music:
            return existing_music
        else:
            music = cls(**kwargs)
            music.save()
            return music

    def __unicode__(self):
        return self.name


class Player():
    actual = None
    event = None
    shuffle = False

    @classmethod
    def play(self, music):
        # clear the queue
        if Player.event:
            Player.event.cancel()

        Player.actual = music
        music.count += 1
        music.date = datetime.now()
        music.save()

        webbrowser.open(helpers.get_youtube_link(music.video_id))

        Player.event = Timer(music.duration, Player.play_next, ())
        Player.event.start()

    @classmethod
    def play_next(self, forced=False):
        music = None
        if Player.actual:
            if forced:
                music = Player.actual
            else:
                music = Music.objects.filter(date__gt=Player.actual.date).first()

        if music:
            Player.play(music)
        elif Player.shuffle:
            shuffled = Music.objects.filter().order_by('?').first()
            Player.play(shuffled)
        else:
            Player.actual = None

    @classmethod
    def push(self, video_id):
        music = Music.add(video_id=video_id)

        if not Player.actual:
            Player.actual = music
            Player.play_next(forced=True)

    @classmethod
    def get_actual_remaining_time(self):
        if not Player.actual:
            return 0
        return Player.actual.duration - int(((datetime.now() - Player.actual.date)).total_seconds())

    @classmethod
    def get_remaining_time(self):
        if not Player.actual:
            return 0
        nexts = Music.objects.filter(date__gt=Player.actual.date)
        time_left = 0
        for music in nexts:
            time_left += music.duration
        time_left += Player.get_actual_remaining_time()

        return time_left

    @classmethod
    def get_musics_remaining(self):
        if not Player.actual:
            return
        nexts = Music.objects.filter(date__gt=Player.actual.date)

        return nexts

    @classmethod
    def get_count_remaining(self):
        if not Player.actual:
            return 0
        return Music.objects.filter(date__gte=Player.actual.date).count()


from browser.signals import *
