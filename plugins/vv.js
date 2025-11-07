
module.exports = {
  command: "vv",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
  desc: "Owner only - View once media viewer",
  category: "owner",

  async execute(sock, m, args, { from, isCreator }) {
    try {
      // react on use
      await sock.sendMessage(from, { react: { text: '😃', key: m.key } });

      if (!isCreator) return;

      if (!m.quoted) {
        await sock.sendMessage(from, { react: { text: '😊', key: m.key } });
        return await sock.sendMessage(from, {
          text: "*KISI NE APKO PRIVATE PHOTO , VIDEO YA AUDIO BHEJI HAI 🥺 AUR AP NE USE DEKHNA HAI 🤔*\n\n" +
                "*TO AP ESE LIKHO ☺️*\n\n❮VV❯\n\n*TO WO PRIVATE PHOTO , VIDEO YA AUDIO OPEN HO JAYE 🥰*"
        }, { quoted: m });
      }

      const buffer = await m.quoted.download();
      const mtype = m.quoted.mtype;
      const options = { quoted: m };

      let msgContent = {};

      if (mtype === "imageMessage") {
        msgContent = {
          image: buffer,
          caption: m.quoted.text || '',
          mimetype: "image/jpeg"
        };
      } else if (mtype === "videoMessage") {
        msgContent = {
          video: buffer,
          caption: m.quoted.text || '',
          mimetype: "video/mp4"
        };
      } else if (mtype === "audioMessage") {
        msgContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: m.quoted.ptt || false
        };
      } else {
        await sock.sendMessage(from, { react: { text: '🥺', key: m.key } });
        return await sock.sendMessage(from, {
          text: "*AP SIRF PHOTO , VIDEO YA AUDIO KO MENTION KARO BAS 🥺*"
        }, { quoted: m });
      }

      await sock.sendMessage(m.sender, msgContent, options);
      await sock.sendMessage(from, { react: { text: '😍', key: m.key } });

    } catch (err) {
      console.error("VV2 Error:", err);
      await sock.sendMessage(from, { react: { text: '😔', key: m.key } });
      await sock.sendMessage(from, {
        text: "*DUBARA LIKHO ❮VV2❯ 🥺*\n" + err.message
      }, { quoted: m });
    }
  }
};
