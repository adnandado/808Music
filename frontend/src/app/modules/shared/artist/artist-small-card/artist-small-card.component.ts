import {Component, EventEmitter, inject, input, Input, Output} from '@angular/core';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {MyConfig} from '../../../../my-config';
import {ArtistTrackDto} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {Router} from '@angular/router';
import {
  ArtistFollowResponse
} from '../../../../endpoints/artist-endpoints/artist-get-followed-by-user-endpoint.service';
import {
  ToggleNotificationsEndpointService
} from '../../../../endpoints/follow-endpoints/toggle-notifications-endpoint.service';
import {
  FollowOrUnfollowEndpointService
} from '../../../../endpoints/follow-endpoints/follow-or-unfollow-endpoint.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-artist-small-card',
  templateUrl: './artist-small-card.component.html',
  styleUrl: './artist-small-card.component.css'
})
export class ArtistSmallCardComponent {
  @Input() artist : ArtistSimpleDto | ArtistTrackDto | ArtistFollowResponse | null = null;
  @Input() interactive: boolean = false;
  @Input() followManagerMode: boolean = false;

  @Output() onRemove: EventEmitter<ArtistSimpleDto | ArtistTrackDto | ArtistFollowResponse> = new EventEmitter<ArtistSimpleDto | ArtistTrackDto>();

  constructor(private toggleNotiService : ToggleNotificationsEndpointService,
              private followService : FollowOrUnfollowEndpointService,
              private snackBar : MatSnackBar) {
  }

  router = inject(Router);

  protected readonly MyConfig = MyConfig;

  emitClick() {
    if(this.artist){
      this.onRemove.emit(this.artist);
    }
  }

  routeToProfile() {
    this.router.navigate(["listener/profile", this.artist?.id]);
  }

  validArtist(a: any) : a is ArtistFollowResponse {
    return 'wantsNotifications' in a;
  }

  toggleNotis(artist: ArtistFollowResponse) {
    this.toggleNotiService.handleAsync(artist.id).subscribe({
      next: value => {
        //this.snackBar.open(value, "Dismiss", {duration: 2000});
        artist.wantsNotifications = !artist.wantsNotifications;
      }
    })
  }

  unfollow(artist: ArtistFollowResponse) {
    this.followService.handleAsync(artist.id).subscribe({
      next: value => {
        this.snackBar.open(value, "Dismiss", {duration: 2000});
        this.emitClick()
      }
    })
  }
}
