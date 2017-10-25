var main=document.getElementById('main');
var start=document.getElementById('start');
var myScore=document.getElementById('myScore');
var userbtn=document.getElementById('userbtn');
var userbtns=userbtn.getElementsByTagName('a');
var displayscore=document.getElementById('displayscore');
var overScore=document.getElementById('overScore');
var backstart=document.getElementById('backstart');
var startGame=start.getElementsByTagName('a')[0];
var num=0,numEnemy=0;
var bgscroll=0;
var arrEnemys=[];
var arrBullets=[];
var scoreMyAir=0;
var setIntervalGo=null;
// 游戏开始事件
function gameStart(){
	start.style.display='none';
	var newCreateMyAir=new createMyAir(127,488);
	main.addEventListener('mousemove',myAirMove,true);
	_setInterval();
}
// 飞机创建公用类
function airPlaneCreate(airW,airH,airX,airY,lifevalue,speed,flightImg,blastImg,score,sufferBeatingImg){
	this.airW=airW;
	this.airH=airH;
	this.airX=airX;
	this.airY=airY;
	this.score=score;
	this.time=0;
	this.lifevalue=lifevalue;
	this.speed=speed;
	this.deathState=false;
	this.flightImg=flightImg;
	this.blastImg=blastImg;
	this.sufferBeatingImg=sufferBeatingImg;
	this.nodeAirName=null;
	this.nodeAirCreate=function(){
		this.nodeAirName=document.createElement('img');
		this.nodeAirName.src=this.flightImg;
		this.nodeAirName.style.left=this.airX+'px';
		this.nodeAirName.style.top=this.airY+'px';
		main.appendChild(this.nodeAirName);
	}
	this.nodeAirCreate();
	this.enemyAirMove=function(){
		if(scoreMyAir<=100000 && scoreMyAir>=50000){
			this.nodeAirName.style.top=parseInt(this.nodeAirName.style.top)+this.speed+1+'px';
		}else if(scoreMyAir>100000 && scoreMyAir<=200000){
			this.nodeAirName.style.top=parseInt(this.nodeAirName.style.top)+this.speed+2+'px';
		}else if(scoreMyAir>200000){
			this.nodeAirName.style.top=parseInt(this.nodeAirName.style.top)+this.speed+3+'px';
		}
		else{
			this.nodeAirName.style.top=parseInt(this.nodeAirName.style.top)+this.speed+'px';
		}
	}
}
// 创建我方飞机
function createMyAir(x,y){
	airPlaneCreate.call(this,66,80,x,y,1,1,'img/我的飞机.gif','img/本方飞机爆炸.gif')
	this.nodeAirName.setAttribute('id','newMyAir');
}
// 创建敌方飞机
function createEnemyAir(airW,airH,airX,airY,lifevalue,speed,flightImg,blastImg,score,sufferBeatingImg){
	airPlaneCreate.call(this,airW,airH,airX,airY,lifevalue,speed,flightImg,blastImg,score,sufferBeatingImg);
}
// 创建子弹
function bullet(bulletH,bulletW,bulletX,bulletY,bulletImg,bulAttack){
	this.bulletH=bulletH;
	this.bulletW=bulletW;
	this.bulletX=bulletX;
	this.bulletY=bulletY;
	this.bulletImg=bulletImg;
	this.bulAttack=1;
	this.nodeBulletName=null;
	this.nodeBullteCreate=function(){
		this.nodeBulletName=document.createElement('img');
		this.nodeBulletName.src=bulletImg;
		this.nodeBulletName.style.left=this.bulletX+'px';
		this.nodeBulletName.style.top=this.bulletY+'px';
		main.appendChild(this.nodeBulletName);
	}
	this.nodeBullteCreate();
	this.bulletMove=function(){
		this.nodeBulletName.style.top=parseInt(this.nodeBulletName.style.top)-20+'px';
	}
}
// 创建子弹实例
function createBullet(x,y){
	bullet.call(this,14,6,x,y,'img/bullet1.png');
}
// setInterval使用，子弹，背景，敌方飞机，子弹飞机碰撞判断
function _setInterval(){
	setIntervalGo=setInterval(function(){
		bgscroll++;
		main.style.backgroundPosition='0 '+bgscroll+'px';
		num++;
		if(num%5==0){
			arrBullets.push(new createBullet(parseInt(newMyAir.style.left)+30,parseInt(newMyAir.style.top)));
		}
		for(var i=0;i<arrBullets.length;i++){
			arrBullets[i].bulletMove();
			if(parseInt(arrBullets[i].nodeBulletName.style.top)<=10){
				main.removeChild(arrBullets[i].nodeBulletName);
				arrBullets.splice(i,1);
			}
		}

		if(num==20){
			numEnemy++;
			if (numEnemy%9==0){
				arrEnemys.push(new createEnemyAir(46,60,_random(23,270),-10,8,_random(1,3),'img/enemy3_fly_1.png','img/中飞机爆炸.gif',3000,'img/中飞机挨打.png'));
			}else if(numEnemy%15==0){
				arrEnemys.push(new createEnemyAir(110,170,_random(55,210),-10,15,_random(1,3),'img/enemy2_fly_1.png','img/大飞机爆炸.gif',5000,'img/大飞机挨打.png'));
				numEnemy=0;
			}else if(numEnemy%1==0){
				arrEnemys.push(new createEnemyAir(34,24,_random(17,286),-10,1,_random(1,3),'img/enemy1_fly_1.png','img/小飞机爆炸.gif',1000,'img/enemy1_fly_1.png'));
			}
			num=0;
		}

		for(var j=0;j<arrEnemys.length;j++){
			for(var i=0;i<arrBullets.length;i++){
				if(arrEnemys[j].deathState == false){
					if(arrBullets[i].nodeBulletName.offsetLeft+arrBullets[i].bulletW > arrEnemys[j].nodeAirName.offsetLeft && arrBullets[i].nodeBulletName.offsetLeft < arrEnemys[j].nodeAirName.offsetLeft + arrEnemys[j].airW && arrEnemys[j].nodeAirName.offsetTop >= 0){
						if(arrBullets[i].nodeBulletName.offsetTop <= arrEnemys[j].nodeAirName.offsetTop + arrEnemys[j].nodeAirName.offsetHeight){
							arrEnemys[j].lifevalue = arrEnemys[j].lifevalue-arrBullets[i].bulAttack;
							main.removeChild(arrBullets[i].nodeBulletName);
							arrBullets.splice(i,1);
							arrEnemys[j].nodeAirName.src=arrEnemys[j].sufferBeatingImg;
							if(arrEnemys[j].lifevalue == 0 ){
								scoreMyAir=scoreMyAir+arrEnemys[j].score;
								myScore.innerHTML=scoreMyAir;
								arrEnemys[j].deathState = true;
								arrEnemys[j].nodeAirName.src=arrEnemys[j].blastImg;
							}
						}
					}
				}
			}
			if(arrEnemys[j].nodeAirName.offsetLeft <= newMyAir.offsetLeft+newMyAir.offsetWidth && arrEnemys[j].nodeAirName.offsetWidth + arrEnemys[j].nodeAirName.offsetLeft >= newMyAir.offsetLeft  && newMyAir.offsetTop <= arrEnemys[j].nodeAirName.offsetTop + arrEnemys[j].nodeAirName.offsetHeight && newMyAir.offsetTop + newMyAir.offsetHeight >= arrEnemys[j].nodeAirName.offsetTop){
				if(arrEnemys[j].deathState == false){
					newMyAir.src='img/本方飞机爆炸.gif';
					clearInterval(setIntervalGo);
					gameover();
				}
			}
		}

		for(var i=0;i<arrEnemys.length;i++){
			arrEnemys[i].enemyAirMove();
			if(parseInt(arrEnemys[i].nodeAirName.style.top)>=568){
				main.removeChild(arrEnemys[i].nodeAirName);
				arrEnemys.splice(i,1);	
			}
			if(arrEnemys[i].deathState == true){
				arrEnemys[i].time++;
				if(arrEnemys[i].time >=20){
					main.removeChild(arrEnemys[i].nodeAirName);
					arrEnemys.splice(i,1);
				}
			}
		}
	},20)
}
// 随机数
function _random(min,max){
	return min+Math.floor(Math.random()*(max-min));
}
// 本方飞机移动
function myAirMove(e){
	var newMyAir=document.getElementById('newMyAir');
	var myAirX=e.pageX;
	var myAirY=e.pageY;
	newMyAir.style.left=myAirX-100-30+'px';
	newMyAir.style.top=myAirY-100-38+'px';
	if(parseInt(newMyAir.style.left)<=-25){
		newMyAir.style.left=-25+'px';
	}
	if(parseInt(newMyAir.style.left)>=275){
		newMyAir.style.left=275+'px';
	}
	if(parseInt(newMyAir.style.top)<=0){
		newMyAir.style.top=0;
	}
	if(parseInt(newMyAir.style.top)>=488){
		newMyAir.style.top=488+'px';
	}
}
// 游戏结束事件
function gameover(e){
	displayscore.style.display='block';
	main.removeChild(newMyAir);
	var scoreover=myScore.firstChild;
	if(scoreMyAir>50000 && scoreMyAir<100000){
		var txt='<h1>玩的一般般啦!</h1>';
	}else if(scoreMyAir<200000 && scoreMyAir>100000){
		var txt='<h1>很厉害哦!继续加油!</h1>';
	}else if(scoreMyAir>200000){
		var txt='<h1>哇塞,你太厉害了!</h1>';
	}else{
		var txt='<h1>这不是你的真实水平吧!</h1>';
	}
	overScore.innerHTML=scoreMyAir+'<br>' +txt;
	scoreMyAir=0;
	backstart.onclick=function(){
		window.location.reload();
	}
}
// 暂停时三个按钮操作事件
function menuOperation(e){
	clearInterval(setIntervalGo);
	newMyAir.style.display='none';
	userbtn.style.display='block';
	var target=e.target;
	if(target == userbtns[0]){
		newMyAir.style.display='block';
		userbtn.style.display='none';
		_setInterval();
	}
	if(target == userbtns[1]){
		window.location.reload();
	}
	if(target == userbtns[2]){
		window.location.reload();
	}
}
// 开始游戏监听事件
startGame.addEventListener('click',gameStart);
// 鼠标点击显示操作按钮
main.addEventListener('click',menuOperation,true);