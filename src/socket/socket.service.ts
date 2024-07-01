import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseCommentDto } from 'src/comment/dto/response-comment.dto';

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

  sendUploadSuccess(clientId: string, id: number) {
    this.server.to(clientId).emit('uploadSuccess', id);
  }

  syncComment(blogId: string, comment: ResponseCommentDto) {
    this.server.to(blogId).emit('receiveComment', comment);
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() data: { clientId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.clientId);
  }

  @SubscribeMessage('joinBlog')
  handleJoinBlog(@MessageBody() data: { blogId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.blogId);
  }

  syncCommentByHao(blogId: string, comment: ResponseCommentDto) {
    this.server.emit(`comment/${blogId}`, comment);
  }
}
