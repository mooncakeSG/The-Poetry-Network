import { Server } from 'ws';
import { parse } from 'url';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface WebSocketClient extends WebSocket {
  userId?: string;
  poemId?: string;
}

interface CollaborationMessage {
  type: 'join' | 'leave' | 'edit' | 'cursor' | 'selection';
  poemId: string;
  userId: string;
  content?: string;
  cursor?: {
    position: number;
    userId: string;
    userName: string;
  };
  selection?: {
    start: number;
    end: number;
    userId: string;
    userName: string;
  };
}

class CollaborationServer {
  private wss: Server;
  private clients: Map<string, Set<WebSocketClient>>;

  constructor() {
    this.wss = new Server({ noServer: true });
    this.clients = new Map();
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocketClient, req) => {
      const { query } = parse(req.url || '', true);
      const poemId = query.poemId as string;

      if (!poemId) {
        ws.close(1008, 'Poem ID is required');
        return;
      }

      ws.poemId = poemId;

      // Add client to poem's client set
      if (!this.clients.has(poemId)) {
        this.clients.set(poemId, new Set());
      }
      this.clients.get(poemId)?.add(ws);

      ws.on('message', async (message: string) => {
        try {
          const data: CollaborationMessage = JSON.parse(message);

          // Handle different message types
          switch (data.type) {
            case 'join':
              await this.handleJoin(ws, data);
              break;
            case 'leave':
              this.handleLeave(ws, data);
              break;
            case 'edit':
              this.handleEdit(ws, data);
              break;
            case 'cursor':
              this.handleCursor(ws, data);
              break;
            case 'selection':
              this.handleSelection(ws, data);
              break;
          }
        } catch (error) {
          console.error('Error handling message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.handleLeave(ws, { type: 'leave', poemId, userId: ws.userId || '' });
      });
    });
  }

  private async handleJoin(ws: WebSocketClient, data: CollaborationMessage) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        ws.close(1008, 'Authentication required');
        return;
      }

      ws.userId = session.user.id;
      ws.send(JSON.stringify({ type: 'joined', poemId: data.poemId }));
    } catch (error) {
      console.error('Error handling join:', error);
      ws.close(1011, 'Internal server error');
    }
  }

  private handleLeave(ws: WebSocketClient, data: CollaborationMessage) {
    const clients = this.clients.get(data.poemId);
    if (clients) {
      clients.delete(ws);
      if (clients.size === 0) {
        this.clients.delete(data.poemId);
      }
    }
  }

  private handleEdit(ws: WebSocketClient, data: CollaborationMessage) {
    const clients = this.clients.get(data.poemId);
    if (clients) {
      const message = JSON.stringify({
        type: 'edit',
        content: data.content,
        userId: data.userId,
      });
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  private handleCursor(ws: WebSocketClient, data: CollaborationMessage) {
    const clients = this.clients.get(data.poemId);
    if (clients && data.cursor) {
      const message = JSON.stringify({
        type: 'cursor',
        cursor: data.cursor,
      });
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  private handleSelection(ws: WebSocketClient, data: CollaborationMessage) {
    const clients = this.clients.get(data.poemId);
    if (clients && data.selection) {
      const message = JSON.stringify({
        type: 'selection',
        selection: data.selection,
      });
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }

  public handleUpgrade(request: any, socket: any, head: any) {
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit('connection', ws, request);
    });
  }
}

export const collaborationServer = new CollaborationServer(); 