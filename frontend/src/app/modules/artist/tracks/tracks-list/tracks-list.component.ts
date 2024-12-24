import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {
  AlbumGetByIdEndpointService,
  AlbumGetResponse
} from '../../../../endpoints/album-endpoints/album-get-by-id-endpoint.service';
import {MyConfig} from '../../../../my-config';
import {ArtistSimpleDto} from '../../../../services/auth-services/dto/artist-dto';
import {ArtistHandlerService} from '../../../../services/artist-handler.service';
import {
  TrackGetAllEndpointService,
  TrackGetAllRequest
} from '../../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import {TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {MyPagedList} from '../../../../services/auth-services/dto/my-paged-list';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {MusicPlayerService} from '../../../../services/music-player.service';

@Component({
  selector: 'app-tracks-list',
  templateUrl: './tracks-list.component.html',
  styleUrl: './tracks-list.component.css',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class TracksListComponent implements OnInit {
  album : AlbumGetResponse | null = null;
  artist : ArtistSimpleDto | null = null;
  tracks: TrackGetResponse[] = [];
  pagedResponse: MyPagedList<TrackGetResponse> | null = null;
  pagedRequest : TrackGetAllRequest = {
    pageNumber:1,
    pageSize:20
  }
  location = inject(Location)
  selectedTrack: TrackGetResponse | null = null;
  protected readonly MyConfig = MyConfig;
  @Input() isHome: boolean = false;
  private albumId = -1;
  reloadTable = false;
  @Input() artistMode: boolean = true;

  constructor(private router: Router,
              private route : ActivatedRoute,
              private albumGetService : AlbumGetByIdEndpointService,
              private artistHandler : ArtistHandlerService,
              private tracksGetAllService : TrackGetAllEndpointService,
              private musicPlayerService: MusicPlayerService,) {
  }

  ngOnInit(): void {
    this.checkIfHome();
    this.reloadData();
  }

  reloadData() {
    this.route.params.subscribe(params => {
      let id: number = params["id"];
      this.pagedRequest.albumId = id;

      this.albumGetService.handleAsync(id).subscribe({
        next: data => {
          this.album = data;
          this.artist = {
            id: data.artist.id,
            isFlaggedForDeletion: false,
            role: "",
            deletionDate:"",
            name: data.artist.name,
            pfpPath: "/media/Images/ArtistPfps/" + data.artist.profilePhotoPath
          };
        }
      });

      this.tracksGetAllService.handleAsync(this.pagedRequest).subscribe({
        next: data => {
          this.tracks = data.dataItems;
          this.pagedResponse = data;
          console.log(data);
        }
      })
    })
  }

  getYear() {
    return new Date(this.album?.releaseDate!).getFullYear();
  }

  getAlbumDuration(lengthInSeconds: number | undefined) {
    if(lengthInSeconds != undefined)
    {
      let hours = Math.floor(lengthInSeconds / 3600).toString();
      let minutes = Math.floor((lengthInSeconds % 3600)/60).toString();
      let seconds = Math.floor((lengthInSeconds % 3600)%60).toString();
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return "";
  }

  isAlbumExplicit() : boolean{
    for (const track of this.tracks) {
      if(track.isExplicit)
      {
        return true;
      }
    }
    return false;
  }

  goBack() {
    if(this.artistMode)
    {
      this.router.navigate(['/artist/album']);
    }
    else {
      this.location.back();
    }
  }

  logData(track: TrackGetResponse) {
    console.log(track);
  }

  editTrack(e: number) {
    if(this.artistMode)
    {
      this.router.navigate(["edit",e], {relativeTo:this.route, queryParams: {albumId: this.album!.id}});
    }
    else {
      this.musicPlayerService.createQueue(this.tracks,{display:this.album?.title + " - " + this.album?.type.type, value: "./listener/release/"+this.album?.id})
      this.musicPlayerService.skipTo(this.tracks.find(x=> x.id == e)!);
      console.log(this.tracks.find(x=> x.id == e)!)
    }

    //this.router.navigate(["/artist/tracks/"+this.album!.id+"/edit/"+e.id], { queryParams: {albumId: this.album!.id}});
  }

  addNew() {
    if(this.artistMode)
    {
      this.router.navigate(["create"], {relativeTo:this.route, queryParams: {albumId: this.album!.id}});
    }
    else {
      this.musicPlayerService.createQueue(this.tracks, {display:this.album?.title + " - " + this.album?.type.type, value: "./listener/release/"+this.album?.id})
    }
  }

  checkIfHome() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart)
      {
        if(event.url == "/artist/tracks/"+this.pagedRequest.albumId)
        {
          console.log(event.url, "/artist/tracks/"+this.pagedRequest.albumId)
          this.reloadData();
          this.reloadTable = true;
          this.isHome = true;
        }
        else {
          this.isHome = false;
          this.reloadTable = false;
        }
      }
    })
  }
}
