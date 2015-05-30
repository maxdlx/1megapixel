!function($) {
	'use strict';

	var game = {};

	game.goal = 1E3; // 1,000
	game.step = 50;

	game.list = $('.list');

	// position the lines from the top of the screen according to their data-meters attribute
	var posLines = function() {
		var $elem = $('.meters');

		$elem.each(function(value, key) {
			var $this = $(this),
				m = parseFloat($this.attr('data-meters'));

			$this.css('top', m*1000 + 'px');
		});
	};

	// fill lines in 50m steps for better orientation
	var fillLines = function() {
		var $elem = $('.meters'),
			goal = game.goal,
			stepWidth = game.step,
			steps = {};

		$elem.each(function(value, key) {
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
	};

	game.finished = 0;
	game.dist = 0;
	game.offset = document.querySelector('.list').offsetTop;
	function trackDistance() {
		game.dist = (window.scrollY - game.offset)/1000;
		document.querySelector('#m').innerHTML = numFormat(Math.max(0,game.dist));

		if (game.dist >= 1000) {
			if (!game.finished)
				finishGame();
		}
		window.requestAnimationFrame(trackDistance);
	};

	function numFormat(e){
		return e.toFixed(3).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
	};

	function finishGame() {
		game.finished = 1;
		alert("You did it! Respect :)");
		document.querySelector('.finish').style.display = 'block';
		document.querySelector('.finish').onclick = function() {
			famobi.submitHighscore(0, game.dist);
		};
		document.querySelector('.game').style.height = '1000000000000000px';
	}

	game.start = function() {
		trackDistance();
		fillLines();
		posLines();
	};

	game.start();
}(Zepto);