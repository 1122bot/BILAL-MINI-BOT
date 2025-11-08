const { sleep } = require("../lib/functions");

module.exports = {
  command: "ping",
  alias: ["alive", "check", "status"],
  description: "Check bot response with live line updates",
  category: "main",
  react: "🥰",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;

      // Start reaction
      await sock.sendMessage(from, { react: { text: "🥰", key: msg.key } });

      const lines = [
        "*ASSALAMUALAIKUM ☺️*",
        "\n*KESE HAI AP ☺️*",
        "\n*UMEED HAI KE AP KHARIYAT SE HOGE INSHALLAH 🤲🥰*",
        "\n*ALLAH APKO AUR APKE CHAHNE WALO KO HAMESHA KHUSH RAKHE AMEEN 🤲🥰*",
        "\n*APNA KHAYAL RKHO AUR KHUSH RAHO AMEEN 🤲🥰*",
        "\n*AUR BATAYE KESE GUZAR RAHI HAI APKI ZINDAGI 🥰*",
        "\n*NAMAZ BHI PARHA KARO 🥰💞*",
        "\n*AUR QURAN MAJEED KI TILAWAT BHI KIA KARO 🥰💞*",
        "\n*ALLAH PAK KI IBADAT BHI KIA KARO 🥰💞*",
        "\n*BEE HAPPY MY DEAR ☺️💞*"
      ];

      // Pehla khali message send karo
      let text = "";
      const sent = await sock.sendMessage(from, { text }, { quoted: msg });

      // 2 second gap se har line update hoti rahegi
      for (const line of lines) {
        text += line + "\n";
        await sleep(2000);
        await sock.relayMessage(from, {
          protocolMessage: {
            key: sent.key,
            type: 14,
            editedMessage: { conversation: text },
          },
        }, {});
      }

      // End reaction
      await sock.sendMessage(from, { react: { text: "😇", key: msg.key } });

    } catch (err) {
      console.error("Ping command error:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "😔", key: msg.key },
      });
      await sock.sendMessage(msg.key.remoteJid, {
        text: "*ERROR: DUBARA KOSHISH KARE 😔*",
      });
    }
  },
};
