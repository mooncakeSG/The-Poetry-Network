import { NextRequest } from 'next/server';
import { collaborationServer } from '@/app/lib/websocket/server';

export async function GET(req: NextRequest) {
  if (!req.headers.get('upgrade')?.includes('websocket')) {
    return new Response('Expected Upgrade: WebSocket', { status: 426 });
  }

  const { socket, response } = await new Promise<{
    socket: WebSocket;
    response: Response;
  }>((resolve) => {
    const server = new WebSocket.Server({ noServer: true });
    
    server.on('connection', (ws) => {
      resolve({ socket: ws, response: new Response(null, { status: 101 }) });
    });

    server.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      server.emit('connection', ws, req);
    });
  });

  collaborationServer.handleUpgrade(req, socket, response);

  return response;
} 