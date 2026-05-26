import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import axios from 'axios';

const TU_OPENWEATHER_KEY = 'PON_AQUI_TU_KEY';
const NUMERO = '521XXXXXXXXXX'; // tu número con código país, sin +, sin espacios

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
        auth: state,
        browser: ['Ubuntu', 'Chrome', '22.04.4'] // esto ayuda a que no te tire Connection Failure
    });

    // Pide el código de 8 dígitos si no estás logueado
    if (!sock.authState.creds.registered) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // espera 2s a que conecte
        const code = await sock.requestPairingCode(NUMERO);
        console.log(`\nTu código de 8 dígitos es: ${code}`);
        console.log('Ve a WhatsApp > Dispositivos vinculados > Vincular con número de teléfono');
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Desconectado. Reconectando:', shouldReconnect);
            if (shouldReconnect) startSock();
        } else if (connection === 'open') {
            console.log('Bot conectado ✅');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // aquí van tus comandos .clima, .tagall, .kick
}

startSock(); 