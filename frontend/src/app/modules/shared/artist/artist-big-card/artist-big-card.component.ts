import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {formatNumber} from '@angular/common';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {MyConfig} from '../../../../my-config';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MusicPlayerService} from '../../../../services/music-player.service';
import {TrackGetAllEndpointService} from '../../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ArtistInfoResponse} from '../../../../endpoints/user-endpoints/get-user-last-streams-endpoint.service';

@Component({
  selector: 'app-artist-big-card',
  templateUrl: './artist-big-card.component.html',
  styleUrl: './artist-big-card.component.css'
})
export class ArtistBigCardComponent implements OnInit, OnDestroy {
  @Input() artist : ArtistSimpleDto | null = null;
  @Input() numberDescription = "followers";
  @Input() artists : ArtistInfoResponse | null = null;
  @Input() isForProfile = false;
  isPlayingThisAlbum: boolean = false;
  playingState: boolean = false;

  state$! : Subscription;
  trackChange$! : Subscription;

  ngOnDestroy(): void {
    this.state$.unsubscribe();
    this.trackChange$.unsubscribe();
  }

  ngOnInit(): void {
    this.isPlayingThisAlbum = this.musicPlayerService.getLastPlayedSong()?.artists[0].id == this.artist?.id && this.musicPlayerService.getQueueType() === "artist";

    this.playingState = this.musicPlayerService.getPlayState();

    this.state$ = this.musicPlayerService.playStateChange.subscribe(state => this.playingState = state);
    this.trackChange$ = this.musicPlayerService.trackEvent.subscribe(track =>
      this.isPlayingThisAlbum = (track.artists[0].id == this.artist?.id || track.artists[0].id == this.artists?.artistId) && this.musicPlayerService.getQueueType() === "artist");
  }

  constructor(protected musicPlayerService: MusicPlayerService,
              private trackGetAllService: TrackGetAllEndpointService,
              private router : Router,) {}

  getFollowCount() {
    if(this.numberDescription === "followers") {
      if(!this.isForProfile)
      return `${formatNumber(this.artist?.followers ?? 0,'en')} ${this.numberDescription}`;
      return `${formatNumber(this.artists?.followerCount ?? 0,'en')} ${this.numberDescription}`;

    }
    else {
      return `${formatNumber(this.artist?.streams ?? 0,'en')} ${this.numberDescription}`;
    }
  }

  protected readonly MyConfig = MyConfig;
  playBtnSyle = {
    'display': 'none',
  };

  pauseBtnSyle = {
    'display': 'block',
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
      this.trackGetAllService.handleAsync({leadArtistId: this.artist.id, isReleased: true, pageSize:10000, sortByStreams:true, pageNumber: 1}).subscribe({
        next: e => {
          if(e.dataItems.length > 0)
          {
            this.musicPlayerService.createQueue(e.dataItems, {display: this.artist!.name, value: "/listener/profile/"+this.artist!.id}, "artist");
          }
          else {
            this.trackGetAllService.handleAsync({featuredArtists: [this.artist!.id], isReleased: true, pageSize:10000, sortByStreams:true, pageNumber: 1}).subscribe({
              next: data => {
                if(data.dataItems.length > 0)
                {
                  this.musicPlayerService.createQueue(data.dataItems, {display: this.artist!.name, value: "/listener/profile/"+this.artist!.id},"artist");
                }
              }
            })
          }
        }
      });
    }

  }
  playArtists() {



      console.log('IM HEREEEEEEEEEE');
      this.trackGetAllService.handleAsync({leadArtistId: this.artists!.artistId, isReleased: true, pageSize:10000, sortByStreams:true, pageNumber: 1}).subscribe({
        next: e => {
          if(e.dataItems.length > 0)
          {
            this.musicPlayerService.createQueue(e.dataItems, {display: this.artists!.artistName, value: "/listener/profile/"+this.artists!.artistId}, "artist");
          }
          else {
            this.trackGetAllService.handleAsync({featuredArtists: [this.artists!.artistId], isReleased: true, pageSize:10000, sortByStreams:true, pageNumber: 1}).subscribe({
              next: data => {
                if(data.dataItems.length > 0)
                {
                  this.musicPlayerService.createQueue(data.dataItems, {display: this.artists!.artistName, value: "/listener/profile/"+this.artists!.artistId},"artist");
                }
              }
            })
          }
        }
      });


  }
  goToArtist() {
    if (!this.isForProfile)
    this.router.navigate(["/listener/profile", this.artist?.id]);
    this.router.navigate(["/listener/profile", this.artists?.artistId]);

  }
}
