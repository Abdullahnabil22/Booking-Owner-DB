import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MessageService } from '../../Services/messages/messages.service';
import { JWTService } from '../../Services/JWT/jwt.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../Services/socket.service/socket.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  chats: any[] = [];
  newMessage: string = '';
  selectedChat: any = null;
  currentUserId: string = '';
  currentUserName: string = '';
  private subscriptions: any[] = [];
  private shouldScrollToBottom = false;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(
    private messageService: MessageService,
    private jwtService: JWTService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getCurrentUserInfo();
    this.loadMessages();
    this.setupSocketSubscriptions();
  }

  setupSocketSubscriptions() {
    // Handle new messages
    this.subscriptions.push(
      this.socketService.newMessage$.subscribe((message) => {
        this.handleNewMessage(message);
      })
    );

    // Handle read messages
    this.subscriptions.push(
      this.socketService.messageRead$.subscribe((messageId) => {
        this.handleMessageRead(messageId);
      })
    );
  }

  handleNewMessage(message: any) {
    // Find the appropriate chat and add the message
    const chatKey = message.hostId?._id || message.apartmentId?._id;
    const existingChat = this.chats.find((chat) => chat.id === chatKey);

    if (existingChat) {
      const formattedMessage = {
        id: message._id,
        sender: {
          _id: message.sender._id,
          userName: message.sender.userName,
        },
        receiver: {
          _id: message.receiver._id,
          userName: message.receiver.userName,
        },
        content: message.content,
        timestamp: message.timestamp,
        read: message.read,
      };

      existingChat.messages = [...existingChat.messages, formattedMessage];

      if (this.selectedChat && this.selectedChat.id === existingChat.id) {
        this.selectedChat = { ...existingChat };
        setTimeout(() => this.scrollToBottom(), 100);
      }

      this.cdr.detectChanges();
    } else {
      // If it's a new chat, reload all messages
      this.loadMessages();
    }
  }

  handleMessageRead(messageId: string) {
    // Update the read status of the message in the UI
    this.chats.forEach((chat) => {
      const message = chat.messages.find((m: any) => m.id === messageId);
      if (message) {
        message.read = true;
      }
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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

        if (this.selectedChat) {
          const updatedSelectedChat = this.chats.find(
            (chat) => chat.id === this.selectedChat.id
          );
          if (updatedSelectedChat) {
            this.selectedChat = updatedSelectedChat;
          }
        }

        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading messages:', error);
      }
    );
  }

  selectChat(chat: any) {
    this.selectedChat = chat;
    this.markMessagesAsRead(chat);
    setTimeout(() => this.scrollToBottom(), 100);
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

      this.messageService.sendMessage(message).subscribe(
        (response) => {
          // Don't manually add the message here, it will come through the socket
          this.newMessage = '';
          this.shouldScrollToBottom = true;
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
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

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
