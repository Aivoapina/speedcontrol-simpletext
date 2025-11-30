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

  let msgErrorCount = 0;
  let donateMessageInterval;

  if (!donateMessages.value) {
    donateMessages.value = [];
  }

  const donateAmountFetcher = async () => {
    if (!donateUrl) return;

    const data = await fetchJson(donateUrl);
    if (!data) return;
    const total = data.data.total_amount;
    
    donateAmountReplicant.value = total;
  }

  const donateMessageFetcher = async () => {
    if (!donateMessagesUrl) return;
    try {
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
      msgErrorCount = 0;
    } catch (error) {
      msgErrorCount += 1;
      if (msgErrorCount >= 5) {
        console.error('Too many errors fetching donate messages, stopping fetcher.');
        clearInterval(donateMessageInterval);
        donateMessageInterval = null;
      }
    }
  };

  setInterval(donateAmountFetcher, 10000);
  donateMessageInterval = setInterval(donateMessageFetcher, 10000);

  donateUrlReplicant.on("change", (val) => {
    donateUrl = val;
  });

  donateMessagesUrlReplicant.on("change", (val) => {
    donateMessagesUrl = val;
    if (!donateMessageInterval) {
      donateMessageInterval = setInterval(donateMessageFetcher, 10000);
    }
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

