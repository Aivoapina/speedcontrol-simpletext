const fetch = require('node-fetch');

const speedcontrolBundle = "nodecg-speedcontrol";

module.exports = async function (nodecg) {

  const donateUrlReplicant = nodecg.Replicant("donateUrl", speedcontrolBundle);
  const donateAmountReplicant = nodecg.Replicant("donateAmount", speedcontrolBundle);

  let donateUrl = donateUrlReplicant.value;

  const interval = setInterval(async () => {
    if (!donateUrl) return;
  
    const headers = {
      "Content-Type": "application/json",
      "X-Locale": "fi",
      "X-Site-Id": "Dp9tjHj3gsVn"
    };

    const res = await fetch(donateUrl, { headers });
    const data = await res.json();
    const total = data.data.total_amount;
    
    donateAmountReplicant.value = total;
  }, 10000);

  donateUrlReplicant.on("change", (val) => {
    donateUrl = val;
  });
};
