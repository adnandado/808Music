import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  TrackGetByIdEndpointService,
  TrackGetResponse
} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {MyConfig} from '../../../my-config';
import {AlbumGetByIdEndpointService} from '../../../endpoints/album-endpoints/album-get-by-id-endpoint.service';
import {
  TrackGetAllEndpointService,
  TrackGetAllRequest
} from '../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {ProductAddResponse} from '../../../endpoints/products-endpoints/product-create-endpoint.service';
import {MyPagedList} from '../../../services/auth-services/dto/my-paged-list';
import {MusicPlayerService} from '../../../services/music-player.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {
  QueueViewBottomSheetComponent
} from '../../shared/bottom-sheets/queue-view-bottom-sheet/queue-view-bottom-sheet.component';
import {ShareBottomSheetComponent} from '../../shared/bottom-sheets/share-bottom-sheet/share-bottom-sheet.component';
import {queue} from 'rxjs';
import {Router} from '@angular/router';
import {
  IsSubscribedRequest,
  IsSubscribedService
} from '../../../endpoints/auth-endpoints/is-subscribed-endpoint.service';
import {MatDialog} from '@angular/material/dialog';
import {PleaseSubscribeComponent} from '../../shared/bottom-sheets/please-subscribe/please-subscribe.component';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {SendSongMessageComponent} from '../../shared/bottom-sheets/send-song-message/send-song-message.component';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css',
  standalone: false
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  track:TrackGetResponse | null = null;
  newTrackId: number = 39;
  queueManager = inject(MatBottomSheet)
  isSubbed = true;


  constructor(private trackGetService: TrackGetByIdEndpointService,
              private albumGetService: TrackGetAllEndpointService,
              private albumByIdService: AlbumGetByIdEndpointService,
              protected musicPlayerService: MusicPlayerService,
              private router: Router,
              private isSubscribedService : IsSubscribedService,
              private dialog : MatDialog,
              private auth: MyUserAuthService) {
  }

  ngOnDestroy(): void {
        this.musicPlayerService.queue = [];
  }

  ngOnInit(): void {
    /*
    this.albumGetService.handleAsync({albumId: this.newTrackId}).subscribe({
      next: (response: MyPagedList<TrackGetResponse>) => {
        this.albumByIdService.handleAsync(this.newTrackId).subscribe({
          next: value => {
            this.musicPlayerService.createQueue(response.dataItems, {display:value.title+ " - " + value.type.type, value:"/artist/album/edit/"+value.id});
          }
        })
      }
    })
     */

    const request: IsSubscribedRequest = {
      userId : this.auth.getAuthToken()!.userId
    };
    this.isSubscribedService.handleAsync(request).subscribe({
      next: (response) => {
        if (!response.isSubscribed)
        {
          this.openPleaseSubscribeDialog();
          this.isSubbed = false;
        }
        else {
          this.isSubbed = true;
        }
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });

    this.track = this.musicPlayerService.getLastPlayedSong();

    this.musicPlayerService.trackEvent.subscribe({
      next: data => {
        this.track = data;
      }
    })
  }

  protected readonly MyConfig = MyConfig;

  setNewSong() {
    this.trackGetService.handleAsync(this.newTrackId).subscribe({
      next: data => {
        this.musicPlayerService.addToQueue(data);
        console.log(this.musicPlayerService.queue);
      }
    })
  }

  openQueueManager() {
    let queue = this.musicPlayerService.getQueue();
    this.queueManager.open(QueueViewBottomSheetComponent, {data: {queue}});
  }

  openShareSheet() {
    this.queueManager.open(ShareBottomSheetComponent, {data: {url: MyConfig.ui_address + "/listener/track/"+ this.track?.id}});
  }

  redirectToSource() {
    this.router.navigate([this.musicPlayerService.queueSource.value]);
  }

  goToRelease() {
    this.router.navigate(["/listener/release", this.track!.albumId]);
  }

  goHome() {
    this.router.navigate(["/listener/home"]);
  }

  goToSearch() {
    this.router.navigate(["/listener/search"]);
  }

  messageBottomSheet() {
    /*
    this.musicPlayerService.setAutoPlayStatus(!this.musicPlayerService.getAutoPlayStatus());
    console.log(this.musicPlayerService.getAutoPlayStatus());
     */
    let ref = this.queueManager.open(SendSongMessageComponent, {data: {track: this.track}});
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
