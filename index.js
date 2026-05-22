const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const fs = require('fs')

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Desconectado. Reconectando:', shouldReconnect)
      if (shouldReconnect) startSock()
    }
    
    if (connection === 'open') {
      console.log('Bot conectado ✅')
    }
  })

  // Pide el número si no está logueado
  if (!sock.authState.creds.registered) {
    const phone = process.env.PHONE_NUMBER
    
    if (!phone) {
      console.log('❌ Pon tu número en Render en la variable PHONE_NUMBER')
      console.log('Ejemplo: 5215512345678 sin + ni espacios')
      process.exit(0)
    }

    console.log('Generando código para:', phone)
    let code = await sock.requestPairingCode(phone)
    code = code.match(/.{1,4}/g).join('-')
    console.log('TU CÓDIGO DE 8 DÍGITOS:', code)
    console.log('Ve a WhatsApp > Dispositivos vinculados > Vincular con número de teléfono')
  }
}

startSock()