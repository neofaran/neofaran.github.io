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
  },
  {
    id: "ronin-ash",
    title: "Ronin Ash: Blade of the Fallen",
    tagline: "Draw your blade. Become the Ronin.",
    description: "A fast, brutal samurai action game: chain katana combos, land critical finishing cuts, survive endless waves and hunt warlords. English and Arabic.",
    genre: "Action",
    platform: "Android",
    status: "dev",
    image: "ronin/feature.png",
    page: "ronin/",
    play: "",
    privacy: "ronin/privacy.html"
  }
];

/*
  VR AND MIXED REALITY WORK (shipped earlier, shown in its own section). Add or remove blocks the same way.
*/
window.PROJECTS = [
  {
    title: "Violet Flame Experience",
    meta: "VR meditation app, Meta Quest 2, FI Consultancy, 2023 to 2024",
    description: "A meditation app for Quest, built in Unity with web API integration and optimized for VR and mobile. Launched on the Oculus Store.",
    points: ["Unity 3D, Virtual Reality", "Web API integration", "Oculus Store release"],
    color: "var(--echo-5)"
  },
  {
    title: "Nexus Arcade",
    meta: "Mixed reality gaming platform, Meta Quest, FI Consultancy, 2023 to 2024",
    description: "A mixed reality arcade with four games that connects physical activity with digital play. Released on Meta App Lab.",
    points: ["Four immersive games, multiplayer features", "Gameplay mechanics and visuals, performance tuning for Quest", "Meta App Lab release"],
    color: "var(--echo-1)"
  }
];
