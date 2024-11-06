import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;
  private platformId = inject(PLATFORM_ID);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval: any;

  private notificationSubject = new BehaviorSubject<{
    paypalEmail: string;
    amount: number;
  } | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  private newMessageSubject = new Subject<any>();
  public newMessage$ = this.newMessageSubject.asObservable();

  private messageReadSubject = new Subject<string>();
  public messageRead$ = this.messageReadSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSocket();
    }
  }

  private initializeSocket(): void {
    try {
      this.socket = io('http://localhost:3000', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 60000,
        forceNew: true,
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('Socket initialization error:', error);
      this.handleReconnect();
    }
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server', this.socket?.id);
      this.reconnectAttempts = 0;
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit('ping');
      }
    }, 25000);

    this.socket.on('pong', () => {
      console.log('Received pong from server');
    });

    this.socket.on(
      'payout_request',
      (notification: { paypalEmail: string; amount: number }) => {
        console.log('Received payout request:', notification);
        this.notificationSubject.next(notification);
        setTimeout(() => {
          this.notificationSubject.next(null);
        }, 5000);
      }
    );

    this.socket.on('new_message', (message: any) => {
      console.log('Received new message:', message);
      this.newMessageSubject.next(message);
    });

    this.socket.on('message_read', (messageId: string) => {
      console.log('Message marked as read:', messageId);
      this.messageReadSubject.next(messageId);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect...');
        this.reconnectAttempts++;
        this.socket?.close();
        this.initializeSocket();
      }, 5000);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.off('connect');
      this.socket.off('connect_error');
      this.socket.off('payout_request');
      this.socket.off('pong');
      this.socket.disconnect();
    }

    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
  }
}
