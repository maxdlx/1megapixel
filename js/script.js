!function($) {
	'use strict';

	var game = {};

	game.goal = 1E3; // 1,000,000
	game.step = 25;

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
			m = 0;

		for (i; i < c; i++) {
			m = i*stepWidth;
			console.log(m, c, i, steps);
			// console.log(i*stepWidth);
			if (!steps[m]) {
				game.list.append('<li class="meters intermediate" data-meters="' + m + '">' + m + 'm</li>');
			}
		}
	};

	fillLines();
	posLines();
}(Zepto);