import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({ path: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  wsClients = [];

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.broadcast(payload);
  }

  broadcast(message) {
    for (const client of this.wsClients) {
      client.send(JSON.stringify(message));
    }
  }

  handleConnection(client: any) {
    this.wsClients.push(client);
  }

  handleDisconnect(client: any) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
  }
}
