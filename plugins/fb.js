const axios = require("axios");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // 👈 testing ke liye add karo

function formatDuration(ms) {
  if (!ms) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

module.exports = {
  command: "fb",
  desc: "📘 Download Facebook videos (HD / SD / Audio)",
  category: "download",
  react: "☺️",

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const url = args[0];

    try {
      if (!url || !url.includes("facebook.com")) {
        return sock.sendMessage(from, { text: "*📘 Facebook video link do please!*" }, { quoted: msg });
      }

      // ✅ working API endpoint
      const { data } = await axios.get(
        `https://www.varshade.biz.id/api/downloader/facebook?url=${encodeURIComponent(url)}`,
        { timeout: 15000 }
      );

      if (!data.status || !data.medias) {
        return sock.sendMessage(from, { text: "🥺 Video not found ya API down hai." }, { quoted: msg });
      }

      const { title, thumbnail, duration, medias } = data;
      const hd = medias.find(v => v.quality?.toLowerCase() === "hd");
      const sd = medias.find(v => v.quality?.toLowerCase() === "sd");

      const caption = `
*🎥 FACEBOOK VIDEO INFO 🎥*
🎞️ Title: ${title}
🕒 Duration: ${formatDuration(duration)}

👇 Choose:
1️⃣ SD Video
2️⃣ HD Video
`;

      const sent = await sock.sendMessage(from, { image: { url: thumbnail }, caption }, { quoted: msg });

      // Wait for user reply (mini bot style)
      const listener = async (update) => {
        const mek = update.messages[0];
        if (!mek.message) return;

        const isReply = mek.message?.extendedTextMessage?.contextInfo?.stanzaId === sent.key.id;
        if (!isReply) return;

        const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
        const choice = text.trim();

        if (choice === "1" && sd) {
          await sock.sendMessage(from, { video: { url: sd.url }, caption: "🎬 SD Video" }, { quoted: mek });
        } else if (choice === "2" && hd) {
          await sock.sendMessage(from, { video: { url: hd.url }, caption: "🎥 HD Video" }, { quoted: mek });
        } else {
          await sock.sendMessage(from, { text: "❌ Invalid option!" }, { quoted: mek });
        }
      };

      sock.ev.on("messages.upsert", listener);
      setTimeout(() => sock.ev.off("messages.upsert", listener), 2 * 60 * 1000);

    } catch (err) {
      console.error("Facebook error:", err.message);
      await sock.sendMessage(from, { text: `⚠️ Error: ${err.message}` }, { quoted: msg });
    }
  }
};
