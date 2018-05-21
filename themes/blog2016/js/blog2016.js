ACMS.Ready(function(){
	//リンクモジュールのトグル
	$('.js-toggle-heading').click(function(){
		var $target = $($(this).data('target'));
		if($target.height() > 0){
			$(this)
			.children('i')
			.removeClass('acms-admin-icon-arrow-small-down')
			.addClass('acms-admin-icon-arrow-small-up');
			$target.height(0);
		} else {
			$(this)
			.children('i')
			.removeClass('acms-admin-icon-arrow-small-up')
			.addClass('acms-admin-icon-arrow-small-down');
			var height = $target.children('*').height();
			$target.height(height);
		}
	})
});
