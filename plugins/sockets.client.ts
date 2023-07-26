import { io, ManagerOptions, SocketOptions } from 'socket.io-client';

import type { ISocket } from 'types/sockets';

export default defineNuxtPlugin(nuxtApp => {
    const { apiURL } = nuxtApp.$config.public;

    const getAuth = () => ({
        token: cookies.get('HX_AT') || cookies.get('HX_GUAST') || ''
    });

    const socket: ISocket = io(apiURL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        auth: getAuth()
    }) as ISocket;

    socket.reconnect = () => {
        socket.disconnect();

        socket.auth = getAuth();

        socket.connect();
    }

    return {
        provide: {
            socket
        }
    }
});