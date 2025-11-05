module.exports = {
  command: "mute",
  description: "Mute the group (only admins can send messages)",
  category: "group",

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const groupMetadata = await sock.groupMetadata(jid);
    const sender = msg.key.participant || msg.participant;
    const admins = groupMetadata.participants
      .filter(p => p.admin !== null)
      .map(p => p.id);

    // Group check
    if (!jid.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: "*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*" });
    }

    // Admin check
    if (!admins.includes(sender)) {
      return sock.sendMessage(jid, { text: "*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*" });
    }

    // Bot admin check
    const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    if (!admins.includes(botNumber)) {
      return sock.sendMessage(jid, { text: "*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*" });
    }

    try {
      await sock.groupSettingUpdate(jid, "announcement");
      await sock.sendMessage(jid, {
        text: "*YEH GROUP AB BAND HO CHUKA HAI 🥺*\n\n*AB AP SAB IS GROUP ME CHAT NAHI KAR SAKTE HAI 😇🌺*\n\n*YEH GROUP BAHUT JALD OPEN HO JAYE GA 🥰*"
      });
    } catch (err) {
      console.error(err);
      await sock.sendMessage(jid, { text: "*DUBARA KOSHISH KAREIN 🥺❤️*" });
    }
  },
};
