// pseudo-code, không phải code hoàn chỉnh

import TcpSocket from 'react-native-tcp-socket';

function ChatScreen() {
  // state lưu socket và messages
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  // chạy 1 lần khi màn hình mount
  useEffect(() => {
    const s = TcpSocket.createConnection(
      { host: '192.0.0.1', port: 12345 }, // IP & port server TCP Java
      () => {
        console.log('Connected to server');
        // có thể gửi message "hello" để handshake
        const hello = { type: 'HELLO', username: 'user1' };
        s.write(JSON.stringify(hello) + '\n'); // thêm \n để server dễ tách gói
      },
    );

    // khi nhận data từ server
    s.on('data', data => {
      // data là Buffer, convert sang string
      const text = data.toString('utf-8');
      console.log('Raw data from server:', text);

      // tùy protocol: có thể 1 lần nhận nhiều JSON, cần tách theo \n
      const chunks = text.split('\n').filter(Boolean);
      chunks.forEach(chunk => {
        try {
          const msgObj = JSON.parse(chunk);

          // ví dụ msgObj = { type: 'CHAT', from: 'user2', content: 'hi' }
          if (msgObj.type === 'CHAT') {
            setMessages(prev => [...prev, msgObj]);
          }
        } catch (e) {
          console.log('JSON parse error:', e);
        }
      });
    });

    // xử lý lỗi
    s.on('error', error => {
      console.log('Socket error', error);
    });

    // khi server đóng kết nối
    s.on('close', () => {
      console.log('Socket closed');
    });

    setSocket(s);

    // cleanup khi rời màn hình
    return () => {
      s.destroy();
    };
  }, []);
}
