const axios = require("axios");

module.exports = {
  command: "facebook",
  alias: ["fb", "fbdl"],
  description: "Download Facebook videos (HD/SD) with info",
  category: "downloader",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const url = args[0];
      const pushname = msg.pushName || "User";

      if (!url || !url.includes("facebook.com")) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a valid Facebook video link!*\n\n📌 Example:\n.facebook https://www.facebook.com/reel/xyz`
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      const api = await axios.get(`https://www.varshade.biz.id/api/downloader/facebook?url=${encodeURIComponent(url)}`);
      const data = api.data;

      if (!data || !data.medias || data.medias.length === 0) {
        return await sock.sendMessage(from, { text: "❌ Video not found or download failed." }, { quoted: msg });
      }

      const title = data.title || "Untitled Video";
      const author = data.author || "Unknown";
      const thumb = data.thumbnail || null;

      const hd = data.medias.find(v => v.quality === "HD");
      const sd = data.medias.find(v => v.quality === "SD");

      const caption = `🎬 *${title}*\n👤 *By:* ${author}\n🌐 *Source:* Facebook\n\n💠 *Available Qualities:*\n• HD Video ✅\n• SD Video ✅\n\n> 👑 BILAL-MD MINI BOT 👑`;

      // Send preview + caption
      await sock.sendMessage(from, {
        image: { url: thumb },
        caption
      }, { quoted: msg });

      // Send HD (preferred) or SD
      const videoUrl = hd?.url || sd?.url;
      if (!videoUrl) return sock.sendMessage(from, { text: "❌ No downloadable video found." }, { quoted: msg });

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        caption: `✅ *Here is your Facebook video (HD)*\n> BILAL-MD MINI BOT`
      }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });
    } catch (err) {
      console.error("Facebook CMD Error:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Error fetching Facebook video!"
      }, { quoted: msg });
    }
  }
};
