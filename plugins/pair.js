const axios = require("axios");
const config = require("../config");

// Heroku App URL
const HEROKU_APP_URL = 'https://mini-inconnu-xd-v2.onrender.com';

module.exports = {
  command: "pair",
  desc: "Get pairing code for mini inconnu xd AI bot",
  use: ".pair 923078071982",
  filename: __filename,

  execute: async (socket, msg, args) => {
    const messages = {
      invalid: "APKO BILAL-MINI BOT KA PAIR CODE CHAHYE 🤔*\n*TO AP ESE LIKHO ☺️\n\n*PAIR +923078071982*\n\n *JAB AP ESE LIKHO GE 😇 TO APKO BILAL-MD MINI BOT KA PAIR CODE MIL JAYE GA 😃 WO AP APNI WHATSAPP ME LOGIN KAR LENA 😍 APKA MINI BOT ACTIVATE HO JAYE GA 🥰* ",
      failed: "*THORI DER BAD KOSHISH KARE 🥺❤️*",
      done: "*👑 BILAL-MD MINI BOT 👑*\nn *PAIR CODE COMPLETED 😇❤️*",
      error: "*APKE NUMBER PER PAIR CODE CONNECT NAHI HO RAHA ☹️",
    };

    try {
      // Get sender details
      const senderId = msg.sender || msg.key?.participant || msg.key?.remoteJid || "";
      const senderNumber = senderId.split("@")[0];

      // Use args or fallback
      const phoneNumber = args.length > 0 ? args.join(" ").trim() : "";

      if (!phoneNumber) {
        return socket.sendMessage(
          msg.key?.remoteJid || senderId,
          {
            text: `*BILAL-MD MINI BOT APKE NUMBER PER LAGANE KE LIE ☺️*\n*AP ESE LIKHO 😇*\n\n *.PAIR ❮+923078071982❯*\n\n *IS NUMBER KI JAGAH AP APNA NUMBER LIKHNA OK 😊 FIR APKO PAIRING CODE MIL JAYE GA 😃 AP WO PAIRING CODE APNE WHATSAPP ME LOGIN KAR LENA 😌 PHIR BILAL-MD MINI BOT APKE NUMBER PER ACTIVE HO JAYE GA 😍*`,
          },
          { quoted: msg }
        );
      }

      if (!phoneNumber.match(/^\+?\d{10,15}$/)) {
        return await socket.sendMessage(
          msg.key?.remoteJid || senderId,
          { text: messages.invalid },
          { quoted: msg }
        );
      }

      const baseUrl = `${HEROKU_APP_URL}/code?number=`;
      const response = await axios.get(`${baseUrl}${encodeURIComponent(phoneNumber)}`);

      if (!response.data || !response.data.code) {
        return await socket.sendMessage(
          msg.key?.remoteJid || senderId,
          { text: messages.failed },
          { quoted: msg }
        );
      }

      const pairingCode = response.data.code;

      const otpCaption = `${pairingCode}`;

      await socket.sendMessage(
        msg.key?.remoteJid || senderId,
        { text: otpCaption },
        { quoted: msg }
      );

      await new Promise((r) => setTimeout(r, 2000));
      await socket.sendMessage(
        msg.key?.remoteJid || senderId,
        { text: pairingCode },
        { quoted: msg }
      );
    } catch (error) {
      console.error("Pair command error:", error);
      const senderId = msg.sender || msg.key?.participant || msg.key?.remoteJid || "";
      await socket.sendMessage(
        msg.key?.remoteJid || senderId,
        { text: messages.error },
        { quoted: msg }
      );
    }
  },
};
