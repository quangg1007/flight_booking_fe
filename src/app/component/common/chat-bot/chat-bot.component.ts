import { CommonModule } from '@angular/common';
import { Component, OnInit, viewChild, ElementRef } from '@angular/core';
import {
  ReactiveFormsModule,
} from '@angular/forms';

declare global {
  interface Window {
    voiceflow: {
      chat: {
        load: (config: any) => void;
      };
    };
  }
}

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
})
export class ChatBotComponent implements OnInit {
  chatContainer = viewChild<ElementRef>('chatContainer');

  userID: string = '';

  constructor() {}

  ngOnInit() {
    this.userID =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    this.loadVoiceflowWidget();
  }

  loadVoiceflowWidget() {
    const script = document.createElement('script');
    script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
    script.async = true;
    script.onload = () => this.initializeWidget();
    document.body.appendChild(script);
  }

  private initializeWidget() {
    window.voiceflow.chat.load({
      verify: { projectID: '675fe848e375d84376eea09d' },
      url: 'https://general-runtime.voiceflow.com',
      versionID: 'production',
      user_id: this.userID,
      container: this.chatContainer()!.nativeElement
    });
  }
}
