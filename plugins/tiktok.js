const axios = require('axios');

module.exports = {
  command: 'tiktok',
  alias: ["ttdl","tt","tiktokdl"],
  description: "Download TikTok video without watermark",
  category: "download",
  react: "🎵",
  usage: ".tiktok <TikTok URL>",
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const text = args.join(" ");

    let waitMsg; // Waiting message reference

    try {
      // React command message
      await socket.sendMessage(sender, { react: { text: "🥺", key: msg.key } });

      if (!text) return await socket.sendMessage(sender, {
        text: "*🥺 TikTok video download karne ke liye sahi command ka istemal karo:*\n.tiktok <TikTok URL>"
      }, { quoted: msg });

      if (!text.includes("tiktok.com")) {
        await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
        return await socket.sendMessage(sender, { text: "*😔 Dubara koshish karo!*" }, { quoted: msg });
      }

      // Send waiting message
      waitMsg = await socket.sendMessage(sender, { text: "*⏳ TikTok video download ho rahi hai…*" });

      const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${text}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data) {
        if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });
        await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
        return await socket.sendMessage(sender, { text: "*😔 Dubara koshish karo!*" }, { quoted: msg });
      }

      const { meta } = data.data;
      const videoUrl = meta.media.find(v => v.type === "video").org;

      // Caption
      const caption = "*👑 BY : BILAL-MD 👑*";

      // Send video
      await socket.sendMessage(sender, {
        video: { url: videoUrl },
        caption,
        contextInfo: { mentionedJid: [msg.sender] }
      }, { quoted: msg });

      // Delete waiting message
      if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });

      // React after success
      await socket.sendMessage(sender, { react: { text: "☺️", key: msg.key } });

    } catch (e) {
      console.error("TikTok command error:", e);
      if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });
      await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
      await socket.sendMessage(sender, { text: "*😔 Dubara koshish karo!*" }, { quoted: msg });
    }
  }
};
