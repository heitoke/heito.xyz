interface Listeners {
    [key: string]: Array<{
        once: boolean;
        callback(...args: Array<any>): void;
    }>
}

export default defineNuxtPlugin(nuxtApp => {
    const { socketUrl } = nuxtApp.$config.public;

    let ws: WebSocket;

    const socketData = ref<{ id: string }>({
        id: ''
    });

    const listeners: Listeners = {};



    function on(name: string, callback: (...args: Array<any>) => void, options: { once?: boolean; } = {}) {
        const { once = false } = options;

        if (!listeners[name]) listeners[name] = [];

        listeners[name].push({
            callback,
            once
        });
    }


    function connect() {
        const url = new URL(socketUrl);

        url.searchParams.set('token', cookies.get('HX_AT') || '');

        ws = new WebSocket(url.href, ['soap', 'wamp']);

        console.log('WebSockets: Start');
        
        ws.onopen = () => {
            console.log(`WebSockets: Connected`);
        }

        ws.onmessage = event => {
            let messageBody;

            try {
                messageBody = JSON.parse(event.data);
            } catch (_) {
                messageBody = event.data;
            }
            
            const listener = listeners[messageBody.name];

            if (!listener) return;

            for (let i = 0; i < listener.length; i++) {
                const { callback, once } = listener[i];

                callback(...messageBody.body);
    
                if (once) {
                    listeners[messageBody.name].splice(i, 1);
                }
            }
        }

        ws.onclose = event => {
            setTimeout(() => {
                connect();
            }, 1000);
        }

        ws.onerror = error => {
            ws.close();
        }
    }

    on('server:me', (data: { id: string }) => {
        socketData.value = {
            id: data.id
        }
    });

    return {
        provide: {
            socket: {
                connect,
                data: socketData,
                ws: ws!,
                on,
                off(...names: Array<string>) {
                    for (const name of names) {
                        if (!listeners[name]) continue;

                        delete listeners[name];
                    }
                },
                emit(name: string, ...args: any) {
                    ws?.send(JSON.stringify({
                        name,
                        body: args
                    }));
                }
            }
        }
    }
});