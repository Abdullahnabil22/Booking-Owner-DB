import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReplyComponent } from './chat-reply.component';

describe('ChatReplyComponent', () => {
  let component: ChatReplyComponent;
  let fixture: ComponentFixture<ChatReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatReplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
