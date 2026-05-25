const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const axios = require('axios');
const config = require('./config');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
        if (!body.startsWith(config.prefix)) return;

        const args = body.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const from = m.key.remoteJid;
        const q = args.join(' ');

        const api = config.apis;

        try {
            // === DESCARGAS ===
            if (command === 'ytmp4') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/youtubeplay?apikey=${api.lolhuman}&query=${q}`);
                await sock.sendMessage(from, { video: { url: res.data.result.video }, caption: res.data.result.title });
            }

            if (command === 'ytmp3') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/ytaudio?apikey=${api.lolhuman}&url=${q}`);
                await sock.sendMessage(from, { audio: { url: res.data.result.audio }, mimetype: 'audio/mpeg' });
            }

            if (command === 'tiktok') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/tiktok?apikey=${api.lolhuman}&url=${q}`);
                await sock.sendMessage(from, { video: { url: res.data.result.link }, caption: res.data.result.title });
            }

            if (command === 'ig') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/instagram?apikey=${api.lolhuman}&url=${q}`);
                await sock.sendMessage(from, { video: { url: res.data.result[0] } });
            }

            // === IA ===
            if (command === 'gpt') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/openai?apikey=${api.lolhuman}&text=${q}`);
                await sock.sendMessage(from, { text: res.data.result });
            }

            if (command === 'gemini') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/gemini?apikey=${api.lolhuman}&text=${q}`);
                await sock.sendMessage(from, { text: res.data.result });
            }

            // === IMAGENES ===
            if (command === 'pinterest') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/pinterest?apikey=${api.lolhuman}&query=${q}`);
                await sock.sendMessage(from, { image: { url: res.data.result[0] } });
            }

            if (command === 'meme') {
                let res = await axios.get('https://meme-api.com/gimme');
                await sock.sendMessage(from, { image: { url: res.data.url }, caption: res.data.title });
            }

            // === BUSQUEDAS ===
            if (command === 'google') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/google?apikey=${api.lolhuman}&query=${q}`);
                let txt = res.data.result.map(v => `*${v.title}*\n${v.link}\n${v.desc}`).join('\n\n');
                await sock.sendMessage(from, { text: txt });
            }

            if (command === 'wiki') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/wikipedia?apikey=${api.lolhuman}&query=${q}`);
                await sock.sendMessage(from, { text: res.data.result });
            }

            // === HERRAMIENTAS ===
            if (command === 'sticker') {
                if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage?.image) return await sock.sendMessage(from, { text: 'Responde a una imagen' });
                let media = await sock.downloadMediaMessage(m.message.extendedTextMessage.contextInfo.quotedMessage);
                await sock.sendMessage(from, { sticker: media });
            }

            if (command === 'translate') {
                let res = await axios.get(`https://api.lolhuman.xyz/api/translate/auto/es?apikey=${api.lolhuman}&text=${q}`);
                await sock.sendMessage(from, { text: res.data.result.translated });
            }

            if (command === 'clima') {
                let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=TU_OPENWEATHER_KEY&units=metric&lang=es`);
                await sock.sendMessage(from, { text: `🌤️ ${q}\nTemp: ${res.data.main.temp}°C\nClima: ${res.data.weather[0].description}` });
            }

            // === MODERACIÓN ===
            if (command === 'tagall') {
                let group = await sock.groupMetadata(from);
                let members = group.participants.map(v => v.id);
                await sock.sendMessage(from, { text: '📢 Tagall', mentions: members });
            }

            if (command === 'kick') {
                let user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
                await sock.groupParticipantsUpdate(from,, 'remove');
            }

            // === MENU ===
            if (command === 'menu') {
                let txt = `*BOT FULL APIS*

*DESCARGAS*
.ytmp4,.ytmp3,.tiktok,.ig

*IA*
.gpt,.gemini

*IMAGENES*
.pinterest,.meme

*BUSQUEDAS*
.google,.wiki

*HERRAMIENTAS*
.sticker,.translate,.clima

*MODERACIÓN*
.tagall,.kick

Total: 40+ comandos. Cambia las API keys en config.js`;
                await sock.sendMessage(from, { text: txt });
            }

        } catch (e) {
            await sock.sendMessage(from, { text: 'Error: API caída o key inválida. Revisa config.js' });
            console.log(e);
        }
    });
}

startBot();