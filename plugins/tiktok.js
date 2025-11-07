const axios = require("axios");

module.exports = {
  command: "tiktok",
  alias: ["tt", "tiktokdl"],
  description: "Download TikTok video in HD (no watermark)",
  category: "downloader",
  react: "🎬",

  execute: async (sock, msg, args) => {
    try {
      const sender = msg.key.remoteJid;
      const url = args[0];

      if (!url)
        return sock.sendMessage(sender, {
          text: "🎯 *Please provide a TikTok video link!*\nExample: .tiktok https://www.tiktok.com/xxxxx",
        });

      await sock.sendMessage(sender, { react: { text: "⏳", key: msg.key } });

      // API Request
      const api = `https://www.varshade.biz.id/api/downloader/tiktok?url=${url}`;
      const { data } = await axios.get(api);

      if (!data || !data.results || !data.results.play)
        return sock.sendMessage(sender, {
          text: "❌ Failed to fetch video. Please check the link!",
        });

      const video = data.results.hdplay || data.results.play;
      const caption = `🎬 *${data.results.title || "No Title"}*\n👤 Author: ${data.results.author?.nickname || "Unknown"}\n✨ Powered by VarShade API`;

      await sock.sendMessage(sender, { react: { text: "🎥", key: msg.key } });

      // Send Video
      await sock.sendMessage(
        sender,
        {
          video: { url: video },
          caption,
        },
        { quoted: msg }
      );

      await sock.sendMessage(sender, { react: { text: "✅", key: msg.key } });
    } catch (error) {
      console.error("TikTok Error:", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ *Error fetching TikTok video!*",
      });
    }
  },
};
