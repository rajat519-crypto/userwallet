const TonWeb = require("tonweb");
const fs = require("fs");

const tonweb = new TonWeb();

async function generateNewWallet() {
  const keyPair = await tonweb.utils.keyPair();

  const WalletClass = tonweb.wallet.all.v3R2;
  const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0
  });

  const address = await wallet.getAddress();
  const friendlyAddress = address.toString(true, true, true);

  const walletData = {
    address: friendlyAddress,
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPair.secretKey).toString("hex")
  };

  console.log("🔐 New TON Wallet Generated:", walletData.address);
  fs.writeFileSync(`wallets/${walletData.address}.json`, JSON.stringify(walletData, null, 2));
}

generateNewWallet();
