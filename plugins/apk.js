const axios = require("axios");

module.exports = {
  command: 'apk',
  alias: ["app","apps","application","ap"],
  description: "Download APK from Aptoide",
  category: "download",
  react: "🥺",
  usage: ".apk <app name>",
  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const q = args.join(" ");
    let waitMsg;

    try {
      // React to command
      await socket.sendMessage(sender, { react: { text: "🥺", key: msg.key } });

      if (!q) return await socket.sendMessage(sender, {
        text: "*🥺 APK download karne ke liye command ka sahi istemal karo:*\n.apk <app name>"
      }, { quoted: msg });

      // Waiting message
      waitMsg = await socket.sendMessage(sender, { text: "*⏳ APK download ho rahi hai, thoda sa intezar kare…*" });

      const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || !data.datalist || !data.datalist.list.length) {
        if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });
        return await socket.sendMessage(sender, { text: "*😔 APK nahi mili, dubara try karo!*" }, { quoted: msg });
      }

      const app = data.datalist.list[0];
      const appSize = (app.size / 1048576).toFixed(2);

      // Send APK
      await socket.sendMessage(sender, {
        document: { url: app.file.path_alt },
        fileName: `${app.name}.apk`,
        mimetype: "application/vnd.android.package-archive",
        caption: `*👑 APK NAME:* ${app.name}\n*👑 SIZE:* ${appSize} MB\n\n*BY : BILAL-MD*`
      }, { quoted: msg });

      // Delete waiting message
      if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });

      // React after success
      await socket.sendMessage(sender, { react: { text: "☺️", key: msg.key } });

    } catch (error) {
      console.error("APK download error:", error);
      if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });
      await socket.sendMessage(sender, { text: "*😔 APK download nahi hui, dubara koshish karo!*" }, { quoted: msg });
      await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
    }
  }
};
