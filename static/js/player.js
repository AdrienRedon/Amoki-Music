var player;
var initialized = false;
var currentVolume;

var playerControl = {
  play: function(options) {
    player.loadVideoById(options.videoId, 0, 'default');
    $(document).attr('title', options.name);
  },
  stop: function() {
    player.stopVideo();
  },
  volume_up: function() {
    player.setVolume(Math.min(player.getVolume() + 10, 100));
  },
  volume_down: function() {
    player.setVolume(Math.max(player.getVolume() - 10, 0));
  }
};

// Socket init
var socket = new io.Socket();
socket.connect();
socket.on('connect', function() {
  socket.subscribe(token);
});

socket.on('message', function(message) {
  if(initialized) {
    playerControl[message.action](message.options);
  }
});

// Youtube iframe init
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
  player = new YT.Player('embed', {
    height: '390',
    width: '640',
    playerVars: {iv_load_policy: '3',modestbranding:'1',rel:'0',},
    events: {
      onReady : function(){
        if(typeof current_music !== "undefined"){
          player.loadVideoById(current_music, current_time_past, 'default');
        }
        initialized = true;
      }
    }
  });
}

