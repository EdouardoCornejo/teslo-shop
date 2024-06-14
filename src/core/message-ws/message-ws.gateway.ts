import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from 'src/core/message-ws/dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interface';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // client.join('ventas');
    // this.wss.to('ventas').emit('message-from-server', {
    //   fullName: 'John Doe',
    //   message: 'Welcome to the ventas room',
    // });

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageClient(client: Socket, payload: NewMessageDto) {
    //message-from-server
    // this emit is sending a message to the client------------
    // client.emit('message-from-server', {
    //   fullName: 'John Doe',
    //   message: payload.message || 'No message provided',
    // });
    //---------------------
    //---------------------
    //this emit to all client except the initial client
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'John Doe',
    //   message: payload.message || 'No message provided',
    // });
    //---------------------
    //---------------------
    //this emit to all client including the initial client
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'No message provided',
    });
  }
}
