// App.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';
// import { SocketProtocol } from './src/SocketProtocol';
import { SocketProtocol } from "./src/model/SocketProtocol"

const socketProtocol = {
  type: String,
  payload: {
    from: String,
    to: String,
    content: String,
  },
};
export default function App() {
  const [status, setStatus] = useState('Connecting...');
  const [serverMsg, setServerMsg] = useState('');
  const [socket, setSocket] = useState<TcpSocket.Socket | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let socket: TcpSocket.Socket
    const s: TcpSocket.Socket = TcpSocket.createConnection(
      {
        host: '10.0.2.2', // localhost android to localhost pc
        port: 12345,
      },
      () => {
        console.log('Connected to server!');
        s.setEncoding('binary');
        setSocket(s);


        setStatus('Connected to server');
      },
    );

    // Nhận data từ server
    s.on('data', (data: any) => {
      const msg = data.toString('utf-8');
      console.log('Received:', msg);
      setServerMsg(msg);
    });

    // Lỗi socket
    s.on('error', (error: Error) => {
      console.log('Socket error:', error);
      setStatus('Socket error (Xem log)');
    });

    // Server đóng kết nối
    s.on('close', () => {
      console.log('Socket closed');
      setStatus('Connection closed');
    });

    return () => {
      s.destroy();
    };
  }, []);

  const sendJsonMessage = () => {
    if (!socket) {
      console.log('⚠️ Socket chưa sẵn sàng');
      return;
    }

    const msg: SocketProtocol = {
      type: "login",
      payload: {
        from: message,
        to: "",
        content: "",
        date: new Date()
      }
    }
    // 2. Chuyển JSON → string
    const jsonString = JSON.stringify(msg);

    // 3. Encode UTF-8 → bytes
    const jsonBytes = Buffer.from(jsonString, 'utf8');

    // 4. Tạo length-prefix buffer
    const buffer = Buffer.alloc(4 + jsonBytes.length);
    buffer.writeUInt32BE(jsonBytes.length, 0); // ghi 4 byte độ dài
    jsonBytes.copy(buffer, 4); // copy JSON vào sau

    // 5. Gửi qua socket
    socket.write(buffer);
    console.log(buffer);

    // clear input
    setMessage('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Status: {status}</Text>

      <View style={{ marginTop: 20 }}>
        <Text>Message from server:</Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>{serverMsg}</Text>
        <TextInput
          style={{ borderColor: '00ff00', borderWidth: 2 }}
          value={message}
          editable
          multiline
          onChangeText={text => {
            setMessage(text);
          }}
        ></TextInput>
        <Button title="Send" onPress={sendJsonMessage}></Button>
      </View>
    </View>
  );
}
