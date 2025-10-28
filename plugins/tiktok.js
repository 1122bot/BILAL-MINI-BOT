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
        text: "*AGAR AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI 🥺💓* \n *TO AP ESE LIKHO 😇♥️* \n \n *TIKTOK ❮APKI TIKTOK VIDEO KA LINK❯* \n\n *AP APNI TIKTOK VIDEO KA LINK COMMAND ❮TIKTOK❯ LIKH KER ☺️* \n *USKE AGE APNI TIKTOK VIDEO KA LINK PASTE KAR DO 😊* \n *TO APKI TIKTOK VIDEO DOWNLOAD KARNE KE BAAD 😍* \n *YAHA BHEJ DE JAYE GE 🥰*"
      }, { quoted: msg });

      if (!text.includes("tiktok.com")) {
        await socket.sendMessage(sender, { react: { text: "☹️", key: msg.key } });
        return await socket.sendMessage(sender, { text: "*APKI TIKTOK VIDEO NAHI MILI ☹️*" }, { quoted: msg });
      }

      // Send waiting message
      waitMsg = await socket.sendMessage(sender, { text: "*APKI TIKTOK VIDEO DOWNLOAD HO RAHI HAI ☺️*\n*JAB DOWNLOAD HO JAYE GE TO YAHA BHEJ DE JAYE GE 🥰*" });

      const apiUrl = `https://lance-frank-asta.onrender.com/api/tikdl?url=${text}`;
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
