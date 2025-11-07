const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  command: "vv",
  alias: ["antivv", "avv", "viewonce", "open", "openphoto", "openvideo", "vvphoto", "vvphoto"],
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
          text: "*KISI NE APKO PRIVATE PIC , VIDEO , PHOTO YA PHOTO BHEJI HAI 😐 AUR AP NE USKO BAR BAR OPEN KAR KE DEKHNA HAI 😃 TO AP PEHLE US PRIVATE CHIZ KO MENTION KARO LAZMI 😤 PHIR LIKHO*\n\n*❮VV❯*\n\n*JAB AP ESE LIKHO GE 😇 TO WO PRIVATE PHOTO , VIDEO , VOICE OPEN HO JAYE GE 😁 AP USE BAR BAR OPEN KER KE DEKH SKTE HAI 😍*"
        }, { quoted: msg });
      }

      // Identify media type
      let type = Object.keys(quoted)[0];
      if (!["imageMessage", "videoMessage", "audioMessage"].includes(type)) {
        await socket.sendMessage(sender, { react: { text: "🥺", key: msg.key } });
        return await socket.sendMessage(sender, {
          text: "*𝚈𝙾𝚄 𝙾𝙽𝙻𝚈 𝙽𝙴𝙴𝙳 𝚃𝙾 𝙼𝙴𝙽𝚃𝙸𝙾𝙽 𝚃𝙷𝙴 𝙿𝙷𝙾𝚃𝙾, 𝚅𝙸𝙳𝙴𝙾 𝙾𝚁 𝙰𝚄𝙳𝙸𝙾 🥺*"
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
      console.error("VV Error:", error);
      await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
      await socket.sendMessage(sender, {
        text: `*𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝚁𝙸𝚃𝙴 ❮𝚅𝚅❯ 𝙰𝙶𝙰𝙸𝙽 🥺*\n\n_Error:_ ${error.message}`
      }, { quoted: msg });
    }
  }
};
