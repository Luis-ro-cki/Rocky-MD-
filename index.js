import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pkg from 'https-proxy-agent';
const { HttpsProxyAgent } = pkg;

const PROXIES = [
    'http://180.183.157.159:8080',
    'http://51.254.69.243:3128',
    'http://81.171.24.199:3128',
    'http://163.172.182.164:3128',
    'http://95.156.82.35:3128'
];

let proxyIndex = 0;

async function startSock() {
    if (proxyIndex >= PROXIES.length) {
        console.log('Todos los proxies fallaron. Saca 5 nuevos de proxyscrape.com');
        return;
    }

    const proxy = PROXIES[proxyIndex];
    console.log(`Intentando con proxy ${proxyIndex + 1}/${PROXIES.length}: ${proxy}`);

    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        browser: ['Chrome', 'Linux', '10.0.0'],
        connectTimeoutMs: 60000,
        agent: new HttpsProxyAgent(proxy)
    });

    if (!state.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const code = await sock.requestPairingCode('50578391933');
            console.log(`\nCódigo de 8 dígitos: ${code}`);
        } catch (e) {
            console.log('Error pidiendo código:', e.message);
            proxyIndex++;
            setTimeout(() => startSock(), 3000);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            proxyIndex++;
            setTimeout(() => startSock(), 3000);
        } else if (connection === 'open') {
            console.log('Bot conectado ✅');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startSock();