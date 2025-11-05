const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

module.exports = {
  command: "update",
  alias: ["upgrade", "up"],
  desc: "Update the bot from GitHub.",
  react: "🆕",
  category: "owner",

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      // ✅ Owner check
      const botOwner = process.env.OWNER_NUMBER || "923000000000@s.whatsapp.net";
      if (sender !== botOwner)
        return sock.sendMessage(jid, { text: "*YE COMMAND SIRF OWNER KE LIYE HAI 😎*" }, { quoted: msg });

      await sock.sendMessage(jid, { text: "*🔄 BILAL-MD UPDATE HO RHA HAI... THORA WAIT KRO 🥰*" }, { quoted: msg });

      const zipUrl = "https://github.com/1122bot/BILAL-MINI-BOT/archive/refs/heads/main.zip";
      const zipPath = path.join(__dirname, "update.zip");
      const extractPath = path.join(__dirname, "update-temp");

      // 📦 Download ZIP
      const { data } = await axios.get(zipUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(zipPath, data);

      // 📂 Extract ZIP
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);

      const src = path.join(extractPath, "BILAL-MINI-BOT-main");
      const dest = path.join(__dirname, "..");

      // 📁 Copy Files (safe update)
      copyFolder(src, dest);

      // 🧹 Cleanup
      fs.unlinkSync(zipPath);
      fs.rmSync(extractPath, { recursive: true, force: true });

      await sock.sendMessage(
        jid,
        { text: "*✅ BILAL-MD BOT SUCCESSFULLY UPDATE HO GAYA 😍🌹*\n*BOT RESTART HO RHA HAI...*" },
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
    if (["config.js", ".env"].includes(file)) continue; // Don’t overwrite personal files
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    if (fs.lstatSync(srcFile).isDirectory()) copyFolder(srcFile, destFile);
    else fs.copyFileSync(srcFile, destFile);
  }
        }
