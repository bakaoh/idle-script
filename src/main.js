const collectDec = require("./collectDec");
const collectCard = require("./collectCard");

async function main() {
  await collectDec("bakaoh", {
    "cbc-aquamarine": "5K85vgJS9tdjG6uVhmTc...",
    "cbc-obsidian": "5KYAifxB2jNjzfAF1xns..."
  });

  await collectCard("bakaoh", {
    "cbc-aquamarine": "5K85vgJS9tdjG6uVhmTc...",
    "cbc-obsidian": "5KYAifxB2jNjzfAF1xns..."
  });
}

main();
