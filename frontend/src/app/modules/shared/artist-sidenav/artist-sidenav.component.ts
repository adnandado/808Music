import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {ArtistHandlerService} from '../../../services/artist-handler.service';

@Component({
  selector: 'artist-sidenav',
  templateUrl: './artist-sidenav.component.html',
  styleUrls: ['./artist-sidenav.component.css']
})
export class ArtistSidenavComponent {
  isMenuVisible: boolean = false;

  constructor(private router: Router, private artistHandlerService: ArtistHandlerService) {}

  toggleMenu(): void {
    console.log('Toggling menu visibility...');
    this.isMenuVisible = !this.isMenuVisible;
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
}
