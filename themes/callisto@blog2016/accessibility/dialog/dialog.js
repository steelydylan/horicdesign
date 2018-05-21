jQuery(function($){
	var focusableElements = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
	$.fn.dialog = function(){
		var $active;
		var $self = $(this);
		var $firstInput = $self.find(focusableElements).first();
		var $lastInput = $self.find(focusableElements).last();
		var id = $self.attr("id");
		var $btn = $("[data-target="+id+"]");
		$btn.click(function(){
			$active = $(document.activeElement);
			$self.attr("aria-hidden",false);
			$firstInput.focus();
		});
		$(".js-dialog-close",$self).click(function(){
			$self.attr("aria-hidden","true");
			$active.focus();
		});
		$firstInput.on('keydown', function (e) {
		    if ((e.which === 9 && e.shiftKey)) {
		        e.preventDefault();
		        $lastInput.focus();
		    }
		});
		$lastInput.on('keydown', function (e) {
		   if ((e.which === 9 && !e.shiftKey)) {
		       e.preventDefault();
		       $firstInput.focus();
		   }
		});
	}
	$(".js-dialog").dialog();
});