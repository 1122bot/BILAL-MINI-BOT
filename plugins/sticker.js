const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const Config = require("../config");

module.exports = {
  command: "sticker",
  alias: ["s", "stickergif"],
  react: "🥰",
  desc: "Create sticker from image, video or sticker reply.",
  category: "sticker",
  usage: ".sticker (reply to image/video)",

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      // Agar reply nahi hai
      if (!quoted) {
        return sock.sendMessage(
          jid,
          { text: `📸 *Reply kisi image ya video par kare!* \n\nUsage: *.sticker*` },
          { quoted: msg }
        );
      }

      // Type check
      const mimeType = Object.keys(quoted)[0];
      if (!["imageMessage", "videoMessage", "stickerMessage"].includes(mimeType)) {
        return sock.sendMessage(jid, { text: "⚠️ *Sirf photo ya video par reply kare!*" }, { quoted: msg });
      }

      // Media download function
      const messageType = mimeType.replace("Message", "");
      const stream = await downloadContentFromMessage(quoted[mimeType], messageType);

      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const pack = Config.STICKER_NAME || "👑 MINI BILAL-MD 👑";

      // Sticker create
      const sticker = new Sticker(buffer, {
        pack,
        type: StickerTypes.FULL,
        quality: 75,
        background: "transparent",
      });

      const stickerBuffer = await sticker.toBuffer();

      // Send sticker
      await sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });

    } catch (err) {
      console.error("Sticker Error:", err);
      const errorText = `*❌ Sticker banane me error!* \n\n*Error Details:* \n\`\`\`${err.message || err}\`\`\``;
      await sock.sendMessage(msg.key.remoteJid, { text: errorText }, { quoted: msg });
    }
  },
};
