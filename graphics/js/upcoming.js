"use strict";
$(() => {
  const speedcontrolBundle = "nodecg-speedcontrol";

  const runDataArray = nodecg.Replicant("runDataArray", speedcontrolBundle);
  const scheduleAdjustmentReplicant = nodecg.Replicant("scheduleAdjustment", speedcontrolBundle);

  let runs = [];

   NodeCG.waitForReplicants(scheduleAdjustmentReplicant, runDataArray).then(() => {
    runDataArray.on("change", (newVal) => {
      if (newVal) {
        runs = newVal;
        updater(runs);
      }
    });
  });

  const updater = () => {
    const now = new Date();

    if (scheduleAdjustmentReplicant.value && !isNaN(scheduleAdjustmentReplicant.value)) {
      const adjustmentMs = parseInt(scheduleAdjustmentReplicant.value) * 60 * 1000;
      now.setTime(now.getTime() + adjustmentMs);
    }

    runs.forEach((run, index) => {
      if (!runs[index + 1]) return;

      const upnext = runs[index + 1];
      const later = runs[index + 2];
      const later2 = runs[index + 3];

      const startTime = calculateHalfway(
        run.scheduled,
        run.estimateS,
        run.setupTimeS,
      );
      const nextTime = calculateHalfway(
        upnext.scheduled,
        upnext.estimateS,
        upnext.setupTimeS,
      );

      if (startTime > now && index === 0) {
        setTexts("upnext", run);
        setTexts("later", upnext);
        setTexts("later2", later);
      }

      if (startTime < now && now < nextTime) {
        setTexts("upnext", upnext);
        setTexts("later", later);
        setTexts("later2", later2);
      }
    });
  };

  const calculateHalfway = (startTime, estimate, setupTime) => {
    const start = new Date(startTime);
    const halfway = new Date(
      start.getTime() + ((estimate + setupTime) * 1000) / 2,
    );
    return halfway;
  };

  const getPlayerNames = (teams) => {
    return teams
      .map((team) => team.players.map((player) => player.name).join(", "))
      .join(", ");
  };

  const setTexts = (name, run) => {
    const title = $(`#${name}Title`);
    const category = $(`#${name}Category`);
    const player = $(`#${name}Player`);

    if (!run) {
      category.parent().hide();
      player.parent().hide();
      return;
    }

    const names = getPlayerNames(run.teams);

    if (!run.category) {
      category.parent().hide();
    } else {
      category.parent().show();
    }
    if (!names) {
      player.parent().hide();
    } else {
      player.parent().show();
    }

    title.text(run.game);
    category.text(run.category);
    player.text(names);
  };

  setInterval(updater, 10000);
});
