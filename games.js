/*
  ADD A NEW GAME: copy one block below, paste it at the end of the list and edit it.
  The games grid, the filters, the markers on the hero radar and the footer privacy links all read from this list.
  Put images in the game's own folder (for example /newgame/feature.png, 1024x500).

  status: "live" (on Google Play) or "dev" (in development)
  play:   Google Play URL, or "" when not released
  page:   the game's page on this site, or "" if it has none yet
  privacy: privacy policy page on this site, or ""
*/
window.GAMES = [
  {
    id: "hunt-for-the-pride",
    title: "Hunt for the Pride",
    tagline: "Grow from a lion cub to king of the pride.",
    description: "Hunt, find water, fight rival dens and defeat the alpha lions in a 3D wildlife survival game. English and Arabic.",
    genre: "Survival",
    platform: "Android",
    status: "live",
    image: "hunt/feature.png",
    page: "hunt/",
    play: "https://play.google.com/store/apps/details?id=com.macsoft.HuntForThePride",
    privacy: "hunt/privacy.html"
  },
  {
    id: "death-arena",
    title: "Death Arena: Rise of the Warlord",
    tagline: "Arm your car and survive the warlords' arena.",
    description: "Armed car combat in a huge desert arena: survival waves, supply drops, boss fights and a garage full of upgrades.",
    genre: "Vehicle combat",
    platform: "Android",
    status: "live",
    image: "deatharena/feature.png",
    page: "deatharena/",
    play: "https://play.google.com/store/apps/details?id=com.macsoft.DeathArena",
    privacy: "deatharena/privacy.html"
  }
];
