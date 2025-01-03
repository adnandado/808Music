import {Component, OnInit} from '@angular/core';
import {
  ArtistGetAutocompleteEndpointService,
  UserArtistSearchRequest
} from '../../../endpoints/artist-endpoints/artist-get-autocomplete-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TrackGetByIdEndpointService} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';
import {Location} from '@angular/common';

@Component({
  selector: 'app-artist-search-result-page',
  templateUrl: './artist-search-result-page.component.html',
  styleUrl: './artist-search-result-page.component.css'
})
export class ArtistSearchResultPageComponent implements OnInit{
  searchRequest: UserArtistSearchRequest = {
    sortByPopularity: true,
    searchString: "",
    returnAmount: 10000
  }

  title: string = "Artists search result";

  artists: ArtistSimpleDto[] = [];
  numDescription = "followers";

  constructor(private router: Router,
              private route: ActivatedRoute,
              private artistGetService: ArtistGetAutocompleteEndpointService,
              private location : Location) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let searchString = params['searchString'];
      if(searchString != null && searchString.length > 0)
      {
        this.searchRequest.searchString = searchString;
      }

      let popular = params['popular'];
      if(popular != null && popular.length > 0)
      {
        this.searchRequest.sortByPopularity = true;
      }

      let streams = params['streams'];
      if(streams != null && streams.length > 0)
      {
        this.searchRequest.sortByStreams = true;
        this.numDescription = "streams";
      }

      let needsToHaveSongs = params['needsToHaveSongs'];
      if(needsToHaveSongs != null && needsToHaveSongs.length > 0)
      {
        this.searchRequest.needsToHaveSongs = true;
      }

      this.artistGetService.handleAsync(this.searchRequest).subscribe(artistGet => {
        this.artists = artistGet;
      })

      let title = params['title'];
      if(title != null && title.length > 0)
      {
        this.title = title;
      }
    })
  }

  goBack() {
    this.location.back();
  }
}
