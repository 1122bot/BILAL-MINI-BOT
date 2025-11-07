const axios = require("axios");

function formatDuration(ms) {
  if (!ms) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

module.exports = {
  command: "fb",
  desc: "📘 Download Facebook videos (HD / SD / Audio)",
  category: "download",
  react: "☺️",

  async execute(sock, msg, args) {
    try {
      const from = msg.key.remoteJid;
      const pushname = msg.pushName || "User";
      const url = args[0];

      if (!url || !url.includes("facebook.com")) {
        return await sock.sendMessage(from, {
          text: `*AP KO KOI FACEBOOK KI VIDEO DOWNLOAD KARNI HAI 🥺 TO US VIDEO KA LINK COPY KAR LO FACEBOOK  SE 😊* \n*AUR PHIR ESE LIKHO 😇* \n\n *FB ❮FACEBOK VIDEO LINK❯* \n\n *TO APKI VIDEO DOWNLOAD KAR KE 😃 YAHA SEND KAR DI JAYE GE OK 🥰❤️*`
        }, { quoted: msg });
      }

      const { data } = await axios.get(`https://www.varshade.biz.id/api/downloader/facebook?url=${encodeURIComponent(url)}`);

      if (!data.status || !data.medias) {
        return await sock.sendMessage(from, {
          text: "*APKI FACEBOOK VIDEO NAHI MIL RAHI 🥺❤️*"
        }, { quoted: msg });
      }

      const { title, author, duration, thumbnail, medias } = data;
      const hd = medias.find(v => v.quality?.toLowerCase() === "hd");
      const sd = medias.find(v => v.quality?.toLowerCase() === "sd");
      const audio = medias.find(v => v.type === "audio");

      const caption = `
*👑 FACEBOOK VIDEO INFORMATION 👑*

 *👑 VIDEO NAME 👑*
 *${title || "N/A"}*
 
*👑 TIME :❯ ${formatDuration(duration)}*

*👑 IMPORTANT TOPIC 👑*
*PEHLE MERE IS MSG KO MENTION KARO LAZMIII PLZ 🥺 AUR PHIR AGAR NUMBER ❮1❯ LIKHO GE TO VIDEO NORMAL QUALITY ME AYE GE 🙂 AGAR NUMBER ❮2❯ LIKHO GE TO VIDEO ❮ HD ❯ QUALITY ME AYE GE 😍 AGAR NUMBER ❮2❯ LIKHO GE TO VIDEO KA SIRF ❮AUDIO❯ AYE GA BAS 😌 AGE APKI MERZI 🥰*

*👑 ❮1❯ NORMAL QUALTIY 👑*
*👑 ❮2❯ HD QUALITY 👑*
*👑 ❮3❯ AUDIO ONLY 👑*

*⟪════════ ♢.✰.♢ ════════⟫*
*👑 BILAL-MD MINI BOT 👑*
*⟪════════ ♢.✰.♢ ════════⟫*
`;

      const sent = await sock.sendMessage(from, {
        image: { url: thumbnail },
        caption
      }, { quoted: msg });

      const msgId = sent.key.id;

      const listener = async (update) => {
        const mek = update.messages[0];
        if (!mek.message) return;

        const isReply = mek.message?.extendedTextMessage?.contextInfo?.stanzaId === msgId;
        if (!isReply) return;

        const text = mek.message.conversation || mek.message.extendedTextMessage?.text;
        const choice = text.trim();

        await sock.sendMessage(from, { react: { text: "😍", key: mek.key } });

        switch (choice) {
          case "1":
            if (!hd) return sock.sendMessage(from, { text: "*HD QUALITY VIDEO NAHI MILI 🥺 AP NORMAL QUALITY DOWNLOAD KARO NUMBER ❮1❯ LIKHO 😇*" }, { quoted: mek });
            await sock.sendMessage(from, { video: { url: hd.url }, caption: "*👑 HD QUALITY VIDEO 👑*" }, { quoted: mek });
            break;
          case "2":
            if (!sd) return sock.sendMessage(from, { text: "*NORMAL QUALITY VIDEO NAHI MILI 🥺 AP HD QUALITY DOWNLOAD KARO NUMBER ❮2❯ LIKHO 😇" }, { quoted: mek });
            await sock.sendMessage(from, { video: { url: sd.url }, caption: "*👑 NORMAL QUALITY VIDEO 👑*" }, { quoted: mek });
            break;
          case "3":
            if (!audio) return sock.sendMessage(from, { text: "AUDIO DOWNLOAD NAHI HO RAHA SORRY 🥺❤️*" }, { quoted: mek });
            await sock.sendMessage(from, { audio: { url: audio.url }, mimetype: "audio/mp4" }, { quoted: mek });
            break;
          default:
            await sock.sendMessage(from, { text: "*US MSG ME IMPORTANT TOPIC LIKHA THA WO NAHI PARHA KIA 🤨*\n\n*PEHLE MERE USS MSG KO MENTION KARO LAZMIII  😤*\n\n*AUR PHIR AGAR NUMBER ❮1❯ LIKHO GE TO VIDEO NORMAL QUALITY ME AYE GE 🙂 AGAR NUMBER ❮2❯ LIKHO GE TO VIDEO ❮ HD ❯ QUALITY ME AYE GE 😍 AGAR NUMBER ❮2❯ LIKHO GE TO VIDEO KA SIRF ❮AUDIO❯ AYE GA BAS 😌 AGE APKI MERZI 🥰*" }, { quoted: mek });
        }
      };

      sock.ev.on("messages.upsert", listener);
      setTimeout(() => sock.ev.off("messages.upsert", listener), 2 * 60 * 1000);

    } catch (e) {
      console.error(e);
      await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ Error: ${e.message}` }, { quoted: msg });
    }
  }
};
