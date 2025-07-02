const { read } = require('fs');
const fetch = require('node-fetch');

const speedcontrolBundle = "nodecg-speedcontrol";

module.exports = async function (nodecg) {
  const donateUrlReplicant = nodecg.Replicant("donateUrl", speedcontrolBundle);
  const donateAmountReplicant = nodecg.Replicant("donateAmount", speedcontrolBundle);

  const donateMessagesUrlReplicant = nodecg.Replicant("donateMessagesUrl", speedcontrolBundle);
  const donateMessages = nodecg.Replicant("donateMessages", speedcontrolBundle);

  let donateUrl = donateUrlReplicant.value;
  let donateMessagesUrl = donateMessagesUrlReplicant.value;

  if (!donateMessages.value) {
    donateMessages.value = [];
  }

  setInterval(async () => {
    if (!donateUrl) return;

    const data = await fetchJson(donateUrl);
    if (!data) return;
    const total = data.data.total_amount;
    
    donateAmountReplicant.value = total;
  }, 10000);

  setInterval(async () => {
    if (!donateMessagesUrl) return;
    const res = await fetch(donateMessagesUrl);
    const data = await res.json();
    if (!data) return;

    const newDonates = data.filter(donate => (
      !donateMessages.value.find(d => d.id === donate.id)
    ));

    data.forEach(donate => {
      donateMessages.value.forEach(d => {
        if (d.id === donate.id && (d.message !== donate.msg || d.name !== donate.donator)) {
          d.message = donate.msg;
          d.name = donate.donator;
          d.incValue = donate.inc_value;
          d.game = donate.game;
          d.title = donate.title;
        }
      });
    });

    const formatedDonates = newDonates.map(donate => ({
      id: donate.id,
      name: donate.donator,
      amount: donate.amount,
      message: donate.msg,
      incValue: donate.inc_value,
      game: donate.game,
      title: donate.title,
      read: false
    }));

    donateMessages.value.push(...formatedDonates);
  }, 10000);

  donateUrlReplicant.on("change", (val) => {
    donateUrl = val;
  });

  donateMessagesUrlReplicant.on("change", (val) => {
    donateMessagesUrl = val;
  });
};

const fetchJson = async (url) => {
  const headers = {
    "Content-Type": "application/json",
    "X-Locale": "fi",
    "X-Site-Id": "Dp9tjHj3gsVn"
  };
  try {
    const res = await fetch(url, { headers });
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

