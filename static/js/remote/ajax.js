var csrftoken = $.cookie('csrftoken');

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
beforeSend: function(xhr, settings) {
  if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }
}
});

$(document).on('submit', '.ajax-shuffle', function(e) {
  e.preventDefault();
  var $this = $(this);
  ajax($this).done(function(data) {
    if(data.error) {
      modal_confirm($('#modal-shuffle-error'));
    }
    else if(data.shuffle === true) {
      modal_confirm($('#modal-shuffle-on'));
    }
    else {
      modal_confirm($('#modal-shuffle-off'));
    }
  })
  .fail(log_errors);
});


$(document).on('submit', '.ajax-next, .ajax-dead-link', function(e) {
  e.preventDefault();
  var $this = $(this);
  ajax($this).done(function(data) {
    modal_confirm($('#modal-next-music'));
  })
  .fail(log_errors);
});

$(document).on('change', '.provider', function(){
  $('.ajax-search').submit();
});

$(document).on('submit', '.ajax-search', function(e) {
  e.preventDefault();
  var $this = $(this);
  var provider = $this.children('.provider').children('.provider').val().toLowerCase();
  if($this.children('.query').children('.query').val().trim() === '' || $this.children('.query').children('.query').val().trim() === null) {
    $("#list-" + provider).slideUp();
    $("#list-" + provider).promise().done(function() {
      $("#list-" + provider).children().remove();
      $("#list-" + provider).append('<li class="list-group-item item-lib youtube-list-music"><div class="row"><p class="col-xs-10">Enter your search in the field above</p><i class="fa fa-level-up fa-2x col-xs-2"></i></div></li>');
      $("#list-" + provider).slideDown();
    });
    return;
  }

  ajax($this).done(function(data) {
    if(data.current_music) {
      $("#btn-search").removeAttr('disabled');
      modal_confirm($('#modal-add-music'));
    }
    else {
      $("#tab_btn_" + provider).addClass("active");
      $("#" + provider).addClass("active");
      $("#tab_btn_library").removeClass("active");
      $("#library").removeClass("active");
      $("#list-" + provider).slideUp();
      $("#list-" + provider).promise().done(function() {
        $("." + provider + "-list-music").remove();
        $("#list-" + provider).html(data.template_library);
        $("#list-" + provider).slideDown();
        $("#list-" + provider).promise().done(function() {});
      });
    }
  })
  .fail(log_errors);
});

$(document).on('submit', '.ajax-add-music', function(e) {
  e.preventDefault();
  var $this =  $(this);
  $this.children("button").children("span").attr("class", "fa fa-refresh fa-spin");
  $this.children("button").attr('disabled', 'disabled');

  ajax($this).done(function(data) {
    $this.children("button").children("span").attr('class', 'glyphicon glyphicon-headphones');
    $this.children("button").removeAttr('disabled');
    modal_confirm($('#modal-add-music'));
  })
  .fail(log_errors);
});

$(document).on('submit', '.ajax-volume', function(e) {
  e.preventDefault();
  var $this = $(this);

  ajax($this).done(function(data) {
    $this.children(".volume_clicked").removeClass("volume_clicked");
  })
  .fail(log_errors);
});

$(document).on('submit', '.ajax_music_inifite_scroll', function(e) {
  e.preventDefault();
  var $this = $(this);
  $("<li id='spinner_library' class='list-group-item item-lib row row-list-item' style='color:black'><i class='fa fa-spinner fa-4x fa-spin'></i></li>").insertBefore($this.closest('li'));

  ajax($this).done(function(data) {
    $(data.template).insertBefore($this.closest('li'));
      if(data.more_musics) {
        $this.children("#page").val(parseInt($this.children("#page").val()) + 1);
      }
      else {
        $this.children("#page").addClass('disabled');
      }
      $("#spinner_library").remove();
  })
  .fail(log_errors);
});

function update_player() {
  var dataSend = {
      'page': encodeURIComponent($('.ajax_music_inifite_scroll').children("#page").val()),
    };
  $.ajax({
    type: "POST",
    url: "/update-player/",
    data: dataSend,
    dataType: "json",
    success: function(data) {
      if(data.shuffle === true) {
        $("#btn-shuffle").attr("value", "false");
        $("#submit-shuffle").attr("class", "btn btn-default btn-control btn-shuffle-true");
      }
      else {
        $("#btn-shuffle").attr("value", "true");
        $("#submit-shuffle").attr("class", "btn btn-default btn-control btn-shuffle-false");
      }

      $('.library-list-music').remove();
      $('#list-library').prepend(data.template_library);

      if(data.current_music) {
        timeline(data.time_left, data.time_past_percent);
        maj_playlist_current(data);
      }
      else {
        disabled_btn();
      }
    },
    error: log_errors
  });
}

function log_errors(resultat, statut, erreur){
  console.error(resultat.responseText);
  console.error("Statut : " + statut);
  console.error("Error: " + erreur.stack);
}

function ajax(source){
  return $.ajax({
    url: source.attr('action'),
    type: source.attr('method'),
    data: source.serialize().replace(/[^&]+=(?:&|$)/gm, ''),
    dataType: "json",
  });
}

socket.on('message', function(message) {
  if(message.update === true){
    update_player();
  }
});
