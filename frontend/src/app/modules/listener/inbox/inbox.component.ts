import {Component, OnInit} from '@angular/core';
import {ChatGetEndpointService} from '../../../endpoints/chat-endpoints/chat-get-endpoint.service';
import {ChatGetResponse} from '../../../endpoints/chat-endpoints/chat-create-endpoint.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {
  CreateChatBottomSheetComponent
} from '../../shared/bottom-sheets/create-chat-bottom-sheet/create-chat-bottom-sheet.component';
import moment from 'moment';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {ChatService} from '../../../services/chat.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent implements OnInit {
  chats : ChatGetResponse[] = [];
  queryString = "";
  selectedChat: ChatGetResponse | null = null;
  protected readonly JSON = JSON;
  protected readonly moment = moment;

  constructor(private getChatsService: ChatGetEndpointService,
              private matBtmSheet : MatBottomSheet,
              private chatService : ChatService) {
  }

  ngOnInit(): void {
    this.chatService.startConnection();

    this.getChatsService.handleAsync().subscribe({
      next: value => {
        this.chats = value;
        this.selectedChat = value[0];
      }
    })
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
  }

  getFilteredChats() {
    if(this.queryString != "")
    {
      return this.chats.filter(c => c.chatter.toLowerCase().includes(this.queryString.toLowerCase()));
    }
    return this.chats;
  }
}
