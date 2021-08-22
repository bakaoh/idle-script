const hive = require("@hiveio/hive-js");
const { getApi2, sleep } = require("./utils");

hive.api.setOptions({ url: "https://rpc.ausbit.dev" });

async function getBalances(username) {
  const rs = await getApi2("/players/balances", { username });
  let dec, ecr;
  for (let b of rs) {
    if (b.token == "DEC") dec = b.balance;
    if (b.token == "ECR") ecr = b.balance;
  }
  return [dec, ecr];
}

async function collectDec(to, accounts) {
  let html = "Name         |    DEC";
  let total = { dec: 0 };

  for (let username in accounts) {
    const [dec, ecr] = await getBalances(username);
    total.dec += parseFloat(dec);

    const lName = username.padEnd(12);
    const lDec = dec
      .toFixed()
      .toString()
      .padStart(6);
    html += `${lName} | ${lDec} | ${lHive}\n`;

    if (dec > 10) {
      await send(to, username, accounts[username], Math.floor(dec));
    }
  }
  html += `\nTotal: ${total.dec.toFixed()} DEC`;
  return html;
}

async function send(to, account, key, qty) {
  try {
    await transfer(to, account, key, qty);
  } catch (err) {
    console.error(err);
  }
}

function transfer(to, account, key, qty) {
  return new Promise((resolve, reject) => {
    let data = {
      to,
      qty,
      token: "DEC",
      type: "withdraw"
    };
    hive.broadcast.customJson(
      key,
      [account],
      [],
      "sm_token_transfer",
      JSON.stringify(data),
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

module.exports = collectDec;
