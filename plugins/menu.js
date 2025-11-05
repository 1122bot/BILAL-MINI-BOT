const config = require('../config');

module.exports = {
  command: "menu",
  description: "To get the menu.",
  react: "👑",
  category: "main",
  execute: async (socket, msg, args, number) => {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;
      const pushname = msg.pushName || "there";

      // Nouveau style BiLAL-MD 
      const menumsg = `
*╭━━━〔 👑 BILAL MD 👑 〕━━━┈⊷*
*┃👑╭──────────────────*
*┃👑│ USER :❯ ${pushname}*
*┃👑│ MODE :❯ PUBLIC*
*┃👑│ PREFiX :❯ ${config.PREFIX}*
*┃👑│ VERSION :❯ 1.0.0*
*┃👑╰──────────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*HI ${pushname} G 🥰*
*MERE BOT KA MENU 🌹*
*YEH HAI G 😊*

*╭━━〔 👑 MAIN 👑 〕━━┈⊷*
*┃👑│ • SONG*
*┃👑│ • VIDEO*
*┃👑│ • TIKTOK*
*┃👑│ • FB*
*┃👑│ • APK*
*┃👑│ • IMG*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 MAIN 👑 〕━━┈⊷*
*┃👑│ • ALIVE*
*┃👑│ • PING*
*┃👑│ • UPTIME*
*┃👑│ • SYSTEM*
*┃👑│ • HELP*
*┃👑│ • OWNER*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 XTRA 👑 〕━━┈⊷*
*┃👑│ • VV*
*┃👑│ • DELETE*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 GROUP 👑 〕━━┈⊷*
*┃👑│ • HIDETAG*
*┃👑│ • DELETE*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 USER 👑 〕━━┈⊷*
*┃👑│ • BLOCK*
*┃👑│ • UNBLOCK*
*┃👑│ • AUTOBIO*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 AI 👑 〕━━┈⊷*
*┃👑│ • AI*
*╰━━━━━━━━━━━━━━━┈⊷*

*👑 BILAL-MD MINI BOT 👑*

*👑 FOR SUPPORT 👑*
 *👑 DEVELEPER 👑* 
 *https://akaserein.github.io/Bilal/*
 
 *👑 SUPPORT CHANNEL 👑* 
*https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G*
 
 *👑 SUPPORT GROUP 👑* 
 *https://chat.whatsapp.com/BwWffeDwiqe6cjDDklYJ5m?mode=ems_copy_t*

`;

      // Envoi du menu avec image et contextInfo stylisé
      await socket.sendMessage(sender, {
        image: { url: 'https://files.catbox.moe/bkufwo.jpg' },
        caption: menumsg,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363296818107681@newsletter',
            newsletterName: 'BILAL-MD MINI BOT',
            serverMessageId: 143
          }
        }
      }, { quoted: msg });

    } catch (e) {
      console.error(e);
      await socket.sendMessage(msg.key.remoteJid, { 
        text: `❌ ERROR: ${e.message}` 
      }, { quoted: msg });
    }
  }
};
