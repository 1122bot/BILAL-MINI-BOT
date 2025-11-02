module.exports = {
  command: "vv",
  desc: "Owner Only - Retrieve view-once media",
  category: "main",
  react: "😃",
  fromMe: false,
  filename: __filename,

  execute: async (sock, msg) => {
    const sender = msg.key.remoteJid;
    const isOwner = msg.key.fromMe; // usually owner message check

    // 🧑‍💼 Owner check
    if (!isOwner) {
      return await sock.sendMessage(sender, {
        text: "*📛 This is an owner-only command.*"
      }, { quoted: msg });
    }

    // 📎 Check if replied to a view-once message
    if (!msg.quoted) {
      return await sock.sendMessage(sender, {
        text: `*📩 Reply to a View-Once Photo, Video, or Audio!* 🥺\n\nExample:\n> Reply and type *.vv* 😎`
      }, { quoted: msg });
    }

    try {
      const quotedMsg = msg.quoted;
      const type = Object.keys(quotedMsg.message)[0]; // Detect message type

      // 🖼️ If it's a View Once message
      if (type === "viewOnceMessageV2" || type === "viewOnceMessage") {
        const viewOnceContent = quotedMsg.message[type].message;
        const innerType = Object.keys(viewOnceContent)[0];

        // ⬇️ Forward the media back without view-once restriction
        await sock.sendMessage(sender, viewOnceContent, { quoted: msg });
      } else {
        await sock.sendMessage(sender, {
          text: "*❌ The replied message is not a View Once media.*"
        }, { quoted: msg });
      }
    } catch (error) {
      console.error(error);
      await sock.sendMessage(sender, {
        text: "*⚠️ Error retrieving view-once media.*"
      }, { quoted: msg });
    }
  }
};
