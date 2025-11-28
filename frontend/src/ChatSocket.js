// ChatSocket.js
import TcpSocket from 'react-native-tcp-socket';

class ChatSocket {
  socket = null;
  listeners = {
    onMessage: null,
    onConnect: null,
    onClose: null,
    onError: null,
  };

  connect(host, port) {
    return new Promise((resolve, reject) => {
      this.socket = TcpSocket.createConnection({ host, port }, () => {
        if (this.listeners.onConnect) this.listeners.onConnect();
        resolve();
      });

      // receive data
      this.socket.on('data', data => {
        const text = data.toString('utf-8');
        const chunks = text.split('\n').filter(Boolean);

        chunks.forEach(chunk => {
          try {
            const msg = JSON.parse(chunk);
            if (this.listeners.onMessage) this.listeners.onMessage(msg);
          } catch (e) {
            console.log('JSON parse error:', e);
          }
        });
      });

      this.socket.on('error', err => {
        if (this.listeners.onError) this.listeners.onError(err);
        reject(err);
      });

      this.socket.on('close', () => {
        if (this.listeners.onClose) this.listeners.onClose();
      });
    });
  }

  send(obj) {
    if (!this.socket) return;
    const json = JSON.stringify(obj);
    this.socket.write(json + '\n');
  }

  close() {
    if (this.socket) this.socket.destroy();
  }

  onMessage(callback) {
    this.listeners.onMessage = callback;
  }

  onConnect(callback) {
    this.listeners.onConnect = callback;
  }

  onClose(callback) {
    this.listeners.onClose = callback;
  }

  onError(callback) {
    this.listeners.onError = callback;
  }
}

export default new ChatSocket();
