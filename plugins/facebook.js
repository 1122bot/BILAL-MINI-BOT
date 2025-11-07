const axios = require("axios");

module.exports = {
  command: "facebook",
  alias: ["fb", "fbdl"],
  description: "Download Facebook video in HD or SD quality",
  category: "downloader",
  react: "📽️",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const url = args[0];
      const pushname = msg.pushName || "User";

      if (!url || !url.includes("facebook.com")) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a valid Facebook video link!*\n\nExample: *.facebook https://www.facebook.com/reel/xyz*`,
        }, { quoted: msg });
      }

      // Send initial reaction
      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      // API call
      const apiUrl = `https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data || !data.data.urls) {
        return await sock.sendMessage(from, {
          text: "❌ *Video not found or unavailable!*",
        }, { quoted: msg });
      }

      const result = data.data;
      const hdVideo = result.urls[0];
      const sdVideo = result.urls[1] || null;
      const title = result.title || "Unknown Title";

      // Prepare caption
      const caption = `
🎬 *Facebook Video Downloader*
━━━━━━━━━━━━━━
👤 *Requested by:* ${pushname}
📘 *Title:* ${title}
💫 *Quality:* ${hdVideo ? "HD Available" : "SD Only"}
🔗 *Source:* ${url}
━━━━━━━━━━━━━━
> 👑 *BILAL-MD MINI BOT*
`;

      // Send thumbnail + info
      const previewImg = result.thumbnail || "https://i.ibb.co/4M9H2PQ/facebook.jpg";
      await sock.sendMessage(from, {
        image: { url: previewImg },
        caption,
      }, { quoted: msg });

      // Send the video
      await sock.sendMessage(from, { react: { text: "📤", key: msg.key } });

      await sock.sendMessage(from, {
        video: { url: hdVideo || sdVideo },
        caption: `✅ *Here is your video in ${hdVideo ? "HD" : "SD"} quality!* 🎥`,
      }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

    } catch (error) {
      console.error("FB Error:", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ *Error fetching video:* ${error.message}`,
      }, { quoted: msg });
    }
  },
};
