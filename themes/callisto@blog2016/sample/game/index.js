(function(){
	Atlas();
	var width = window.innerWidth;
	var height = window.innerHeight;
	var Wall = Atlas.createClass(Shape.Box,{
		initialize:function(color,width,height){
			this.inherit(color,width,height);
		},
		enterFrame:function(){
			if(this.hitTest(ball)){
				var box1 = new Shape.Box("red",this.width,1);
				var box2 = new Shape.Box("red",1,this.height);
				box1.setPosition(this.x,this.y);
				if(box1.hitTest(ball) && ball.sy > 0){
					ball.y = box1.y - 40;
					ball.sy = -ball.sy * 0.5;
				}
				box1.y+= this.height - 1;
				if(box1.hitTest(ball) && ball.sy < 0){
					ball.y = box1.y;
					ball.sy = -ball.sy * 0.5;
				}
				box2.setPosition(this.x,this.y);
				if(box2.hitTest(ball) && ball.sx > 0){
					ball.x = box2.x - 40;
					ball.sx = -ball.sx * 0.5;
				}
				box2.x+= this.width - 1;
				if(box2.hitTest(ball) && ball.sx < 0){
					ball.x = box2.x;
					ball.sx = -ball.sx * 0.5;
				}
			}
		}
	});
	var walls = [
		/*スクリーン用ボックス*/
		{color:'red',width:50,height:height,x:-50,y:0},
		{color:'red',width:50,height:height,x:width,y:0},
		{color:'red',width:width,height:50,x:0,y:-50},
		{color:'red',width:width,height:50,x:0,y:height},
		/*障害物*/
		{color:'red',width:50,height:1000,x:150,y:0},
		{color:'red',width:500,height:50,x:150,y:1000},
		{color:'red',width:500,height:50,x:width-500,y:500},
		{color:'red',width:50,height:300,x:width-250,y:0}
	];
	var game = new App();
	game.fps = 60;
	game.setColor("orange");
	game.setSize(width,height);
	game.setQuality(width,height);
	game.centerize();
	var text = new Text("","white",10);
	text.setPosition(10,10);
	var ball = new Shape.Circle("white",20);
	ball.sx = 0;
	ball.sy = 0;
	ball.setPosition(10,100);
	ball.enterFrame = function(){
		ball.x += parseInt(ball.sx/2);
		ball.y += parseInt(ball.sy/2);
	};
	for(var i = 0,n = walls.length; i < n; i++){
		var opt = walls[i];
		var wall = new Wall(opt.color,opt.width,opt.height);
		wall.setPosition(opt.x,opt.y);
		game.addChild(wall);
	}
	window.addEventListener("deviceorientation",function(e){
		ball.sx += parseInt(e.gamma/10);
		ball.sy += parseInt(e.beta/10);
	});
	game.addChildren(ball,text);
	game.start();
})();