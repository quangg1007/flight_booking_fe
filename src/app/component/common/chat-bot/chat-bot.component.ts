import { CommonModule } from '@angular/common';
import { Component, OnInit, viewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { delay, of, tap } from 'rxjs';
import {
  MessageChat,
  ChatResponse,
  Choice,
} from 'src/app/models/chatbot.model';
import { ChatBotService } from 'src/app/services/chat-bot.service';
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
  scrollContainer = viewChild<ElementRef>('scrollContainer');

  messages: Array<MessageChat> = [];
  chatForm!: FormGroup;

  isTyping = false;

  isMinimized = true;
  showEndChat = false;

  flights = [
    {
      name: "Tokyo Express",
      origin: "Noi Bai Airport",
      destination: "Narita Airport",
      departureTime: "2024-12-25T20:00:00",
      arrivalTime: "2024-12-26T04:00:00",
      duration: "8 hours",
      price: 1200,
      stops: 0,
      description: "Direct flight to Tokyo with premium service",
      image: "https://images.unsplash.com/photo-1542296332-2e4473faf563",
      tags: "Cheapest",
    },
    {
      name: "Singapore Shuttle",
      origin: "Noi Bai Airport",
      destination: "Changi Airport",
      departureTime: "2024-12-25T10:00:00",
      arrivalTime: "2024-12-25T14:00:00",
      duration: "4 hours",
      price: 800,
      stops: 0,
      description: "Non-stop flight to Singapore with luxury service",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
      tags: "Second Cheapest",
    },
    {
      name: "Seoul Flyer",
      origin: "Noi Bai Airport",
      destination: "Incheon Airport",
      departureTime: "2024-12-25T08:00:00",
      arrivalTime: "2024-12-25T14:30:00",
      duration: "6.5 hours",
      price: 900,
      stops: 1,
      description: "Convenient flight to Seoul with one stop",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1",
      tags: "Shortest",
    }
  ]

  constructor(
    private _fb: FormBuilder,
    private chatBotService: ChatBotService
  ) {}

  ngOnInit() {
    this.initForm();

    this.initChat();
  }

  initForm() {
    this.chatForm = this._fb.group({
      message: ['', Validators.required],
    });
  }

  initChat() {
    this.chatBotService.loadChat().subscribe((response: ChatResponse[]) => {
      console.log('load chat ', response);
      this.isTyping = true;

      this.pushMessage(response, false);
    });
  }

  isJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (this.chatBotService.getUserID() === '') {
      this.initChat();
    }
  }

  showEndChatPopup() {
    this.showEndChat = true;
  }

  private scrollToBottom() {
    try {
      this.scrollContainer()!.nativeElement.scrollTop =
        this.scrollContainer()!.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const userMessage = this.chatForm.value.message!;

      // Add user message to chat
      this.messages.push({
        type: 'text',
        isUser: true,
        payload: {
          message: userMessage,
        },
      });

      // Clear input
      this.chatForm.reset();

      this.chatBotService
        .interact({
          type: 'text',
          payload: userMessage,
        })
        .subscribe((response: ChatResponse[]) => {
          console.log(response);
          this.isTyping = true;

          // Push message to chat
          this.pushMessage(response, false);
        });
    }
  }

  handleChoiceSelection(choice: Choice) {
    this.messages.push({
      type: 'text',
      isUser: true,
      payload: {
        message: choice.name,
      },
    });

    // Send choice payload to service
    this.chatBotService.interact(choice.request).subscribe((response) => {
      console.log('response choice selection', response);
      this.isTyping = true;

      this.pushMessage(response, false);
    });
  }

  endChat() {
    this.chatBotService.deleteState().subscribe(() => {
      this.messages = [];
      this.isMinimized = false;
      this.chatForm.reset();
      this.showEndChat = false;
    });
  }

  pushMessage(dataMessage: any[], isUser: boolean) {
    dataMessage.forEach((chat: any, index: number) => {
      of(chat)
        .pipe(tap(() => {
          this.isTyping = true;

        }),delay(chat.payload.delay * (index + 1) || 2000))
        .subscribe(() => {

          if (chat.type == 'text') {
            if (this.isJSON(chat.payload.message)) {
              let testDataJSON = JSON.parse(chat.payload.message);
              console.log('testDataJSON 1', testDataJSON);
            } else {
              this.messages.push({
                type: 'text',
                isUser: isUser,
                payload: {
                  message: chat.payload.message,
                },
              });
            }
          } else if (chat.type == 'choice') {
            console.log('choice');
            this.messages.push({
              type: 'choice',
              isUser: isUser,
              payload: {
                choices: chat.payload.buttons,
              },
            });
          }
          this.isTyping = false;
        });
    });
  }
}
