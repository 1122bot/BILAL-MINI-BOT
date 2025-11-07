const axios = require("axios");

function formatDuration(ms) {
  if (!ms) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

module.exports = {
  command: "facebook",
  desc: "📘 Download Facebook videos (HD / SD / Audio)",
  category: "download",
  react: "📥",

  async execute(sock, msg, args) {
    try {
      const from = msg.key.remoteJid;
      const pushname = msg.pushName || "User";
      const url = args[0];

      if (!url || !url.includes("facebook.com")) {
        return await sock.sendMessage(from, {
          text: `❌ *Facebook video link do bhai!*\n\n📌 Example:\n.facebook https://www.facebook.com/reel/xyz`
        }, { quoted: msg });
      }

      const { data } = await axios.get(`https://www.varshade.biz.id/api/downloader/facebook?url=${encodeURIComponent(url)}`);

      if (!data.status || !data.medias) {
        return await sock.sendMessage(from, {
          text: "❌ Video fetch nahi hua. Link check karo ya dobara try karo!"
        }, { quoted: msg });
      }

      const { title, author, duration, thumbnail, medias } = data;
      const hd = medias.find(v => v.quality?.toLowerCase() === "hd");
      const sd = medias.find(v => v.quality?.toLowerCase() === "sd");
      const audio = medias.find(v => v.type === "audio");

      const caption = `
╭───────────────⭓
│ 👤 ᴜꜱᴇʀ: ${pushname}
│ 🎬 ᴛɪᴛʟᴇ: ${title || "N/A"}
│ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ: ${formatDuration(duration)}
│ 🔗 ꜱᴏᴜʀᴄᴇ: facebook.com
│
│ ✨ *Reply with:*
│ 1️⃣ HD Video
│ 2️⃣ SD Video
│ 3️⃣ Audio Only
╰───────────────⭓
> _Varshade API_`;

      const sent = await sock.sendMessage(from, {
        image: { url: thumbnail },
        caption
      }, { quoted: msg });

      const msgId = sent.key.id;

      const listener = async (update) => {
        const mek = update.messages[0];
        if (!mek.message) return;

        const isReply = mek.message?.extendedTextMessage?.contextInfo?.stanzaId === msgId;
        if (!isReply) return;

        const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
        const choice = text.trim();

        await sock.sendMessage(from, { react: { text: "✅", key: mek.key } });

        switch (choice) {
          case "1":
            if (!hd) return sock.sendMessage(from, { text: "❌ HD link available nahi hai." }, { quoted: mek });
            await sock.sendMessage(from, { video: { url: hd.url }, caption: "🎞️ *Facebook HD Video*" }, { quoted: mek });
            break;
          case "2":
            if (!sd) return sock.sendMessage(from, { text: "❌ SD link available nahi hai." }, { quoted: mek });
            await sock.sendMessage(from, { video: { url: sd.url }, caption: "📼 *Facebook SD Video*" }, { quoted: mek });
            break;
          case "3":
            if (!audio) return sock.sendMessage(from, { text: "❌ Audio available nahi hai." }, { quoted: mek });
            await sock.sendMessage(from, { audio: { url: audio.url }, mimetype: "audio/mp4" }, { quoted: mek });
            break;
          default:
            await sock.sendMessage(from, { text: "❌ Reply 1, 2, ya 3 likho!" }, { quoted: mek });
        }
      };

      sock.ev.on("messages.upsert", listener);
      setTimeout(() => sock.ev.off("messages.upsert", listener), 2 * 60 * 1000);

    } catch (e) {
      console.error(e);
      await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Error: ${e.message}` }, { quoted: msg });
    }
  }
};
