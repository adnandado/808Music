import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ArtistDetailResponse,
  ArtistGetByIdEndpointService
} from '../../../endpoints/artist-endpoints/artist-get-by-id-endpoint.service';
import {MyConfig} from '../../../my-config';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ShareBottomSheetComponent} from '../../shared/bottom-sheets/share-bottom-sheet/share-bottom-sheet.component';
import {TrackGetAllEndpointService} from '../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {MusicPlayerService} from '../../../services/music-player.service';
import {FollowOrUnfollowEndpointService} from '../../../endpoints/follow-endpoints/follow-or-unfollow-endpoint.service';
import {CheckFollowEndpointService, Follow} from '../../../endpoints/follow-endpoints/check-follow-endpoint.service';
import {
  ToggleNotificationsEndpointService
} from '../../../endpoints/follow-endpoints/toggle-notifications-endpoint.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {
  GetArtistBioEndpointService,
  GetArtistBioResponse
} from '../../../endpoints/artist-endpoints/get-artist-bio-endpoint.service';
import {ArtistDialogComponent} from './artist-dialog/artist-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {
  GetUserArtistStatsEndpointService
} from '../../../endpoints/user-endpoints/get-user-artist-stats-endpoint.service';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.css',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class ArtistPageComponent implements OnInit, OnDestroy {
  artist: ArtistDetailResponse | null = null;
  hasTracks: boolean = true;
  followInfo: Follow | null = null;

  isPlayingThisAlbum: boolean = false;
  playingState: boolean = false;

  state$! : Subscription;
  trackChange$! : Subscription;
  userArtistStats : GetUserArtistStatsEndpointService | null = null;
  artistStats : GetArtistBioResponse | null = null;

  ngOnDestroy(): void {
    this.state$.unsubscribe();
    this.trackChange$.unsubscribe();
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private artistService: ArtistGetByIdEndpointService,
              private shareSheet: MatBottomSheet,
              private trackGetAllService: TrackGetAllEndpointService,
              protected musicPlayerService: MusicPlayerService,
              private followService : FollowOrUnfollowEndpointService,
              private checkFollowService : CheckFollowEndpointService,
              private toggleNotiService : ToggleNotificationsEndpointService,
              private location: Location,
              private snackBar : MatSnackBar,
              private getArtistInfo : GetArtistBioEndpointService,
              private dialog: MatDialog,
              private userArtistService : GetUserArtistStatsEndpointService
              ) { }

    ngOnInit(): void {

      this.route.params.subscribe(params => {
          let id = params['id'];
          if(id) {
            this.loadArtistStats(id);
            this.artistService.handleAsync(id as number).subscribe({
              next: data => {
                this.artist = data;
                this.isPlayingThisAlbum = this.musicPlayerService.getLastPlayedSong()?.artists[0].id == this.artist?.id
                  && this.musicPlayerService.getQueueType() === "artist";
                console.log(this.artist);

                this.checkFollowService.handleAsync(data.id).subscribe({next: val => {
                  this.followInfo = val;
                }})
              }
            })
            this.trackGetAllService.handleAsync({leadArtistId: this.artist?.id, isReleased: true}).subscribe({next: data => {
              this.hasTracks = data.totalCount > 0;
              }})
          }
        })
      this.playingState = this.musicPlayerService.getPlayState();

      this.state$ = this.musicPlayerService.playStateChange.subscribe(state => this.playingState = state);
      this.trackChange$ = this.musicPlayerService.trackEvent.subscribe(track =>
        this.isPlayingThisAlbum = track.artists[0].id == this.artist?.id && this.musicPlayerService.getQueueType() === "artist");
    }

  protected readonly MyConfig = MyConfig;

  shareProfile() {
      this.shareSheet.open(ShareBottomSheetComponent, {data: {url: MyConfig.ui_address + "/listener/profile/"+this.artist?.id}});
  }

  playArtist() {
    this.trackGetAllService.handleAsync({pageNumber:1, pageSize:10000, leadArtistId:this.artist?.id, sortByStreams: true}).subscribe({
      next: data => {
        this.musicPlayerService.createQueue(data.dataItems, {display: this.artist?.name ?? "Artist profile", value: "/listener/profile/"+this.artist?.id}, "artist");
      }
    });
  }

  shufflePlay() {
    this.musicPlayerService.toggleShuffle();
  }

  followOrUnfollow() {
    if(this.artist)
    {
      this.followService.handleAsync(this.artist.id).subscribe({next: data => {
          if(data == "Followed"){
            this.artist!.followers++;
          }
          if(data == "Unfollowed"){
            this.artist!.followers--;
          }
          this.checkFollowService.handleAsync(this.artist!.id).subscribe({next: data => {
            this.followInfo = data;
          }})
      }})
    }
  }

  toggleNotifications() {
    if(this.artist)
    {
      this.toggleNotiService.handleAsync(this.artist.id).subscribe({next: data => {
        if(data == "Notifications On"){
          this.followInfo!.wantsNotifications = true;
        }
        else if(data == "Notifications Off"){
          this.followInfo!.wantsNotifications = false;
        }
        this.snackBar.open(data, "Dismiss", {duration: 3000});
        /*
          this.checkFollowService.handleAsync(this.artist!.id).subscribe({next: data => {
              this.followInfo = data;
            }})
         */
      }});
    }
  }

  goBack() {
    this.location.back();
  }
  openArtistDialog(): void {
    if (!this.artist || !this.artistStats) return;

    this.dialog.open(ArtistDialogComponent, {
      width: '950px',
      height: '600px',
      maxWidth: 'none',
      panelClass: 'custom-dialog-container',
      data: { artist: this.artist, artistStats: this.artistStats }
    });

  }
  private loadArtistStats(id: number) {
    const request = {
      artistId : id
    }
    this.getArtistInfo.handleAsync(request).subscribe({next: data => {
      this.artistStats = data;
      }})
  }
}
