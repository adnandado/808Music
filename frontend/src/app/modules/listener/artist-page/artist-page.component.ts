import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.css'
})
export class ArtistPageComponent implements OnInit {
  artist: ArtistDetailResponse | null = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private artistService: ArtistGetByIdEndpointService,
              private shareSheet: MatBottomSheet,
              private trackGetAllService: TrackGetAllEndpointService,
              private musicPlayerService: MusicPlayerService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
          let id = params['id'];
          if(id) {
            this.artistService.handleAsync(id as number).subscribe({
              next: data => {
                this.artist = data;
                console.log(this.artist);
              }
            })
          }
        })
    }

  protected readonly MyConfig = MyConfig;

  shareProfile() {
    this.shareSheet.open(ShareBottomSheetComponent, {data: {url: MyConfig.ui_address + "/listener/profile/"+this.artist?.id}});
  }

  playArtist() {
    this.trackGetAllService.handleAsync({pageNumber:1, pageSize:20, leadArtistId:this.artist?.id}).subscribe({
      next: data => {
        this.musicPlayerService.createQueue(data.dataItems, {display: this.artist?.name ?? "Artist profile", value: "/listener/profile/"+this.artist?.id});
      }
    });
  }
}
