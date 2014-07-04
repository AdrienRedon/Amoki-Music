def get_youtube_id(url):
    if not "v=" in url:
        return url
    else:
        return url.rsplit("v=", 1)[1]


def get_youtube_link(video_id):
    return "https://www.youtube.com/watch?v=" + video_id

# TODO hours converter