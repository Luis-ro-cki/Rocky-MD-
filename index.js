import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent'; // npm i https-proxy-agent

const TU_OPENWEATHER_KEY = 'PON_AQUI_TU_KEY';
const NUMERO = '50578391933'; // pon tu número con código país

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        browser: ['Chrome', 'Linux', '10.0.0'],
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        // Descomenta la siguiente línea si DuckCloud te bloquea:
        // agent: new HttpsProxyAgent('http://usuario:pass@proxy:port')
    });

    if (!state.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const code = await sock.requestPairingCode(NUMERO);
            console.log(`\nCódigo de 8 dígitos: ${code}`);
            console.log('Ponlo en WhatsApp > Dispositivos vinculados > Vincular con número');
        } catch (e) {
            console.log('Error pidiendo código:', e);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log('Desconectado. Código:', statusCode);
            if (statusCode !== DisconnectReason.loggedOut) {
                setTimeout(() => startSock(), 5000);
            }
        } else if (connection === 'open') {
            console.log('Bot conectado ✅');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startSock();