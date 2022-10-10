const config = {
  name: "Molly & Philip's Wedding",
  description:
    "Come join us for a day of Ceremony, great food, wonderful company, and dancing!",
  startDate: "2023-07-15",
  endDate: "2023-07-15",
  options: ["Google", "Apple", "Microsoft365"],
  location:
    "Revera Windermere on the Mount, 1486 Richmond St, London, ON N6G 2M3, Canada",
  timeZone: "America/Toronto",
  trigger: "click",
  iCalFileName: "Reminder-Event",
};
const button = document.querySelector("#rsvp-button");
button.addEventListener("click", () => atcb_action(config, button));
