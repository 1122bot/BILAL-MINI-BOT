module.exports = {
  command: "mute",
  desc: "Mute the group (only admins can send messages)",
  category: "group",
  use: ".mute",
  fromMe: true,
  filename: __filename,

  execute: async (sock, msg) => {
    const { remoteJid } = msg.key;
    await sock.groupSettingUpdate(remoteJid, "announcement");
    await sock.sendMessage(remoteJid, { text: "*YEH GROUP AB BAND HO CHUKA HAI 🥺* \n *AB AP SAB IS GROUP ME CHAT NAHI KAR SAKTE HAI 😇* \n *YEH GROUP BAHUT JALD OPEN HO JAYE GA 🥰*" }, { quoted: msg });
  }
};
