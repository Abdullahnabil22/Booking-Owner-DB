import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessagesService } from '../../Services/messages/messages.service';
import { JWTService } from '../../Services/JWT/jwt.service';

@Component({
  selector: 'app-chat-reply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-reply.component.html',
  styleUrl: './chat-reply.component.css',
})
export class ChatReplyComponent {
  @Input() message: any;
  @Output() messageSent = new EventEmitter<void>();

  replyContent: string = '';

  constructor(
    private messageService: MessagesService,
    private jwtService: JWTService
  ) {}

  sendReply() {
    if (this.replyContent.trim()) {
      const replyData = {
        host_id: this.message.host_id,
        user_id: this.message.user_id,
        apartment_id: this.message.apartment_id,
        content: this.replyContent,
        status: 'unread',
      };

      this.messageService.sendMessage(replyData).subscribe(
        () => {
          this.replyContent = '';
          this.messageSent.emit();
        },
        (error) => console.error('Error sending reply:', error)
      );
    }
  }
}
