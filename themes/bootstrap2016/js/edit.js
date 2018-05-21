$(function(){
	// カスタムフィールドに登録されているアイコンのクラス名を取得
	// 登録されているクラス名と一致するものがあったら、.selectedを適用する
	$(document).on('click','.js-select-icon-start' ,function(){
		var selectedItem = $('#selected-icon').attr('class');
		$('.js-select-icon li').each(function() {
			var listItem = $(this).children().attr('class');
			if( selectedItem == listItem ) {
				$(this).children().addClass('selected');
			}
		});
	});

	// .js-select-icon内のa要素をクリックしたとき
	$(document).on('click','.js-select-icon a' ,function(e){
		e.preventDefault();
		var selectedIcon = $(this).attr('class');
		$('.js-select-icon a').removeClass('selected');
		$(this).addClass('selected');
		//クラスを一旦外して、新しいクラス名を付与する
		$('#selected-icon').removeClass().addClass(selectedIcon);
		// カスタムフィールドにクラス名を挿入する
		$('#js-insert-icon').val(selectedIcon);
	});
	// 削除ボタン をクリックしたとき
	$(document).on('click','.js-delete-icon' ,function(e){
		e.preventDefault();
		var selectedIcon = '';
		$('#selected-icon').removeClass();
		$('#js-insert-icon').val(selectedIcon);
	});
});
