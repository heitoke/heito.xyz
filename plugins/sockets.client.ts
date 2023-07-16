import { io, ManagerOptions, SocketOptions } from 'socket.io-client';

import { TSocket } from 'types/sockets';

export default defineNuxtPlugin(nuxtApp => {
    const { apiURL } = nuxtApp.$config.public;

    const socket: TSocket = io(apiURL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        auth: {
            token: cookies.get('HX_AT') || cookies.get('HX_GUAST') || ''
        }
    });

    return {
        provide: {
            socket
        }
    }
});