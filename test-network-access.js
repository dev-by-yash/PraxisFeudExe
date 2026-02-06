const os = require('os');

console.log('🌐 Network Configuration Check\n');

// Get all network interfaces
const interfaces = os.networkInterfaces();

console.log('📡 Your computer\'s IP addresses:');
console.log('================================\n');

Object.keys(interfaces).forEach(ifname => {
  interfaces[ifname].forEach(iface => {
    // Skip internal and non-IPv4 addresses
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`✅ ${ifname}: ${iface.address}`);
      console.log(`   Use this on your phone: http://${iface.address}:3000`);
      console.log(`   WebSocket will connect to: ws://${iface.address}:8080\n`);
    }
  });
});

console.log('🔥 Next Steps:');
console.log('==============');
console.log('1. Make sure Next.js is running with: npm run dev -- --host');
console.log('2. Make sure WebSocket server is running: node server/websocket.js');
console.log('3. On your phone, open the URL shown above');
console.log('4. If it doesn\'t work, check Windows Firewall settings\n');

console.log('🛡️  Firewall Fix (run as Administrator):');
console.log('==========================================');
console.log('netsh advfirewall firewall add rule name="WebSocket Port 8080" dir=in action=allow protocol=TCP localport=8080');
console.log('netsh advfirewall firewall add rule name="Next.js Port 3000" dir=in action=allow protocol=TCP localport=3000\n');
