'use strict';
$(() => {
	const speedcontrolBundle = 'nodecg-speedcontrol';

	const timerElem = $('#timer');

  const playerNumber = parseInt(window.location.hash.replace('#', '')) - 1 || 0;

  const runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
  const timer = nodecg.Replicant('timer', speedcontrolBundle);

  let teamId;
	
  runDataActiveRun.on('change', newVal => {
    if (newVal && newVal.teams && newVal.teams[playerNumber])
      teamId = newVal.teams[playerNumber].id;
  });

  timer.on('change', (newVal, oldVal) => {
    if (!oldVal) return;

    if (!oldVal.teamFinishTimes[teamId] && newVal.teamFinishTimes[teamId]) {
      const place = Object.keys(newVal.teamFinishTimes).length;
      timerElem.html(newVal.teamFinishTimes[teamId].time);
      timerElem.addClass('place_' + place);
    }
    if (newVal.state === 'stopped' && oldVal.state === 'finished') {
      timerElem.html('')
      timerElem.removeClass();
    }
  });

	NodeCG.waitForReplicants(runDataActiveRun, timer).then(() => {
    const id = runDataActiveRun.value.teams[playerNumber].id;
    if (timer.value.teamFinishTimes[id]) {
      timerElem.addClass('place_1');
      timerElem.html(timer.value.teamFinishTimes[id].time);
    }
  });
});