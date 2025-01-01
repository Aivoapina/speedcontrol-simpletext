"use strict";
$(() => {
  const speedcontrolBundle = "nodecg-speedcontrol";

  const runDataArray = nodecg.Replicant("runDataArray", speedcontrolBundle);

  runDataArray.on("change", (newVal) => {
    if (newVal) {
      const now = new Date();

      newVal.forEach((run, index) => {
        if (!newVal[index + 1]) return;

        const upnext = newVal[index + 1];
        const later = newVal[index + 2];
        const later2 = newVal[index + 3];

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
    }
  });

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
    if (!run) return;

    const title = $(`#${name}Title`);
    const category = $(`#${name}Category`);
    const player = $(`#${name}Player`);

    title.text(run.game);
    category.text(run.category);
    player.text(getPlayerNames(run.teams));
  };
});
