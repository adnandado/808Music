import {Component, OnDestroy, OnInit} from '@angular/core';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {NotificationsService, RichNotification} from '../../../services/notifications.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MusicPlayerService} from '../../../services/music-player.service';
import {
  IsSubscribedRequest,
  IsSubscribedService
} from '../../../endpoints/auth-endpoints/is-subscribed-endpoint.service';
import {
  PlaylistUpdateTracksRequest
} from '../../../endpoints/playlist-endpoints/add-track-to-playlist-endpoint.service';
import {PleaseSubscribeComponent} from '../../shared/bottom-sheets/please-subscribe/please-subscribe.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-listener-layout',
  templateUrl: './listener-layout.component.html',
  styleUrl: './listener-layout.component.css'
})
export class ListenerLayoutComponent implements OnInit, OnDestroy {
  showPleaseSubscribe = false;

  notiCallback = (data:RichNotification) => {
    this.snackBar.open(data.message, "", {duration: 2000});
    let audio = new Audio('assets/notification.mp3');
    audio.play().catch(err => {console.log(err)});
  }

  constructor(private auth: MyUserAuthService,
              private router: Router,
              private notificationsService: NotificationsService,
              private snackBar: MatSnackBar, private musicPlayerService : MusicPlayerService,
              private isSubscribedService : IsSubscribedService,
              private dialog : MatDialog) {
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
    this.musicPlayerService.trackEvent.subscribe({
      next: data => {
        const request: IsSubscribedRequest = {
          userId : this.getUserIdFromToken()
        };
        this.isSubscribedService.handleAsync(request).subscribe({
          next: (response) => {
            if (!response.isSubscribed)
            {
              this.openPleaseSubscribeDialog();

            }
          },
          error: (err) => {
            console.error('Error:', err);

          },
        });
      },

      complete: () => {
        console.log('Stream completed');
      }
    });
    this.notificationsService.startConnection();
    this.notificationsService.addNotificationListener(this.notiCallback);
  }
  private getUserIdFromToken(): number {
    let authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      authToken = localStorage.getItem('authToken');
    }

    if (!authToken) {
      return 0;
    }

    try {
      const parsedToken = JSON.parse(authToken);
      return parsedToken.userId;
    } catch (error) {
      console.error('Error parsing authToken:', error);
      return 0;
    }
  }
  private openPleaseSubscribeDialog(): void {
    const dialogRef = this.dialog.open(PleaseSubscribeComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: string | undefined ) => {
      if (result === 'navigate') {
        this.router.navigate(['listener/subscriptions']);
      }
    });
  }
}
