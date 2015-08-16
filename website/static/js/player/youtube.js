// Youtube iframe init
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var youtubePlayer = {initialized: false};

var youtubePlayerControl = {
  play: function(options) {
    if(youtubePlayer.initialized) {
      var musicOptions = {
        videoId: options.musicId,
        suggestedQuality: 'default',
      };
      if(options.timer_start) {
        musicOptions.startSeconds = options.timer_start;
      }
      if(options.timer_end) {
        musicOptions.endSeconds = options.timer_end;
      }
      youtubePlayer.loadVideoById(musicOptions);
      $(document).attr('title', options.name);
      $('#youtubePlayer').fadeIn(250);
    }
  },
  stop: function() {
    if(youtubePlayer.initialized) {
      youtubePlayer.stopVideo();
      $('#youtubePlayer').fadeOut(250);
    }
  },
  volume_up: function() {
    if(youtubePlayer.initialized) {
      youtubePlayer.setVolume(Math.min(youtubePlayer.getVolume() + 10, 100));
    }
  },
  volume_down: function() {
    if(youtubePlayer.initialized) {
      youtubePlayer.setVolume(Math.max(youtubePlayer.getVolume() - 10, 0));
    }
  },
  set_volume: function(volume) {
    if(youtubePlayer.initialized) {
      youtubePlayer.setVolume(volume);
    }
  },
};

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player('youtubePlayer', {
    height: '390',
    width: '640',
    playerVars: {
      iv_load_policy: '3',
      modestbranding: '1',
      rel: '0',
      controls: '0',
    },
    events: {
      onReady: function() {
        youtubePlayer.initialized = true;
        youtubePlayerControl.set_volume(cookieVolume);
        if(typeof current_music !== "undefined" && current_music_source === "Youtube") {
          youtubePlayerControl.play({
            musicId: current_music,
            timer_start: current_time_past,
            timer_end: current_music_timer_end,
          });
        }
      },
    }
  });
}
