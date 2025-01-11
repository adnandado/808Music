import {Component, OnDestroy, OnInit} from '@angular/core';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {NotificationsService, RichNotification} from '../../../services/notifications.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-listener-layout',
  templateUrl: './listener-layout.component.html',
  styleUrl: './listener-layout.component.css'
})
export class ListenerLayoutComponent implements OnInit, OnDestroy {
  notiCallback = (data:RichNotification) => {
    this.snackBar.open(data.message, "", {duration: 2000});
    let audio = new Audio('assets/notification.mp3');
    audio.play().catch(err => {console.log(err)});
  }

  constructor(private auth: MyUserAuthService,
              private router: Router,
              private notificationsService: NotificationsService,
              private snackBar: MatSnackBar) {
  }

  ngOnDestroy(): void {
    this.notificationsService.removeNotificationListener(this.notiCallback);
  }

  ngOnInit(): void {
    if(!this.auth.isLoggedIn())
    {
      console.log("Not logged in...");
      setTimeout(() => this.router.navigate(['/auth/login']), 1000);
    }

    this.notificationsService.startConnection();
    this.notificationsService.addNotificationListener(this.notiCallback);
  }


}
