import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css',
  standalone: false
})
export class MusicPlayerComponent implements OnInit {
  track:TrackGetResponse | null = null;
  newTrackId: number = 39;

  constructor(private trackGetService: TrackGetByIdEndpointService,
              private albumGetService: TrackGetAllEndpointService,
              private albumByIdService: AlbumGetByIdEndpointService,
              protected musicPlayerService: MusicPlayerService) {
  }

  ngOnInit(): void {

    this.albumGetService.handleAsync({albumId: this.newTrackId}).subscribe({
      next: (response: MyPagedList<TrackGetResponse>) => {
        this.albumByIdService.handleAsync(this.newTrackId).subscribe({
          next: value => {
            this.musicPlayerService.createQueue(response.dataItems, {display:value.title+ " - " + value.type.type, value:"/artist/album/edit/"+value.id});
          }
        })
      }
    })

    this.musicPlayerService.trackEvent.subscribe({
      next: data => {
        this.track = data;
      }
    })
  }

  protected readonly MyConfig = MyConfig;

  setNewSong() {
    this.ngOnInit();
  }
}
