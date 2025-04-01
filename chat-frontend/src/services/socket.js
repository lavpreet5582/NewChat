import { io } from "socket.io-client";

const SOCKET_URL = "ws://localhost:8000/ws/chat/";


export const socket = (channel_name, token) => {
    return io(`${SOCKET_URL}${channel_name}/`, {
        transports: ["websocket"],
        auth: {
            token: token,
        },
    })
}