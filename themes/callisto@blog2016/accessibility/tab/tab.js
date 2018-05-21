jQuery(function($){
	$.fn.tab = function(){
		var $links = $(this).find(".js-tab-item");
		var $panels = $(this).children(".js-tab-panel");
		var length = $links.length;
		$links.click(function(e){
			$(this).focus();
			$links.attr("aria-selected",false);
			$(this).attr("aria-selected",true);
			$panels.attr("aria-hidden",true);
			var $panel = $("#"+$(this).attr("aria-controls"));
			$panel.attr("aria-hidden",false);
			e.preventDefault();
		});
		$links.keydown(function(event) {
			var index = $links.index(this);
			if(event.keyCode == 37){
				index--;
			}else if(event.keyCode == 39){
				index++;
			}
			if(index < 0){
				index = length-1;
			}else if(index >= length){
				index = 0;
			}
			$links.get(index).click();
			$links.get(index).focus();
		});
	}
	$(".js-tab").tab();
});