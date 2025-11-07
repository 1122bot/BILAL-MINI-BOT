const axios = require("axios");

module.exports = {
  command: "tiktok",
  alias: ["tt", "tiktokdl"],
  description: "Download TikTok video in HD (no watermark)",
  category: "downloader",
  react: "🥺",

  execute: async (sock, msg, args) => {
    try {
      const sender = msg.key.remoteJid;
      const url = args[0];

      if (!url)
        return sock.sendMessage(sender, {
          text: "*AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI TO TIKTOK VIDEO KA LINK COPY KAR LO 😊 🤔*\n*AUR PHIR ESE LIKHO ☺️*\n\n*TIKTOK ❮TIKTOK VIDEO LINK❯*\n\n*JAB AP ESE LIKHO GE 😇TO APKO TIKTOK VIDEO DOWNLOAD KAR KE 😃 YAHA PER BHEJ DE JAYE GE 😍❤️*",
        });

      await sock.sendMessage(sender, { react: { text: "😃", key: msg.key } });

      // API Request
      const api = `https://www.varshade.biz.id/api/downloader/tiktok?url=${url}`;
      const { data } = await axios.get(api);

      if (!data || !data.results || !data.results.play)
        return sock.sendMessage(sender, {
          text: "*APKI TIKTOK VIDEO NAHI MILI 🥺❤️*",
        });

      const video = data.results.hdplay || data.results.play;
      const caption = `*⟪════════ ♢.✰.♢ ════════⟫*\n*👑 VIDEO NAME 👑*\n *${data.results.title || "No Title"}*\n*👑 CREATER NAME 👑*\n *${data.results.author?.nickname || "Unknown"}* \n*👑 BILAL-MD MINI BOT 👑*`;

      await sock.sendMessage(sender, { react: { text: "☺️", key: msg.key } });

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
