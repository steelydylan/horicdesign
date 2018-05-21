(function() {
 
  $(function() {
  	var url = location.href;
  	if(url.indexOf("entry-edit")){
	    var $action;
	    $action = $("[name^='ACMS_POST_Entry_Insert'], [name^='ACMS_POST_Entry_Update']");
	    if (0 !== $action.size()) {
	      window.onbeforeunload = function() {
	        return "エントリーを編集中にページを離れると保存できない場合があります。よろしいですか？";
	      };
	      return $($action[0].form).submit(function() {
	        return window.onbeforeunload = null;
	      });
	    }
	}
  });
 
}).call(this);