import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../Services/messages/messages.service';
import { LoginService } from '../../Services/login/login.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { LocalStorageService } from '../../Services/localstorage/localstorage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent {
  messages: any[] = [];
  newMessage: string = '';
  selectedChat: any = null;
  currentUserId: string = '';

  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
    private jwtService: JWTService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getCurrentUserId();
    this.loadMessages();
  }

  getCurrentUserId() {
    const token = this.localStorageService.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      this.currentUserId = decodedToken.userId;
    }
  }

  loadMessages() {
    this.messageService.getMessages().subscribe(
      (messages) => {
        this.messages = this.groupMessagesByProperty(messages);
      },
      (error) => {
        console.error('Error loading messages:', error);
      }
    );
  }

  groupMessagesByProperty(messages: any[]) {
    const groupedMessages: { [key: string]: any } = {};
    messages.forEach((message) => {
      if (message && message.apartmentId && message.hostId) {
        const key = `${message.apartmentId._id || message.apartmentId}-${
          message.hostId._id || message.hostId
        }`;
        if (!groupedMessages[key]) {
          groupedMessages[key] = {
            apartment: message.apartmentId,
            host: message.hostId,
            messages: [],
          };
        }
        groupedMessages[key].messages.push(message);
      } else {
        console.warn('Invalid message structure:', message);
      }
    });
    return Object.values(groupedMessages);
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedChat) {
      const receiverId = this.getReceiverId();
      if (!receiverId) {
        console.error('Unable to determine receiver ID');
        return;
      }

      const message = {
        receiverId: receiverId,
        apartmentId: this.selectedChat.apartment._id,
        hostId: this.selectedChat.host._id,
        content: this.newMessage,
      };

      this.messageService.sendMessage(message).subscribe(
        (response) => {
          this.selectedChat.messages.push(response);
          this.newMessage = '';
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }

  getReceiverId(): string | null {
    if (
      this.selectedChat &&
      this.selectedChat.messages &&
      this.selectedChat.messages.length > 0
    ) {
      const firstMessage = this.selectedChat.messages[0];
      if (firstMessage.sender && firstMessage.receiver) {
        return firstMessage.sender._id === this.currentUserId
          ? firstMessage.receiver._id
          : firstMessage.sender._id;
      }
    }
    return null;
  }

  isCurrentUser(senderId: string): boolean {
    return senderId === this.currentUserId;
  }
}
