export function getWebSocketUrl(): string {
  // Check if we're in browser
  if (typeof window === 'undefined') {
    return 'ws://localhost:8080';
  }

  // Use environment variable if set (for ngrok)
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }

  // In production/network mode, use the current hostname
  const hostname = window.location.hostname;
  
  // If using ngrok (hostname contains ngrok.io or ngrok-free.app)
  if (hostname.includes('ngrok')) {
    // For ngrok, we need to use the WebSocket ngrok URL
    // This should be set in .env.local as NEXT_PUBLIC_WS_URL
    console.warn('⚠️ Using ngrok but NEXT_PUBLIC_WS_URL not set!');
    console.warn('   Set NEXT_PUBLIC_WS_URL in .env.local to your WebSocket ngrok URL');
    return 'ws://localhost:8080'; // Fallback
  }
  
  // If accessing via IP or network hostname, use that
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `ws://${hostname}:8080`;
  }

  // Default to localhost
  return 'ws://localhost:8080';
}
