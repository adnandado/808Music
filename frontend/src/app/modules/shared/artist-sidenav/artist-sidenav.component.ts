import {Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import {MyConfig} from '../../../my-config';

@Component({
  selector: 'artist-sidenav',
  templateUrl: './artist-sidenav.component.html',
  styleUrls: ['./artist-sidenav.component.css']
})
export class ArtistSidenavComponent implements OnInit {
  isMenuVisible: boolean = false;
  pathToPfp: string = `${MyConfig.api_address}`;

  constructor(private router: Router, private artistHandlerService: ArtistHandlerService) {}

  ngOnInit(): void {
    this.pathToPfp += this.artistHandlerService.getSelectedArtist()?.pfpPath;
  }

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

