import {Component, OnDestroy, OnInit} from '@angular/core';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {Router} from '@angular/router';
import {NotificationsService} from '../../../services/notifications.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-listener-layout',
  templateUrl: './listener-layout.component.html',
  styleUrl: './listener-layout.component.css'
})
export class ListenerLayoutComponent implements OnInit, OnDestroy {
  constructor(private auth: MyUserAuthService,
              private router: Router,
              private notificationsService: NotificationsService,
              private snackBar: MatSnackBar) {
  }

  ngOnDestroy(): void {
        throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    if(!this.auth.isLoggedIn())
    {
      this.router.navigate(['/auth/login']);
    }

    this.notificationsService.startConnection();
    this.notificationsService.addEventListener("notificationReceived", (data) => {
      this.snackBar.open(JSON.stringify(data), "", {duration: 2000});
      console.log(data);
      let audio = new Audio('assets/notification.mp3');
      audio.play().catch(err => {console.log(err)});
    })
  }


}
