'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var timer = $('#timer'); // timer.html
	
	// This is where the timer information is received.
	// The "change" event is triggered whenever the time changes or the state changes.
	var stopwatch = nodecg.Replicant('stopwatch', speedcontrolBundle);
	stopwatch.on('change', (newVal, oldVal) => {
		if (newVal)
			updateTimer(newVal, oldVal);
	});
	
	// Sets the timer text and classes.
	function updateTimer(newVal, oldVal) {
		// Change class on the timer to change the colour if needed.
		// See the common.css file for more information.
		if (oldVal) timer.toggleClass('timer_'+oldVal.state, false);
		timer.toggleClass('timer_'+newVal.state, true);
		
		timer.html(newVal.time); // timer.html
	}
});