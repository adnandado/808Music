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


  constructor(private trackGetService: TrackGetByIdEndpointService,
              private albumGetService: TrackGetAllEndpointService,
              private albumByIdService: AlbumGetByIdEndpointService,
              protected musicPlayerService: MusicPlayerService,
              private router: Router) {
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
}
