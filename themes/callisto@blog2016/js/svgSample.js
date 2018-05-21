(function(){
	var s = Snap("#japan");
	var arrows = s.selectAll('.arrow')
	//上方向へ
	var upword = function(){
		arrows.forEach(function(arrow){
			arrow.animate({ transform: 't0 -20',fill:'red'},
			1000);
		});
		setTimeout(downword,1000);
	}
	//下方向へ
	var downword = function(){
		arrows.forEach(function(arrow){
			arrow.animate({ transform: 't0 20',fill:'green'},
			1000);
		});
		setTimeout(upword,1000);
	}
	upword();
})();