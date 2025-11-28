package vku.phatla;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.*;
import tools.jackson.databind.ObjectMapper;

public class Server {
    private static final int PORT = 12345;
    private static final ExecutorService threadPool = Executors.newFixedThreadPool(10);
    private static final ObjectMapper mapper = new ObjectMapper();
    private static Socket clientSocket;

    public static void main(String[] args) throws IOException {
        try(ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server listening on port 12345");
            while (true) {
                clientSocket = serverSocket.accept();
                System.out.println("Client connected: " + clientSocket.getInetAddress());
                threadPool.execute(new ClientHandler(clientSocket));
            }
        }catch(IOException e){
            System.out.println("Error from ServerSocket: " + e.getMessage());
        }
    }
}


