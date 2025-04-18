"use strict";
$(() => {
  // The bundle name where all the run information is pulled from.
  const speedcontrolBundle = "nodecg-speedcontrol";

  // JQuery selectors.
  const gameTitle = $("#gameTitle"); // game-title.html
  const textCarousel = $("#textCarousel"); // next-game-title.html
  const gameCategory = $("#gameCategory"); // game-category.html
  const gameCatPlatCarousel = $("#gameCatPlatCarousel"); // game-catplat-carousel.html
  const gameSystem = $("#gameSystem"); // game-system.html
  const gameEstimate = $("#gameEstimate"); // game-estimate.html
  const player = $("#player"); // player.html
  const player1 = $("#player1"); // full layout player 1
  const player2 = $("#player2"); // full layout player 2
  const twitch = $("#twitch"); // twitch.html
  const commentatorContainer = $("#commentatorContainer");
  const donationInfoElem = document.getElementById("donationInfo");

  let playerCycle = 0;
  let textCycle = 0;
  let nextGame;
  let texts = [];

  // replicants
  const runDataActiveRun = nodecg.Replicant(
    "runDataActiveRun",
    speedcontrolBundle,
  );
  const runDataArray = nodecg.Replicant("runDataArray", speedcontrolBundle);
  const runDataActiveRunSurrounding = nodecg.Replicant(
    "runDataActiveRunSurrounding",
    speedcontrolBundle,
  );
  const donateStatus = nodecg.Replicant("donateStatus", speedcontrolBundle);
  const commentators = nodecg.Replicant("commentators", speedcontrolBundle);
  const textCarouselReplicant = nodecg.Replicant(
    "textCarousel",
    speedcontrolBundle,
  );
  const backgrounds = nodecg.Replicant("backgrounds", speedcontrolBundle);

  runDataActiveRunSurrounding.on("change", (newVal) => {
    if (newVal) updateNextGame(runDataActiveRunSurrounding);
  });

  runDataActiveRun.on("change", (newVal) => {
    if (newVal) updateSceneFields(newVal);
  });

  backgrounds.on("change", (newVal) => {
    if (newVal) {
      Object.keys(newVal).forEach((key) => {
        const imgElem = document.getElementById(key);
        if (imgElem) {
          imgElem.src = newVal[key];
        }
      });
    }
  });

  commentators.on("change", (newVal) => {
    if (newVal) {
      const leftDiv = newVal.left
        ? `<div class="blue-bg">${newVal.left}</div>`
        : "";
      const rightDiv = newVal.right
        ? `<div class="blue-bg">${newVal.right}</div>`
        : "";
      commentatorContainer.empty().append(leftDiv + rightDiv);
    }
  });

  textCarouselReplicant.on("change", (newVal) => {
    if (newVal) {
      texts = newVal.split(";");
    }
  });

  donateStatus.on("change", (newVal) => {
    if (!donationInfoElem) return;

    if (newVal) {
      donationInfoElem.innerHTML = "Lahjoituksia luettavana!";
    } else {
      donationInfoElem.innerHTML = "";
    }
  });

  const updateNextGame = (runDataActiveRunSurrounding) => {
    runDataArray.value.forEach((runData) => {
      if (runData.id == runDataActiveRunSurrounding.value.next) {
        nextGame = runData.game;
      }
    });
  };

  const textCarouselUpdater = () => {
    textCarousel.addClass("hide");

    setTimeout(() => {
      // bit hacky solution to replace only for nextgame
      const formatedText = texts[textCycle].replace("{nextGame}", nextGame);
      textCarousel.html(formatedText);
      textCarousel.removeClass("hide");
    }, 1000);

    if (textCycle === texts.length - 1) {
      textCycle = 0;
    } else {
      textCycle += 1;
    }
  };

  const sceneUpdater = () => {
    if (playerCycle == 0) {
      playerCycle = 1;
    } else if (playerCycle == 1) {
      playerCycle = 0;
    }
    updateSceneFields(runDataActiveRun.value);
  };

  // Sets information on the pages for the run.
  const updateSceneFields = (runData) => {
    gameTitle.html(runData.game); // game-title.html
    gameCategory.html(runData.category); // game-category.html
    gameSystem.html(runData.system); // game-system.html
    gameEstimate.html(runData.estimate); // game-estimate.html
    gameCatPlatCarousel.html(
      runData.category + " • " + runData.system + " • " + runData.estimate,
    );

    // Checks if we are on the player.html/twitch.html page.
    // This is done by checking if the #player/#twitch span exists.
    if (player.length || twitch.length || player1.length || player2.length) {
      // Open the webpage with a hash parameter on the end to choose the team.
      // eg: http://localhost:9090/bundles/speedcontrol-simpletext/graphics/player.html#2
      // If this can't be found, defaults to 1.
      const playerNumber = parseInt(window.location.hash.replace("#", "")) || 1;

      // Arrays start from 0 and not 1, so have to adjust for that.
      const team = runData.teams[playerNumber - 1];

      // speedcontrol has the ability to have multiple players in a team,
      // but for here we'll just return the 1st one.

      if (playerCycle == 0) {
        showPlayerName(player, team.players[0]);
        showPlayerName(player1, runData.teams[0].players[0]);
        showPlayerName(player2, runData.teams[1].players[0]);
      } else if (playerCycle == 1) {
        showPlayerTwitch(player, team.players[0]);
        showPlayerTwitch(player1, runData.teams[0].players[0]);
        showPlayerTwitch(player2, runData.teams[1].players[0]);
      }
    }
  };

  const showPlayerName = (elem, play) => {
    elem.addClass("hide");
    setTimeout(function () {
      elem.removeClass("twitchLogo");
      elem.html(play.name);
      elem.addClass("emptylogo");
      elem.removeClass("hide");
    }, 1000);
  };

  const showPlayerTwitch = (elem, play) => {
    elem.addClass("hide");
    setTimeout(function () {
      elem.removeClass("emptylogo");
      elem.html(play.social.twitch);
      elem.addClass("twitchLogo");
      elem.removeClass("hide");
    }, 1000);
  };

  setInterval(sceneUpdater, 15000);
  setInterval(textCarouselUpdater, 25000);

  textCarouselUpdater();
});
