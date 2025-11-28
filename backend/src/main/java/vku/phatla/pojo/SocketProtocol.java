package vku.phatla.pojo;

public class SocketProtocol {
    public String type;
    public Payload payload;
    public SocketProtocol(){};
    public SocketProtocol(String type, Payload payload){
        this.type = type;
        this.payload = payload;
    }

}
