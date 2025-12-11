const fs = require('fs-extra');
if (fs.existsSync('.env'))
  require('dotenv').config({ path: __dirname + '/.env' });
const path = require("path");

module.exports = { 
    SESSION_ID: process.env.SESSION_ID || '',
    PREFIX: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "𝐆𝐈𝐅𝐓𝐄𝐃 𝐓𝐄𝐂𝐇",
    OWNER_NUMBER : process.env.OWNER_NUMBER || "",
    SUDO_NUMBERS : process.env.SUDO_NUMBERS || "",
    BOT_NAME : process.env.BOT_NAME || '𝐆𝐈𝐅𝐓𝐄𝐃 𝐌𝐃',
    FOOTER : process.env.FOOTER || 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɢɪғᴛᴇᴅ ᴛᴇᴄʜ',
    CAPTION : process.env.CAPTION || '©𝟐𝟎𝟐𝟒 𝐆𝐈𝐅𝐓𝐄𝐃 𝐌𝐃 𝐕𝟓',
    VERSION: process.env.VERSION || '5.0.0',
    BOT_PIC : process.env.BOT_PIC || 'https://gitcdn.giftedtech.co.ke/image/AZO_image.jpg',            
    MODE: process.env.MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'false',
    WARN_COUNT : process.env.WARN_COUNT || '3',
    TIME_ZONE: process.env.TIME_ZONE || "Africa/Nairobi",
    DM_PRESENCE : process.env.DM_PRESENCE || 'online',
    GC_PRESENCE : process.env.GC_PRESENCE || 'online',
    CHATBOT : process.env.CHATBOT || 'false',
    CHATBOT_MODE : process.env.CHATBOT_MODE || 'inbox',
    STARTING_MESSAGE : process.env.STARTING_MESSAGE || "true",
    ANTIDELETE : process.env.ANTIDELETE || 'indm',
    GOODBYE_MESSAGE : process.env.GOODBYE_MESSAGE || 'false',
    ANTICALL : process.env.ANTICALL || 'false',
    ANTICALL_MSG: process.env.ANTICALL_MSG || "*_📞 Auto Call Reject Mode Active. 📵 No Calls Allowed!_*",
    WELCOME_MESSAGE : process.env.WELCOME_MESSAGE || 'false',
    ANTILINK : process.env.ANTILINK || 'false',
    AUTO_LIKE_STATUS : process.env.AUTO_LIKE_STATUS || 'true',
    AUTO_READ_STATUS : process.env.AUTO_READ_STATUS || 'true',
    STATUS_LIKE_EMOJIS : process.env.STATUS_LIKE_EMOJIS || "💛,❤️,💜,🤍,💙",
    AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS || "false",   
    STATUS_REPLY_TEXT: process.env.STATUS_REPLY_TEXT || "*ʏᴏᴜʀ sᴛᴀᴛᴜs ᴠɪᴇᴡᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ✅*",             
    AUTO_REACT : process.env.AUTO_REACT || 'false',
    AUTO_REPLY : process.env.AUTO_REPLY || 'false',
    AUTO_READ_MESSAGES : process.env.AUTO_READ_MESSAGES || 'false',
    AUTO_BIO : process.env.AUTO_BIO || 'false',
    AUTO_BLOCK: process.env.AUTO_BLOCK || '212,233',
    YT: process.env.YT || 'youtube.com/@giftedtechnexus',
    NEWSLETTER_JID: process.env.NEWSLETTER_JID || '120363408839929349@newsletter',
    NEWSLETTER_URL: process.env.NEWSLETTER_URL || 'https://whatsapp.com/channel/0029Vb3hlgX5kg7G0nFggl0Y',
    BOT_REPO: process.env.BOT_REPO || 'mauricegift/gifted-md',
    PACK_NAME: process.env.PACK_NAME || '𝐆𝐈𝐅𝐓𝐄𝐃 𝐌𝐃',
    PACK_AUTHOR: process.env.PACK_AUTHOR || '𝐆𝐈𝐅𝐓𝐄𝐃 𝐓𝐄𝐂𝐇',
    
    // Session Generator Specific
    MAX_SESSIONS: process.env.MAX_SESSIONS || 50,
    SESSION_TIMEOUT: process.env.SESSION_TIMEOUT || 300000,
    CLEANUP_INTERVAL: process.env.CLEANUP_INTERVAL || 3600000,
    ALLOWED_COUNTRIES: process.env.ALLOWED_COUNTRIES || '254,255,256',
    PAIRING_CODE_LENGTH: process.env.PAIRING_CODE_LENGTH || 6,
    
    // CDN & API Endpoints
    GIFTED_CDS_API: process.env.GIFTED_CDS_API || 'https://apis.giftedtech.co.ke',
    DOWNLOAD_ENDPOINT: process.env.DOWNLOAD_ENDPOINT || '/api/download',
    AI_ENDPOINT: process.env.AI_ENDPOINT || '/api/ai/chat'
};

let fileName = require.resolve(__filename);
fs.watchFile(fileName, () => {
    fs.unwatchFile(fileName);
    console.log(`⚙️ Config file updated: ${__filename}`);
    delete require.cache[fileName];
    require(fileName);
});
