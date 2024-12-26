import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {
  ArtistDetailResponse,
  ArtistGetByIdEndpointService
} from '../../../endpoints/artist-endpoints/artist-get-by-id-endpoint.service';

@Component({
  selector: 'app-artist-albums-list',
  templateUrl: './artist-albums-list.component.html',
  styleUrl: './artist-albums-list.component.css'
})
export class ArtistAlbumsListComponent implements OnInit {
  artist : ArtistDetailResponse | null = null;
  title : string = "'s releases";

  constructor(private location : Location,
              private route : ActivatedRoute,
              private getArtistService: ArtistGetByIdEndpointService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if(id)
      {
        this.getArtistService.handleAsync(id as number).subscribe({
          next: data => {
            this.artist = data;
          }
        })
      }
    })

    this.route.queryParams.subscribe(params => {
      let featured = params['featured'];
      if(featured)
      {
        this.title = "'s appearances"
      }
    })
  }

  goBack() {
    this.location.back();
  }
}
