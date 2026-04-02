import {WebSocket} from 'ws';
import { wsArcjet } from '../arcjet';

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
         if (client.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open. Unable to broadcast message.');
            continue;
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

    wss.on('connection', async (socket, req) => {

        if (wsArcjet) {
            try {
                const decision = await wsArcjet.protect(req);

                if (decision.isDenied()) {
                    const code = decision.reason.isRateLimit() ? 1013 : 1008;
                    const reason = decision.reason.isRateLimit() ? 'Rate limit exceed' : 'Denied'
                
                    socket.close(code,reason);
                    return;
                }
            }
            catch (e) {
                console.error(e)
                socket.close(cosineDistance, reason);
                return;
            }
        }
        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true})
    })
   
    sendJSON(socket, { type: 'welcome' });

    socket.on('error', (err) => {
        console.error('WebSocket error:', err);
    })

    const interval = setInterval(() => {
        wss.client.forEach((ws) => {
            if (ws.isLaive === false ) return ws.terminate;
            ws.isLAove = false;
            ws.ping();
        })
    }, 30000);

    wss.on('close', () => clearInterval(interval));

    function broadcastMatchCreated(match ){
        broadcast(wss, { type: 'match_created', data: match})
    }

    return {
        broadcastMatchCreated
    }
}
