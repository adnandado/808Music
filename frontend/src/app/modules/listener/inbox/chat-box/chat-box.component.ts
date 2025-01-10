import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ChatGetResponse} from '../../../../endpoints/chat-endpoints/chat-create-endpoint.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService, MessageSendRequest} from '../../../../services/chat.service';
import {
  ChatGetMessagesEndpointService,
  MessageGetResponse
} from '../../../../endpoints/chat-endpoints/chat-get-messages-endpoint.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chat: ChatGetResponse | null = null;
  form = new FormGroup({
    message: new FormControl('', [Validators.required]),
    contentType: new FormControl(''),
    contentId: new FormControl(0),
  })
  messages: MessageGetResponse[] = [];
  receiveMessageCallback = (msg: MessageGetResponse) => {
    console.log("RECEIVED MSG: ", msg);
    this.messages.push(msg);
  }
  sendDisabled: boolean = false;

  constructor(private chatService: ChatService,
              private getMessages: ChatGetMessagesEndpointService) {
  }

  ngOnDestroy(): void {
    this.chatService.removeMessageListener(this.receiveMessageCallback);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMessages.handleAsync(this.chat!.id).subscribe({
      next: data => {
        this.messages = data;
      }
    });
  }

  ngOnInit(): void {
    this.getMessages.handleAsync(this.chat!.id).subscribe({
      next: data => {
        this.messages = data;
      }
    });

    this.chatService.addMessageListener(this.receiveMessageCallback);
  }

  sendMessage() {
    if(!this.form.valid)
    {
      return;
    }
    let msg : MessageSendRequest = {
      message: this.form.value.message!,
      userChatId: this.chat!.id,
      contentType: "None",
      contentId: -1
    }
    this.chatService.sendMessage(msg).then(res => {
      if(res == 200)
      {
        console.log('Message sent successfully');
        this.form.reset();
      }
    });
  }

  protected readonly JSON = JSON;
}
