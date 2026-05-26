import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import axios from 'axios';
import pkg from 'https-proxy-agent';
const { HttpsProxyAgent } = pkg;

const TU_OPENWEATHER_KEY = 'PON_AQUI_TU_KEY';
const NUMERO = '50578391933'; // tu número de Nicaragua

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        browser: ['Chrome', 'Linux', '10.0.0'],
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        // Descomenta la línea de abajo SOLO si DuckCloud te bloquea:
        // agent: new HttpsProxyAgent('http://usuario:pass@proxy:port')
    });

    // Genera código de 8 dígitos si no estás logueado
    if (!state.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const code = await sock.requestPairingCode(NUMERO);
            console.log(`\nCódigo de 8 dígitos: ${code}`);
            console.log('Ve a WhatsApp > Dispositivos vinculados > Vincular con número de teléfono');
        } catch (e) {
            console.log('Error pidiendo código:', e);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log('Desconectado. Código:', statusCode);
            if (statusCode!== DisconnectReason.loggedOut) {
                setTimeout(() => startSock(), 5000);
            }
        } else if (connection === 'open') {
            console.log('Bot conectado ✅');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Aquí van tus comandos.clima,.tagall,.kick
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        if (text === '.ping') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Pong 🏓' });
        }
    });
}

startSock();