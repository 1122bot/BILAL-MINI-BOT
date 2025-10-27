module.exports = {
  command: "alive",
  description: "Check if bot is running",
  category: "info",

  async execute(sock, msg) {
    try {
      const jid = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const jidName = sender.split("@")[0];

      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      const speed = Math.floor(Math.random() * 90 + 10);

      const caption = `*ASSALAMUALAIKUM ☺️*
      *KESE HAI AP 😇*
      *UMEED HAI KE AP KHARIYT SE HOGE INSHALLAH 🤲*
      *ME BILAL-MD MINI BOT USER HOO ☺️*
      
      *👑 OWNER INFO 👑*
https://akaserein.github.io/Bilal/

*👑 SUPPORT CHANNEL 👑*
https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G

*👑 SUPPORT GROUP 👑*
https://chat.whatsapp.com/BwWffeDwiqe6cjDDklYJ5m?mode=ems_copy_t
`;

      // Envoyer simplement le message avec l'image
      await sock.sendMessage(
        jid,
        {
          image: { url: 'https://files.catbox.moe/bkufwo.jpg' },
          caption: caption
        },
        { quoted: msg }
      );

    } catch (err) {
      console.error("❌ Error in alive command:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Error checking bot status",
      });
    }
  },
};
