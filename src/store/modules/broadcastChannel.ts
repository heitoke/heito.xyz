import type { StoreOptions } from 'vuex';

export interface IBroadcastMessage {
    cmd: string;
    senderId: number;
    to?: number;
    data: any;
}

export interface IBroadcastWindow {
    id: number;
    createdAt: number;
}

interface State {
    id: number;
    broadcast?: BroadcastChannel | null;
    windows: IBroadcastWindow[]
}

const module: StoreOptions<State> = {
    state: {
        id: -1,
        broadcast: null,
        windows: []
    },
    mutations: {
        'broadcast:connect'(state: State, broadcast: BroadcastChannel) {
            state.broadcast = broadcast;
            state.id = isNaN(sessionStorage['broadcastId']) ? Math.floor(Date.now() / 256) : sessionStorage['broadcastId'];

            sessionStorage?.setItem('broadcastId', `${state.id}`);

            console.log(`Broadcast channel ${broadcast.name} ${state.id} connected.`);

            state.windows = [{ id: state.id, createdAt: Date.now() }];

            if (isNaN(localStorage['broadcastMain'])) {
                localStorage?.setItem('broadcastMain', `${state.id}`);
            }

            window.addEventListener('beforeunload', () => {
                broadcast.postMessage({ cmd: 'disconnect', senderId: state.id });

                if (Number(localStorage['broadcastMain']) !== state.id) return;
                
                let list = state.windows.filter(window => window.id !== state.id);

                if (list.length > 0) {
                    localStorage?.setItem('broadcastMain', `${list[0].id}`);
                } else localStorage?.removeItem('broadcastMain');
            }, { once: true });

            broadcast.postMessage({ cmd: 'connect', senderId: state.id });
        },
        'broadcast:messages:send'(state: State, message: IBroadcastMessage) {
            state.broadcast?.postMessage({
                ...message,
                senderId: state.id
            });
        },
        'broadcast:events'(state: State, [data, origin, broadcast]: [IBroadcastMessage, string, BroadcastChannel]) {
            if (data?.to !== undefined && !isNaN(data?.to) && Number(data?.to) !== state.id) return;

            switch (data.cmd) {
                case "connect":
                    state.windows = [...state.windows || [], { id: data.senderId, createdAt: Date.now() }];

                    if (Number(localStorage['broadcastMain']) === state.id) {
                        state.broadcast?.postMessage(JSON.parse(JSON.stringify({ cmd: 'windows:list', senderId: state.id, data: state.windows })));
                    }
                    break;
                case "windows:list":
                    state.windows = data.data;
                    break;
                case "focus":
                    window?.focus();
                    break;
                case "close":
                    window?.close();
                    break;
                case "disconnect":
                    console.log(`Disconnect window - ${data.senderId}`);
                    state.windows = state.windows.filter(window => window.id !== data.senderId);
                    break;
                default:
                    break;
            }
        }
    },
    actions: {
        setBroadcastChannel({ commit }, name: string = 'heito.xyz') {
            let broadcast = new BroadcastChannel(name);

            broadcast.addEventListener('message', async ({ data, origin }) => {
                commit('broadcast:events', [data, origin, broadcast]);
            });

            commit('broadcast:connect', broadcast);
        },
        sendBroadcastMessage({ commit }, message: IBroadcastMessage) {
            return commit('broadcast:messages:send', message);
        }
    },
    getters: {
        getBroadcastWindows(state: State): IBroadcastWindow[] {
            return state.windows;
        }
    }
}

export default module;