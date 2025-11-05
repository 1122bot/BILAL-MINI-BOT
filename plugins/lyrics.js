const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
  command: "lyrics",
  alias: ["lyric", "lirik"],
  react: "😇",
  desc: "Get song lyrics (Mini-MD Style)",
  category: "music",

  execute: async (sock, msg, { text, reply }) => {
    try {
      if (!text)
        return reply(
          "*APKO KISI SONG KI LYRICS CHAHIYE 🤔*\n*TO ESE LIKHO ☺️*\n\n*LYRICS ❮SONG NAME❯*\n\n*JAB AP ESE LIKHO GE 🙂 TO US SONG KI LYRICS MIL JAYE GE 🥰❤️*"
        );

      const api = `https://api.zenzxz.my.id/api/tools/lirik?title=${encodeURIComponent(text)}`;
      const res = await fetch(api);
      const json = await res.json();

      if (!json.success || !json.data?.result?.length)
        return reply("*IS SONG KI LYRICS NAHI MILI 🥺 KISI AUR SONG KA NAME LIKHO 😇*");

      const song = json.data.result[0];
      const title = song.trackName || song.name || text;
      const artist = song.artistName || "Unknown Artist";
      const album = song.albumName || "Unknown Album";
      const duration = song.duration ? `${song.duration}s` : "N/A";
      const lyrics = song.plainLyrics?.trim() || "No lyrics found 😢";

      const thumb = "https://i.ibb.co/4ZX9kTWy/BILAL-MD.jpg";

      const shortLyrics =
        lyrics.length > 900
          ? lyrics.substring(0, 900) + "\n\n...(reply *1* to get full lyrics as TXT file)"
          : lyrics;

      const caption = `
*👑 MINI-MD LYRICS 👑*

*🎵 NAME:* ${title}
*🎤 ARTIST:* ${artist}
*💿 ALBUM:* ${album}
*⏰ TIME:* ${duration}

*🎼 LYRICS:*
${shortLyrics}
`;

      const sentMsg = await sock.sendMessage(
        msg.chat,
        { image: { url: thumb }, caption: caption },
        { quoted: msg }
      );

      // reply "1" to get full lyrics file
      const listener = async (msgUpdate) => {
        try {
          const up = msgUpdate.messages?.[0];
          const body = up?.message?.conversation?.trim();
          const context = up?.messageContextInfo;

          if (body === "1" && context?.stanzaId === sentMsg.key.id) {
            const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
            fs.writeFileSync(fileName, `${title}\nby ${artist}\n\n${lyrics}`);

            await sock.sendMessage(
              msg.chat,
              {
                document: { url: fileName },
                mimetype: "text/plain",
                fileName: `${title}.txt`,
                caption: `🎶 *${title}* Lyrics file by Mini-MD`,
              },
              { quoted: up }
            );

            fs.unlinkSync(fileName);
            sock.ev.off("messages.upsert", listener);
          }
        } catch (e) {
          console.log("Lyrics listener error:", e);
        }
      };

      sock.ev.on("messages.upsert", listener);
      setTimeout(() => sock.ev.off("messages.upsert", listener), 180000);
    } catch (e) {
      console.error("Lyrics Error:", e);
      reply("❌ *LYRICS ERROR — DUBARA KOSHISH KARO 🥺*");
    }
  },
};
