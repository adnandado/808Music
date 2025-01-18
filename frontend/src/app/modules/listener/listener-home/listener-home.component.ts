import {Component, OnInit} from '@angular/core';
import {MyConfig} from '../../../my-config';
import {Params, Router} from '@angular/router';
import {TrackGetAllEndpointService} from '../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {MusicPlayerService} from '../../../services/music-player.service';
import {MyPagedList} from '../../../services/auth-services/dto/my-paged-list';
import {
  AlbumGetAllEndpointService,
  AlbumGetAllResponse, AlbumPagedRequest
} from '../../../endpoints/album-endpoints/album-get-all-endpoint.service';
import {AlbumGetByIdEndpointService} from '../../../endpoints/album-endpoints/album-get-by-id-endpoint.service';
import {
  ArtistGetAutocompleteEndpointService, UserArtistSearchRequest
} from '../../../endpoints/artist-endpoints/artist-get-autocomplete-endpoint.service';
import {ArtistSimpleDto} from '../../../services/auth-services/dto/artist-dto';

@Component({
  selector: 'app-listener-home',
  templateUrl: './listener-home.component.html',
  styleUrls: ['../artist-page/artist-music-page/artist-music-page.component.css','./listener-home.component.css']
})
export class ListenerHomeComponent implements OnInit {

  protected readonly MyConfig = MyConfig;
  popularAlbums: MyPagedList<AlbumGetAllResponse> | null = null;
  popularParams: Params = {
    title: "Popular Releases",
    popular: "yes"
  };
  recentAlbums: MyPagedList<AlbumGetAllResponse> | null = null;
  recentParams: Params = {
    title: "Recent Releases",
    popular: "no"
  };
  popularArtists: ArtistSimpleDto[] | null = null;
  popArtistParams: Params = {
    title: "Popular Artists",
    popular: "yes",
    needsToHaveSongs: "yes"
  };
  mostStreamedArtists:  ArtistSimpleDto[] | null = null;
  mostStreamedArtistParams: Params = {
    title: "Most Streamed Artists",
    streams: "yes",
    needsToHaveSongs: "yes"
  }

  infinitePage = [1];

  constructor(private router: Router,
              private trackGetAllService: TrackGetAllEndpointService,
              private musicPlayerService: MusicPlayerService,
              private albumGetService: AlbumGetAllEndpointService,
              private artistGetService: ArtistGetAutocompleteEndpointService) {
  }

  ngOnInit(): void {
    let request: AlbumPagedRequest  = {pageNumber: 1, pageSize: 50, isReleased: true, title: ""};
      this.albumGetService.handleAsync(request).subscribe({
        next: data => {
          this.recentAlbums = data;
        }
      })
    this.albumGetService.handleAsync({...request, sortByPopularity:true}).subscribe({
      next: data => {
          this.popularAlbums = data;
      }
    })

    this.artistGetService.handleAsync({sortByPopularity: true, returnAmount: 6, searchString:"", needsToHaveSongs:true}).subscribe({
      next: data => {
        this.popularArtists = data;
      }
    })

    this.artistGetService.handleAsync({sortByStreams: true, returnAmount: 6, searchString:"", needsToHaveSongs:true}).subscribe({
      next: data => {
        this.mostStreamedArtists = data;
      }
    })
  }


  loadMore() {
    this.infinitePage.push(this.infinitePage[this.infinitePage.length-1]+1);
    console.log("Scrolled")
  }
}
