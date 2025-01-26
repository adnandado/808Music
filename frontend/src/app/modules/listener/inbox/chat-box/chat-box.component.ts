import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import {ChatGetResponse} from '../../../../endpoints/chat-endpoints/chat-create-endpoint.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService, MessageSendRequest} from '../../../../services/chat.service';
import {
  ChatGetMessagesEndpointService, MessageGetRequest,
  MessageGetResponse
} from '../../../../endpoints/chat-endpoints/chat-get-messages-endpoint.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {
  SearchForContentSheetComponent
} from '../../../shared/bottom-sheets/search-for-content-sheet/search-for-content-sheet.component';
import {
  MessageContent,
  MessageContentCardComponent
} from '../../../shared/message-content-card/message-content-card.component';
import {MyConfig} from '../../../../my-config';
import {MyUserAuthService} from '../../../../services/auth-services/my-user-auth.service';
import {ChatToggleBlockEndpointService} from '../../../../endpoints/chat-endpoints/chat-toggle-block-endpoint.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent implements AfterViewInit, OnChanges {
  @Input() chat: ChatGetResponse | null = null;
  form = new FormGroup({
    message: new FormControl('', [Validators.required]),
    contentType: new FormControl('None'),
    contentId: new FormControl(-1),
  })
  @Input() messages: MessageGetResponse[] = [];
  receiveMessageCallback = (msg: MessageGetResponse) => {
    console.log("RECEIVED MSG: ", msg);
    this.messages.push(msg);
  }
  @Input() scroll: boolean = true;
  @Output() msgSent : EventEmitter<any> = new EventEmitter();
  @Output() loadMoreMessages : EventEmitter<number> = new EventEmitter();
  sendDisabled: boolean = false;
  msgDiv!: HTMLDivElement;

  result: MessageContent | null = null;

  userId: number = 0;

  page = 1;

  constructor(private chatService: ChatService,
              private getMessages: ChatGetMessagesEndpointService,
              private snackBar: MatSnackBar,
              private changeDetectorRef: ChangeDetectorRef,
              private bottomSheet: MatBottomSheet,
              private auth: MyUserAuthService,
              private blockToggleService: ChatToggleBlockEndpointService,
              private router: Router) {
  }

  ngAfterViewInit(): void {
    this.msgDiv = document.getElementById("messageBox") as HTMLDivElement;
    setTimeout(() => {this.msgDiv.scrollTop = this.msgDiv.scrollHeight}, 100);
    this.changeDetectorRef.detectChanges();
    this.chatService.msgReceived$.subscribe(msg => {
      setTimeout(() => {this.msgDiv.scrollTop = this.msgDiv.scrollHeight}, 100);
    })

    this.chatService.chatBlocked$.subscribe(blockedChat => {
      if(blockedChat.id === this.chat?.id) {
        this.chat.blockedByUser = blockedChat.blockedByUser
        this.chat.blocked = blockedChat.isBlocked
        this.chat.blockedByUserId = blockedChat.blockedByUserId

        console.log(this.chat.blockedByUserId);
      }
    })

    this.userId = this.auth.getAuthToken()?.userId!;
  }

  ngOnChanges(changes: SimpleChanges): void {
      setTimeout(() => {this.msgDiv.scrollTop = this.msgDiv.scrollHeight}, 50);
      this.scroll = false;
      this.page = 1;
  }

  sendMessage() {
    if(!this.form.valid)
    {
      return;
    }
    let msg : MessageSendRequest = {
      message: this.form.value.message!,
      userChatId: this.chat!.id,
      contentType: this.form.value.contentType!,
      contentId: this.form.value.contentId!,
    }
    this.chatService.sendMessage(msg).then(res => {
      if(res == 200)
      {
        console.log('Message sent successfully');
        this.form.reset();
        this.form.patchValue({
          message: '',
          contentId: -1,
          contentType: 'None'
        });
      }
    });
  }

  protected readonly JSON = JSON;

  attachItems() {
    let ref = this.bottomSheet.open(SearchForContentSheetComponent, {hasBackdrop: true});
    ref.afterDismissed().subscribe({
      next: (data: MessageContent | null) => {
        if(data != null) {
          this.result = data;
          this.form.get('contentType')!.setValue(data.type);
          this.form.get('contentId')!.setValue(data.id);
          this.form.get('message')!.setValue(this.form.get('message')!.value);
        }
      }
    })
  }

  removeContent() {
    this.form.get('contentType')!.setValue('None');
    this.form.get('contentId')!.setValue(-1);
    this.form.get('message')!.setValue(this.form.get('message')!.value);
  }

  protected readonly MyConfig = MyConfig;

  toggleBlock(chat: ChatGetResponse | null) {
    this.blockToggleService.handleAsync(chat?.id!).subscribe({
      next: data => {
        this.chat!.blocked = data.isBlocked;
        this.chat!.blockedByUserId = data.blockedByUserId;
        this.chat!.blockedByUser = data.blockedByUser
      }
    })
  }

  loadMore() {
    this.page++;
    this.loadMoreMessages.emit(this.page);
  }

  goToUserProfile() {
    this.router.navigate(["/listener/user", this.chat?.chatterId])
  }
}
