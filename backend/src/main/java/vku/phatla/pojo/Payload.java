package vku.phatla.pojo;

public class Payload {
    public String from;
    public String to;
    public String content;
    public Payload(){};
    public Payload(String from, String to, String content){
        this.from = from;
        this.to = to;
        this.content = content;
    }
}
