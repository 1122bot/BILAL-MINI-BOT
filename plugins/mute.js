module.exports = {
  command: 'mute',
  alias: ["groupmute", "offgroup", "groupoff", "offgc", "gcoff"],
  description: "Mute the group (Only admins can send messages)",
  category: "group",
  react: "🔒",
  usage: ".mute",

  execute: async (socket, msg, args) => {
    try {
      const from = msg.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const sender = msg.key.participant || msg.key.remoteJid;

      // 🧠 Helper reply function
      const reply = (text) => socket.sendMessage(from, { text }, { quoted: msg });

      // ✅ Group check
      if (!isGroup) {
        await socket.sendMessage(from, { react: { text: "❌", key: msg.key } });
        return reply("*❌ Yeh command sirf groups me use karein!*");
      }

      // 📋 Group metadata
      const groupMetadata = await socket.groupMetadata(from);
      const groupAdmins = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => p.id);
      const isAdmins = groupAdmins.includes(sender);
      const botNumber = socket.user?.id || '';
      const isBotAdmins = groupAdmins.includes(botNumber);

      // 🧑 Sender check
      if (!isAdmins) {
        await socket.sendMessage(from, { react: { text: "⚠️", key: msg.key } });
        return reply("*⚠️ Sirf group admins is command ko use kar sakte hain!*");
      }

      // 🤖 Bot admin check
      if (!isBotAdmins) {
        await socket.sendMessage(from, { react: { text: "❗", key: msg.key } });
        return reply("*❗ Pehle mujhe is group me admin banao!*");
      }

      // 🔒 Mute the group
      await socket.groupSettingUpdate(from, "announcement");
      await socket.sendMessage(from, { react: { text: "🔒", key: msg.key } });
      reply("*✅ Group ab mute ho chuka hai! Sirf admins message bhej sakte hain.*");

    } catch (e) {
      console.error("❌ Group mute error:", e);
      await socket.sendMessage(msg.key.remoteJid, { react: { text: "😔", key: msg.key } });
      socket.sendMessage(msg.key.remoteJid, { text: "*⚠️ Dubara koshish karein!*" }, { quoted: msg });
    }
  }
};
