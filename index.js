const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const readline = require('readline')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })
  
  sock.ev.on('creds.update', saveCreds)
  
  sock.ev.on('connection.update', async (update) => {
    if(update.connection === 'close') console.log('Desconectado')
    if(update.connection === 'open') console.log('Bot conectado ✅')
  })

  // Pide el número si no está logueado
  if (!sock.authState.creds.registered) {
    const phone = await new Promise(resolve => rl.question('Pon tu número con código país, ej 5215512345678: ', resolve))
    let code = await sock.requestPairingCode(phone)
    code = code.match(/.{1,4}/g).join('-') // lo formatea 1234-5678
    console.log('TU CÓDIGO DE 8 DÍGITOS:', code)
    console.log('Ve a WhatsApp > Dispositivos vinculados > Vincular con número de teléfono')
  }
}

startBot()