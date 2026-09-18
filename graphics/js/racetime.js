"use strict";
$(() => {
	const speedcontrolBundle = "nodecg-speedcontrol";

	const timerElem = $("#finishTime");

	const playerNumber = parseInt(window.location.hash.replace("#", "")) - 1 || 0;

	const runDataActiveRun = nodecg.Replicant(
		"runDataActiveRun",
		speedcontrolBundle,
	);
	const timer = nodecg.Replicant("timer", speedcontrolBundle);

	let teamId;

	runDataActiveRun.on("change", (newVal) => {
		if (newVal && newVal.teams && newVal.teams[playerNumber])
			teamId = newVal.teams[playerNumber].id;
	});

	// Grab and display the player's finish times
	const player1Elem = document.getElementById("player1Time");
	const player2Elem = document.getElementById("player2Time");

	if (player1Elem || player2Elem) {
		NodeCG.waitForReplicants(runDataActiveRun, timer).then(() => {
			timer.on("change", () => {
				const teams = runDataActiveRun.value?.teams;
				if (!teams || teams.length < 2) return;

				player1Elem?.classList.remove("place_1", "place_2");
				player2Elem?.classList.remove("place_1", "place_2");

				const finished = Object.keys(timer.value.teamFinishTimes);
				if (finished.length < 2) return;

				if (finished[0] === teams[0].id) {
					player1Elem?.classList.add("place_1");
					player2Elem?.classList.add("place_2");
				} else {
					player2Elem?.classList.add("place_1");
					player1Elem?.classList.add("place_2");
				}
			});
		});
	}

	timer.on("change", (newVal, oldVal) => {
		if (!oldVal) return;

		if (!oldVal.teamFinishTimes[teamId] && newVal.teamFinishTimes[teamId]) {
			const place = Object.keys(newVal.teamFinishTimes).length;
			timerElem.html(newVal.teamFinishTimes[teamId].time);
			timerElem.addClass("place_" + place);
		}
		if (newVal.state === "stopped" && oldVal.state === "finished") {
			timerElem.html("");
			timerElem.removeClass();
		}
	});

	NodeCG.waitForReplicants(runDataActiveRun, timer).then(() => {
		const id = runDataActiveRun.value.teams[playerNumber].id;
		if (timer.value.teamFinishTimes[id]) {
			timerElem.addClass("place_1");
			timerElem.html(timer.value.teamFinishTimes[id].time);
		}
	});
});
