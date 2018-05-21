// トップページのスライダーの設定
$(function() {
	$('.js-slider').slick({
		dots: true,
		arrows: true,
		prevArrow: '<button type="button" class="slick-prev">前へ</button>',
		nextArrow: '<button type="button" class="slick-next">次へ</button>',
		autoplay: true,
		autoplaySpeed: 3000,
	});
});