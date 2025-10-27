const config = require('../config');

module.exports = {
  command: "menu",
  description: "To get the menu.",
  react: "🛍️",
  category: "main",
  execute: async (socket, msg, args, number) => {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;
      const pushname = msg.pushName || "there";

      // Nouveau style BiLAL-MD 
      const menumsg = `
*╭━━━〔 🤖 BILAL MD 〕━━━┈⊷*
*┃👑╭──────────────────*
*┃👑│ USER :❯ ${pushname}*
*┃👑│ JID  :❯ @${sender.split("@")[0]}*
*┃👑│ MODE :❯ PUBLIC*
*┃👑│ PREFiX :❯ ${config.PREFIX}*
*┃👑│ VERSION :❯ 2.0.0*
*┃👑╰──────────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*HI ${pushname} 🥰*
*HERE IS YOUR MENU 🌹*

*╭━━〔 📥 DOWNLOAD 〕━━┈⊷*
*┃👑│ • SONG*
*┃👑│ • VIDEO*
*┃👑│ • TIKTOK*
*┃👑│ • FB*
*┃👑│ • APK*
*┃👑│ • IMG*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👨‍💻 OWNER 〕━━┈⊷*
*┃👑│ • BLOCK*
*┃👑│ • UNBLOCK*
*┃👑│ • DELETE*
*┃👑│ • LEAVE*
*┃👑│ • ADS*
*┃👑│ • VV*
*┃👑│ • JOIN*
*┃👑│ • CONTACTLIST*
*┃👑│ • RUN*
*┃👑│ • CODEADD*
*┃👑│ • EDID*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 🪀 GROUP 〕━━┈⊷*
*┃👑│ • JOIN*
*┃👑│ • LEAVE*
*┃👑│ • BC*
*┃👑│ • HIDETAG*
*┃👑│ • WELCOME*
*┃👑│ • MUTE*
*┃👑│ • UNMUTE*
*┃👑│ • KICK*
*┃👑│ • ADD*
*┃👑│ • TAGALL*
*┃👑│ • PROMOTE*
*┃👑│ • DEMOTE*
*┃👑│ • GNAME*
*┃👑│ • GDESC*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 🧣 OTHER 〕━━┈⊷*
*┃👑│ • GETPP*
*┃👑│ • META*
*┃👑│ • TAKE*
*┃👑│ • STICKER*
*┃👑│ • VOICEGPT*
*┃👑│ • JOKE*
*┃👑│ • WEATHER*
*┃👑│ • TRAIN*
*┃👑│ • BUS*
*┃👑│ • SUMMARY*
*┃👑│ • AISUMMARY*
*┃👑│ • WABETA*
*┃👑│ • SENDUPDATE*
*┃👑│ • DL*
*┃👑│ • TEXTM*
*┃👑│ • GETDP*
*┃👑│ • BIRTHDAY*
*┃👑│ • REPLY*
*┃👑│ • RANK*
*╰━━━━━━━━━━━━━━━┈⊷*

> *MADE BY MINI BILAL 💫*`;

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
            newsletterName: 'MINI BILAL MD',
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
