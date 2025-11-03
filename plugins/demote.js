// 🌟 Code by bilal
const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin", "dmt"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "🥺",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, q, isGroup, sender, botNumber, isBotAdmins, isAdmins, reply
}) => {

    // 🥺 react on command start
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    // ⚠️ Group check
    if (!isGroup) {
        await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
        return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
    }

    // 👮 User admin check
    if (!isAdmins) {
        await conn.sendMessage(from, { react: { text: "😥", key: m.key } });
        return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI 🥺*");
    }

    // 🤖 Bot admin check
    if (!isBotAdmins) {
        await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
        return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
    }

    // 🧩 Number detection
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });
        return reply(`*AP NE KIS ADMIN KO DISSMISS KARNA HAI 🥺* 
*US ADMIN KO MENTION YA USKE MSG KO REPLY KARO ☺️* 
*PHIR LIKHO 🥺👇*

*❮DEMOTE❯*

*TO US ADMIN KO ADMIN KI POST SE HATA DIYA JAYEGA 😇🌹*`);
    }

    if (number === botNumber) {
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        return reply("*SORRY G, MUJHE ADMIN SE HATA NAHI SAKTE 🥺❤️*");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        // 👇 Demote kar do
        await conn.groupParticipantsUpdate(from, [jid], "demote");

        await conn.sendMessage(from, { react: { text: "☹️", key: m.key } });
        reply(`*+${number} KO ADMIN SE DISSMISS KAR DIYA GAYA HAI 🥺💔*`, { mentions: [jid] });

    } catch (error) {
        console.error("❌ DEMOTE ERROR:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
