"use strict";
$(() => {
  const timerElem = $("#time");

  const updateTimer = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const min = currentTime.getMinutes();
    let formatedMin;
    let formatedHours;
    if (min < 10) {
      formatedMin = "0" + min;
    } else {
      formatedMin = min;
    }

    if (hours < 10) {
      formatedHours = "0" + hours;
    } else {
      formatedHours = hours;
    }

    timerElem.html(`${formatedHours}.${formatedMin}`);
  };

  setInterval(updateTimer, 1000);
});
