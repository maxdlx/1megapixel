/* jshint undef: true, unused: true */
/* global famobi, faZepto */
(function() {
	'use strict';

	var now = +(new Date());
	var game = {
		"goal": 1E3,
		"step": 10,
		"list": document.querySelector('.list'),
		"finished": 0,
		"lastTime": now,
		"idle": 1,
		"idleSince": 0,
		"deltaTime": 0,
		"now": now,
		"players": [],
		"nextPlayer": {
			"id": "",
			"dist": 0,
			"distf": "",
			"name": "",
			"avatar": "",
			"dummy": ""
		},
		"htmlElement": document.querySelector('html'),
		"bodyElement": document.querySelector('body'),
		"distElement": document.querySelector('#m'),
		"dist": document.querySelector('.list').offsetTop,
		"offset": 0,
		"lastDistance": 0,
		"deltaDistance": 0,
		"start": function() {},
		"tick": function() {},
		"update": function() {},
		"dummy": ""
	};

	game.dist = (window.scrollY - game.offset)/1000;
	game.lastDistance = game.dist;

	// ticker
	game.tick = function() {
		game.update();
		window.requestAnimationFrame(game.tick);
	};

	// fired on every tick, when a frame is requested
	game.update = function() {
		game.now = +(new Date());
		game.deltaTime = game.now - game.lastTime;
		game.lastTime = game.now;

		trackDistance();
		trackPlayers();

		if (game.dist >= 1000) {
			if (!game.finished) {
				finishGame();
			}
		}
	};

	// position the lines from the top of the screen according to their data-meters attribute
	function posLines() {
		var elem,
			i = 0,
			m = 0,
			list = document.querySelectorAll('[data-meters]');

		for (i; i < list.length; i++) {
			elem = list[i];
			m = parseFloat(elem.getAttribute('data-meters'));

			elem.style.top = m*1000 + 'px';
		};
	}

	// fill lines in steps for better orientation
	function fillLines() {
		var elem,
			i = 0,
			list = document.querySelectorAll('.meters'),
			goal = game.goal,
			stepWidth = game.step,
			steps = {};

		for (i; i < list.length; i++) {
			elem = list[i];
			m = parseFloat(elem.getAttribute('data-meters'));

			steps[m] = !0;
		});

		var c = goal / stepWidth,
			i = 0,
			m = 0,
			li = '';

		for (i; i < c; i++) {
			m = i*stepWidth;

			if (!steps[m]) {
				li += '<li class="meters intermediate" data-meters="' + m + '">' + m + 'm</li>';
			}
		}
		game.list.append(li);
	}

	function fillPlayers() {
		var pl = getNextPlayer(),
			m = 0,
			li = '';
		do {
			m = pl.dist;
			li += '<li class="enemy" data-meters="' + m + '"><img src="'+pl.avatar+'">'+pl.name+'</li>';
		} while(pl = getNextPlayer());
		game.list.append(li);
	}

	function trackDistance() {
		game.dist = (window.scrollY - game.offset)/1000;
		game.distElement.innerHTML = numFormat(Math.max(0,game.dist));

		// check if distance has change in the last X sec
		game.deltaDistance = game.dist - game.lastDistance;

		if (game.deltaDistance > 0.1) {
			// movement
			game.idle = 0;
			game.idleSince = 0;
			game.bodyElement.style.backgroundSize = '100% 25%';
		} else if (!game.idle) {
			game.idleSince = game.idleSince || game.now;
			// 1 sec of idleness
			if ((game.now - game.idleSince) > 1E3) {
				game.bodyElement.style.backgroundSize = 'auto auto';
				game.idle = 1;
				submitHighscore();
			}
		}

		var nextLi = document.querySelector('.meters');
		nextLi.style.position = 'fixed';
		nextLi.style.top = '0';

		game.lastDistance = game.dist;
	}

	function trackPlayers() {
		
	}

	function numFormat(e){
		return e.toFixed(3).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.');
	}

	function signIn() {
		var user = new Parse.User();
		user.set("username", "my name");
		user.set("password", "my pass");
		user.set("email", "email@example.com");
		  
		// other fields can be set just like with Parse.Object
		user.set("phone", "650-555-0000");
		  
		user.signUp(null, {
		  success: function(user) {
		    // Hooray! Let them use the app now.
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	}

	function initPlayers() {
		// retrieve list of friends/enemies from fb
		// todo

		// dummy data:
		game.players.push({
			"id": "xxx-xxxx-xxx",
			"dist": Number(1000*game.players.length) + Number(Math.random()*1000),
			"distf": function() { 
				return numFormat(this.dist/1000);
			},
			"name": "ABC",
			"avatar": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y",
			"dummy": ""
		});
		game.players.push({
			"id": "xxx-xxxx-xxx",
			"dist": Number(1000*game.players.length) + Number(Math.random()*1000),
			"distf": function() { 
				return numFormat(this.dist/1000);
			},
			"name": "ABC",
			"avatar": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y",
			"dummy": ""
		});
		game.players.push({
			"id": "xxx-xxxx-xxx",
			"dist": (1000*game.players.length) + (Math.random() * 100),
			"distf": function() { 
				return numFormat(this.dist/1000);
			},
			"name": "ABC",
			"avatar": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y",
			"dummy": ""
		});
		game.players.push({
			"id": "xxx-xxxx-xxx",
			"dist": (1000*game.players.length) + (Math.random() * 100),
			"distf": function() { 
				return numFormat(this.dist/1000);
			},
			"name": "ABC",
			"avatar": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y",
			"dummy": ""
		});
		game.players.push({
			"id": "xxx-xxxx-xxx",
			"dist": (1000*game.players.length) + (Math.random() * 100),
			"distf": function() { 
				return numFormat(this.dist/1000);
			},
			"name": "ABC",
			"avatar": "http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y",
			"dummy": ""
		});
	}

	function getNextPlayer() {
		return game.nextPlayer = game.players.shift();
	}

	function finishGame() {
		game.finished = 1;
		alert(famobi.__("msg_finished"));
		document.querySelector('.finish').style.display = 'block';
		document.querySelector('.finish').onclick = submitHighscore;
		// document.querySelector('body').style.minHeight = '1000000000000000px';
		window.scrollTo(10,10);
	}

	function submitHighscore() {
		requestAnimationFrame(function() {
			famobi.submitHighscore(0, game.dist);
		});
	}

	game.start = function() {
		trackDistance();
		fillLines();
		initPlayers();
		fillPlayers();
		posLines();

		game.tick();
	};

	game.start();
})();
