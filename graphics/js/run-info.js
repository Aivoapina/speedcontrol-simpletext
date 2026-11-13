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
  const sponsorCarousel = $("#sponsorCarousel");
  const donationInfoElem = document.getElementById("donationInfo");
  const hostContainer = $(".hostContainer");

  let playerCycle = 0;
  let textCycle = 0;
  let nextGame;
  let texts = [];

  let commentatorNames = {
    left: "",
    right: "",
  };

  let selectedPlayerPosition = "playerPositionCenter";

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
  const producer = nodecg.Replicant("producer", speedcontrolBundle);
  const playerPosition = nodecg.Replicant("playerPosition");

  const textCarouselReplicant = nodecg.Replicant(
    "textCarousel",
    speedcontrolBundle,
  );

  const sponsorCarouselReplicant = nodecg.Replicant("assets:sponsor-imgs");

  runDataActiveRunSurrounding.on("change", (newVal) => {
    if (newVal) updateNextGame(runDataActiveRunSurrounding);
  });

  runDataActiveRun.on("change", (newVal) => {
    if (newVal) updateSceneFields(newVal);
  });

  const cleanName = (value) => (typeof value === "string" ? value.trim() : "");

  function renderNameSlots() {
    const isRaceLayout = player1.length && player2.length;

    if (isRaceLayout) {
      const commentatorSlot = document.getElementById("commentatorLeft");

      if (!commentatorSlot) return;

      const name = commentatorNames.left || commentatorNames.right;

      commentatorSlot.innerHTML = name
        ? `<i class="fa-solid fa-sharp fa-headset"></i> ${name}`
        : "";

      commentatorSlot.classList.toggle("no_display", !name);

      return;
    }

    const slots = ["nameSlotLeft", "nameSlotCenter", "nameSlotRight"].map(
      (id) => document.getElementById(id),
    );

    const playerIndex =
      {
        playerPositionLeft: 0,
        playerPositionCenter: 1,
        playerPositionRight: 2,
      }[selectedPlayerPosition] ?? 1;

    let commentatorIndex = 0;

    slots.forEach((slot, index) => {
      if (!slot || !player.length) return;

      slot.replaceChildren();

      const name =
        index === playerIndex
          ? ""
          : [commentatorNames.left, commentatorNames.right][commentatorIndex++];

      if (index === playerIndex) {
        slot.append(player[0]);
      } else if (name) {
        slot.innerHTML = `<i class="fa-solid fa-sharp fa-headset"></i> ${name}`;
      }

      slot.classList.toggle("no_display", !slot.textContent.trim());
    });
  }

  commentators.on("change", (newVal) => {
    commentatorNames = {
      left: cleanName(newVal?.left),
      right: cleanName(newVal?.right),
    };

    renderNameSlots();

    if (newVal) {
      hostContainer.css("flex-direction", "");
    } else {
      hostContainer.css("flex-direction", "column-reverse");
    }
  });

  playerPosition.on("change", (newVal) => {
    selectedPlayerPosition = newVal;
    renderNameSlots();
  });

  producer.on("change", (newVal) => {
    const container = document.querySelector(".producerContainer");
    const producerSpan = document.getElementById("producerName");
    if (!container || !producerSpan) return;

    if (newVal) {
      container.classList.remove("active");
      setTimeout(() => {
        producerSpan.innerHTML = `<i class="fa-solid fa-microphone"></i> ${newVal}`;
        container.classList.add("active"); // slide in
      }, 600);
    } else {
      container.classList.remove("active");
      // Slide out

      // Wait for animation duration, then clear text
      setTimeout(() => {
        producerSpan.innerHTML = "";
      }, 600); // matches CSS transition
    }
  });

  textCarouselReplicant.on("change", (newVal) => {
    if (newVal) {
      texts = newVal.split(";");
    }
  });

  let sponsorInterval = null;

  const startSponsorCarousel = (assets) => {
    if (!assets || assets.length === 0) return;

    sponsorCarousel.attr("src", assets[0].url);

    if (sponsorInterval) {
      clearInterval(sponsorInterval);
      sponsorInterval = null;
    }

    if (assets.length > 1) {
      let sponsorIndex = 0;

      sponsorInterval = setInterval(() => {
        sponsorIndex = (sponsorIndex + 1) % assets.length;

        sponsorCarousel.addClass("hide");

        setTimeout(() => {
          sponsorCarousel.attr("src", assets[sponsorIndex].url);

          sponsorCarousel.removeClass("hide");
        }, 500);
      }, 15000);
    }
  };

  // Listen for changes
  sponsorCarouselReplicant.on("change", (newValue) => {
    startSponsorCarousel(newValue);
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

      // Note: Twitch name cycling has been commented out for now
      if (playerCycle == 0) {
        showPlayerName(player, team.players[0]);
        showPlayerName(player1, runData.teams[0].players[0]);
        showPlayerName(player2, runData.teams[1].players[0]);
      } // else if (playerCycle == 1) {
      // if (team.players[0]?.social?.twitch) {
      //   showPlayerTwitch(player, team.players[0]);
      // }
      // if (runData.teams[0].players[0]?.social?.twitch) {
      //   showPlayerTwitch(player1, runData.teams[0].players[0]);
      // }
      // if (runData.teams[1].players[0]?.social?.twitch) {
      //   showPlayerTwitch(player2, runData.teams[1].players[0]);
      // }
      // }
    }
  };

  const showPlayerName = (elem, play) => {
    const newContent = play?.name
      ? `<i class="fa-solid fa-sharp fa-running"></i> ${play.name}`
      : "";

    if (elem.html() === newContent) {
      renderNameSlots();
      return;
    }

    elem.addClass("hide");

    setTimeout(() => {
      elem.html(newContent);
      elem.removeClass("hide");
      renderNameSlots();
    }, 1000);
  };
  // const showPlayerTwitch = (elem, play) => {
  //   elem.addClass("hide");
  //   setTimeout(() => {
  //     elem.html(`<i class="fa-brands fa-twitch"></i> ${play.social.twitch}`);
  //     elem.removeClass("hide");
  //   }, 1000);
  // };

  setInterval(sceneUpdater, 15000);
  setInterval(textCarouselUpdater, 25000);

  textCarouselUpdater();
});
