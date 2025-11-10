const config = require('../config');
const { sleep } = require('../lib/functions');

module.exports = {
  command: "menu",
  alias: ["help", "commands", "panel"],
  description: "To get the full command menu.",
  category: "main",
  react: "👑",

  execute: async (sock, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const pushname = msg.pushName || "there";

      const lines = [
        "*╭━━━〔 👑 BILAL MD 👑 〕━━━┈⊷*",
        "*┃👑╭──────────────────*",
        `*┃👑│ USER :❯ ${pushname}*`,
        `*┃👑│ PLATFORM :❯ BILAL-X❮LINUX❯*`,
        `*┃👑│ PREFiX :❯ ${config.PREFIX}*`,
        "*┃👑│ VERSION :❯ 1.0.0*",
        "*┃👑╰──────────────────*",
        "*╰━━━━━━━━━━━━━━━┈⊷*",
        "",
        "*HI G 🥰*",
        "*MERE BOT KA MENU 🌹*",
        "*YEH HAI G 😊*",
        "",
        "*╭━━〔 👑 DOWNLOAD 👑 〕━━┈⊷*",
        "*┃👑│ • SONG*",
        "*┃👑│ • VIDEO*",
        "*┃👑│ • TIKTOK*",
        "*┃👑│ • APK*",
        "*┃👑│ • IMG*",
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
        "*┃👑│ • AUTOBIO*",
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

      // Step 1: Send image with short caption
      await sock.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/bkufwo.jpg' },
        caption: "*👑 BILAL-MD MINI BOT 👑*"
      }, { quoted: msg });

      // Step 2: Send menu line by line with 1 second delay
      for (const line of lines) {
        await sock.sendMessage(from, { text: line });
        await sleep(1000); // 1 second gap
      }

    } catch (e) {
      console.error(e);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ ERROR: ${e.message}`
      }, { quoted: msg });
    }
  }
};
