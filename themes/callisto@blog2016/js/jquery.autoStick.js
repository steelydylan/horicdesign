/**
* jquery.autoStick.js
* @version v0.1.0
* @author steelydylan
* @link http://horicdesign.com
* @license MIT License
*/
(function($){
    var defaults = {
        wrapperElement:"body",
        beforeElement:null,
        marginTop:20,
        marginBottom:20,
        marginLeft:10,
        enableCondition:function(){
            return true;
        }
    }
    $.fn.extend({
        autoStick:function(opt){
            opt = $.extend(defaults,opt);
            opt.fixTop = opt.fixTop || opt.marginTop;
            $wrapper = $(opt.wrapperElement);
            $wrapper.css("position","relative");
            var $this = $(this);
            var that = this;
            $(window).scroll(function(){  
                if(!opt.enableCondition.apply(that)){
                    $this.css("position","static");
                    $this.css("marginTop",opt.marginTop);
                    return true;
                }
                $this.css("marginTop",0);         
                var scroll = $(this).scrollTop();
                var beforeElement = opt.beforeElement;
                var beforeHeight = $wrapper.offset().top;
                if(beforeElement){
                    beforeHeight = $(beforeElement).offset().top + $(beforeElement).outerHeight();
                }
                if(scroll > beforeHeight){
                    if(scroll + $this.height() + opt.marginBottom + opt.fixTop > $wrapper.offset().top + $wrapper.height()){
                        var bottom = $wrapper.outerHeight() - $this.outerHeight();
                        $this.css("position","absolute");
                        $this.css("top",bottom - opt.marginBottom);
                        $this.css("left",opt.marginLeft);
                        width = $this.width();
                    }else{
                        $this.css("position","fixed");
                        $this.css("top",opt.fixTop);
                        $this.css("left",$wrapper.offset().left+opt.marginLeft);
                    }
                }else{
                    $this.css("position","absolute");
                    if(beforeHeight){
                        $this.css("top",beforeHeight-$wrapper.offset().top+opt.marginTop);
                        $this.css("left",opt.marginLeft);
                        width = $this.width();
                    }
                }
            }).scroll();
            $(window).resize(function(){
                $(window).scroll();
            });
        }
    })
})(jQuery);