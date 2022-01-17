let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

$(document).ready(function(){
	var hash = location.hash.replace( /^#/, '' );
	if(hash) {
		hashchanged();
	}
});

function hashchanged(){

	$('html').css('overflow-y', 'hidden');

	var hash = location.hash.replace( /^#/, '' );

	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'games/' + hash + '/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);

	
	document.title = $('#' + hash +  '-title').attr('linkedPageTitle');
	if(hash != '') {
		if(hash == 'calico') {
			var url = window.location.href;
			var newurl = url.split('#');
			window.top.location.href = newurl[0] + 'games/calico/index.html';
		} else {
			$('body').html('<iframe class="frame" src="games/' + hash + '/index.html"></iframe>')
		}
	} else {
		var url = window.location.href;

		// url = ['https://myautoma.github.io', 'clansofcaledonia/index.html']
		url = url.split('/games/');

		//url[0] = 'https://myautoma.github.io'
		window.top.location.href = url[0];
	}
	
}

$('.infoTrigger').on(touchEvent, function () {
	$('#resetOverlay').css('display', 'block');
	$('#infoBox').css('display', 'block');
});

$('.close').on(touchEvent, function () {
	$('#resetOverlay').css('display', 'none');
	$('#infoBox').css('display', 'none');
});


window.addEventListener("hashchange", hashchanged, false);