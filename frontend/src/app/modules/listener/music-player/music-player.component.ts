import {Component, OnInit} from '@angular/core';
import {
  TrackGetByIdEndpointService,
  TrackGetResponse
} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {MyConfig} from '../../../my-config';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css',
  standalone: false
})
export class MusicPlayerComponent implements OnInit {
  track:TrackGetResponse | null = null;
  newTrackId: number = 24;

  constructor(private trackGetService: TrackGetByIdEndpointService) {
  }

  ngOnInit(): void {
        this.trackGetService.handleAsync(this.newTrackId).subscribe({
          next: data => {
            this.track = data;
            console.log(this.track);
          }
        })
  }

  protected readonly MyConfig = MyConfig;

  setNewSong() {
    this.ngOnInit();
  }
}
