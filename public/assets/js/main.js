var color = { 'playerOne': '#dd1166', 'playerTwo': '#77cc00' };

var connect = {}

connect.id		= (location.search.replace('?', '').split('__'))[0];
connect.user	= (location.search.replace('?', '').split('__'))[1];

connect.uri		= location.origin;
connect.socket	= io.connect();

connect.socket.on('member', function(data) { console.log(data); });
connect.socket.emit('connectTo', connect.id, connect.user);






var myArea = document.getElementById('area');
var myInfo = document.getElementById('info');

// colorize background
myArea.style.backgroundColor = color[connect.user];

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myArea);


var myAreaSize = {
	x: null,
	y: null,
	w: null,
	h: null,
	calc: function(){
		var rect = myArea.getBoundingClientRect();
		this.x   = rect.left;
		this.y   = rect.top;
		this.w   = rect.width;
		this.h   = rect.height;
	}
}


myAreaSize.calc();


myInfo.textContent = connect.user;

// let the pan gesture support all directions.
// this will block the vertical scrolling on a touch-device while on the element
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

// listen to events...
mc.on('panleft panright panup pandown tap press', function(ev) {

	var pos = {
		x: (ev.center.x - myAreaSize.x) / myAreaSize.w,
		y: (ev.center.y - myAreaSize.y) / myAreaSize.h
	}

	pos.x = Math.min(Math.max(pos.x, 0), 1);
	pos.x = Math.min(Math.max(pos.y, 0), 1);

/*
	if( pos.x < 0 ) pos.x = 0;
	if( pos.x > 1 ) pos.x = 1;

	if( pos.y < 0 ) pos.y = 0;
	if( pos.y > 1 ) pos.y = 1;
*/

	//myInfo.textContent = ev.type ;//+'\n('+pos.x+','+pos.y+')';

	console.log(pos);

	var msg = {
		type: 'move',
		user: connect.user,
		pos:  pos
	};

	connect.socket.send(msg);
});




window.onresize = function(event) {
	myAreaSize.calc();
};
