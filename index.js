import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        connectTimeoutMs: 60000
    });

    if (!state.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
            const code = await sock.requestPairingCode('50578391933');
            console.log(`\n✅ Código de 8 dígitos: ${code}`);
        } catch (e) {
            console.log('Error pidiendo código:', e.message);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log('Conexión cerrada. Código:', statusCode);
        } else if (connection === 'open') {
            console.log('✅ Bot conectado');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startSock();