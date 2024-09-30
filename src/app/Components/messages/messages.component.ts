import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessagesService } from '../../Services/messages/messages.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { ChatReplyComponent } from '../chat-reply/chat-reply.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ChatReplyComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  users: any[] = [
    {
      id: 1,
      name: 'Vincent Porter',
      avatar: 'https://bootdey.com/img/Content/avatar/avatar1.png',
      status: 'online',
      lastSeen: '2 hours ago',
    },
    {
      id: 2,
      name: 'Aiden Chavez',
      avatar: 'https://bootdey.com/img/Content/avatar/avatar2.png',
      status: 'online',
      lastSeen: '1 hour ago',
    },
    // Add more users as needed
  ];

  selectedUser: any;
  messages: any[] = [];
  newMessage: string = '';
  currentUser = {
    id: 0,
    name: 'Current User',
    avatar: 'path_to_current_user_avatar',
  };

  constructor(
    private messageService: MessagesService,
    private jwtService: JWTService
  ) {}

  ngOnInit() {
    this.currentUser.id = this.jwtService.decodeToken(
      localStorage.getItem('token')!
    ).id;
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getAllUserMessages().subscribe(
      (messages) => {
        this.messages = messages.filter(
          (m) =>
            (m.user_id === this.selectedUser.id &&
              m.host_id === this.currentUser.id) ||
            (m.user_id === this.currentUser.id &&
              m.host_id === this.selectedUser.id)
        );
        this.messages.sort(
          (a, b) =>
            new Date(a.timestamps).getTime() - new Date(b.timestamps).getTime()
        );
      },
      (error) => console.error('Error loading messages:', error)
    );
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageData = {
        host_id: this.currentUser.id,
        user_id: this.selectedUser.id,
        apartment_id: null,
        content: this.newMessage,
        timestamps: new Date(),
        status: 'unread',
        sender: this.currentUser.id,
      };

      this.messageService.sendMessage(messageData).subscribe(
        (newMessage) => {
          this.messages.push(newMessage);
          this.newMessage = '';
        },
        (error) => console.error('Error sending message:', error)
      );
    }
  }

  getUserAvatar(senderId: number): string {
    if (senderId === this.currentUser.id) {
      return this.currentUser.avatar;
    }
    const user = this.users.find((u) => u.id === senderId);
    return user ? user.avatar : '';
  }
}
