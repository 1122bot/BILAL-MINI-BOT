const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const fs = require("fs");
const Config = require("../config");

module.exports = {
  command: "sticker",
  alias: ["s", "stickergif"],
  desc: "Create sticker from image, video or sticker reply.",
  category: "sticker",
  usage: ".sticker (reply to image/video)",
  filename: __filename,

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      // Agar reply nahi hai
      if (!quoted) {
        await sock.sendMessage(jid, {
          text: `*📸 Reply kisi image ya video par kare!* \n\nUsage: *.sticker*`,
        }, { quoted: msg });
        return;
      }

      // Type check
      const mimeType = Object.keys(quoted)[0];
      if (!["imageMessage", "videoMessage", "stickerMessage"].includes(mimeType)) {
        await sock.sendMessage(jid, { text: "*⚠️ Sirf photo ya video par reply kare!*" }, { quoted: msg });
        return;
      }

      // Download media
      const messageType = mimeType === "imageMessage" ? "image" :
                         mimeType === "videoMessage" ? "video" : "sticker";
      const stream = await sock.downloadMediaMessage({ message: quoted });
      const mediaBuffer = Buffer.from(stream);

      const pack = Config.STICKER_NAME || "👑 MINI BILAL-MD 👑";

      // Sticker banao
      const sticker = new Sticker(mediaBuffer, {
        pack,
        type: StickerTypes.FULL,
        quality: 75,
        background: "transparent",
      });

      const buffer = await sticker.toBuffer();

      // Send sticker
      await sock.sendMessage(jid, { sticker: buffer }, { quoted: msg });
    } catch (err) {
      console.error("Sticker Error:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: "*❌ Sticker banane me error! Dubara koshish kare.*" }, { quoted: msg });
    }
  },
};
