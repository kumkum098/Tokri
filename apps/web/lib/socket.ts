'use client';

import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from './store/auth';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  const token = useAuthStore.getState().accessToken;
  socket = io(SOCKET_URL, {
    path: '/api/socket.io',
    transports: ['websocket'],
    auth: { token },
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
