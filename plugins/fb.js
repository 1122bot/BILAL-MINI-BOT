const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadFacebookVideo(url) {
    const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl, { timeout: 40000 });

    if (!res.data || res.data.status !== 200 || !res.data.success || !res.data.result) {
        throw new Error("Invalid API response");
    }

    return res.data.result.hd_video || res.data.result.sd_video;
}

async function saveVideo(url) {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `fb_${Date.now()}.mp4`);
    const response = await axios({ url, method: "GET", responseType: "stream" });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });

    return filePath;
}

module.exports = {
    command: 'fb',
    alias: ["facebook","fb1","fb2","fbdl","fbvideo","facebookvideo","lite","fvid","fvide","fvideo","fbdlvideo"],
    description: "Download Facebook videos",
    category: "download",
    usage: ".fb <Facebook URL>",
    execute: async (socket, msg, args) => {
        const sender = msg.key.remoteJid;
        const text = args[0];

        try {
            if (!text) return await socket.sendMessage(sender, {
                text: "*APKO FACEBOOK KI VIDEO DOWNLOAD KARNA HAI 🥺*\n*TOH AP AISE LIKHO ☺️* \n\n *FB ❮FACEBOOK VIDEO LINK❯* \n\n *TO APKI FACEBOOK VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰❤️*"
            }, { quoted: msg });

            if (!text.includes("facebook.com")) return await socket.sendMessage(sender, {
                text: "⚠️ Invalid Facebook URL."
            }, { quoted: msg });

            // Waiting message
            const waitMsg = await socket.sendMessage(sender, { text: "*APKI FACEBOOK VIDEO DOWNLOAD HO RAHI HAI ☺️ THORA SA INTAZAR KARE...❤️*" }, { quoted: msg });
            await socket.sendMessage(sender, { react: { text: "😃", key: waitMsg.key } });

            const fbvid = await downloadFacebookVideo(text);
            const filePath = await saveVideo(fbvid);

            // Send video
            await socket.sendMessage(sender, {
                video: { url: filePath },
                mimetype: "video/mp4",
                caption: "*👑 BY :❯ BILAL-MD 👑*"
            }, { quoted: msg });

            // React after success
            await socket.sendMessage(sender, { react: { text: "☺️", key: msg.key } });

            // Delete waiting message
            await socket.sendMessage(sender, { delete: waitMsg.key });

            // Remove local file
            fs.unlinkSync(filePath);

        } catch (e) {
            console.error("Facebook download error:", e);
            await socket.sendMessage(sender, { text: "😔 Video download nahi hui." }, { quoted: msg });
        }
    }
};
