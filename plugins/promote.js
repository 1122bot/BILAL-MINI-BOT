// 🌟 Code by WHITESHADOW x Umar
module.exports = {
  command: "promote",
  alias: ["p", "makeadmin", "admin"],
  description: "Promotes a member to group admin",
  category: "admin",
  react: "🥺",
  usage: ".promote (reply or mention user)",
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const from = sender;
    const isGroup = sender.endsWith("@g.us");

    try {
      // 🥺 react on command
      await socket.sendMessage(from, { react: { text: "🥺", key: msg.key } });

      // ❌ Not group
      if (!isGroup) {
        await socket.sendMessage(from, { react: { text: "😫", key: msg.key } });
        return await socket.sendMessage(from, { text: "*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️*", quoted: msg });
      }

      // Fetch group metadata
      const metadata = await socket.groupMetadata(from);
      const participants = metadata.participants;
      const groupAdmins = participants.filter(p => p.admin).map(a => a.id);
      const botNumber = socket.user.id.split(":")[0] + "@s.whatsapp.net";
      const isBotAdmins = groupAdmins.includes(botNumber);
      const isAdmins = groupAdmins.includes(msg.participant || msg.key.participant);

      // ❌ User not admin
      if (!isAdmins) {
        await socket.sendMessage(from, { react: { text: "😥", key: msg.key } });
        return await socket.sendMessage(from, { text: "*YEH COMMAND SRF GROUP ADMINS USE KAR SAKTE HAI AP ADMIN NAHI HO 🥺*", quoted: msg });
      }

      // ❌ Bot not admin
      if (!isBotAdmins) {
        await socket.sendMessage(from, { react: { text: "😎", key: msg.key } });
        return await socket.sendMessage(from, { text: "*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*", quoted: msg });
      }

      // 🎯 Determine target user
      let number;
      if (quoted) {
        number = quoted.split("@")[0];
      } else if (args.length && args[0].includes("@")) {
        number = args[0].replace(/[@\s]/g, "");
      } else {
        await socket.sendMessage(from, { react: { text: "☺️", key: msg.key } });
        return await socket.sendMessage(from, {
          text: "*AP KIS MEMBER KO IS GROUP KA ADMIN BANANA CHAHTE HAI 🤔*\n*PEHLE US MEMBER KO MENTION YA USKE MSG KO REPLY KAR KE ☺️🌹*\n*PHIR ESE LIKHO 🥰*\n\n❮ADMIN❯\n\n*TO WO MEMBER GROUP ME ADMIN BAN JAYE GA 😇♥️*"
        }, { quoted: msg });
      }

      const jid = number + "@s.whatsapp.net";

      // 🧩 Skip if already admin
      if (groupAdmins.includes(jid)) {
        await socket.sendMessage(from, { react: { text: "🥺", key: msg.key } });
        return await socket.sendMessage(from, { text: "*YEH MEMBER PEHLE SE ADMIN HAI ☺️*", quoted: msg });
      }

      // ✅ Promote member
      await socket.groupParticipantsUpdate(from, [jid], "promote");
      await socket.sendMessage(from, { react: { text: "☺️", key: msg.key } });
      await socket.sendMessage(from, {
        text: `*YEH ${number} SIMPLE MEMBER SE ADMIN BAN CHUKA HAI 🥰🌹*`,
        mentions: [jid],
        quoted: msg
      });

    } catch (error) {
      console.error("Promote Error:", error);
      await socket.sendMessage(from, { react: { text: "😔", key: msg.key } });
      await socket.sendMessage(from, { text: "*DUBARA KOSHISH KAREIN 🥺❤️*", quoted: msg });
    }
  }
};
