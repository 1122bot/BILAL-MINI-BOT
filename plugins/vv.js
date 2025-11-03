// 🌟 code by Bilal
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  command: "vv",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
  description: "Owner Only - retrieve quoted media (photo, video, audio)",
  category: "owner",
  react: "😃",
  usage: ".vv2 (reply on media)",
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const fromMe = msg.key.fromMe;
    const isCreator = fromMe; // Mini bot usually treats 'fromMe' as owner check
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    try {
      // Initial react 😃
      await socket.sendMessage(sender, { react: { text: "😃", key: msg.key } });

      // Owner check
      if (!isCreator) return;

      // Agar koi reply nahi kiya gaya
      if (!quoted) {
        await socket.sendMessage(sender, { react: { text: "😊", key: msg.key } });
        return await socket.sendMessage(sender, {
          text: "*KISI NE APKO PRIVATE PHOTO , VIDEO YA AUDIO BHEJI HAI 🥺 AUR AP NE USE DEKHNA HAI 🤔*\n\n*TO AP ESE LIKHO ☺️*\n\n`VV2`\n\n*TO WO PRIVATE PHOTO , VIDEO YA AUDIO OPEN HO JAYE 🥰*"
        }, { quoted: msg });
      }

      // Identify media type
      let type = Object.keys(quoted)[0];
      if (!["imageMessage", "videoMessage", "audioMessage"].includes(type)) {
        await socket.sendMessage(sender, { react: { text: "🥺", key: msg.key } });
        return await socket.sendMessage(sender, {
          text: "*AP SIRF PHOTO , VIDEO YA AUDIO KO MENTION KARO BAS 🥺*"
        }, { quoted: msg });
      }

      // Download media
      const stream = await downloadContentFromMessage(quoted[type], type.replace("Message", ""));
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

      // Prepare message content
      let sendContent = {};
      if (type === "imageMessage") {
        sendContent = {
          image: buffer,
          caption: quoted[type]?.caption || "",
          mimetype: quoted[type]?.mimetype || "image/jpeg"
        };
      } else if (type === "videoMessage") {
        sendContent = {
          video: buffer,
          caption: quoted[type]?.caption || "",
          mimetype: quoted[type]?.mimetype || "video/mp4"
        };
      } else if (type === "audioMessage") {
        sendContent = {
          audio: buffer,
          mimetype: quoted[type]?.mimetype || "audio/mp4",
          ptt: quoted[type]?.ptt || false
        };
      }

      // Send back media
      await socket.sendMessage(sender, sendContent, { quoted: msg });

      // React after success 😍
      await socket.sendMessage(sender, { react: { text: "😍", key: msg.key } });

    } catch (error) {
      console.error("VV2 Error:", error);
      await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
      await socket.sendMessage(sender, {
        text: `*DUBARA LIKHO ❮VV2❯ 🥺*\n\n_Error:_ ${error.message}`
      }, { quoted: msg });
    }
  }
};
