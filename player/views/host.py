# -*- coding: utf-8 -*-
from django.shortcuts import render
from player.models import Room


def host(request):
    room_name = request.POST.get('room')
    password = request.POST.get('password')
    if request.method == "POST" and room_name and password:
        room = Room.objects.filter(name=room_name)
        if room.count() == 0:
            bad_password = True
            logging = True
        elif room[0].password != password:
            bad_password = True
            logging = True
        else:
            request.session['room'] = room_name
            request.session['token'] = room[0].token

    if not request.session.get('room', False):
        rooms = Room.objects.values_list('name', flat=True).all()
        logging = True
        return render(request, 'player.html', locals())

    return render(request, 'player.html', locals())


def logout(request):
    request.session.flush()
    logging = True
    rooms = Room.objects.values_list('name', flat=True).all()
    return render(request, 'login.html', locals())
