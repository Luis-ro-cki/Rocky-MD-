import { createRequire } from 'module';
import pino from 'pino';
import qrcode from 'qrcode-terminal';

const require = createRequire(import.meta.url);
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        connectTimeoutMs: 60000
    });

    sock.ev.on('qr', (qr) => {
        console.log(`\n╭〔 📱 ROCKY-MD QR 〕━⬣`);
        qrcode.generate(qr, { small: true });
        console.log(`╰━━━━━━━━━━━━━━⬣\n`);
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log(`╭〔 ❌ DESCONECTADO 〕━⬣`);
            console.log(`│ Código: ${statusCode}`);
            console.log(`╰━━━━━━━━━━━━━━⬣`);
        } else if (connection === 'open') {
            console.log(`╭〔 ✅ ROCKY-MD CONECTADO 〕━⬣`);
            console.log(`│ Bot listo y activo`);
            console.log(`╰━━━━━━━━━━━━━━⬣`);
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startSock();