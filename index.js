import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import axios from 'axios';

const TU_OPENWEATHER_KEY = 'PON_AQUI_TU_KEY';

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
            console.log('Desconectado. Reconectando:', shouldReconnect);
            if (shouldReconnect) startSock();
        } else if (connection === 'open') {
            console.log('Bot conectado ✅');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type!== 'notify') return;
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const from = m.key.remoteJid;
        const body = m.message.conversation || m.message.extendedTextMessage?.text || '';

        if (!body.startsWith('.')) return;

        const args = body.trim().slice(1).split(/ +/);
        const command = args.shift().toLowerCase();
        const q = args.join(' ');

        try {
            if (command === 'clima') {
                if (!q) {
                    return await sock.sendMessage(from, { text: 'Uso:.clima Madrid' });
                }
                let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${TU_OPENWEATHER_KEY}&units=metric&lang=es`);
                let data = res.data;
                let txt = `🌡️ ${data.name}\nTemp: ${data.main.temp}°C\nClima: ${data.weather[0].description}`;
                await sock.sendMessage(from, { text: txt });
            }

            if (command === 'tagall') {
                let group = await sock.groupMetadata(from);
                let members = group.participants.map(v => v.id);
                let texto = '📢 Tagall\n' + members.map(v => `@${v.split('@')[0]}`).join(' ');
                await sock.sendMessage(from, { text: texto, mentions: members });
            }

            if (command === 'kick') {
                let mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
                if (!mentioned || mentioned.length === 0) {
                    return await sock.sendMessage(from, { text: 'Menciona a alguien:.kick @usuario' });
                }
                await sock.groupParticipantsUpdate(from, mentioned, 'remove');
                await sock.sendMessage(from, { text: `Usuario expulsado`, mentions: mentioned });
            }

        } catch (err) {
            console.log('Error:', err.message);
            await sock.sendMessage(from, { text: 'Error ejecutando el comando' });
        }
    });
}

startSock();