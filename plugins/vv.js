module.exports = {
  command: 'vv',
  description: 'Owner Only - Retrieve and resend view-once or private media (photo, video, or audio).',
  category: 'main',
  react: '🥺',

  /**
   * Execute command
   */
  execute: async (client, message, args, number) => {
    const from = message.key.remoteJid;
    const isOwner = message.key.fromMe; // Check if the sender is the bot owner
    const match = message; // Just for cleaner reference

    try {
      // 🥺 React when the command is used
      await client.sendMessage(from, { react: { text: "🥺", key: message.key } });

      // 🔒 Restrict command to owner only
      if (!isOwner) {
        await client.sendMessage(from, { react: { text: "😎", key: message.key } });
        return await client.sendMessage(from, {
          text: "*🚫 This command is only for the bot owner.*"
        }, { quoted: message });
      }

      // 🧾 Make sure the command is replying to a message
      if (!match.quoted) {
        await client.sendMessage(from, { react: { text: "☺️", key: message.key } });
        return await client.sendMessage(from, {
          text: "*Please reply to a private or view-once photo, video, or audio message first.*\n\n" +
                "*Then type:* vv\n\n" +
                "*And watch the magic 😎*"
        }, { quoted: message });
      }

      // 📥 Download quoted (view-once or private) media
      const buffer = await match.quoted.download();
      const mtype = match.quoted.mtype;
      const options = { quoted: message };
      let messageContent = {};

      // 🎬 Detect media type and prepare message
      switch (mtype) {
        case "imageMessage":
          messageContent = {
            image: buffer,
            caption: match.quoted.text || "📸 Recovered Image",
            mimetype: match.quoted.mimetype || "image/jpeg"
          };
          break;

        case "videoMessage":
          messageContent = {
            video: buffer,
            caption: match.quoted.text || "🎬 Recovered Video",
            mimetype: match.quoted.mimetype || "video/mp4"
          };
          break;

        case "audioMessage":
          messageContent = {
            audio: buffer,
            mimetype: "audio/mp4",
            ptt: match.quoted.ptt || false
          };
          break;

        default:
          await client.sendMessage(from, { react: { text: "😥", key: message.key } });
          return await client.sendMessage(from, {
            text: "*Please reply to a valid view-once or private media message (photo, video, or audio).*"
          }, { quoted: message });
      }

      // 📤 Send recovered media
      await client.sendMessage(from, messageContent, options);

      // 😃 React when done successfully
      await client.sendMessage(from, { react: { text: "😃", key: message.key } });

    } catch (error) {
      console.error("vv Error:", error);
      await client.sendMessage(from, { react: { text: "😔", key: message.key } });
      await client.sendMessage(from, {
        text: "❌ Error occurred:\n" + error.message
      }, { quoted: message });
    }
  }
};
