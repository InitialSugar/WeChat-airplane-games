// 变量创建
var main=document.getElementById('main');
var start=document.getElementById('start');
var startbtn=start.getElementsByTagName('a')[0];
// 鼠标坐标位置初始
var airMoveX=0,airMoveY=0;
// setInterval计数初始化
var num=0;
// 子弹数组，地方飞机数组
var bullets = [];
var enemyAirs=[];
// 创建敌方飞机计数
var num1=0;

// 游戏开始
function gamestart(){
	// 设置开始界面隐藏
	start.style.display='none';
	// 创建本方飞机实例
	var ourAircreate=new ourAir(127,488);
	// 关于使用setInterval函数调用，背景，子弹，敌方飞机
	_SetInterval();
	// 给main创建监听函数
	main.addEventListener('mousemove',airMove,true);
}

// 创建飞机(敌方和友方)
//this,宽度，高度，X坐标，Y坐标，生命值，正常图片，爆炸图片，分数，速度。
function createAir(airW,airH,x,y,life,normalImg,boastImg,grade,speed){
	this.airW=airW;//宽度
	this.airH=airH;//高度
	this.x=x;//X坐标
	this.y=y;//Y坐标
	this.speed=speed;//速度
	this.life=life;//生命值
	this.normalImg=normalImg;//正常图片
	this.boastImg=boastImg;//爆炸图片
	this.grade=grade;//分数
	this.live=false;//判断是否存活
	this.imageNode = null;//节点初始化
	this.node=function(){
		this.imageNode=document.createElement('img');
		this.imageNode.src=this.normalImg;
		this.imageNode.style.left=this.x+'px';
		this.imageNode.style.top=this.y+'px';
		main.appendChild(this.imageNode);
	}//创建节点，给mainc插入节点图片；
	this.node();//创建节点函数调用
	this.enemyPlanMove=function(){
		if(grade<=50000){
			this.imageNode.style.top=this.imageNode.offsetTop+this.speed+'px';
		}else if(grade>50000&&grade<=100000){
			this.imageNode.style.top=this.imageNode.offsetTop+this.speed+1+'px';
		}else if(grade>100000&&grade<=150000){
			this.imageNode.style.top=this.imageNode.offsetTop+this.speed+2+'px';
		}else{
			this.imageNode.style.top=this.imageNode.offsetTop+this.speed+3+'px';
		}
	}//敌方飞机移动，通过分数判断做飞机移动
	
}

//this,宽度，高度，X坐标，Y坐标，生命值，正常图片，爆炸图片，分数，速度。
// 创建本方飞机
function ourAir(X,Y){
	var ourAirImgsrc='img/我的飞机.gif';//指定本方飞机文件路径
	createAir.call(this,66,80,X,Y,1,ourAirImgsrc,'img/本方飞机爆炸.gif',0);//调用创建飞机的函数，通过Call方法改变this指向，并向创建飞机的函数传递具体的参数
	this.imageNode.setAttribute('id','ourAirm');//设置创建的图片的id
}

// 创建敌方飞机
//this,宽度，高度，X坐标，Y坐标，生命值，正常图片，爆炸图片，分数，速度。
function enemycreateAir(airW,airH,x,y,life,normalImg,boastImg,grade,speed){
	createAir.call(this,airW,airH,x,y,life,normalImg,boastImg,grade,speed);//调用创建飞机的函数，通过Call方法改变this指向，并向创建飞机的函数传递具体的参数
}

// 创建随机数，通过随机数设置敌方飞机的随机X轴位置及随机速度。
function randomEnemyX(min,max){
	return Math.floor(min+Math.random()*(max-min));
}
// 背景滚动和子弹移动事件
function _SetInterval(){
	setInterval(function(){
		main.style.backgroundPosition='0'+ ' ' + num+'px';//设置背景位置
		num++;
		if(num % 5 == 0){
			bullets.push(new airBullet(parseInt(ourAirm.style.left)+30,parseInt(ourAirm.style.top)))//创建子弹，通过本方飞机的位置创建子弹
		}

		for(var i = 0;i < bullets.length;i++){
			bullets[i].bulletMove();//调用子弹移动函数
			if(parseInt(bullets[i].imageNode.style.top)<=20){//判断当子弹距离顶部高度小于等于20px时，移除该节点并数组删除该项。
				main.removeChild(bullets[i].imageNode);
				bullets.splice(i,1);
			}
		}

//this,宽度，高度，X坐标，Y坐标，生命值，正常图片，爆炸图片，分数，速度。
		if(num%20==0){
			num1++;
			if(num1%20==0){//创建中型飞机
				enemyAirs.push(new enemycreateAir(46,60,randomEnemyX(0,270),-100,5,'img/enemy3_fly_1.png','img/中飞机爆炸.gif',5000,randomEnemyX(1,3)))
			}
			if(num1%40==0){//创建大飞机
				enemyAirs.push(new enemycreateAir(110,170,randomEnemyX(0,210),-100,10,'img/enemy2_fly_1.png','img/大飞机爆炸.gif',30000,randomEnemyX(1,3)))
				num1=0;
			}else if(num1%2==0){//创建小飞机
				enemyAirs.push(new enemycreateAir(34,24,randomEnemyX(0,285),-100,1,'img/enemy1_fly_1.png','img/小飞机爆炸.gif',1000,randomEnemyX(1,3)))
			}
		}

		for(var i=0;i<enemyAirs.length;i++){
			enemyAirs[i].enemyPlanMove();//调用敌军飞机移动函数
			if(parseInt(enemyAirs[i].imageNode.style.top)>=568){//判断当子弹距离顶部高度大于等于568px时，移除该节点并数组删除该项。
				main.removeChild(enemyAirs[i].imageNode);
				enemyAirs.splice(i,1);
			}
		}

		
	},20);
}

// 飞机移动事件
function airMove(e){
	var ourAirm=document.getElementById('ourAirm');
	// 获取本方飞机ID
	airMoveX=e.clientX;
	airMoveY=e.clientY;
	// 获取X,Y轴坐标
	ourAirm.style.left=airMoveX-100-30+'px';
	ourAirm.style.top=airMoveY-100-38+'px';
	// 设置飞机左边距和顶部距离
	if(parseInt(ourAirm.style.left)<=-24){
		ourAirm.style.left=-24+'px';
	}
	if(parseInt(ourAirm.style.left)>=276){
		ourAirm.style.left=276+'px';
	}
	if(parseInt(ourAirm.style.top)>=488){
		ourAirm.style.top=488+'px';
	}
	if(parseInt(ourAirm.style.top)<=0){
		ourAirm.style.top=0+'px';
	}
	// 针对飞机位置做判断，超出设置顶部高度，左右距离
	
}

// 创建子弹
//this，子弹宽度，子弹高度，X坐标，Y坐标，子弹图片
function bullet(bulW,bulH,x,y,bulImg){
	this.bulW=bulW;//设置子弹宽度
	this.bulH=bulH;//设置子弹高度
	this.x=x;//设置子弹X坐标
	this.y=y;//设置子弹Y坐标
	this.bulImg=bulImg;//设置子弹图片
	this.imageNode = null;//初始化节点
	this.node=function(){
		this.imageNode=document.createElement('img');
		this.imageNode.src=this.bulImg;
		this.imageNode.style.left=this.x+'px';
		this.imageNode.style.top=this.y+'px';
		main.appendChild(this.imageNode);
	}
	//创建节点，给mainc插入节点图片；
	this.node();
	//调用创建函数
	this.bulletMove = function(){
		this.imageNode.style.top = this.imageNode.offsetTop - 30 + 'px';
	}
	//子弹移动函数
}

// 创建具体子弹
//this，子弹宽度，子弹高度，X坐标，Y坐标，子弹图片
function airBullet(x,y){
	var airBulletImgsrc='img/bullet1.png';//设置子弹图片路径
	bullet.call(this,6,14,x,y,airBulletImgsrc);//调用创建子弹的函数，通过Call方法改变this指向，并向创建子弹的函数传递具体的参数
}

// 给开始按钮创建监听事件
startbtn.addEventListener('click',gamestart);
