$(() => {
  const speedcontrolBundle = "nodecg-speedcontrol";

  const donations = $("#donations");
  const donateUrlReplicant = nodecg.Replicant("donateUrl", speedcontrolBundle);

  let donateUrl = donateUrlReplicant.value;

  donateUrlReplicant.on("change", (val) => {
    donateUrl = val;
    updateDonations();
  });

  const updateDonations = () => {
    if (!donateUrl) return;

    fetch(donateUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        donations.html(data.gift.amount + "€");
      });
  };

  setInterval(updateDonations, 10000);
});
