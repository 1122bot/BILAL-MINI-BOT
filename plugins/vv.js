const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
  command: "vv",
  alias: ["antivv", "avv", "viewonce", "open", "openphoto", "openvideo", "vvphoto"],
  description: "Owner Only - retrieve quoted media (photo, video, audio, view once)",
  category: "owner",
  react: "😃",
  usage: ".vv (reply on view once media)",
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const fromMe = msg.key.fromMe;
    const isCreator = fromMe;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    try {
      await socket.sendMessage(sender, { react: { text: "😃", key: msg.key } });

      if (!isCreator) return;

      if (!quoted) {
        await socket.sendMessage(sender, { text: "Reply kisi photo/video par karo 🥺" }, { quoted: msg });
        return;
      }

      // 🧩 Handle view once (important fix)
      let realMsg = quoted;
      if (quoted.viewOnceMessageV2) {
        realMsg = quoted.viewOnceMessageV2.message;
      } else if (quoted.viewOnceMessageV2Extension) {
        realMsg = quoted.viewOnceMessageV2Extension.message;
      }

      let type = Object.keys(realMsg)[0];
      if (!["imageMessage", "videoMessage", "audioMessage"].includes(type)) {
        return await socket.sendMessage(sender, {
          text: "Reply view once photo, video ya audio par karo 🥺"
        }, { quoted: msg });
      }

      // 🧲 Download
      const stream = await downloadContentFromMessage(realMsg[type], type.replace("Message", ""));
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

      // 📦 Prepare send content
      let sendContent = {};
      if (type === "imageMessage") {
        sendContent = {
          image: buffer,
          caption: realMsg[type]?.caption || "",
          mimetype: "image/jpeg"
        };
      } else if (type === "videoMessage") {
        sendContent = {
          video: buffer,
          caption: realMsg[type]?.caption || "",
          mimetype: "video/mp4"
        };
      } else if (type === "audioMessage") {
        sendContent = {
          audio: buffer,
          mimetype: realMsg[type]?.mimetype || "audio/mp4",
          ptt: realMsg[type]?.ptt || false
        };
      }

      await socket.sendMessage(sender, sendContent, { quoted: msg });
      await socket.sendMessage(sender, { react: { text: "😍", key: msg.key } });

    } catch (error) {
      console.error("VV Error:", error);
      await socket.sendMessage(sender, {
        text: `Error while opening view once media:\n${error.message}`
      }, { quoted: msg });
    }
  }
};
