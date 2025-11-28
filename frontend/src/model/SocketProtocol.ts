export type SocketProtocol = {
  type: String,
  payload: Payload
}

type Payload = {
  from: String,
  to: String,
  content: String,
  date: Date
}
