import {Component, OnInit} from '@angular/core';
import {ChatGetEndpointService} from '../../../endpoints/chat-endpoints/chat-get-endpoint.service';
import {ChatGetResponse} from '../../../endpoints/chat-endpoints/chat-create-endpoint.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {
  CreateChatBottomSheetComponent
} from '../../shared/bottom-sheets/create-chat-bottom-sheet/create-chat-bottom-sheet.component';
import moment from 'moment';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {ChatService, MsgSeen} from '../../../services/chat.service';
import {
  ChatGetMessagesEndpointService,
  MessageGetResponse
} from '../../../endpoints/chat-endpoints/chat-get-messages-endpoint.service';
import {
  NotificationMarkAsReadEndpointService
} from '../../../endpoints/notification-endpoints/notification-mark-as-read-endpoint.service';
import {ChatMarkAsReadEndpointService} from '../../../endpoints/chat-endpoints/chat-mark-as-read-endpoint.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent implements OnInit {
  chats : ChatGetResponse[] = [];
  queryString = "";
  selectedChat: ChatGetResponse | null = null;
  selectedChatMessages: MessageGetResponse[] = [];
  userId!: number;
  protected readonly JSON = JSON;
  protected readonly moment = moment;

  receiveMessageCallback = (msg: MessageGetResponse) => {
    if(this.selectedChat?.id === msg.userChatId)
    {
      this.selectedChatMessages.push(msg);
      this.markAsReadService.handleAsync({msgs:[msg]}).subscribe({
        next: value => {
          console.log("New message marked as read");
        }
      })
      if(this.userId !== msg.senderId)
      {
        let audio = new Audio("/assets/activeChatMsg.mp3");
        audio.volume = 0.15;
        audio.play();
      }
      this.shouldScroll = true;
    }
    else {
      let audio = new Audio("/assets/notification.mp3");
      audio.volume = 0.15;
      audio.play();
    }
    let userChat = this.chats.find(val => val.id === msg.userChatId);
    if(userChat && this.selectedChat?.id !== msg.userChatId)
    {
      userChat.numberOfUnreads++;
    }

    userChat!.lastMessage = msg.message;
    userChat!.lastMessageAt = msg.sentAt;
    userChat!.lastMessageSenderId = msg.senderId;
  }

  msgSeenCallback  = (msg: MsgSeen) => {
    if(this.selectedChat?.id === msg.userChatId)
    {
      let updatemMsg : MessageGetResponse = this.selectedChatMessages.find(val => val.id === msg!.id)!;
      updatemMsg.seen = msg.seen;
      updatemMsg.seenAt = msg.seenAt;
    }
  }

  constructor(private getChatsService: ChatGetEndpointService,
              private matBtmSheet : MatBottomSheet,
              private chatService : ChatService,
              private getMessages : ChatGetMessagesEndpointService,
              private auth: MyUserAuthService,
              private markAsReadService : ChatMarkAsReadEndpointService,) {
  }

  ngOnInit(): void {
    this.chatService.startConnection();
    this.chatService.msgReceived$.subscribe(msg => {
      this.receiveMessageCallback(msg);
    })
    this.chatService.msgSeen$.subscribe(msg => {
      this.msgSeenCallback(msg);
    })

    this.getChatsService.handleAsync().subscribe({
      next: value => {
        this.chats = value;
        this.selectedChat = value[0];
        this.fetchMessages();
      }
    })

    this.userId = this.auth.getAuthToken()!.userId;
  }

  filterChats(queryString: string) {
    this.queryString = queryString;
  }

  openCreateSheet() {
    let ref = this.matBtmSheet.open(CreateChatBottomSheetComponent, {data:{chats: this.chats}});

    ref.afterDismissed().subscribe({
      next: value => {
        if(value)
        {
          this.chats.unshift(value as ChatGetResponse);
        }
      }
    });
  }

  openChat(c: ChatGetResponse) {
    this.selectedChat = c;
    this.fetchMessages();
  }

  fetchMessages() {
    this.getMessages.handleAsync(this.selectedChat!.id).subscribe({
      next: data => {
        this.selectedChatMessages = data;
        this.markAsReadService.handleAsync({msgs: data}).subscribe({
          next: value => {
            console.log("Marked as read");
          }
        })
        this.selectedChat!.numberOfUnreads = 0;
      }
    })
  }

  getFilteredChats() {
    if(this.queryString != "")
    {
      return this.chats.filter(c => c.chatter.toLowerCase().includes(this.queryString.toLowerCase()));
    }
    return this.chats;
  }

  protected readonly Math = Math;
  shouldScroll: boolean = true;

  getUnreadCount(numberOfUnreads: number) {
    return numberOfUnreads > 99 ? "99+" : numberOfUnreads;
  }

  getLastMessage(lastMessage: ChatGetResponse) {
    return lastMessage.lastMessageSenderId == this.userId ? `You: ${lastMessage.lastMessage}` : lastMessage.lastMessage;
  }

  scroll() {
    this.shouldScroll = true;
  }
}
