module.exports = {
  command: 'vv',
  description: 'Owner Only - Retrieve view-once media',
  category: 'main',
  react: '😃',
  execute: async (socket, msg, args, number) => {
    try {
      const sender = msg.key.remoteJid;
      const isOwner = msg.key.fromMe; // owner check

      // Owner restriction
      if (!isOwner) {
        return await socket.sendMessage(sender, {
          text: "*📛 This is an owner-only command.*"
        }, { quoted: msg });
      }

      // Must reply to a message
      if (!msg.quoted) {
        return await socket.sendMessage(sender, {
          text: "*📸 Kisi view-once photo ya video pe reply karo phir likho:* `.vv`"
        }, { quoted: msg });
      }

      // Get quoted message
      const quoted = msg.quoted.message;

      // Extract view-once message (v2 or v1)
      const viewOnce = quoted?.viewOnceMessageV2?.message || quoted?.viewOnceMessage?.message;
      if (!viewOnce) {
        return await socket.sendMessage(sender, {
          text: "*⚠️ Ye view-once media nahi hai!*"
        }, { quoted: msg });
      }

      // Get the message type (image or video)
      const type = Object.keys(viewOnce)[0];
      const mediaMessage = viewOnce[type];

      // Download the view-once media
      const buffer = await socket.downloadMediaMessage({ message: viewOnce });

      // Send retrieved media
      await socket.sendMessage(sender, {
        [type]: buffer,
        caption: "*Here’s your view-once media 👀*"
      }, { quoted: msg });

    } catch (error) {
      console.error("VV command error:", error);
      await socket.sendMessage(msg.key.remoteJid, {
        text: `*❌ Error:* ${error.message}`
      }, { quoted: msg });
    }
  }
};
