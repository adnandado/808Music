import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import {MyConfig} from "../../../my-config";
import {UserProfileService} from '../../../endpoints/auth-endpoints/user-profile-endpoint.service';
import {PfpCropperDialogComponent} from '../pfp-cropper-dialog/pfp-cropper-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  isMenuVisible: boolean = false;
  pathToPfp = MyConfig.media_address;
  constructor(private router: Router,private cdRef: ChangeDetectorRef, private dialog: MatDialog, private userProfileService : UserProfileService, private artistHandlerService: ArtistHandlerService){}

  toggleMenu(): void {
    console.log('Toggling menu visibility...');
    this.isMenuVisible = !this.isMenuVisible;
  }
  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    console.log('User ID:', userId);

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
}
