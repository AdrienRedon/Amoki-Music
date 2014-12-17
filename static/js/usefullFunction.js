$( document ).ready(function() {
	var hauteur = $(window).height() - 115;
	if ($(window).height() > 765) {
		hauteur = $(window).height() - 115;
	} else {
		hauteur = 650;
	}
	$(".LIB").height(hauteur);
	$(".list-lib").height(hauteur - 90);
	$(".tab-content").height(hauteur - 130);
	$( window ).resize(function() {
		if ($(window).width() > 992) {
			if ($(window).height() > 765) {
				hauteur = $(window).height() - 115;
			} else {
				hauteur = 650;
			}
			$(".LIB").height(hauteur);
			$(".list-lib").height(hauteur - 90);
			$(".tab-content").height(hauteur - 130);
		}
	});

    $(".btn").click(function(){
	    $(this).blur();
	});

	updateDataTime();
	$('.ajax_music_inifi_scroll').submit();
});

function maj_header_player(data){
	$(document).attr('title', data.current_music[0].fields.name);
	$(".player").children('.header-player').html(data.template_header_player);
	$('#url-next').val(data.current_music[0].fields.url);
	$('#url-dead-link').val(data.current_music[0].fields.url);
}

function disabled_btn(){
	$(document).attr('title', 'Amoki\'s musics');
	$(".header-player").children().remove();
	$('.header-player').append('<div class="col-md-12 title"><div class="marquee"><span class="now-playing">No music :\'( Add yours now !</span></div></div>');
	$("#btn-next").attr('disabled', 'disabled');
	$("#dead-link").attr('disabled', 'disabled');
	$(".progress-bar").stop();
	$(".progress-bar").css('width', '0%');
	myCounter.stop();
}

function maj_playlist_current(data, url){
	myCounter.stop();
	$("#btn-next").removeAttr('disabled');
	$("#dead-link").removeAttr('disabled');
	$('.playlist-ajax').html(data.template_playlist);
	updateDataTime();
	if (url !== '/add-music/' && url !== '/search-music/'){
		maj_header_player(data);
	} else if ($('.title').length){
		maj_header_player(data);
	}
	myCounter.start(data.time_left);
}

function modal_confirm(target){
	target.modal({
		'show':true,
		'backdrop':false
	}).on('shown.bs.modal', function(){
		setTimeout(function(){target.modal('hide');}, 1000);
	});
}

function updateDataTime(){
	$('span[data-time]').each(function(){
       $(this).html(updateTimePlaylistTemporaryFunction($(this).data("time")));
	});
}