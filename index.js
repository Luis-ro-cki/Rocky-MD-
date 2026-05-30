const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const BOT_NAME = '𝕯𝖊𝖛𝕷𝖚𝖎𝖘𝖎𝖙𝖔';

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "devluisitobot"
  })
});

client.on('qr', (qr) => {
  console.log('Escanea este QR con tu WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log(`${BOT_NAME} está online ✅`);
});

client.on('message', async (msg) => {
  const body = msg.body.toLowerCase();
  
  if (body === 'ping') {
    msg.reply(`pong 🏓 - ${BOT_NAME} activo`);
  }
  
  if (body === 'help') {
    msg.reply(`Comandos de ${BOT_NAME}:\nping - test\nhelp - este menú`);
  }
});

client.initialize();