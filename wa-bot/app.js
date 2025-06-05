const { Boom } = require('@hapi/boom');
const {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  makeWASocket
} = require('@whiskeysockets/baileys');

const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

// Inisialisasi Firebase
const serviceAccount = require('./utils/accountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ''
});

const db = admin.database();

// 🔢 Format nomor
function formatPhoneNumber(phoneNumber) {
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '62' + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith('62')) {
    cleanNumber = '62' + cleanNumber;
  }
  return `${cleanNumber}@s.whatsapp.net`;
}

// 📋 Ambil detail menu dari Firebase
async function getMenuDetails(orderList) {
  const menuDetails = [];

  try {
    const categoriesSnapshot = await db.ref('mie-hoog/menu').once('value');
    const categories = categoriesSnapshot.val();
    if (!categories) return menuDetails;

    const menuMap = {};
    for (const [catName, catMenus] of Object.entries(categories)) {
      for (const [menuKey, menuData] of Object.entries(catMenus)) {
        if (menuData?.id) {
          menuMap[menuData.id] = {
            name: menuData.menu_name || 'Unknown Menu',
            price: parseInt(menuData.menu_price || 0),
            category: catName
          };
        }
      }
    }

    for (const [menuId, quantity] of Object.entries(orderList)) {
      const data = menuMap[menuId];
      if (data) {
        menuDetails.push({
          name: data.name,
          price: data.price,
          quantity,
          subtotal: data.price * quantity
        });
      } else {
        menuDetails.push({
          name: `Menu tidak ditemukan (ID: ${menuId})`,
          price: 0,
          quantity,
          subtotal: 0
        });
      }
    }
  } catch (error) {
    console.error('Error getting menu details:', error);
  }

  return menuDetails;
}

// 🧾 Format pesan WhatsApp
function formatOrderMessage(orderData, menuDetails) {
  const orderDate = `${orderData.order_day}/${orderData.order_month}/${orderData.order_year}`;
  let message = `🍜 *PESANAN ANDA SEDANG DIPROSES* 🍜\n\n`;
  message += `📋 *Detail Pesanan:*\n`;
  message += `• ID Pesanan: ${orderData.id}\n`;
  message += `• Nama: ${orderData.cust_name}\n`;
  message += `• Meja: ${orderData.table_number}\n`;
  message += `• Tanggal: ${orderDate}\n\n`;
  message += `🍽️ *Menu yang Dipesan:*\n`;

  menuDetails.forEach((menu, index) => {
    message += `${index + 1}. ${menu.name}\n`;
    message += `   Qty: ${menu.quantity} x Rp${menu.price.toLocaleString('id-ID')}\n`;
    message += `   Subtotal: Rp${menu.subtotal.toLocaleString('id-ID')}\n\n`;
  });

  message += `💰 *Total: Rp${orderData.order_total.toLocaleString('id-ID')}*\n\n`;
  message += `⏰ Status: *SEDANG DIMASAK*\n`;
  message += `📍 Pesanan Anda sedang diproses di dapur. Harap menunggu ya!\n\n`;
  message += `Terima kasih telah memesan di Mie Hoog! 🙏`;

  return message;
}

// ✉️ Kirim notifikasi WhatsApp
async function sendOrderNotification(sock, orderData) {
  try {
    if (!orderData.telephone || !orderData.order_list) return;

    const jid = formatPhoneNumber(orderData.telephone);
    const menuDetails = await getMenuDetails(orderData.order_list);
    const message = formatOrderMessage(orderData, menuDetails);

    const logoPath = path.join(__dirname, 'assets', 'logo.JPG');
    if (fs.existsSync(logoPath)) {
      const buffer = fs.readFileSync(logoPath);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: message
      });
    } else {
      await sock.sendMessage(jid, { text: message });
    }

    console.log(`✅ Notification sent to ${orderData.cust_name} (${orderData.telephone})`);
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
  }
}

// 🔄 Dengarkan perubahan status order
function listenToOrderChanges(sock) {
  const ordersRef = db.ref('mie-hoog/order');

  ordersRef.on('child_changed', async (snapshot) => {
    const orderData = snapshot.val();
    if (orderData?.order_status === 2) {
      setTimeout(() => sendOrderNotification(sock, orderData), 100);
    }
  });

  ordersRef.on('child_added', async (snapshot) => {
    const orderData = snapshot.val();
    if (orderData?.order_status === 2) {
      setTimeout(() => sendOrderNotification(sock, orderData), 1000);
    }
  });

  console.log('🔄 Listening to order status changes...');
}

// 🚀 Jalankan bot WhatsApp
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📱 Scan QR Code berikut untuk login:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== 401;
      console.log('❌ Connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ WhatsApp connected!');
      listenToOrderChanges(sock);
    }
  });
}

// start bot
console.log('🚀 Starting WhatsApp Bot...');
startBot();