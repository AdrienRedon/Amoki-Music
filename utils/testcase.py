from django.test import TestCase as DjangoTestCase
from rest_framework.test import APIClient
from player.models import Room, Events

import sure
from datetime import datetime


class TestCase(DjangoTestCase):
    def reload(self, item):
        """
        Reload an item from DB
        """
        return item.__class__.objects.get(pk=item.pk)

    def setUp(self):
        self.r = Room(name="a", password="a")
        self.r.save()

    def tearDown(self):
        for room, event in Events.get_all().items():
            if event is not None:
                event.cancel()


class EndpointTestCase(TestCase):
    def setUp(self):
        super().setUp()
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.reload(self.r).token)

    def assertResponseEqualsRoom(self, response, room, check_token=True):
        response['name'].should.eql(room.name)
        response['current_music'].should.eql(room.current_music)
        response['shuffle'].should.eql(room.shuffle)
        response['can_adjust_volume'].should.eql(room.can_adjust_volume)
        response['count_left'].should.eql(room.get_count_remaining())
        response['time_left'].should.eql(room.get_remaining_time())
        response['current_time_left'].should.eql(room.get_current_remaining_time())
        response['volume'].should.eql(room.volume)
        response['playlist'].should.eql(list(room.playlist.all()))
        if check_token:
            response['token'].should.eql(room.token)

    def assertResponseEqualsMusic(self, response, music):
        response['name'].should.eql(music.name)
        response['music_id'].should.eql(music.music_id)
        response['url'].should.eql(music.url)
        response['duration'].should.eql(music.duration)
        response['thumbnail'].should.eql(music.thumbnail)
        response['count'].should.eql(music.count)
        response['timer_start'].should.eql(music.timer_start)
        response['source'].should.eql(music.source)
        if response['last_play'] is not None:
            datetime.strptime(response['last_play'], '%Y-%m-%dT%H:%M:%S.%f').should.eql(music.last_play)
        else:
            response['last_play'].should.eql(music.last_play)
