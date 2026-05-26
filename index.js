import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pkg from 'https-proxy-agent';
const { HttpsProxyAgent } = pkg;

const PROXIES = [
    'http://51.158.103.168:3128',
    'http://51.158.103.169:3128',
    'http://51.158.103.170:3128',
    'http://91.121.115.31:9300',
    'http://167.172.253.54:3128'
];

let proxyIndex = 0;

async function startSock() {
    if (proxyIndex >= PROXIES.length) {
        console.log('Todos los proxies fallaron. Saca 5 nuevos de proxyscrape.com/free-proxy-list');
        process.exit(1);
    }

    const proxy = PROXIES[proxyIndex];
    console.log(`Intentando con proxy ${proxyIndex + 1}/${PROXIES.length}: ${proxy}`);

    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        connectTimeoutMs: 60000,
        agent: new HttpsProxyAgent(proxy)
    });

    if (!state.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const code = await sock.requestPairingCode('50578391933');
            console.log(`\n✅ Código de 8 dígitos: ${code}`);
            console.log('Mételo en WhatsApp > Dispositivos vinculados > Vincular con número');
        } catch (e) {
            console.log('Error pidiendo código:', e.message);
            proxyIndex++;
            setTimeout(() => startSock(), 3000);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log('Conexión cerrada. Código:', statusCode);
            proxyIndex++;
            setTimeout(() => startSock(), 3000);
        } else if (connection === 'open') {
            console.log('✅ Bot conectado');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startSock();