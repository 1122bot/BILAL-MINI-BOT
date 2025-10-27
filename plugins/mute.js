module.exports = {
  command: 'mute',
  alias: ["groupmute","offgroup","groupoff","offgc","gcoff"],
  description: "Mute the group (Only admins can send messages)",
  category: "group",
  react: "🔒",
  usage: ".mute",
  execute: async (socket, msg, args, { isGroup, senderNumber, isAdmins, isBotAdmins, reply, from }) => {
    try {
      // Check if it's a group
      if (!isGroup) {
        await socket.sendMessage(from, { react: { text: "❌", key: msg.key } });
        return reply("*❌ Yeh command sirf groups me use karein!*");
      }

      // Check if sender is admin
      if (!isAdmins) {
        await socket.sendMessage(from, { react: { text: "⚠️", key: msg.key } });
        return reply("*⚠️ Sirf group admins is command ko use kar sakte hain!*");
      }

      // Check if bot is admin
      if (!isBotAdmins) {
        await socket.sendMessage(from, { react: { text: "❗", key: msg.key } });
        return reply("*❗ Pehle mujhe is group me admin banao!*");
      }

      // Mute the group
      await socket.groupSettingUpdate(from, "announcement");
      await socket.sendMessage(from, { react: { text: "🔒", key: msg.key } });
      reply("*✅ Yeh group ab mute ho chuka hai. Sirf admins messages bhej sakte hain!*");

    } catch (e) {
      console.error("Group mute error:", e);
      await socket.sendMessage(from, { react: { text: "😔", key: msg.key } });
      reply("*⚠️ Dubara koshish karein!*");
    }
  }
};
