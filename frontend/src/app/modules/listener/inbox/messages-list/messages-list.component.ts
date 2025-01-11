import {Component, Input, OnInit} from '@angular/core';
import {MessageGetResponse} from '../../../../endpoints/chat-endpoints/chat-get-messages-endpoint.service';
import {MyUserAuthService} from '../../../../services/auth-services/my-user-auth.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css'
})
export class MessagesListComponent implements OnInit {
  @Input() messages: MessageGetResponse[] = []
  userId:number = 0;

  constructor(private auth: MyUserAuthService,) {
  }
  ngOnInit(): void {
    this.userId = this.auth.getAuthToken()!.userId;
  }
  getStyle(m: MessageGetResponse) {
    return m.senderId != this.userId ? {'align-self': 'start'} : {'align-self': 'end'};
  }
}
