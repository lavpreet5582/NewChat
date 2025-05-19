import { io } from "socket.io-client";
const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/chat/"; // WebSocket URL
const SOCKET_URL = `${wsUrl}/chat/`;


export const socket = (channel_name, token) => {
    return io(`${SOCKET_URL}${channel_name}/`, {
        transports: ["websocket"],
        auth: {
            token: token,
        },
    })
}