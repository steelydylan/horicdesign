(function($){
	var defaults = {
		direction:"right"
	}
	var num = 0;
	var winPos = {x: window.scrollX, y: window.scrollY};
	$.fn.extend({
		offcanvas:function(opt){
			var opt = $.extend(defaults,opt);
			var id = 'js-offcanvas-'+num;
			num++;
			var $this = $(this);
			$this.addClass("js-offcanvas-sidebar");
			$this.wrap("<div class='js-offcanvas' id='"+id+"' />");
			$("body").addClass("js-offcanvas-body");
			if(opt.direction == "right"){
				$this.addClass("js-offcanvas-sidebar-right");
			}else{
				$this.addClass("js-offcanvas-sidebar-left");
			}
			if(opt.btn){
				$(opt.btn).addClass("js-offcanvas-btn");
				$(opt.btn).attr("data-toggle-offcanvas",'#'+id);
			}
			if(opt.fixedHeader){
				$(opt.fixedHeader).addClass("js-header-fixed");
			}
		}
	});
	$(document).on("click",".js-offcanvas-btn",function(e){
		var $target = $($(this).data("toggle-offcanvas"));
		var $this = $(this);
		winPos.x = window.scrollX;
		winPos.y = window.scrollY;
		var $body = $("body").css({"width": window.innerWidth, "height": $(window).height()});
		var $sidebar = $target.find(".js-offcanvas-sidebar");
		$target.addClass("active");
		setTimeout(function(){
			$("html").css('marginTop',-1 * window.scrollY);
			if($sidebar.hasClass("js-offcanvas-sidebar-right")){
				$body.addClass("js-offcanvas-body-right");
			}else{
				$body.addClass("js-offcanvas-body-left");
			}
			$sidebar.addClass("active");
		},1);
		e.preventDefault();
	});
	$(document).on("click touchstart",".js-offcanvas",function(e){
		if($(e.target).hasClass("js-offcanvas")){
				$(".js-offcanvas-body").removeClass("js-offcanvas-body-right");
				$(".js-offcanvas-body").removeClass("js-offcanvas-body-left");
				$(".js-offcanvas-sidebar").removeClass("active");
			setTimeout(function(){
				$(".js-offcanvas").removeClass("active");
				$("html").css('marginTop','');
				$("body").css({width:"",height:""});
				window.scrollTo(winPos.x,winPos.y);
			},300);
		}
	});
})(jQuery);