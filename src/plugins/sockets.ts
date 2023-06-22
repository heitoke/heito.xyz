import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';

import { App, Plugin } from "vue";

import { parse } from 'cookie';

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}
  
export interface ClientToServerEvents {
    // ? Users
    'users:online'(type: 'count' | 'list'): void;
    
    // ? Activities
    'activities:track:playing'(): void;
    'activities:list'(): void;
}

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface IPluginOptions {
    connection: string;
    options: Partial<ManagerOptions & SocketOptions>;
}

interface Sockets<V> {
    [key: string]: (self: any, ...args: any) => void;
}

const plugin: Plugin = {
    install: (app: App, options: IPluginOptions) => {
        try {
            if (process) return;
        } catch (err) {
            
        }
        
        const cookies = parse(document.cookie);
        
        const socket: TSocket = io(options.connection, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            ...options.options,
            auth: {
                token: cookies?.HX_AT || cookies?.HX_GUAST || ''
            }
        });

        app.config.globalProperties.$socket = socket;

        app.provide('sockets', { socket });

        app.mixin({
            mounted() {
                let events = this.$options?.sockets || {},
                    keys = Object.keys(events);

                if (keys.length < 1) return;

                for (let name of keys) {
                    socket.on(name as any, (...args: any) => events[name].call(this, ...args));
                }
            },
            beforeUnmount() {
                let events = this.$options?.sockets || {},
                    keys = Object.keys(events);

                if (keys.length < 1) return;

                for (let event of keys) {
                    socket.off(event as any);
                }
            }
        })
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomOptions {
        sockets?: Sockets<App>;
    }

    interface ComponentCustomProperties {
        $socket: TSocket;
    }
}