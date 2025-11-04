const { formatMessage } = require('../lib/formatter');
const os = require('os');
const moment = require('moment');


module.exports = {
        command: 'system',
        description: 'Show the system',
        execute: async (socket, msg, args, number) => {
            const uptime = process.uptime();
            const formattedUptime = moment.utc(uptime * 1000).format("HH:mm:ss");

            const memoryUsage = process.memoryUsage();
            const usedMemory = (memoryUsage.rss / 1024 / 1024).toFixed(2);
            const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
            const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
            const cpuInfo = os.cpus()[0].model;

            const caption = `
*╭───────────────⭓*
*│ 👑 PLATFORM :❯ ${os.platform()}*
*│ 👑 UPTIME :❯ ${formattedUptime}*
*│ 👑 RAM :❯ ${usedMemory}*
*│ 👑 MEMORY :❯ ${freeMem}*
*│ 👑 CPU :❯ ${cpuInfo} .cache).length}*
*│ 👑 USER :❯ ${os.userInfo().username}*
*╰───────────────⭓*
 *👑 BILAL-MD MINI BOT 👑*`
            

            const sender = msg.key.remoteJid;

            await socket.sendMessage(sender, {
                image: { url: 'https://files.catbox.moe/bkufwo.jpg' }, // Confirm accessibility
                caption,
                contextInfo: {
                    mentionedJid: ['923078071982@s.whatsapp.net'],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363296818107681@newsletter',
                        newsletterName: 'BILAL-MD MINI BOT',
                        serverMessageId: 143
                    }
                }
            })
        }
}




