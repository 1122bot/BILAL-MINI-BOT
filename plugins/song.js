const fetch = require('node-fetch');

module.exports = {
  command: 'song',
  alias: ["play","mp3","audio","music","s","so","son","songs"],
  description: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  react: "🥺",
  usage: ".song <song name>",
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const text = args.join(" ");

    if (!text) {
      return await socket.sendMessage(sender, {
        text: "*🥺 Audio download karne ke liye command ka sahi istemal karo:*\n.song <song name>"
      }, { quoted: msg });
    }

    try {
      // 🔹 API Call (Nekolabs)
      const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(text)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data?.success || !data?.result?.downloadUrl) {
        return await socket.sendMessage(sender, { text: "*😔 Audio nahi mila!*" }, { quoted: msg });
      }

      const meta = data.result.metadata;
      const dlUrl = data.result.downloadUrl;

      // 🔹 Try fetching the thumbnail
      let buffer;
      try {
        const thumbRes = await fetch(meta.cover);
        buffer = Buffer.from(await thumbRes.arrayBuffer());
      } catch {
        buffer = null;
      }

      // 🔹 Song info card
      const caption = `*🎵 AUDIO INFORMATION 🎵*
*Name:* ${meta.title}
*Channel:* ${meta.channel}
*Duration:* ${meta.duration}
*BILAL-MD WHATSAPP BOT*`;

      // 🖼️ Send thumbnail + info
      if (buffer) {
        await socket.sendMessage(sender, { image: buffer, caption }, { quoted: msg });
      } else {
        await socket.sendMessage(sender, { text: caption }, { quoted: msg });
      }

      // 🎧 Send MP3 file
      await socket.sendMessage(sender, {
        audio: { url: dlUrl },
        mimetype: "audio/mpeg",
        fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
      }, { quoted: msg });

    } catch (err) {
      console.error("Audio download error:", err);
      await socket.sendMessage(sender, { text: "*😔 Dubara koshish karo!*" }, { quoted: msg });
    }
  }
};
