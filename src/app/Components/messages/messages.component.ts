import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../Services/messages/messages.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent {
  chats: any[] = [];
  newMessage: string = '';
  selectedChat: any = null;
  currentUserId: string = '';
  currentUserName: string = '';

  constructor(
    private messageService: MessageService,
    private jwtService: JWTService
  ) {}

  ngOnInit() {
    this.getCurrentUserInfo();
    this.loadMessages();
  }

  getCurrentUserInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      this.currentUserId = decodedToken.id;
      this.currentUserName = decodedToken.username || 'Unknown User';
    }
  }

  loadMessages() {
    this.messageService.getMessages().subscribe(
      (groupedMessages) => {
        this.chats = groupedMessages;
        console.log('Grouped messages:', this.chats);
      },
      (error) => {
        console.error('Error loading messages:', error);
      }
    );
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
    this.markMessagesAsRead(chat);
  }

  markMessagesAsRead(chat: any) {
    chat.messages.forEach((message: any) => {
      if (!message.read && message.sender.id !== this.currentUserId) {
        this.messageService.markAsRead(message.id).subscribe(
          () => {
            message.read = true;
          },
          (error) => {
            console.error('Error marking message as read:', error);
          }
        );
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedChat) {
      const message = {
        senderId: this.currentUserId,
        receiverId: this.getReceiverId(),
        hostId:
          this.selectedChat.type === 'Hotel' ? this.selectedChat.id : null,
        apartmentId:
          this.selectedChat.type === 'Apartment' ? this.selectedChat.id : null,
        content: this.newMessage,
      };

      console.log('Sending message:', message);
      console.log('Selected chat:', this.selectedChat);

      this.messageService.sendMessage(message).subscribe(
        (response) => {
          console.log('Message sent successfully:', response);
          response.sender = {
            _id: this.currentUserId,
            userName: this.currentUserName,
          };
          this.selectedChat.messages.push(response);
          this.newMessage = '';
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    } else {
      console.log('Cannot send message: ', {
        newMessage: this.newMessage,
        selectedChat: this.selectedChat,
      });
    }
  }

  getReceiverId(): string {
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
    return this.selectedChat ? this.selectedChat.id : '';
  }

  isCurrentUser(senderId: string): boolean {
    return senderId === this.currentUserId;
  }
}
