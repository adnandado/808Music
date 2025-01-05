import {Component, OnInit} from '@angular/core';
import {MatChipSelectionChange} from '@angular/material/chips';
import {
  ArtistGetAutocompleteEndpointService, UserArtistSearchRequest
} from '../../../endpoints/artist-endpoints/artist-get-autocomplete-endpoint.service';
import {
  AlbumGetAllEndpointService, AlbumGetAllResponse,
  AlbumPagedRequest
} from '../../../endpoints/album-endpoints/album-get-all-endpoint.service';
import {
  TrackGetAllEndpointService, TrackGetAllRequest,
  TrackGetResponse
} from '../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {MyPagedList} from '../../../services/auth-services/dto/my-paged-list';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';
import {Params} from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit{
  artistMode: boolean = false;
  priotity = true;
  filter = {
    showAlbums: true,
    showArtists: true,
    showTracks: true,
  }

  albums: MyPagedList<AlbumGetAllResponse> | null = null;
  artists: ArtistSimpleDto[] = [];
  tracks: MyPagedList<TrackGetResponse> | null = null;

  artistRequest: UserArtistSearchRequest = {
    sortByPopularity: true,
    searchString:"",
    returnAmount: 1000,
  }

  albumRequest: AlbumPagedRequest = {
    pageNumber:1,
    pageSize: 1000,
    sortByPopularity: true,
    title:"",
    isReleased: true,
  }

  trackRequest: TrackGetAllRequest = {
    pageNumber:1,
    pageSize:1000,
    isReleased: true,
    sortByStreams: true,
  }

  popArtistParams: Params = {
    popular: "yes",
    searchString: "",
  };

  albumParams: Params = {
    title: "Album search results",
    popular: "yes",
    albumTitle: ""
  };

  constructor(private artistGetService: ArtistGetAutocompleteEndpointService,
              private albumGetService: AlbumGetAllEndpointService,
              private trackGetService: TrackGetAllEndpointService,) {
  }

  ngOnInit(): void {
    this.search("");
  }

  filterResults(e: MatChipSelectionChange) {
    if(e.selected && e.isUserInput)
    {
      if(e.source.id === "2")
      {
        this.filter.showAlbums = true;
        this.filter.showArtists = false;
        this.filter.showTracks = false;
      }
      else if (e.source.id === "3")
      {
        this.filter.showAlbums = false;
        this.filter.showArtists = true;
        this.filter.showTracks = false;
      }
      else if (e.source.id === "1")
      {
        this.filter.showAlbums = false;
        this.filter.showArtists = false;
        this.filter.showTracks = true;
      }
    }
    else if(!e.selected){
      this.priotity = true;
      this.filter.showAlbums = true;
      this.filter.showArtists = true;
      this.filter.showTracks = true;
    }
    if(e.source.id === "0")
    {
      this.priotity = true;
      this.filter.showAlbums = true;
      this.filter.showArtists = true;
      this.filter.showTracks = true;
      e.source.select();
    }
  }

  search(query: string) {
    this.artistRequest.searchString = query;
    this.trackRequest.title = query;
    this.albumRequest.title = query;

    this.popArtistParams['searchString'] = query;
    this.albumParams['albumTitle'] = query;


    this.artistGetService.handleAsync(this.artistRequest).subscribe({
      next: data => {
        this.artists = data;
      }
    });

    this.albumGetService.handleAsync(this.albumRequest).subscribe({
      next: data => {
        this.albums = data;
      }
    });

    this.trackGetService.handleAsync(this.trackRequest).subscribe({
      next: data => {
        this.tracks = data;
      }
    })
  }
}
