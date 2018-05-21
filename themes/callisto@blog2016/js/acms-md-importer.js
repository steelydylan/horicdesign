(function($){
	var defaults = {
		status:"draft",
		indexing:"on",
		start_date:"1000-01-01",
		start_time:"00:00:00",
		end_date:"9999-12-31",
		end_time:"23:59:59",
		bid:"1",
		code:"",
		tag:"",
		entry:["status","indexing","start_date","start_time","end_date","end_time","primary_image","code","tag","title","status"],
		arg:["bid","cid","eid"]
	};
	var getRand = function(a,b){
		return ~~(Math.random() * (b - a + 1)) + a;
	};
	var getRandText = function(limit){
        var ret = "";
        var strings = "abcdefghijklmnopqrstuvwxyz0123456789";
        var length = strings.length;
        for(var i = 0; i < limit; i++){
            ret += strings.charAt(Math.floor(getRand(0,length)));
        }
        return ret;
	}
	$.fn.extend({
		importMdFile:function(){
			$(this).change(function(opt){
				var opt = $.extend(opt,defaults);
				var file = $(this).prop('files')[0];
				var fr = new FileReader();
				fr.onload = function(){
					var result = fr.result;
					var nodes = result.split('\r\n');
					var content = {};
					content.type = [];
					content.id = [];
					content.align = [];
					content.group = [];
/* 					content */
					content['ACMS_POST_Entry_Insert:'+getRandText(15)] = '';
					nodes.forEach(function(node){
						content.align.push('auto');
						content.group.push('acms-column-clear');
						var rand = getRandText(15);
						if(node.indexOf('##') == 0){
							content.id.push(rand);
							content.type.push('text');
							content['text_text_'+rand] = node.replace('##','');
							content['text_tag_'+rand] = 'h2';
						}else if(node.indexOf('###') == 0){
							content.id.push(rand);
							content.type.push('text');
							content['text_text_'+rand] = node.replace('###','');
							content['text_tag_'+rand] = 'h3';
						}else if(node.indexOf('####') == 0){
							content.id.push(rand);
							content.type.push('text');
							content['text_text_'+rand] = node.replace('####','');
							content['text_tag_'+rand] = 'h4';
						}else if(node.length > 0){
							content.id.push(rand);
							content.type.push('text');
							content['text_text_'+rand] = node;
							content['text_tag_'+rand] = 'p';
						}
					});
					console.log($.extend({title:"test",status:opt.status},content));
					$.post('',$.extend({title:"test",status:opt.status},content));
				}
				fr.readAsText(file);
			});
		},
	});
})(jQuery);