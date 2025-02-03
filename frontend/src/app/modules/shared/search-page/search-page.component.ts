import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ArtistHandlerService} from '../../../services/artist-handler.service';
import {
  UserSearchEndpointService,
  UserSearchRequest, UserSearchResponse
} from '../../../endpoints/user-endpoints/user-search-endpoint.service';
import {MyConfig} from '../../../my-config';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['../../listener/user-profile-page/user-profile-page.component.css', './search-page.component.css']
})
export class SearchPageComponent implements OnInit{
  artistMode: boolean = false;
  isLoading = true;
  priotity = true;
  filter = {
    showAlbums: true,
    showArtists: true,
    showTracks: true,
    showUsers: true
  }

  albums: MyPagedList<AlbumGetAllResponse> | null = null;
  artists: ArtistSimpleDto[] = [];
  tracks: MyPagedList<TrackGetResponse> | null = null;
  users: UserSearchResponse[] = []

  query = "";

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

  userRequest : UserSearchRequest = {
    searchString: "",
    returnAmount: 6
  }

  constructor(private artistGetService: ArtistGetAutocompleteEndpointService,
              private albumGetService: AlbumGetAllEndpointService,
              private trackGetService: TrackGetAllEndpointService,
              private route: ActivatedRoute,
              private artistHandler: ArtistHandlerService,
              private userGetService : UserSearchEndpointService,
              private router: Router,
              private cdRef: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      let artist = data["artist"];
      if(artist)
      {
        this.artistMode = true;
        let a = this.artistHandler.getSelectedArtist();
        this.trackRequest.leadArtistId = a?.id
        this.albumRequest.artistId = a?.id
        this.albumRequest.isReleased = undefined;
        this.trackRequest.isReleased = undefined;
        this.search("");
      }
    });
    this.search("");
  }

  filterResults(e: MatChipSelectionChange) {
    if(e.isUserInput)
    {
      if(e.source.value === "2")
      {
        this.filter.showAlbums = true;
        this.filter.showArtists = false;
        this.filter.showTracks = false;
      }
      else if (e.source.value === "3")
      {
        this.filter.showAlbums = false;
        this.filter.showArtists = true;
        this.filter.showTracks = false;
      }
      else if (e.source.value === "1")
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
    if(e.source.value === "0")
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
    this.userRequest.searchString = query;

    this.query = query;

    this.popArtistParams['searchString'] = query;
    this.albumParams['albumTitle'] = query;

    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 500);

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

    if(!this.artistMode)
    {
      this.artistGetService.handleAsync(this.artistRequest).subscribe({
        next: data => {
          this.artists = data;
        }
      });

      this.userGetService.handleAsync(this.userRequest).subscribe({
        next: data => {
          this.users = data;
        }
      })
    }
  }

  refresh(b: boolean) {
    if (b)
    {
      this.ngOnInit();
    }
  }

  openProfile(userId: number) {
    this.router.navigate(['listener/user/', userId]);
  }

  protected readonly MyConfig = MyConfig;

  selectAll(e: MatChipSelectionChange) {
    if(e.selected)
    {
      this.filter = {
        showAlbums: true,
        showArtists: true,
        showTracks: true,
        showUsers: true
      }
      if(this.artistMode)
      {
        this.searchTwice(this.query);
      }
    }
    else {
      if ((!this.artistMode && this.filter.showUsers && this.filter.showTracks && this.filter.showAlbums && this.filter.showArtists)
        ||
        (this.artistMode && this.filter.showTracks && this.filter.showAlbums ))
      {
        e.source.select();
      }
    }
  }

  searchTwice(query: string) {
    this.search(query);
    this.search(query);
  }

  flip(tracks: string) {
    switch (tracks)
    {
      case "tracks":
        this.filter.showTracks = !this.filter.showTracks; break;
      case "albums":
        this.filter.showAlbums = !this.filter.showAlbums; break;
      case "users":
        this.filter.showUsers = !this.filter.showUsers; break;
      case "artists":
        this.filter.showArtists = !this.filter.showArtists; break;
    }

    if(this.artistMode)
    {
      this.searchTwice(this.query);
    }
  }
}
