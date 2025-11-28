package vku.phatla;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class ClientManager {
    public static final ConcurrentHashMap<String, ClientHandler> onlineClients = new ConcurrentHashMap<>();
    public static final ConcurrentHashMap<String, Set<String>> groups = new ConcurrentHashMap<>();
}
