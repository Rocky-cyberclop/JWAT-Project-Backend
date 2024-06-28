import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SocketService {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  sendUploadSuccess(clientId: string, message: string) {
    this.server.to(clientId).emit('uploadSuccess', message);
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() data: { clientId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.clientId);
  }
}
