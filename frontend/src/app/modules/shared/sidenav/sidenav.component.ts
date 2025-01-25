import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import {MyConfig} from "../../../my-config";
import {UserProfileService} from '../../../endpoints/auth-endpoints/user-profile-endpoint.service';
import {PfpCropperDialogComponent} from '../pfp-cropper-dialog/pfp-cropper-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService, RichNotification} from '../../../services/notifications.service';
import {ChatService} from '../../../services/chat.service';
import {Subscription} from 'rxjs';
import {
  GetUserUnreadsEndpointService,
  UnreadsResponse
} from '../../../endpoints/user-endpoints/get-user-unreads-endpoint.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  isMenuVisible: boolean = false;
  pathToPfp = MyConfig.media_address;

  unreads : UnreadsResponse | null = null;
  notiReceive = (noti : RichNotification) => {
    this.unreads!.unreadNotificationsCount++;
    if(this.unreads!.unreadNotificationsCount > 99)
    {
      this.unreads!.unreadNotificationsCount = 99;
    }
  }
  chat$ : Subscription | null = null;

  constructor(private router: Router,
              private cdRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private userProfileService : UserProfileService,
              private artistHandlerService: ArtistHandlerService,
              private notificationService: NotificationsService,
              private chatService: ChatService,
              private getUserUnreadsService : GetUserUnreadsEndpointService){}

  toggleMenu(): void {
    console.log('Toggling menu visibility...');
    this.isMenuVisible = !this.isMenuVisible;
  }

  getUnreadsCount() {
    this.getUserUnreadsService.handleAsync().subscribe(unreads => {
      this.unreads = unreads;
    })
  }

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    console.log('User ID:', userId);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        event.url.includes("/listener/home");
        if(this.router.url.includes("/artist"))
        {

          setTimeout(() => { window.location.reload(); }, 100);
        }
      }
    })

    if (userId) {
      this.userProfileService.getProfilePicture(userId).subscribe(
        (response) => {
          if (response && response.profilePicturePath) {
            this.pathToPfp = MyConfig.media_address + response.profilePicturePath;
            this.cdRef.detectChanges();
          }
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
        }
      );
    } else {
      console.error('No user ID found.');
    }

    this.notificationService.addNotificationListener(this.notiReceive);
    this.chat$ = this.chatService.msgReceived$.subscribe(msg => {
      this.unreads!.unreadMessaggesCount++;
      if (this.unreads!.unreadMessaggesCount > 99) {
        this.unreads!.unreadMessaggesCount = 99;
      }
    })
    this.getUnreadsCount();

    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.getUnreadsCount();
      }
    })
  }
  openImageCropperDialog(): void {
    const dialogRef = this.dialog.open(PfpCropperDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile picture uploaded successfully:', result);
        this.pathToPfp = MyConfig.media_address + result.profilePicturePath;
        this.cdRef.detectChanges();
      } else {
        console.error('Profile picture upload failed');
      }
    });
    this.cdRef.detectChanges();

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
  navigateTo(destination: string): void {
    if (destination === 'products') {
      const selectedArtistName = this.artistHandlerService.getSelectedArtist();
      console.log('Selected Artist Name:', selectedArtistName);

      if (selectedArtistName) {
        this.router.navigate([`/artist/${selectedArtistName.name}/products`]);
      } else {
        console.error('No artist selected');
        alert('No artist selected.');
      }
    } else {
      this.router.navigate([destination]);
    }
    this.isMenuVisible = false;
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    const isInsideMenu =
      clickedElement.closest('.profile-menu') || clickedElement.classList.contains('profile-picture');

    if (!isInsideMenu) {
      this.isMenuVisible = false;
    }
  }

    protected readonly MyConfig = MyConfig;

  openUserProfile() {
    const userId = this.getUserIdFromToken();
    this.router.navigate([`/listener/user/`,userId]);
  }

  goHome() {
    this.router.navigate([`/listener/home/`]);

  }
}
