$(() => {
  const speedcontrolBundle = "nodecg-speedcontrol";

  const donations = $("#donations");

  const donateAmountReplicant = nodecg.Replicant(
    "donateAmount",
    speedcontrolBundle,
  );

  donateAmountReplicant.on("change", (val) => {
    donations.html(parseInt(val) + "€");
  });
});
