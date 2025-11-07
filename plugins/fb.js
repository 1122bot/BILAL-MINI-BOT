const axios = require("axios");

module.exports = {
  command: "facebook",
  alias: ["fb", "fbdl", "fbvideo"],
  description: "📘 Download Facebook video (HD / SD)",
  category: "download",
  react: "📥",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const url = args[0];

      if (!url || !url.includes("facebook.com")) {
        return sock.sendMessage(from, {
          text: `❌ Please provide a valid Facebook video link.\n\nExample:\n*.facebook https://www.facebook.com/reel/...*`
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

      // ✅ NEW API HERE
      const api = `https://api.akuari.my.id/downloader/fb?link=${encodeURIComponent(url)}`;
      const { data } = await axios.get(api);

      if (!data.status || !data.medias) throw new Error("Invalid API response");

      const title = data.title || "Facebook Video";
      const author = data.author || "Unknown";
      const duration = (data.duration / 1000).toFixed(0) + " sec";
      const thumb = data.thumbnail || null;

      const hd = data.medias.find(v => v.quality === "HD");
      const sd = data.medias.find(v => v.quality === "SD");

      let caption = `
📘 *FACEBOOK VIDEO DOWNLOADER*
───────────────────
👤 *Author:* ${author}
🎬 *Title:* ${title}
⏱ *Duration:* ${duration}
🌐 *Source:* Facebook
───────────────────
🎞 *Available Qualities:*
${hd ? "✅ HD (720p)" : "❌ HD not found"}
${sd ? "✅ SD (360p)" : "❌ SD not found"}
───────────────────
💡 *Reply 1* = Download HD
💡 *Reply 2* = Download SD
`;

      const previewMsg = await sock.sendMessage(from, {
        image: { url: thumb },
        caption
      }, { quoted: msg });

      const msgId = previewMsg.key.id;

      const listener = async (u) => {
        try {
          const m = u.messages[0];
          if (!m.message) return;

          const isReply =
            m.message.extendedTextMessage?.contextInfo?.stanzaId === msgId;
          if (!isReply) return;

          const text = (m.message.conversation || m.message.extendedTextMessage?.text || "").trim();

          if (text === "1" && hd) {
            await sock.sendMessage(from, {
              video: { url: hd.url },
              caption: "✅ Facebook HD Video"
            }, { quoted: m });
          } else if (text === "2" && sd) {
            await sock.sendMessage(from, {
              video: { url: sd.url },
              caption: "📼 Facebook SD Video"
            }, { quoted: m });
          } else {
            await sock.sendMessage(from, { text: "❌ Invalid choice or quality not found." }, { quoted: m });
          }
        } catch (err) {
          console.error("Reply handler error:", err);
        }
      };

      sock.ev.on("messages.upsert", listener);
      setTimeout(() => sock.ev.off("messages.upsert", listener), 2 * 60 * 1000); // 2 min listener off

    } catch (error) {
      console.error("FB Command Error:", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ Error: ${error.message || "Something went wrong!"}`
      }, { quoted: msg });
    }
  }
};
