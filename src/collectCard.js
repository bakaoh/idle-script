const hive = require("@hiveio/hive-js");
const utils = require("./utils");

hive.api.setOptions({ url: "https://rpc.ausbit.dev" });

async function collect(to, accounts) {
  for (let username in accounts) {
    await collectCard(to, username, accounts[username]);
  }
}

async function collectCard(to, user, key) {
  const collection = (await utils.getCollection(user)).cards;
  let cards = [];
  for (let card of collection) {
    if (
      card.player == user &&
      card.edition == 3 &&
      !card.market_id &&
      !card.delegated_to
    ) {
      cards.push(card.uid);
      if (cards.length == 30) {
        sendCards(user, cards);
        cards = [];
        await utils.sleep(6000);
      }
    }
  }
  if (cards.length > 0) sendCards(to, user, key, cards);
}

function sendCards(to, user, key, cards) {
  data = { to, cards, app: "steemmonsters/0.7.123" };
  hive.broadcast.customJson(
    key,
    [user],
    [],
    "sm_gift_cards",
    JSON.stringify(data),
    err => console.log(`[${user}] sent ${cards.length} cards to ${to}`, err)
  );
}

module.exports = collect;
