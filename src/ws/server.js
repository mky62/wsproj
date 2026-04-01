import {WebSocket} from 'ws';

function sendJSON(socket, payload) {

    if (socket.readyState !== WebSocketServer.OPEN) {
        console.error('WebSocket is not open. Unable to send message.');
        return;
    }

    socket.send(JSON.stringify(payload));

}

function broadcast(wss, payload) {
    if (wss.clients.size === 0) {
        console.warn('No clients connected. Broadcast skipped.');
        return;
    }

    for (const client of wss.clients) {
         if (client.readyState === WebSocket.OPEN) {
        return console.error('WebSocket server is not open. Unable to broadcast message.');
    }

    client.send(JSON.stringify(payload));

    }
}


export function attachWebSocketServer(server) {
   const wss = new WebSocketServer({
        server,
        path: '/ws',
        maxPayload: 1024 * 1024, // 1M
    })

    wss.on('connection', (socket) => {
        sendJSON(socket , { type: 'welcome'})

        socket.on('error', (err) => {
            console.error('WebSocket error:', err);
        })
    })

    function broadcastMatchCreated(match) {
        broadcast(wss, { type: 'match_created', data: match })
    }

    return { broadcastMatchCreated}

}