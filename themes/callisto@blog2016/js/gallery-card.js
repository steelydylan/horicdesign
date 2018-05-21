(function($){
	// left: 37, up: 38, right: 39, down: 40,
	// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
	var keys = {37: 1, 38: 1, 39: 1, 40: 1};
	var preventDefault = function(e) {
	  e = e || window.event;
	  if (e.preventDefault)
	      e.preventDefault();
	  e.returnValue = false;  
	}
	var preventDefaultForScrollKeys = function(e) {
	    if (keys[e.keyCode]) {
	        preventDefault(e);
	        return false;
	    }
	}
	var disableScroll = function() {
	  if (window.addEventListener) // older FF
	      window.addEventListener('DOMMouseScroll', preventDefault, false);
	  window.onwheel = preventDefault; // modern standard
	  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	  window.ontouchmove  = preventDefault; // mobile
	  document.onkeydown  = preventDefaultForScrollKeys;
	}
	var enableScroll = function() {
	    if (window.removeEventListener)
	        window.removeEventListener('DOMMouseScroll', preventDefault, false);
	    window.onmousewheel = document.onmousewheel = null; 
	    window.onwheel = null; 
	    window.ontouchmove = null;  
	    document.onkeydown = null;  
	}
	
	$.fn.galleryCard = function(){
		$(this).each(function(){
			var $this = $(this);
			var currentWidth = (window.innerWidth||document.documentElement.clientWidth||0);
			$this.click(function(){
				var width = $this.outerWidth();
				var height = $this.outerHeight();
				var y = $this.offset().top;
				var x = $this.offset().left;
				var windowWidth = (window.innerWidth||document.documentElement.clientWidth||0);
				var windowHeight = (window.innerHeight||document.documentElement.clientHeight||0);
				var toWidth = windowWidth*0.8
				var toLeft = windowWidth*0.1;
				var toHeight = height * toWidth / width;
				var toTop = windowHeight - toHeight * 0.6;
				var caption = $this.data("caption");
				var link = $this.data("link");
				var $clone = $this.clone();
				var $ink = $("<div></div>");
				$ink.css("position","absolute");
				$ink.css("z-index",1);
				$ink.css("border-radius","50%");
				$ink.css("background-color","orange");
				$ink.css("left",x);
				$ink.css("top",y);
				$ink.width(5);
				$ink.height(5);
				$clone.css("z-index",2);
				$clone.css("position","absolute");
				$clone.css("left",x);
				$clone.css("top",y);
				$clone.css("width",width);
				$clone.css("height",height);
				disableScroll();
				$this.after($ink);
				$this.after($clone);
				$ink.animate({
					width:windowWidth*3,
					height:windowWidth*3,
					left:5+x-windowWidth*1.5,
					top:5+y-windowHeight*1.5
				}).promise().done(function(){
					$ink.css("position","fixed");
					$ink.css("top",0);
					$ink.css("left",0);
					$ink.css("border-radius",0);
				});
				$ink.click(function(){
					$ink.fadeOut(function(){
						enableScroll();
						$ink.remove();
					});
					$clone.animate({
						top:0,
						opacity:0
					}).promise().done(function(){
						$clone.remove();
					});
				});
				setTimeout(function(){
					$clone.animate({
						width:toWidth,
						height:toHeight,
						left:toLeft,
						top:toTop
					},200,function(){
						$clone.addClass("active");
					});
				},200);
				//$this.animate({})
			});
		});
	}
})(jQuery);