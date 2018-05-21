// ページ上部へ戻るボタンの表示の設定
$(function () {
	var nav     = $('.page-top-btn'),
		offset  = '50',
		footer  = $(document).height() - $(window).height() - 500;
	$(window).scroll(function() {
		if($(window).scrollTop() > offset) {
			nav.addClass('page-top-btn-appear');
		} else {
			nav.removeClass('page-top-btn-appear');
		}
	});
});

// オフキャンバスのブレイクポイントの設定
ACMS.Ready(function(){
	ACMS.Config.offcanvas.breakpoint = 991
});