const TonWeb = require("tonweb");
const fs = require("fs");
const axios = require("axios");

const tonweb = new TonWeb(new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC"));

const USDT_JETTON_ADDRESS = "EQC..."; // ← You need to get the correct USDT Jetton master address

const BOT_API_URL = "https://api.botbusiness.io/botYOURTOKEN/setUserProperty"; // replace with your bot token

async function getJettonBalance(userWalletAddress) {
  try {
    const result = await tonweb.provider.call2("getJettonBalance", [USDT_JETTON_ADDRESS, userWalletAddress]);
    const balance = result ? parseInt(result) / 1e6 : 0;
    return balance;
  } catch (e) {
    console.log("❌ Error fetching Jetton balance:", e.message);
    return 0;
  }
}

async function checkAllWallets() {
  const files = fs.readdirSync("./wallets");
  for (let file of files) {
    const data = JSON.parse(fs.readFileSync("./wallets/" + file));
    const balance = await getJettonBalance(data.address);
    
    if (balance > 0) {
      console.log(`💸 USDT Deposit Detected! ${balance} USDT → ${data.address}`);

      // Send to bot
      await axios.get(BOT_API_URL, {
        params: {
          user_id: data.user_id,
          name: "balance",
          value: "+" + balance
        }
      });

      // Optionally, rename file to prevent double processing
      fs.renameSync("./wallets/" + file, "./wallets/processed_" + file);
    }
  }
}

setInterval(checkAllWallets, 20000); // every 20 seconds
