import {AfterViewInit, Component, Input} from '@angular/core';
import {ArtistTrackDto, TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {Router} from '@angular/router';
import {MyConfig} from '../../../../my-config';
import {MusicPlayerService} from '../../../../services/music-player.service';

@Component({
  selector: 'app-track-card',
  templateUrl: './track-card.component.html',
  styleUrl: './track-card.component.css'
})
export class TrackCardComponent implements AfterViewInit{
  @Input() track : TrackGetResponse | null = null;
  @Input() artistMode : boolean = false;

  playBtnSyle = {
    'display': 'none',
  };

  cardStyle = {
    width: '32vw'
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

  constructor(private router: Router,
              private musicPlayerService: MusicPlayerService) {
  }

  ngAfterViewInit(): void {
    if(this.artistMode)
    {
      this.cardStyle['width'] = '20vw';
    }
  }

  goToArtistPage(artist: ArtistSimpleDto | ArtistTrackDto) {
    this.router.navigate(["/listener/profile", artist.id]);
  }

  protected readonly MyConfig = MyConfig;


  goToTrack() {
    if(this.artistMode){
      this.router.navigate([`/artist/tracks/${this.track?.albumId}/edit/${this.track?.id}?albumId=${this.track?.albumId}`]);
      console.log("HERE");
    }
    else
    {
      this.router.navigate(["/listener/release", this.track?.albumId]);
    }
  }

  handleActionClick() {
    if(this.artistMode)
    {
      this.router.navigate([`/artist/tracks/${this.track?.albumId}/edit/${this.track?.id}?albumId=${this.track?.albumId}`]);
    }
    else {
      this.musicPlayerService.createQueue([this.track!], {display: this.track!.title, value: "/listener/release/"+this.track!.albumId});
    }
  }
}
