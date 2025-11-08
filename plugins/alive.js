const { sleep } = require("../lib/functions");

module.exports = {
  command: "alive",
  alias: ["status", "online", "a", "active"],
  description: "Check bot is alive or not with live line updates",
  category: "main",
  react: "🥰",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;

      const lines = [
        "*ASSALAMUALAIKUM ☺️*",
        "\n*KESE HAI AP 😇*",
        "\n*UMEED HAI KE AP KHARIYAT SE HOGE AUR BEHTAR HOGE 🥰*",
        "\n*AUR APKE GHAR ME BHI SAB KHARIYAT SE HOGE 🥰*",
        "\n*DUWA KRE GE APKE LIE 🤲*",
        "\n*ALLAH AP SAB KO HAMESHA KHUSH RAKHE AMEEN 🤲*",
        "\n*ALLAH AP SAB KI MUSHKIL PARSHANIYA DOOR KARE AMEEN 🤲*",
        "\n*AP APNA BAHUT KHAYAL RAKHIA KARO 🥰*",
        "\n*AUR HAMESHA KHUSH RAHA KARO 🥰*",
        "\n*Q K APKI SMILE BAHUT PYARY HAI MASHALLAH ☺️*",
        "\n*IS LIE APNE CHEHRE PER HAR WAKAT SMILE RAKHO 🥰*",
        "\n*KABHI SAD MAT HOYE 🥺♥️*",
        "\n\n*👑 BILAL-MD WHATSAPP BOT 👑*"
      ];

      // Pehla blank message send karo
      let text = "";
      const sent = await sock.sendMessage(from, { text }, { quoted: msg });

      // Har 3 sec baad message edit karo
      for (const line of lines) {
        text += line + "\n";
        await sleep(3000);
        await sock.relayMessage(from, {
          protocolMessage: {
            key: sent.key,
            type: 14,
            editedMessage: { conversation: text },
          },
        }, {});
      }
    } catch (err) {
      console.error("Alive cmd error:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ *Alive command error:* ${err.message}`,
      });
    }
  },
};
