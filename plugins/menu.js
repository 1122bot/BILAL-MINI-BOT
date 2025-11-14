const config = require('../config');
const { sleep } = require('../lib/functions');

module.exports = {
  command: "menu",
  alias: ["help", "commands", "panel"],
  description: "To get the full command menu with live effect.",
  category: "main",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const pushname = msg.pushName || "there";

      const lines = [
        "*╭━━━〔 👑 BILAL MD 👑 〕━━━┈⊷*",
        "*┃👑╭──────────────────*",
        `*┃👑│ USER :❯ ${pushname}*`,
        `*┃👑│ PLATFORM :❯ BILAL-X❮LINUX❯*`,
        `*┃👑│ PREFIX :❯ ${config.PREFIX}*`,
        "*┃👑│ VERSION :❯ 1.0.0*",
        "*┃👑╰──────────────────*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*MY DEAR 🥰*",
        "*MERE BOT KA MENU 🌹*",
        "*YEH HAI 😊*",
        "",
        "*╭━━〔 👑 DOWNLOAD 👑 〕━━┈⊷*",
        "*┃👑│ • SONG*",
        "*┃👑│ • VIDEO*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*╭━━〔 👑 SEARCH 👑 〕━━┈⊷*",
        "*┃👑│ • YTS*",
        "*┃👑│ • LYRICS*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*╭━━〔 👑 MAIN 👑 〕━━┈⊷*",
        "*┃👑│ • ALIVE*",
        "*┃👑│ • PING*",
        "*┃👑│ • UPTIME*",
        "*┃👑│ • SYSTEM*",
        "*┃👑│ • HELP*",
        "*┃👑│ • OWNER*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*╭━━〔 👑 XTRA 👑 〕━━┈⊷*",
        "*┃👑│ • VV*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*╭━━〔 👑 GROUP 👑 〕━━┈⊷*",
        "*┃👑│ • MUTE*",
        "*┃👑│ • UNMUTE*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*╭━━〔 👑 USER 👑 〕━━┈⊷*",
        "*┃👑│ • BLOCK*",
        "*┃👑│ • UNBLOCK*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*╭━━〔 👑 AI 👑 〕━━┈⊷*",
        "*┃👑│ • GPT*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*╭━━〔 👑 CONVERT 👑 〕━━┈⊷*",
        "*┃👑│ • TTS*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*👑 FOR SUPPORT 👑*",
        "*👑 DEVELOPER 👑*",
        "https://akaserein.github.io/Bilal/",
        "",
        "*👑 SUPPORT CHANNEL 👑*",
        "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
        "",
        "*👑 SUPPORT GROUP 👑*",
        "https://chat.whatsapp.com/BwWffeDwiqe6cjDDklYJ5m?mode=ems_copy_t"
      ];

      // Step 1: Send image first with caption
      await sock.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/bkufwo.jpg' },
        caption: "*👑 BILAL-MD MINI BOT 👑*",
      }, { quoted: msg });

      // Step 2: Send empty text message
      let text = "";
      const sent = await sock.sendMessage(from, { text }, { quoted: msg });

      // Step 3: Line by line add with edit effect
      for (const line of lines) {
        text += line + "\n";
        await sleep(1000); // har line ke beech 1 sec ka gap
        await sock.relayMessage(from, {
          protocolMessage: {
            key: sent.key,
            type: 14,
            editedMessage: { conversation: text },
          },
        }, {});
      }

    } catch (err) {
      console.error("Menu command error:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "*❌ ERROR: DUBARA KOSHISH KARE 😔*",
      }, { quoted: msg });
    }
  },
};
