import {Component, Input} from '@angular/core';
import {formatNumber} from '@angular/common';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {MyConfig} from '../../../../my-config';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MusicPlayerService} from '../../../../services/music-player.service';
import {TrackGetAllEndpointService} from '../../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-artist-big-card',
  templateUrl: './artist-big-card.component.html',
  styleUrl: './artist-big-card.component.css'
})
export class ArtistBigCardComponent {
  @Input() artist : ArtistSimpleDto | null = null;
  @Input() numberDescription = "followers"
  constructor(private musicPlayerService: MusicPlayerService,
              private trackGetAllService: TrackGetAllEndpointService,
              private router : Router,) {}

  getFollowCount() {
    if(this.numberDescription === "followers") {
      return `${formatNumber(this.artist?.followers ?? 0,'en')} ${this.numberDescription}`;
    }
    else {
      return `${formatNumber(this.artist?.streams ?? 0,'en')} ${this.numberDescription}`;
    }
  }

  protected readonly MyConfig = MyConfig;
  playBtnSyle = {
    'display': 'none',
  };

  showPlayButton(b: boolean) {
    if(b)
    {
      this.playBtnSyle['display'] = 'block';
    }
    else {
      this.playBtnSyle['display'] = 'none';
    }
  }

  playArtist() {
    if(this.artist)
    {
      this.trackGetAllService.handleAsync({leadArtistId: this.artist.id, isReleased: true, pageSize:50, sortByStreams:true, pageNumber: 1}).subscribe({
        next: e => {
          if(e.dataItems.length > 0)
          {
            this.musicPlayerService.createQueue(e.dataItems, {display: this.artist!.name, value: "/listener/profile/"+this.artist!.id});
          }
          else {
            this.trackGetAllService.handleAsync({featuredArtists: [this.artist!.id], isReleased: true, pageSize:50, sortByStreams:true, pageNumber: 1}).subscribe({
              next: data => {
                if(data.dataItems.length > 0)
                {
                  this.musicPlayerService.createQueue(data.dataItems, {display: this.artist!.name, value: "/listener/profile/"+this.artist!.id});
                }
              }
            })
          }
        }
      });
    }
  }

  goToArtist() {
    this.router.navigate(["/listener/profile", this.artist?.id]);
  }
}
