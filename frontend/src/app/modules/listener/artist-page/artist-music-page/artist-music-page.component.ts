import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ArtistDetailResponse} from '../../../../endpoints/artist-endpoints/artist-get-by-id-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
  TrackGetAllEndpointService,
  TrackGetAllRequest
} from '../../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {MusicPlayerService} from '../../../../services/music-player.service';
import {
  TrackGetByIdEndpointService,
  TrackGetResponse
} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';

@Component({
  selector: 'app-artist-music-page',
  templateUrl: './artist-music-page.component.html',
  styleUrl: './artist-music-page.component.css'
})
export class ArtistMusicPageComponent implements OnInit, AfterViewInit{
  @Input() artist : ArtistDetailResponse | null = null;
  myPagedRequest : TrackGetAllRequest = {
    pageSize: 5,
    pageNumber: 1
  }
  tracks: TrackGetResponse[] = [];

  constructor(private router: Router,
              private trackGetAllService: TrackGetAllEndpointService,
              private musicPlayerService: MusicPlayerService,
              private trackByIdService: TrackGetByIdEndpointService,
              private route: ActivatedRoute,) {
  }

  ngAfterViewInit(): void {
    /*
    this.myPagedRequest.leadArtistId = this.artist?.id;
    console.log(this.myPagedRequest);
    this.trackGetAllService.handleAsync(this.myPagedRequest).subscribe({
      next: data => {
        this.tracks = data.dataItems;
      }
    })

     */
    }

  ngOnInit(): void {
      this.route.params.subscribe(params => {
        let id = params['id'];
        if(id)
        {
          this.myPagedRequest.leadArtistId = id;
          this.trackGetAllService.handleAsync(this.myPagedRequest).subscribe({
            next: data => {
              this.tracks = data.dataItems;
            }
          })
        }
      })
  }

  createQueue(e: number) {
    console.log(this.tracks);
    this.musicPlayerService.createQueue(this.tracks);
    let i = this.tracks.filter(val => val.id == e)[0];
    console.log(i);
    if(i)
    {
      this.musicPlayerService.skipTo(i);
    }
  }
}
