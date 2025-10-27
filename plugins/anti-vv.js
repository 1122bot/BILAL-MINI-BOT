module.exports = {
  command: 'vv',
  description: 'Owner Only - Retrieve view-once media',
  category: 'main',
  react: '🐳',
  execute: async (socket, msg, args, number) => {
    const sender = msg.key.remoteJid;
    const isOwner = msg.key.fromMe; // Mini bot me usually owner ka check

    if (!isOwner) {
      return await socket.sendMessage(sender, {
        text: "*📛 This is an owner-only command.*"
      }, { quoted: msg });
    }

    if (!msg.quoted) {
      return await socket.sendMessage(sender, {
        text: "*🍁 Please reply to a view-once message.*"
      }, { quoted: msg });
    }

    // Agar dono conditions pass ho gaye, yahan pe aap ka logic aayega
    await socket.sendMessage(sender, { text: "*✅ Owner verified!*" }, { quoted: msg });
  }
};
