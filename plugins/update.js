const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

module.exports = {
  command: "update",
  alias: ["upgrade", "up"],
  desc: "Update the bot from GitHub repo.",
  react: "🆕",
  category: "owner",

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      // ✅ Sirf owner use kar sakta hai
      const botOwner = process.env.OWNER_NUMBER || "923000000000@s.whatsapp.net";
      if (sender !== botOwner)
        return sock.sendMessage(jid, { text: "*❌ YE COMMAND SIRF OWNER KE LIYE HAI 😎*" }, { quoted: msg });

      await sock.sendMessage(jid, { text: "*🔄 UPDATE CHALU HAI... THORA SABR RAKHO 🥰*" }, { quoted: msg });

      // ⚙️ CONFIG (yahan apne details daalo)
      const GITHUB_USERNAME = "1122bot"; // apna GitHub username
      const GITHUB_REPO = "BILAL-MINI-BOT"; // apna repo name
      const GITHUB_BRANCH = "main"; // agar 'master' use ho to badal lena
      const GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // apna token yahan daal do

      const zipUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/zipball/${GITHUB_BRANCH}`;
      const zipPath = path.join(__dirname, "update.zip");
      const extractPath = path.join(__dirname, "update-temp");

      // 📦 ZIP download (token ke sath)
      const { data } = await axios.get(zipUrl, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": `${GITHUB_USERNAME}-${GITHUB_REPO}-Updater`,
        },
      });
      fs.writeFileSync(zipPath, data);

      // 📂 Extract ZIP
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);

      const extractedFolder = fs
        .readdirSync(extractPath)
        .find((f) => fs.lstatSync(path.join(extractPath, f)).isDirectory());
      const src = path.join(extractPath, extractedFolder);
      const dest = path.join(__dirname, "..");

      // 🔄 Copy all files (safe update)
      copyFolder(src, dest);

      // 🧹 Cleanup
      fs.unlinkSync(zipPath);
      fs.rmSync(extractPath, { recursive: true, force: true });

      await sock.sendMessage(
        jid,
        { text: "*✅ BOT SUCCESSFULLY UPDATE HO GAYA 😍🌹*\n*BOT RESTART HO RHA HAI...*" },
        { quoted: msg }
      );

      process.exit(0);
    } catch (e) {
      console.error("Update Error:", e);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: `*❌ UPDATE FAILED 🥺*\n\n\`\`\`${e.message}\`\`\`` },
        { quoted: msg }
      );
    }
  },
};

// 📂 Folder Copy Helper
function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    if (["config.js", ".env"].includes(file)) continue; // important personal files skip
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    if (fs.lstatSync(srcFile).isDirectory()) copyFolder(srcFile, destFile);
    else fs.copyFileSync(srcFile, destFile);
  }
}
