package vku.phatla;

import tools.jackson.databind.ObjectMapper;
import vku.phatla.pojo.SocketProtocol;
import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class ClientHandler implements Runnable {
    private final Socket socket;
    private DataInputStream in;
    private DataOutputStream out;
    private final ObjectMapper mapper = new ObjectMapper();
    private String username;

    public ClientHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            in = new DataInputStream(socket.getInputStream());
            out = new DataOutputStream(socket.getOutputStream());

            login();
            // handle chat
            while (true) {
                SocketProtocol msg = readMessage();   // đọc frame + JSON
                handleMessage(msg);
            }

        } catch (EOFException e) {
            System.out.println("Client disconnected: " + username);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            cleanup();
        }
    }

    private void login() throws Exception {
        SocketProtocol loginMsg = readMessage();
        if (!"login".equals(loginMsg.type)) {
            throw new Exception("First message must be login");
        }
        this.username = loginMsg.payload.from;
        ClientManager.onlineClients.put(username, this);
        System.out.println("User logged in: " + username);
        System.out.println("List online clients: " + ClientManager.onlineClients.keySet());
        System.out.println("-------------------------------");
    }

    private SocketProtocol readMessage() throws IOException {
        int frameLength = in.readInt();
        byte[] data = new byte[frameLength];
        in.readFully(data);
        String json = new String(data, StandardCharsets.UTF_8);
        return mapper.readValue(json, SocketProtocol.class);
    }

    private void handleMessage(SocketProtocol msg) throws IOException {
        if ("chat".equals(msg.type)) {

            System.out.println("[" + username + " → " + msg.payload.to + "]: " + msg.payload.content);

            ClientHandler receiver = ClientManager.onlineClients.get(msg.payload.to);
            if (receiver != null) {
                receiver.send(msg);   // gửi cho người nhận
            } else {
                System.out.println("User offline: " + msg.payload.to);
            }
        }
    }

    public void send(SocketProtocol msg) throws IOException {
        byte[] jsonBytes = mapper.writeValueAsBytes(msg);
        out.writeInt(jsonBytes.length);
        out.write(jsonBytes);
        out.flush();
    }

    private void cleanup() {
        try {
            if (username != null) {
                ClientManager.onlineClients.remove(username);
            }

            if (socket != null && !socket.isClosed()) socket.close();

        } catch (IOException ignored) {}
    }

}
