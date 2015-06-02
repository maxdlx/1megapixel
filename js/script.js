/* jshint undef: true, unused: true */
/* global famobi, faZepto */
(function($) {
	'use strict';

	var game = {};

	game.goal = 1E3; // 1,000
	game.step = 10;

	game.list = $('.list');
	game.finished = 0;

	game.lastTime = +(new Date());
	game.idle = 1;
	game.idleSince = 0;
	game.deltaTime = 0;
	game.now = game.lastTime;

	game.htmlElement = document.querySelector('html');
	game.bodyElement = document.querySelector('body');
	game.distElement = document.querySelector('#m');

	// fired on every tick, when a frame is requested
	game.tick = function() {
		game.now = +(new Date());
		game.deltaTime = game.now - game.lastTime;
		game.lastTime = game.now;

		trackDistance();

		if (game.dist >= 1000) {
			if (!game.finished) {
				finishGame();
			}
		}
	};

	// ticker
	game.update = function() {
		game.tick();

		window.requestAnimationFrame(game.update);
	};

	// position the lines from the top of the screen according to their data-meters attribute
	function posLines() {
		var $elem = $('.meters');

		$elem.each(function() {
			var $this = $(this),
				m = parseFloat($this.attr('data-meters'));

			$this.css('top', m*1000 + 'px');
		});
	}

	// fill lines in steps for better orientation
	function fillLines() {
		var $elem = $('.meters'),
			goal = game.goal,
			stepWidth = game.step,
			steps = {};

		$elem.each(function() {
			var $this = $(this),
				m = parseFloat($this.attr('data-meters'));

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

	game.dist = 0;
	game.offset = document.querySelector('.list').offsetTop;
	game.lastDistance = 0;
	game.deltaDistance = 0;
	function trackDistance() {
		game.dist = (window.scrollY - game.offset)/1000;
		game.distElement.innerHTML = numFormat(Math.max(0,game.dist));

		// check if distance has change in the last X sec
		game.deltaDistance = game.dist - game.lastDistance;

		famobi.log(game.now, 'game.now');
		famobi.log(game.idle, 'game.idle');
		famobi.log(game.idleSince, 'game.idleSince');
		famobi.log(game.deltaDistance, 'game.deltaDistance');
		famobi.log(game.now - game.idleSince, '(game.now - game.idleSince)');
		famobi.log(game.deltaTime, 'delta > 1 sec');

		if (game.deltaDistance > 0) {
			game.idle = 0;
			game.idleSince = 0;
			game.bodyElement.style.backgroundSize = '100% 100%';
		} else if (!game.idle) {
			game.idleSince = game.idleSince || game.now;
			if ((game.now - game.idleSince) > 1E3) {
				game.bodyElement.style.backgroundSize = 'auto auto';
				game.idle = 1;
				submitHighscore();
			}
		}

		game.lastDistance = game.dist;
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
		posLines();
		initPlayers();

		game.update();
	};

	game.start();
})(faZepto);